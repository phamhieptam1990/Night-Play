/* AI LUYỆN CÙNG, PHẦN TRÌNH DUYỆT (Học Vui Plus G2). TẮT mặc định: chỉ chạy khi LearnPlus.aiOn() (có Plus + cờ bật + phụ huynh chưa tắt). Chưa gắn vào trang nào; điểm cắm:
     LearnCoach.ask({ mode: "hint"|"explain", q, correct, wrong, err, step, subj, skill, grade, lang }).then(function (r) { LearnCoach.say(r); })
   gọi khi bé bấm 💡 (hint) hoặc ngay sau khi bé chọn sai (explain). Kết quả LUÔN dùng được: AI chậm/lỗi/hết hạn mức/tắt → r.source = "fallback" và r.text rỗng; trang giữ gợi ý viết sẵn (hint.js) như hiện nay.
   Bé không gõ chữ tự do; yêu cầu chỉ gồm nội dung câu học, đáp án đúng (để máy chủ kiểm không lộ), đáp án bé chọn, mã lỗi, lớp/môn. KHÔNG tên, email, mã thiết bị.
   Lời của linh vật được lọc lần nữa ở đây (LearnSafe) trước khi hiện, và ghi vào nhật ký trên máy (learn:coachlog, trong ngày) để phụ huynh xem lại ở learn/parent/. */
(function (root) {
  "use strict";
  var MEM = {}, TIMEOUT = 6500, LOG = "learn:coachlog", MAXLOG = 50;
  function ls(k, v) { try { if (v === undefined) return root.localStorage.getItem(k); if (v === null) root.localStorage.removeItem(k); else root.localStorage.setItem(k, v); } catch (e) { if (v === undefined) return MEM[k] == null ? null : MEM[k]; if (v === null) delete MEM[k]; else MEM[k] = v; } return null; }
  function day() { var d = new Date(), z = function (x) { return (x < 10 ? "0" : "") + x; }; return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()); }
  function fb(mode, reason) { return { ok: true, source: "fallback", reason: reason || "", event: mode === "explain" ? "comfort" : "hint", emotion: mode === "explain" ? "sad" : "think", steps: [], text: "" }; }
  function clean(r) {   /* lọc lần hai phía trình duyệt: từ nhạy cảm + độ dài; hỏng là bỏ cả lời */
    var S = root.LearnSafe, all = [r.text].concat(r.steps || []); if (!S) return false;
    for (var i = 0; i < all.length; i++) { if (typeof all[i] !== "string" || !S.check(all[i]).ok) return false; }
    return typeof r.text === "string" && r.text.length > 0 && r.text.length <= 40 && (r.steps || []).length <= 3;
  }
  var C = {};
  C.enabled = function () { return !!(root.LearnPlus && root.LearnPlus.aiOn && root.LearnPlus.aiOn()); };
  C.log = function () { try { var o = JSON.parse(ls(LOG) || "null"); return o && o.day === day() && Array.isArray(o.items) ? o.items : []; } catch (e) { return []; } };
  C.clearLog = function () { ls(LOG, null); };
  function addLog(item) { var items = C.log(); items.push(item); if (items.length > MAXLOG) items = items.slice(-MAXLOG); ls(LOG, JSON.stringify({ day: day(), items: items })); }
  C.ask = function (req) {
    req = req || {}; var mode = req.mode === "explain" ? "explain" : "hint";
    if (!C.enabled() || !root.LearnPlus.token() || !req.q || !req.correct || typeof root.fetch !== "function") return Promise.resolve(fb(mode, "off"));
    var body = { mode: mode, q: String(req.q).slice(0, 400), correct: String(req.correct).slice(0, 60), wrong: req.wrong == null ? undefined : String(req.wrong).slice(0, 60), err: req.err, step: req.step | 0, subj: req.subj, skill: req.skill, grade: req.grade, lang: req.lang === "en" ? "en" : "vi" };
    var ac = typeof AbortController !== "undefined" ? new AbortController() : null, tm = ac ? setTimeout(function () { ac.abort(); }, TIMEOUT) : 0;
    if (root.LearnMascot && root.LearnMascot.event) { try { root.LearnMascot.event("thinking"); } catch (e) {} }   /* "đang nghĩ…" tối đa vài giây */
    return root.fetch("/api/learn/coach", { method: "POST", signal: ac && ac.signal, headers: { "Content-Type": "application/json", Authorization: "Bearer " + root.LearnPlus.token() }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return null; }).then(function (j) { return { ok: r.ok, status: r.status, j: j }; }); })
      .then(function (r) {
        clearTimeout(tm);
        if (!r.ok || !r.j || r.j.source === "fallback" || !clean(r.j)) { if (r.status === 401 || r.status === 402) { try { root.LearnPlus.refresh(); } catch (e) {} } return fb(mode, r.j && r.j.reason || "http" + r.status); }
        addLog({ at: Date.now(), mode: mode, text: r.j.text, steps: (r.j.steps || []).slice(0, 3), src: r.j.source });
        return { ok: true, source: r.j.source, event: r.j.event, emotion: r.j.emotion, steps: r.j.steps || [], text: r.j.text };
      }, function () { clearTimeout(tm); if (root.LearnMascot && root.LearnMascot.event) { try { root.LearnMascot.event("offline"); } catch (e) {} } return fb(mode, "network"); });
  };
  C.say = function (r) { if (!r || r.source === "fallback" || !r.text || !root.LearnMascot || !root.LearnMascot.react) return false; try { root.LearnMascot.react({ emotion: r.emotion, text: r.text }); return true; } catch (e) { return false; } };
  root.LearnCoach = C;
})(typeof window !== "undefined" ? window : globalThis);
