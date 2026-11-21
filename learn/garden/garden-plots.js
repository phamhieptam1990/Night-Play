/* Ô trồng: giai đoạn, phần thưởng, huy hiệu, vùng bấm. */
var SN = ["Hạt", "Mầm", "Cây con", "Sắp chín", "CHÍN"];
function ths(n){ return [0, Math.ceil(n * .2), Math.ceil(n * .4), Math.ceil(n * .8), n]; }
function stg(p){ if(!p.planted) return 0; var t = ths(p.need), k = 0; for(var i = 1; i < 5; i++) if(p.got >= t[i]) k = i; return k; }
function icon(id, sz){ return CI[id].img ? "<img src='" + GardenLayout.ART + "produce_" + id + ".svg' alt='' style='width:" + sz + "px;height:" + sz + "px'>" : "<span style='font-size:" + Math.round(sz * .8) + "px;line-height:1'>" + CI[id].ic + "</span>"; }
function mins(n){ return Math.max(1, Math.ceil(n * 0.7)); }
function reward(p){ var c = CI[p.crop]; return c.per[Math.min(4, stg(p))]; }
function badge(p, b){ var e = b.querySelector(".bdg"); if(e) e.remove(); var t = p.tree || !p.planted ? "" : p.got >= p.need ? CI[p.crop].ic : "";   /* ô cây ăn trái và ĐẤT TRỐNG: không gắn huy hiệu (bỏ dấu + trên đất trồng); chỉ hiện nông sản khi chín */ if(t){ e = document.createElement("span"); e.className = "bdg" + ""; e.textContent = t; b.appendChild(e); } b.classList.toggle("ripe", p.planted && p.got >= p.need); if(p.tree && typeof saveTrees === "function") saveTrees(); if(typeof cropSprite === "function") cropSprite(p, b); b.setAttribute("aria-label", p.planted ? CI[p.crop].vi + (p.got >= p.need ? ": chín, bấm để thu hoạch" : ": còn " + (p.need - p.got) + " câu đúng nữa") : "Đất trống, bấm để chọn cây"); }
function initPlots(){
/* cỡ vùng bấm theo cỡ cảnh (không ghi cứng trong CSS): rộng ≈ 1,1 ô, cao ≈ 0,83 ô */
stage.style.setProperty("--hsw", (11520 / W) + "%"); stage.style.setProperty("--hsh", (8448 / H) + "%"); stage.style.aspectRatio = W + "/" + H;
PLOTS.forEach(function(p){ var b = document.createElement("button"); b.type = "button"; b.className = "hs"; b.style.left = (p.x / W * 100) + "%"; b.style.top = (p.y / H * 100) + "%"; p.el = b; badge(p, b); stage.appendChild(b);
  b.addEventListener("pointerenter", function(){ showTip(p); }); b.addEventListener("pointerleave", hideTip); b.addEventListener("focus", function(){ showTip(p); }); b.addEventListener("blur", hideTip); b.addEventListener("click", function(){ hideTip(); openCard(p, b); }); });
}

