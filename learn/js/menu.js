let AUTO = ls("learn:auto") == null ? grade <= 2 : ls("learn:auto") === "1", GESTURE = false;   /* lớp 1–2 chưa đọc thạo: mặc định TỰ ĐỌC đề (bé tắt được) */
const mqL = matchMedia("(max-height:430px) and (min-aspect-ratio:11/10)");
function placeStars(){ const st = $("stars"); if(mqL.matches){ if(st.parentNode !== $("topRow")) $("snd").before(st); } else if(st.parentNode !== $("streak").parentNode) $("streak").before(st); }
if(mqL.addEventListener) mqL.addEventListener("change", placeStars);
/* ← : về TRANG TRƯỚC ĐÓ nếu bé đến từ một trang cùng site (hub game, trang môn...); mở thẳng trang học thì về hub Học Vui */
function storyUrl(){   /* đi từ Lớp truyện (sessionStorage learn:from=story): ← và các nút về đều về bản đồ truyện */
  try{ const u = sessionStorage.getItem("learn:from") === "story" && sessionStorage.getItem("learn:from:url"); return u && /^\/learn\/story\/[a-z-]+\.html\?/.test(u) ? u : ""; }catch(_){ return ""; }
}
function hubUrl(){ return storyUrl() || (lang === "en" ? "/en" : "") + "/hoc/"; }
function goBack(e){
  e.preventDefault(); let same = false;
  if(storyUrl()){ location.href = storyUrl(); return; }
  try{ const r = new URL(document.referrer); same = !!document.referrer && r.origin === location.origin && r.pathname !== location.pathname; }catch(_){}
  if(same && history.length > 1) history.back(); else location.href = hubUrl();
}
function sndUi(){ const t = T[lang]; $("snd").textContent = AUTO ? "🔊" : "🔇"; $("snd").setAttribute("aria-pressed", String(AUTO)); const n = (AUTO ? t.autoOn : t.autoOff);
  $("snd").setAttribute("aria-label", n); $("snd").title = n; }
function menuUi(){ const t = T[lang];
  [["mn", t.menu], ["mPick", t.mPick], ["mAgain", t.mAgain], ["lang", t.lang], ["mMusic", t.music], ["mTheme", t.theme], ["mInfo", t.fiAria], ["mParent",
    PARENT_COPY.UI[lang].title]].forEach(([id, n]) => { $(id).setAttribute("aria-label", n); $(id).title = n; });
  const LB = lang === "en" ? ["Subject","Replay","Music","Theme","Map","Mine","Info","Parents","Tiếng Việt","Voice"] : ["Đổi môn","Chơi lại","Nhạc","Sáng/Tối","Bản đồ","Của bé",
    "Thông tin","Phụ huynh","English","Giọng đọc"];
  ["lPick","lAgain","lMusic","lTheme","lMap","lMe","lInfo","lParent","lLang","lVoice"].forEach((id, i) => { if(id) $(id).textContent = LB[i]; });
  $("mVoice").setAttribute("aria-label", LB[9]);
  $("lang").firstChild.textContent = t.next; }
function openMenu(){ $("mnu").hidden = false; $("mn").setAttribute("aria-expanded", "true"); const f = $("mnu").querySelector(".mt"); if(f) f.focus(); }
function closeMenu(refocus){ if($("mnu").hidden) return; $("mnu").hidden = true; $("mn").setAttribute("aria-expanded", "false"); if(refocus) $("mn").focus(); }
function renderStars(){ $("stars").textContent = "⭐ " + stars; $("stars").setAttribute("aria-label", stars + " " + T[lang].stars); }
