/* CÁC KHU CỦA NGÔI NHÀ: phòng khách (chơi), bếp (ăn), nhà tắm (tắm), phòng ngủ (ngủ), sân sau (đi dạo, nhặt sao). Thanh biểu tượng ở đáy + vuốt ngang để đổi khu;
   Bi tự đi ra rồi vào khu mới. Khu mở dần theo cấp tình cảm (khoá hiện mờ + ổ khoá). Cảnh = màu 3D (NTV_SCENES.c) + đồ đặt trên tường sau. */
(function (N) {
  "use strict";
  var cur = "living", swiping = false;
  var idx = function (id) { for (var i = 0; i < N.store.D().zones.length; i++) if (N.store.D().zones[i][0] === id) return i; return 0; };
  N.zoneOpen = function (id) { return N.store.level() >= N.store.D().zones[idx(id)][3]; };
  N.zoneId = function () { return cur; };
  function scene(id) {
    var sc = NTV_SCENES[id], rm = N.$("rm"), c = sc.c, v = ["--w1", "--w2", "--s1", "--s2", "--f1", "--f2", "--cc"];
    v.forEach(function (k, i) { rm.style.setProperty(k, c[i]); }); rm.dataset.rug = sc.rug || 0; rm.dataset.sky = sc.sky || 0; rm.dataset.zone = id;
    var lv = N.store.level(), h = "";
    sc.props.forEach(function (p) { if ((p.lv || 0) <= lv) h += '<img src="' + N.art(p.i) + '" alt="" style="left:' + p.l + "%;bottom:" + p.b + "%;width:" + p.w + '%">'; });
    N.$("props").innerHTML = h;
  }
  /* thanh khu: biểu tượng tranh Pop 3D */
  N.buildZoneBar = function () {
    var bar = N.$("zbar"), D = N.store.D(); bar.innerHTML = "";
    D.zones.forEach(function (z) {
      var b = document.createElement("button"), open = N.zoneOpen(z[0]); b.type = "button"; b.className = "zb" + (z[0] === cur ? " on" : "") + (open ? "" : " lk");
      b.dataset.z = z[0]; b.setAttribute("aria-label", "Khu " + z[0]); b.setAttribute("role", "tab");
      b.innerHTML = '<img src="' + N.art(z[2]) + '" alt="">' + (open ? "" : '<i class="lkb">' + N.icon("lock") + "</i>");
      b.onclick = function () { N.sfx.tap(); N.goZone(z[0]); }; bar.appendChild(b);
    });
  };
  N.goZone = function (id, dir) {
    if (N.busy || id === cur) return;
    if (!N.zoneOpen(id)) { N.sfx.bad(); var z = N.store.D().zones[idx(id)]; N.toast("Cần " + N.store.D().pet.levels[z[3]][0] + " để mở", 1600); N.puffLock(id); return; }
    var old = idx(cur), nu = idx(id), d = dir || (nu > old ? 1 : -1), rm = N.$("rm"), pw = N.$("pw");
    N.busy = true; N.petX(d > 0 ? 125 : -25, true); N.setExp("cun");
    setTimeout(function () {
      rm.classList.add("swap"); N.setCare("none");
      setTimeout(function () {
        cur = id; scene(id); N.buildZoneBar(); pw.classList.add("nott"); N.petX(d > 0 ? -25 : 125, true); void pw.offsetWidth; pw.classList.remove("nott");
        rm.classList.remove("swap"); N.busy = false; var c = N.store.D().zones[idx(id)][1];
        setTimeout(function () { N.petX(50, false); N.setCare(c); if (N.onZone) N.onZone(id); }, 60);
      }, 260);
    }, 380);
  };
  N.puffLock = function (id) { var b = document.querySelector('.zb[data-z="' + id + '"]'); if (b) { b.classList.add("shk"); setTimeout(function () { b.classList.remove("shk"); }, 400); } };
  N.enterZone = function (id) { cur = id || cur; scene(cur); N.buildZoneBar(); N.petX(50); N.setCare(N.store.D().zones[idx(cur)][1]); };
  N.refreshZones = function () { scene(cur); N.buildZoneBar(); };
  /* vuốt ngang trên cảnh = sang khu bên cạnh (chỉ khi không đang kéo đồ) */
  function swipe() {
    var rm = N.$("rm"), sx = 0, sy = 0, id = null;
    rm.addEventListener("pointerdown", function (e) { id = e.pointerId; sx = e.clientX; sy = e.clientY; });
    function end(e) {
      if (id !== e.pointerId) return; id = null; var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) < 70 || Math.abs(dy) > 60 || N.busy || N.screen !== "room") return;
      var Z = N.store.D().zones, i = idx(cur) + (dx < 0 ? 1 : -1); if (i < 0 || i >= Z.length) return; N.goZone(Z[i][0], dx < 0 ? 1 : -1);
    }
    rm.addEventListener("pointerup", end); rm.addEventListener("pointercancel", function () { id = null; });
  }
  N.care.none = { items: function () { return []; }, empty: function () { return ""; } };
  swipe();
})(window.NTV);
