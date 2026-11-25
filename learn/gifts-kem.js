/* CẦU NỐI QUÀ của Quán các lớp (Học Vui, môn Tiếng Anh) — MỖI QUÁN CHỈ NHẬN QUÀ CỦA LỚP MÌNH. Sống chung được với learn/gifts.js của Nhà của Bi: tên toàn cục, khoá lưu và hàm đều khác.
   ĐỌC (không ghi) tiến độ: learn:pf:<hồ sơ>:lp:<lớp>:tanh = { <topic_id>: { l: đã học, b: số sao kiểm tra tốt nhất 0-5 } } (xem learn/path.js).
   GHI sổ đã nhận: lớp 1 = learn:quankem:claim (khoá cũ, giữ dữ liệu), lớp N>1 = learn:quankem:claim:N; dạng { "<lớp>:<topic_id>": { l: 0|1, b: sao đã tính } } → mỗi bài / mỗi sao chỉ thưởng MỘT lần.
   CÂN BẰNG: lớp 1-2 có 3 chủ đề, lớp 3-5 có 4 → xu mỗi bài nhân 4/số chủ đề để mỗi quán đạt mức nâng cấp tương đương.
   Dùng: QuanKemGift.pending(lớp) -> { coins, topics }, QuanKemGift.claim(lớp) -> số xu mới nhận (game tự cộng vào ví). */
(function (root) {
  "use strict";
  const N = [3, 3, 4, 4, 4], RATE = (root.QK_DATA && root.QK_DATA.gift) || { learned: 10, star: 5, passed: 10 };
  const get = k => { try { return root.localStorage.getItem(k); } catch (e) { return null; } };
  const json = (k, def) => { try { const o = JSON.parse(get(k) || "null"); return o && typeof o === "object" ? o : def; } catch (e) { return def; } };
  const pf = () => { const p = String(get("learn:pf") || "1"); return /^[A-Za-z0-9_-]{1,16}$/.test(p) ? p : "1"; };
  const ck = g => "learn:quankem:claim" + (g > 1 ? ":" + g : "");
  function scan(g) {
    g = g >= 1 && g <= 5 ? g | 0 : 1;
    const led = json(ck(g), {}), out = [], lp = json("learn:pf:" + pf() + ":lp:" + g + ":tanh", {}), w = 4 / N[g - 1]; let coins = 0;
    Object.keys(lp).forEach(t => {
      const r = lp[t] || {}, c = led[g + ":" + t] || { l: 0, b: 0 }, nb = Math.max(0, Math.min(5, r.b | 0)), nl = r.l ? 1 : 0;
      let n = 0; if (nl && !c.l) n += RATE.learned; if (nb > c.b) n += (nb - c.b) * RATE.star; if (nb >= 3 && c.b < 3) n += RATE.passed; n = Math.round(n * w);
      if (n > 0) { out.push({ id: g + ":" + t, to: { l: nl || c.l, b: Math.max(nb, c.b) }, coins: n }); coins += n; }
    });
    return { g, coins, topics: out, led };
  }
  root.QuanKemGift = {
    pending(g) { const s = scan(g); return { coins: s.coins, topics: s.topics.length }; },
    claim(g) {
      const s = scan(g); if (!s.coins) return 0;
      s.topics.forEach(x => { s.led[x.id] = x.to; });
      try { root.localStorage.setItem(ck(s.g), JSON.stringify(s.led)); } catch (e) { return 0; }
      return s.coins;
    }
  };
})(window);
