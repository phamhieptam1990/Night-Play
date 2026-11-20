/* Cây bé tự trồng trên đất trống/đất xám: hiện cây lớn dần theo giai đoạn và NHỚ trên máy.
   - Ô vẽ sẵn cây trong ảnh cảnh (p.base0) không vẽ thêm. Ô cây ăn trái (p.tree) có ảnh riêng.
   - Lưu "gardenFarm" = { "<số ô>": [giống, số câu đúng] } chỉ cho ô bé đã trồng; ô thu hoạch xong thì xoá khỏi danh sách. */
var FARM_KEY = "gardenFarm";
function loadFarm(){ try { return JSON.parse(localStorage.getItem(FARM_KEY) || "{}") || {}; } catch (e) { return {}; } }
function saveFarm(){ var o = {}; PLOTS.forEach(function(p){ if(!p.base0 && !p.tree && p.planted && p.crop) o[p.i] = [p.crop, p.got]; }); try { localStorage.setItem(FARM_KEY, JSON.stringify(o)); } catch (e) {} }
/* chạy TRƯỚC initPlots: ghi nhớ ô nào đã vẽ sẵn cây, rồi khôi phục cây bé từng trồng */
function initCrops(){
  var saved = loadFarm();
  PLOTS.forEach(function(p){ p.base0 = !!p.planted; var s = saved[p.i]; if(!p.base0 && !p.tree && s && CI[s[0]]){ p.planted = true; p.crop = s[0]; p.need = CI[s[0]].need; p.got = Math.min(+s[1] || 0, p.need); } });
}
/* gọi từ badge(): vẽ/xoá cây trong ô theo trạng thái hiện tại */
function cropSprite(p, b){
  if(p.tree || p.base0) return;
  var im = b.querySelector(".cs"), want = p.planted && p.crop ? GardenLayout.ART + "crop_" + p.crop + (stg(p) >= 4 ? "" : "_s" + stg(p)) + ".svg" : "";
  if(!want){ if(im) im.remove(); saveFarm(); return; }
  if(!im){ im = document.createElement("img"); im.className = "cs"; im.alt = ""; b.insertBefore(im, b.firstChild); }
  if(im.getAttribute("src") !== want) im.src = want;
  saveFarm();
}
