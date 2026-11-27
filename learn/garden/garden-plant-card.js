/* Thẻ cây: mở popup cây (3 tab), thu hoạch, đổi cây. */
function openCard(p, btn){
  cur = p; lastFocus = btn; var h;
  if(!p.planted){
    /* đất trống: gọn, ảnh to, ít chữ — chọn loại (3 nút biểu tượng) rồi chạm giống cây */
    var CT = { ngan: "🥕 Ngắn ngày", hoamau: "🌾 Hoa màu", lau: "🍎 Lâu năm" };
    h = "<div class='hd'><div class='pi' style='font-size:64px'>🌱</div><div><h2 id='ptitle'>Trồng gì nào?</h2></div></div><!--B--><div class='ani plant'><div class='tabs' role='tablist'>" + Object.keys(CATS).map(function(k, n){ return "<button type='button' role='tab' class='tab" + (n === 0 ? " on" : "") + "' data-cat='" + k + "'>" + (CT[k] || CATS[k].vi) + "</button>"; }).join("") + "</div><div class='grid' id='pg'></div><p class='sm hintp' id='cnote'></p></div><div class='acts'><button class='btn g' type='button' id='cl'>Để sau</button></div>";
  } else {
    var c = CI[p.crop], left = p.need - p.got, ripe = left <= 0, sg = stg(p);
    var tt = ths(p.need), stepper = SN.map(function(n, k){ var done = k < sg, now = k === sg; return "<li class='" + (done ? "dn" : now ? "nw" : "") + "'><i>" + ["🌰", "🌱", "🌿", "🌸", "🧺"][k] + "</i><b>" + n + "</b><span>" + (tt[k] ? "từ " + tt[k] + " câu đúng" : "mới gieo") + "</span></li>"; }).join("");
    h = "<div class='hd'><div class='pi'>" + icon(p.crop, 76) + "</div><div><h2 id='ptitle'>" + c.vi + "</h2><span class='chip'>" + LVS[LV].n + "</span><span class='chip'>" + CATS[c.cat].vi + "</span><span class='chip'>" + c.subj + "</span><span class='chip'>" + SN[sg] + "</span></div></div><!--B-->" + masB(p, ripe) +
      (p.hurt ? "<div class='sec warn'>" + HURT[p.hurt].ic + " " + HURT[p.hurt].short + " Cây <b>tạm dừng lớn</b>, không hề hỏng. Em cứu vườn bằng vài bài vui nhé!</div>" : "") +
      "<div class='sec'><div class='row'><span>" + (ripe ? "Đã chín!" : "Còn " + left + " câu đúng · khoảng " + mins(left) + " phút học") + "</span><span>" + p.got + "/" + p.need + "</span></div><div class='bar" + (ripe ? " full" : "") + "'><i id='pb' style='width:0'></i></div></div>" +
      "<div class='tabs2' role='tablist'><button type='button' class='t2 on' data-t='0'>🌱 Giai đoạn</button><button type='button' class='t2' data-t='1'>📚 Cần học</button><button type='button' class='t2' data-t='2'>💧 Chăm sóc</button></div>" +
      "<div class='pnl on sec' data-p='0'><ol class='stp'>" + stepper + "</ol><p class='sm' style='margin-top:10px'>" + (ripe ? "Thu hoạch được <b>" + reward(p) + " " + c.vi.toLowerCase() + "</b>. " : "Khi chín sẽ thu được khoảng <b>" + c.per[4] + "</b>. ") + "<b>Sau khi thu hoạch:</b> " + (c.cat === "lau" ? "cây vẫn đứng ở vị trí này, mùa sau ra quả tiếp." : "ô trở lại đất trống, em trồng cây nào cũng được.") + "</p></div>" +
      "<div class='pnl sec' data-p='1'><p style='margin:0 0 8px'><b>Kỹ năng " + c.subj + ": " + c.skill + "</b></p><div class='chips'>" + c.learn.map(function(t){ return "<span>" + t + "</span>"; }).join("") + "</div></div>" +
      "<div class='pnl sec' data-p='2'><ul class='care' style='margin:0'>" + c.care.map(function(t){ return "<li>" + t + "</li>"; }).join("") + "</ul><p class='sm' style='margin-top:10px'>" + c.tip + " Cây lớn nhờ em làm đúng bài, không có đồng hồ đếm ngược và không bao giờ héo.</p></div>" +
      "<div class='acts'><button class='btn g' type='button' id='cl'>Đóng</button><button class='btn g' type='button' id='sw'>Đổi giống</button>" + (ripe ? "" : "<a class='btn go' id='go' href='../../../learn/index.html?subj=" + c.sk + "&grade=" + c.g + "&lang=vi'>Học ngay</a>") + "<button class='btn' type='button' id='hv'" + (ripe ? "" : " disabled") + ">" + (ripe ? "Thu hoạch" : "Chưa chín") + "</button></div>";
  }
  var pr = skin(h).split("<!--B-->"); card.innerHTML = pr[0] + "<div class='cbody'>" + (pr[1] || "") + "</div>"; ov.classList.add("on"); bindTabs(card);
  var pb = card.querySelector("#pb"); if(pb) requestAnimationFrame(function(){ requestAnimationFrame(function(){ pb.style.width = (p.got / p.need * 100) + "%"; }); });
  card.querySelector("#cl").onclick = closeCard; (card.querySelector("#hv") || card.querySelector(".tab") || card.querySelector("#cl")).focus();
  var hv = card.querySelector("#hv"); if(hv) hv.onclick = function(){ var c = CI[p.crop], n = reward(p); fxHarvest(p, n, p.crop);
    if(c.cat === "lau"){ p.got = 0; toast("+" + n + " " + c.ic + " " + c.vi + " vào kho · cây vẫn ở đó, mùa sau ra quả tiếp"); }
    else { p.planted = false; p.crop = null; p.got = 0; toast("+" + n + " " + c.ic + " " + c.vi + " vào kho · ô trống lại, trồng cây khác tùy ý"); }
    badge(p, p.el); closeCard(); };
  var sw = card.querySelector("#sw"); if(sw) sw.onclick = function(){ p.bk = { crop: p.crop, got: p.got, need: p.need }; p.planted = false; openCard(p, lastFocus); };
  function fillPick(cat){ var pg = card.querySelector("#pg"); if(!pg) return; card.querySelector("#cnote").textContent = "Cần " + CATS[cat].need + " câu đúng để chín · trồng tốn 1 🌱";
    card.querySelectorAll(".tab").forEach(function(t){ t.classList.toggle("on", t.getAttribute("data-cat") === cat); });
    pg.innerHTML = IDS.filter(function(id){ return CI[id].cat === cat && (!window.GardenItems || GardenItems.pickable(id)); }).map(function(id){ var ss = window.Farm ? Farm.seedState(id) : { open: true, need: "" }; return "<button class='pick" + (ss.open ? "" : " lock") + "' type='button' data-id='" + id + "'" + (ss.open ? "" : " aria-disabled='true'") + ">" + "<span class='pim'>" + icon(id, 72) + "</span>" + CI[id].vi + "<span>" + (ss.open ? CI[id].subj : "🔒 " + ss.need) + "</span></button>"; }).join("");
    pg.querySelectorAll(".pick").forEach(function(b){ b.onclick = function(){ var id = b.getAttribute("data-id"); var ss = window.Farm ? Farm.seedState(id) : { open: true }; if(!ss.open){ toast("🔒 Hạt này chưa mở. " + ss.need); return; } if(window.Farm && Farm.get().seeds < 1){ toast("Hết hạt giống rồi! Học một bài để có thêm 🌱"); return; } p.bk = null; p.planted = true; p.crop = id; p.need = CI[id].need; p.got = 0; badge(p, p.el); fxPlant(p); toast("Đã trồng " + CI[id].ic + " " + CI[id].vi + " (−1 hạt giống)"); closeCard();
      if(window.MultiPlant && MultiPlant.armed() && (!window.Farm || Farm.get().seeds > 0)) MultiPlant.start(id); }; }); }
  card.querySelectorAll(".tab").forEach(function(t){ t.onclick = function(){ fillPick(t.getAttribute("data-cat")); }; }); fillPick("ngan"); if(window.MultiPlant) MultiPlant.decorate(card);
}
function masB(p, ripe){ var c = CI[p.crop]; if(!c || !c.mas) return ""; return "<div class='masb'><img class='masi' src='" + GardenLayout.ART + "mascot_" + p.crop + "_l" + LV + (ripe ? "_cheer" : "") + ".svg' alt='" + c.mn + "'><div class='bub'><b>" + c.mn + "</b>" + (ripe ? c.say[1] : c.say[0]) + "</div></div>"; }
