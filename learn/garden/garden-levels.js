/* Cấp (giao diện màu) của vườn. */
var LVS = [null, { n: "Cấp 1 · Mầm xanh", a: "#34D399", b: "#059669", bg: "#ECFDF5", d1: "#0B3D2E", d2: "#14675A", i1: "#FFF3B8", i2: "#FFB020" }, { n: "Cấp 2 · Trời xanh", a: "#38BDF8", b: "#2563EB", bg: "#EFF6FF", d1: "#0B2A5B", d2: "#1B4FB5", i1: "#FFE2B8", i2: "#FF8A3D" }, { n: "Cấp 3 · Tím mộng mơ", a: "#A78BFA", b: "#6D4AE0", bg: "#F5F3FF", d1: "#2A1763", d2: "#4C2FB0", i1: "#FFF7B8", i2: "#FFC83D" }, { n: "Cấp 4 · Nắng vàng", a: "#FBBF24", b: "#EA580C", bg: "#FFF7ED", d1: "#5A2A06", d2: "#A04A12", i1: "#DFF4FF", i2: "#38BDF8" }], LV = 3;
function applyLv(n){ LV = n; var t = LVS[n], r = document.documentElement.style; r.setProperty("--a", t.a); r.setProperty("--b", t.b); r.setProperty("--bg", t.bg); r.setProperty("--d1", t.d1); r.setProperty("--d2", t.d2); r.setProperty("--i1", t.i1); r.setProperty("--i2", t.i2); try { localStorage.setItem("gardenLv", n); } catch (e) {} document.querySelectorAll(".lvbar button").forEach(function(b){ var on = +b.dataset.l === n; b.classList.toggle("on", on); b.style.background = on ? "linear-gradient(135deg," + t.a + "," + t.b + ")" : ""; }); }
function initLevels(){
try { LV = +localStorage.getItem("gardenLv") || 3; } catch (e) {}
document.querySelectorAll(".lvbar button").forEach(function(b){ b.onclick = function(){ applyLv(+b.dataset.l); }; });
applyLv(LV);
}

