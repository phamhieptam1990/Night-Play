/* Giao diện câu hỏi — gõ số, nghe–viết / viết câu, đọc to, tô chữ.
   Một phần của learn/qui.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung QS. */
(function (root) {
  "use strict";
  function part(QS) {
    var busy = QS.busy, d = QS.d, h = QS.h, shake = QS.shake, tile = QS.tile;

    /* gõ số bằng bàn phím trên màn hình (và bàn phím thật) */
    function renderTypein(b, host) {
      /* ô nhập thật (text field) + bàn phím số trên màn hình. inputmode="none": không bật bàn phím hệ thống (che màn hình) nhưng vẫn gõ được bằng bàn phím máy tính.
         b.frac: đáp án phân số / hỗn số ("3/4", "1 1/2") → thêm phím "/" và phím cách (hỗn số); b.ans khi đó là chuỗi "3/4"; b.exact: phải đúng dạng đã rút gọn, không thì bằng giá trị là đủ.
       b.dec: đáp án thập phân → thêm phím dấu phẩy (b.sep). b.ans là số chuẩn ("3.14"), b.show là cách hiển thị cho bé ("3,14"). */
      var sep = b.sep || ",", fld = h("div", "qd fld"), inp = h("input", "qi"), pad = h("div", "qk"), unit = b.unit ? h("span", "un", b.unit) : null;
      inp.type = "text"; inp.setAttribute("inputmode", "none"); inp.setAttribute("autocomplete", "off"); inp.setAttribute("autocapitalize", "off");
          inp.setAttribute("spellcheck", "false");
      inp.maxLength = 8; inp.placeholder = "?"; inp.setAttribute("aria-label", b.lab || "");
      fld.appendChild(inp); if (unit) fld.appendChild(unit);
      var last = "";   /* L3-03: lúc đáp án đang tải (busy) thì không nhận thêm chữ, tránh gõ nhanh bị dính "5252" */
      function fnorm(t) { var m = /^\s*(?:(\d+)\s+)?(\d+)\/(\d+)\s*$/.exec(t); if (m) { if (+m[3] === 0) return null; var w = m[1] ? +m[1] : 0, nn = +
          m[2], dd = +m[3]; return { v: w + nn / dd,
          s: (w ? w + " " : "") + nn + "/" + dd }; } m = /^\s*(\d+)\s*$/.exec(t); return m ? { v: +m[1], s: String(+m[1]) } : null; }
      function clean(v) { if (b.frac) { v = v.replace(/[^0-9\/ ]/g, "").replace(/^ +/, "").replace(/ +/g, " ").replace(/\/+/g, "/"); var sl = v.indexOf(
          "/"); if (sl >= 0) v = v.slice(0, sl +
          1) + v.slice(sl + 1).replace(/[^0-9]/g, ""); if (v.charAt(0) === "/") v = v.slice(1); return v.slice(0, 9); } v = v.replace(/[.,]/g,
              function (c, i) { return b.dec ? sep : "";
          }).replace(/[^0-9,.]/g, ""); var k = v.indexOf(sep); if (k >= 0) v = v.slice(0, k + 1) + v.slice(k + 1).replace(/[,.]/g, ""); if (
              v === sep) v = "0" + sep; return v.slice(0, 8); }
      function add(c) { if (busy(host)) return; var v = inp.value; if (b.frac) { if (c === "/" && (!/\d$/.test(v) || v.indexOf("/") >= 0)) return; if (
          c === " " && (!/\d$/.test(v) ||
          v.indexOf("/") >= 0 || v.indexOf(" ") >= 0)) return; } if (c === sep && b.frac) return; if (c === sep && (!b.dec || v.indexOf(
              sep) >= 0)) return; if (v.length >= (b.frac ? 9 :
          8)) return; inp.value = last = clean(v + c); QS.A.sfx("tap"); inp.focus({ preventScroll: true }); }
      function back() { if (busy(host)) return; inp.value = last = inp.value.slice(0, -1); QS.A.sfx("tap"); inp.focus({ preventScroll: true }); }
      function submit() {
        var raw = b.frac ? inp.value.trim() : inp.value.replace(new RegExp("\\" + sep + "$"), "");
        if (busy(host) || !raw) return;
        if (b.frac) {
          var fa = fnorm(raw), fk = fnorm(String(b.ans));
          if (!fa) { shake(fld); return; }   /* chưa thành số hợp lệ (vd "3/"): rung nhẹ, không tính là sai */
          if (b.exact ? fa.s === fk.s : Math.abs(fa.v - fk.v) < 1e-9) { QS.A.right(fld); return; }
          shake(fld); var rf = QS.A.wrong((b.tags && b.tags[fa.s]) || "other", function () { inp.value = b.show || b.ans; fld.classList.add("okk"); }, b.reveal);
          if (rf === 1) setTimeout(function () { inp.value = last = ""; inp.focus({ preventScroll: true }); }, 650);
          return;
        }
        var num = Number(raw.replace(sep, ".")), key = String(num);
        if (Math.abs(num - Number(b.ans)) < 1e-9) { QS.A.right(fld); return; }
        shake(fld); var r = QS.A.wrong((b.tags && b.tags[key]) || "other", function () { inp.value = b.show || b.ans; fld.classList.add("okk"); }, b.reveal);
            /* gõ trúng một đáp án nhiễu của engine thì ghi đúng mã lỗi tư duy */
        if (r === 1) setTimeout(function () { inp.value = last = ""; inp.focus({ preventScroll: true }); }, 650);
      }
      inp.addEventListener("input", function () { if (busy(host)) { inp.value = last; return; } var v = clean(inp.value); if (
          v !== inp.value) inp.value = v; last = inp.value; });
      "1234567890".split("").forEach(function (c) { var k = tile(c, "kb"); k.onclick = function () { add(c); }; pad.appendChild(k); });
      var bk = tile("⌫", "kb act"); bk.setAttribute("aria-label", "⌫"); bk.onclick = back;
      if (b.dec) { var sk = tile(sep, "kb"); sk.setAttribute("aria-label", sep === "," ? "dấu phẩy" : "decimal point"); sk.onclick = function () { add(
          sep); }; pad.appendChild(sk);
          bk.style.gridColumn = "span 1"; }
      if (b.frac) { var sl2 = tile("/", "kb"); sl2.setAttribute("aria-label", b.lang === "en" ? "fraction bar" : "gạch phân số");
          sl2.onclick = function () { add("/"); }; pad.appendChild(sl2);
          var sp2 = tile("␣", "kb"); sp2.setAttribute("aria-label", b.lang === "en" ? "space (mixed number)" : "cách (hỗn số)");
              sp2.onclick = function () { add(" "); }; pad.appendChild(sp2);
          bk.style.gridColumn = "span 1"; }
      pad.appendChild(bk);
      var go = tile("✓", "kb go"); if (b.frac) go.style.gridColumn = "span 2"; go.setAttribute("aria-label", "✓"); go.onclick = submit; pad.appendChild(go);
      var onKey = function (e) { if (e.ctrlKey || e.metaKey || e.altKey) return; if (e.key === "Enter") { e.preventDefault(); submit(); } else if (
          e.target !== inp && (/^[0-9,.\/ ]$/.test(
          e.key) || e.key === "Backspace")) inp.focus({ preventScroll: true }); };
      d.addEventListener("keydown", onKey); QS.cleanup = function () { d.removeEventListener("keydown", onKey); };
      host.appendChild(fld); host.appendChild(pad); setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) {} }, 0);
    }

    /* nghe–viết (dictate) và viết câu (write): ô nhập chữ thật + nút ✓. dictate so khớp từ cần viết; write chấm theo tiêu chí hình thức (LearnTypes.checkWrite) */
    function renderText(b, host) {
      var fld = h("div", "qd fld txt"), inp = h("input", "qi"), go = tile("✓", "ab tl kb go"), row = h("div", "qk qt1"), isW = b.kind === "write";
      var tipEl = h("div", "wtip"); tipEl.setAttribute("role", "status");
          tipEl.style.cssText = "display:none;margin:8px 4px 0;padding:8px 12px;border-radius:12px;background:#fff7e0;color:#7a4b00;font-size:16px;line-height:1.35;text-align:center;font-weight:600";
      inp.type = "text"; inp.maxLength = isW ? 140 : 24; inp.placeholder = isW ? "…" : "?"; inp.setAttribute("autocomplete", "off"); inp.setAttribute(
          "autocorrect", "off"); inp.setAttribute(
          "autocapitalize", isW ? "sentences" : "off"); inp.setAttribute("spellcheck", "false"); inp.setAttribute("aria-label", b.lab || "");
      fld.appendChild(inp); go.setAttribute("aria-label", "✓");
      function norm(x) { x = String(x).replace(/\s+/g, " ").trim().toLowerCase(); return x.normalize ? x.normalize("NFC") : x; }
      function submit() {
        if (busy(host) || !inp.value.trim()) return;
        tipEl.style.display = "none";
        if (isW) {
          var res = (window.LearnTypes && LearnTypes.checkWrite) ? LearnTypes.checkWrite(inp.value, b, b.lang) : { ok: inp.value.trim().length > 3, tip: "" };
          if (res.ok) { QS.A.right(fld); return; }
          shake(fld); var r0 = QS.A.wrong("other", function () { fld.classList.add("okk"); }, null); if (res.tip) { tipEl.textContent = res.tip;
              tipEl.style.display = "block"; } if (
              r0 === 1) setTimeout(function () { inp.focus(); }, 300); return;
        }
        var v = norm(inp.value);
        if ((b.accept || [b.ans]).indexOf(v) >= 0) { QS.A.right(fld); return; }
        shake(fld); var r = QS.A.wrong("spelling", function () { inp.value = b.reveal || b.ans; fld.classList.add("okk"); }, b.reveal || b.ans);
        if (r === 1) setTimeout(function () { inp.value = ""; inp.focus(); }, 650);
      }
      go.onclick = submit; inp.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); submit(); } });
      row.appendChild(go); host.appendChild(fld); if (isW) host.appendChild(tipEl); host.appendChild(row); setTimeout(function () { try { inp.focus({
          preventScroll: true }); } catch (e) {} }, 0);
    }
    /* đọc to (speak): bé đọc thành tiếng rồi tự báo; không có nhận dạng giọng nói nên ghi là "tự báo" */
    function renderSpeak(b, host) {
      var done = tile((b.lang === "en" ? "✓ I read it aloud" : "✓ Em đã đọc to xong"), "ab tl kb go sayb");
      done.onclick = function () { if (busy(host)) return; QS.A.right(done); };
      host.appendChild(done);
    }

    /* tô chữ (trace, lớp 1): hai canvas chồng nhau — dưới là chữ mờ, trên là nét bé tô. Chấm: nét phủ >= 60% phần lõi của chữ
       và nét lem ra ngoài (cách chữ > 12px) <= 30% tổng nét. Sai lần đầu: xoá cho tô lại; sai lần hai: hiện chữ đầy đủ rồi sang câu sau. */
    function renderTrace(b, host) {
      var W = 300, H = 240, wrap = h("div", "trw"), box = h("div", "trbox"), gc = h("canvas", "trg"), ic = h("canvas", "trc"), row = h("div", "trrow"),
          clr = tile("↺", "kb"), go = tile("✓", "ab tl kb go");
      gc.width = ic.width = W; gc.height = ic.height = H; clr.setAttribute("aria-label", "↺"); go.setAttribute("aria-label", "✓"); go.disabled = true;
      var g = gc.getContext("2d"), x = ic.getContext("2d"), fam = getComputedStyle(d.body).fontFamily, font = "800 " + Math.round(H * .92) + "px " +
          fam, drawing = false, any = false, locked = false;
      function setup(c) { c.font = font; c.textAlign = "center"; c.textBaseline = "middle"; c.lineJoin = "round"; }
      function guide(alpha) { g.clearRect(0, 0, W, H); setup(g); g.globalAlpha = alpha; g.fillStyle = getComputedStyle(d.body).color || "#888";
          g.fillText(b.ch, W / 2, H * .54); g.globalAlpha = 1; }
      function mask(erode, grow) {
        var c = d.createElement("canvas"); c.width = W; c.height = H; var k = c.getContext("2d"); setup(k); k.fillStyle = k.strokeStyle = "#000";
        if (grow) { k.lineWidth = grow * 2; k.strokeText(b.ch, W / 2, H * .54); } k.fillText(b.ch, W / 2, H * .54);
        if (erode) { k.globalCompositeOperation = "destination-out"; k.lineWidth = erode * 2; k.strokeText(b.ch, W / 2, H * .54); }
        return k.getImageData(0, 0, W, H).data;
      }
      function judge() {
        var core = mask(9, 0), wide = mask(0, 12), ink = x.getImageData(0, 0, W, H).data, cn = 0, cc = 0, tot = 0, out = 0, i;
        for (i = 3; i < core.length; i += 4) { var inkOn = ink[i] > 40; if (core[i] > 128) { cn++; if (inkOn) cc++; } if (inkOn) { tot++; if (wide[i] < 40) out++; } }
        if (!tot) return false; return (cn < 40 || cc / cn >= .6) && out / tot <= .3;
      }
      function clear() { x.clearRect(0, 0, W, H); any = false; go.disabled = true; }
      function pt(e) { var r = ic.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; }
      x.lineWidth = 30; x.lineCap = x.lineJoin = "round"; x.strokeStyle = "#7C5CFF"; x.fillStyle = "#7C5CFF";
      ic.style.touchAction = "none";
      ic.addEventListener("pointerdown", function (e) { if (locked || busy(host)) return; drawing = true; try { ic.setPointerCapture(e.pointerId);
          } catch (z) {} var p = pt(e); x.beginPath();
          x.moveTo(p[0], p[1]); x.lineTo(p[0] + .01, p[1]); x.stroke(); any = true; go.disabled = false; QS.A.sfx("tap"); e.preventDefault(); });
      ic.addEventListener("pointermove", function (e) { if (!drawing) return; var p = pt(e); x.lineTo(p[0], p[1]); x.stroke(); x.beginPath(); x.moveTo(
          p[0], p[1]); e.preventDefault(); });
      function up() { drawing = false; } ic.addEventListener("pointerup", up); ic.addEventListener("pointercancel", up);
      clr.onclick = function () { if (locked || busy(host)) return; clear(); };
      go.onclick = function () {
        if (locked || busy(host) || !any) return;
        if (judge()) { locked = true; QS.A.right(wrap); return; }
        shake(box); var r = QS.A.wrong("other", function () { locked = true; clear(); guide(.9); }, null); if (r === 1) setTimeout(clear, 650);
      };
      document.fonts && document.fonts.ready ? document.fonts.ready.then(function () { guide(.22); }) : guide(.22); guide(.22);
      box.appendChild(gc); box.appendChild(ic); row.appendChild(clr); row.appendChild(go); wrap.appendChild(box); wrap.appendChild(row); host.appendChild(wrap);
    }

    QS.renderTypein = renderTypein; QS.renderText = renderText; QS.renderSpeak = renderSpeak; QS.renderTrace = renderTrace;
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnQUIParts = root.LearnQUIParts || {})["text"] = part;
})(typeof window !== "undefined" ? window : globalThis);
