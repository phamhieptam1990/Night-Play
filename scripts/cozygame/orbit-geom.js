/* Bài đo HÌNH HỌC hệ quỹ đạo dùng chung cho check-hub.js và check-landing.js (shared/orbit.js + shared/orbit.css).
   Gọi: await orbitGeom(pg, tag, note, { hub: true|false }) khi trang đã tải và hệ quỹ đạo đang trong khung nhìn. Đo trong trang (36 pha quay xác định qua window.__npOrbit.setPhi, cần ?debug):
     - tâm hộp quỹ đạo = tâm khối chứa (hub: .orbwrap; landing: .orbsys) ±1px; hub dọc: cũng = tâm màn hình ±1px (không lệch do lưới ngầm/scrollbar/padding);
     - tâm hành tinh = tâm hai elip = tâm hộp ±1px;
     - MỌI vệ tinh (kể cả phóng to ở phía trước) nằm TRỌN trong hộp ở mọi pha;
     - đúng MỘT nhãn tên (.sat.lab); nhãn nếu đang hiện thì nằm trong hộp, không đè lên bất kỳ vệ tinh nào (>2px mỗi chiều) và không đè lên hành tinh. */
module.exports = async function orbitGeom(pg, tag, note, opt) {
  const r = await pg.evaluate((hub) => {
    const st = document.querySelector(".orbstage"), box = st.getBoundingClientRect(), cont = (hub ? st.closest(".orbwrap") : document.getElementById("orbsys")).getBoundingClientRect();
    const c = b => [(b.left + b.right) / 2, (b.top + b.bottom) / 2], bc = c(box), cc = c(cont), vw = document.documentElement.clientWidth;
    const out = { dContX: bc[0] - cc[0], dVwX: bc[0] - vw / 2, portrait: innerWidth / innerHeight < 1.1, planet: 0, rings: 0, satOut: 0, labelN: [], labOut: 0, labHitSat: 0, labHitPlanet: 0, samples: 0, labShown: 0 };
    const pb = st.querySelector(".planet").getBoundingClientRect(), pc = c(pb); out.planet = Math.hypot(pc[0] - bc[0], pc[1] - bc[1]);
    st.querySelectorAll(".ring").forEach(e => { const b = e.getBoundingClientRect(), k = c(b); out.rings = Math.max(out.rings, Math.hypot(k[0] - pc[0], k[1] - pc[1])); });
    const D = window.__npOrbit, inter = (a, b) => { const w = Math.min(a.right, b.right) - Math.max(a.left, b.left), h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); return w > 2 && h > 2; };
    for (let k = 0; k < 36; k++) {
      D.setPhi("pop", k * Math.PI * 2 / 36); D.setPhi("night", -k * Math.PI * 2 / 36 + 0.4);
      const sats = [...st.querySelectorAll(".sat")], sp = sats.map(a => a.querySelector("span").getBoundingClientRect()), b = st.getBoundingClientRect();
      sp.forEach(s => { out.satOut = Math.max(out.satOut, b.left - s.left, s.right - b.right, b.top - s.top, s.bottom - b.bottom); });
      out.labelN.push(st.querySelectorAll(".sat.lab").length);
      const L = st.querySelector(".orblab"); if (L && L.classList.contains("on")) {
        const lb = L.getBoundingClientRect(); out.labShown++; out.samples++;
        if (lb.left < b.left - .5 || lb.right > b.right + .5 || lb.top < b.top - .5 || lb.bottom > b.bottom + .5) out.labOut++;
        sp.forEach(s => { if (inter(lb, s)) out.labHitSat++; });
        if (inter(lb, st.querySelector(".planet").getBoundingClientRect())) out.labHitPlanet++;
      }
    }
    D.setPhi("pop", 0); D.setPhi("night", 0);
    return out;
  }, !!opt.hub);
  note(Math.abs(r.dContX) <= 1, tag, `hộp quỹ đạo lệch tâm khối chứa ${r.dContX.toFixed(1)}px (phải ±1)`);
  if (opt.hub && r.portrait) note(Math.abs(r.dVwX) <= 1, tag, `hộp quỹ đạo lệch tâm màn hình ${r.dVwX.toFixed(1)}px (phải ±1)`);
  note(r.planet <= 1, tag, `tâm hành tinh lệch tâm hộp ${r.planet.toFixed(1)}px`); note(r.rings <= 1, tag, `tâm elip lệch tâm hành tinh ${r.rings.toFixed(1)}px`);
  note(r.satOut <= 0.5, tag, `vệ tinh vượt ra ngoài hộp ${r.satOut.toFixed(1)}px (bị cắt)`);
  note(r.labelN.every(n => n === 1), tag, "phải có đúng MỘT nhãn tên mỗi thời điểm: " + [...new Set(r.labelN)]);
  note(r.labOut === 0, tag, `nhãn tên tràn ra ngoài hộp ở ${r.labOut} pha`); note(r.labHitSat === 0, tag, `nhãn tên đè lên vệ tinh ${r.labHitSat} lần`); note(r.labHitPlanet === 0, tag, `nhãn tên đè lên hành tinh ${r.labHitPlanet} lần`);
  note(r.labShown >= 25, tag, `nhãn tên chỉ hiện ở ${r.labShown}/36 pha (hộp quá chật, nhãn bị ẩn quá nhiều?)`);
  return r;
};
