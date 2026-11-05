/* Kiểm tra Night Pass cho landing/game.  <script src="../shared/pass.js"></script>
   NightPass.check().then(p => { if (p.active) unlockAll(); })
   Quyền thật nằm ở server; localStorage chỉ giữ token. Server nên kiểm tra lại khi phục vụ nội dung trả phí. */
window.NightPass = (() => {
  const API = "/api";
  const get = () => { try { return JSON.parse(localStorage.getItem("pass")); } catch (e) { return null; } };
  async function check() {
    const p = get();
    if (!p || !p.token) return { active: false };
    try {
      const r = await fetch(API + "/pass", { headers: { Authorization: "Bearer " + p.token } });
      if (!r.ok) return { active: false };
      const s = await r.json();
      try { localStorage.setItem("pass", JSON.stringify({ ...p, exp: new Date(s.exp).toISOString() })); } catch (e) {}
      return s;
    } catch (e) {
      return { active: !!p.exp && new Date(p.exp) > new Date(), offline: true }; // mất mạng: dùng cache tạm
    }
  }
  return { check, get };
})();
