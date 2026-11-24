/* Trượt Số Nam Châm — hộp NHẬP SỐ HÀNG × SỐ CỘT (2–10) hiện khi bấm "Chọn cỡ & chơi" (kể cả nút Chơi ngay của màn chính). */
(function () {
  const o = document.createElement("div"); o.className = "ov"; o.id = "ovSize"; o.hidden = true;
  const row = (id, key) => '<div class="szrow"><b id="' + id + 'L"></b><button class="ib" type="button" id="' + id + 'M" aria-label="-">−</button><input id="' + id + '" type="number" inputmode="numeric" min="2" max="10" step="1"><button class="ib" type="button" id="' + id + 'P" aria-label="+">+</button></div>';
  o.innerHTML = '<h2 id="szH"></h2>' + row("szR") + row("szC") + '<div class="chips" id="szPre"></div><p class="mut" id="szInfo"></p><div class="row"><button class="btn alt" id="szNo" type="button">✕</button><button class="btn grow" id="szGo" type="button"></button></div>';
  $("play").appendChild(o);
  const val = id => clampN($(id).value), info = () => { $("szInfo").textContent = T("szInfo", { r: val("szR"), c: val("szC"), n: val("szR") * val("szC") - 1 }); };
  const set = (id, v) => { $(id).value = clampN(v); info(); };
  function open() {
    $("szH").textContent = "📐 " + T("szH"); $("szRL").textContent = T("rows"); $("szCL").textContent = T("cols"); $("szGo").textContent = "▶ " + T("szGo");
    set("szR", SZ[0]); set("szC", SZ[1]); $("szPre").innerHTML = "";
    [[3, 3], [4, 4], [5, 5], [6, 6], [4, 6], [8, 8]].forEach(([r, c]) => { const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = r + "×" + c; b.onclick = () => { set("szR", r); set("szC", c); }; $("szPre").appendChild(b); });
    $("ovSize").hidden = false;
  }
  ["szR", "szC"].forEach(id => { $(id + "M").onclick = () => set(id, val(id) - 1); $(id + "P").onclick = () => set(id, val(id) + 1); $(id).onchange = () => set(id, val(id)); $(id).oninput = info; });
  $("szNo").onclick = () => { $("ovSize").hidden = true; };
  $("szGo").onclick = () => { SZ = [val("szR"), val("szC")]; LS.set("ts-sz", SZ); $("ovSize").hidden = true; begin(newSeed(), "free", TY, null); };
  $("bFree").addEventListener("click", e => { if (window.NP && NP.helper) return; e.stopImmediatePropagation(); open(); }, true);
})();
