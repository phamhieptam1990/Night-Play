/* nhạc nền êm (WebAudio, tự sinh, không tệp): thỉnh thoảng một nốt ngân mềm theo thang ngũ cung, rất nhỏ; mỗi môn một tông. Bật/tắt trong menu ⋯, nhớ lựa chọn. */
let MUSIC = ls("learn:music") !== "0", musicT = 0, MG = null;
/* NHẠC NỀN kiểu "nhạc hộp": nốt cao, ngắn, trong, chậm. NHIỀU BÀI: mỗi môn có bộ bài riêng (Toán vui nhộn, Tiếng Việt êm, Tiếng Anh tươi sáng), mỗi VÒNG KIỂM TRA đổi sang bài kế tiếp,
   đổi môn thì đổi bộ bài ngay; thoát trang / ẩn tab thì dừng hẳn. Mỗi bài = { c: 4 hợp âm × 4 nốt (số MIDI), p: mẫu rải 8 nốt, d: nhịp (giây/nốt), t: kiểu âm, k: dịch tông } */
const TRK = [
  { c: [[72, 76, 79, 84], [69, 72, 76, 81], [69, 72, 77, 81], [71, 74, 79, 83]], p: [0, 1, 2, 3, 2, 1, 2, 1], d: .46, t: "box", k: 0 },   /* 0: C–Am–F–G (bài gốc) */
  { c: [[72, 76, 79, 84], [67, 71, 74, 79], [69, 72, 76, 81], [65, 69, 72, 77]], p: [0, 2, 1, 3, 2, 1, 3, 2], d: .4, t: "pluck", k: 0 },   /* 1: C–G–Am–F nhanh, gảy */
  { c: [[67, 71, 74, 79], [64, 67, 71, 76], [60, 64, 67, 72], [62, 66, 69, 74]], p: [0, 1, 2, 3, 3, 2, 1, 0], d: .5, t: "box", k: 0 },   /* 2: G–Em–C–D lên xuống */
  { c: [[69, 72, 76, 81], [65, 69, 72, 77], [72, 76, 79, 84], [67, 71, 74, 79]], p: [0, 1, 2, 1, 3, 2, 1, 2], d: .56, t: "soft", k: 0 },   /* 3: Am–F–C–G êm */
  { c: [[65, 69, 72, 77], [72, 76, 79, 84], [67, 71, 74, 79], [69, 72, 76, 81]], p: [0, 2, 1, 2, 3, 1, 2, 0], d: .6, t: "soft", k: 0 },   /* 4: F–C–G–Am ru */
  { c: [[62, 66, 69, 74], [67, 71, 74, 79], [64, 67, 71, 76], [71, 74, 78, 83]], p: [0, 1, 2, 3, 2, 3, 1, 2], d: .52, t: "box", k: 0 },   /* 5: D–G–Em–B */
  { c: [[67, 71, 74, 79], [72, 76, 79, 84], [74, 78, 81, 86], [72, 76, 79, 84]], p: [0, 1, 2, 3, 2, 1, 0, 1], d: .38, t: "pluck", k: 0 },   /* 6: G–C–D–C tươi */
  { c: [[72, 76, 79, 84], [74, 77, 81, 86], [71, 74, 79, 83], [72, 76, 79, 84]], p: [0, 2, 1, 3, 1, 2, 0, 3], d: .44, t: "pluck", k: 0 },   /* 7: C–Dm–G–C */
  { c: [[69, 73, 76, 81], [64, 68, 71, 76], [66, 69, 73, 78], [71, 74, 78, 83]], p: [0, 1, 3, 2, 1, 2, 3, 1], d: .48, t: "box", k: 0 }   /* 8: A–E–F#m–B */
];
const SUBJ_TRK = { toan: [0, 1, 2], tviet: [3, 4, 5], tanh: [6, 7, 8] };
let mNext = 0, mStep = 0, mTrk = 0, mLast = -1, mSw = 0;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
function boxNote(f, t, pk, kind){
  const parts = kind === "soft" ? [[f, 1, "triangle", 1.6], [f * 2, .12, "sine", .5]] : kind === "pluck" ? [[f, 1, "triangle", .55], [f * 2, .25, "sine", .25]] : [[f, 1, "sine",
    1.3], [f * 3, .18, "sine", .35]];
  parts.forEach(([fr, k, ty, dur]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = ty; o.frequency.value = fr;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(pk * k, t + (kind === "soft" ? .03 : .008)); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g);
      g.connect(MG); o.start(t); o.stop(t + dur + .1); });
}
function musicTick(){
  if(!MUSIC || !AC || AC.state !== "running" || !MG) return;
  if(document.hidden){ mNext = 0; return; }
  const T = TRK[mTrk], now = AC.currentTime; if(mNext < now) mNext = now + .1;
  while(mNext < now + 1.2){ const bar = Math.floor(mStep / 8) % 4, k = mStep % 8; boxNote(mtof(T.c[bar][T.p[k]] + T.k), mNext, k === 0 ? .13 : .1, T.t); mStep++; mNext += T.d; }
}
/* chọn bài kế tiếp của môn hiện tại (không trùng bài vừa chơi) */
function pickTrack(){ const L = SUBJ_TRK[subj] || SUBJ_TRK.toan; let i = L.indexOf(mTrk); i = i < 0 ? Math.floor(Math.random() * L.length) : (i + 1) % L.length; mTrk = L[i];
  if(mTrk === mLast && L.length > 1) mTrk = L[(i + 1) % L.length]; mLast = mTrk; }
/* đổi bài: giảm âm lượng nhanh rồi vào bài mới (gọi khi bắt đầu vòng mới hoặc đổi môn) */
function musicSwitch(){
  if(!MUSIC || !AC || !MG){ pickTrack(); return; }
  clearTimeout(mSw); const t0 = AC.currentTime; MG.gain.cancelScheduledValues(t0); MG.gain.setValueAtTime(MG.gain.value, t0); MG.gain.linearRampToValueAtTime(.0001, t0 + .35);
  mSw = setTimeout(() => { pickTrack(); mStep = 0; mNext = 0; try{ const t1 = AC.currentTime; MG.gain.cancelScheduledValues(t1); MG.gain.setValueAtTime(.0001, t1);
    MG.gain.linearRampToValueAtTime(.8, t1 + 1.2); }catch(e){} musicTick(); }, 380);
}
function musicStart(){
  try{ AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if(AC.state === "suspended") AC.resume();
    if(!MG){ MG = AC.createGain(); MG.gain.value = 0; MG.connect(AC.destination); MG.gain.linearRampToValueAtTime(.8, AC.currentTime + 3); pickTrack(); }
    if(musicT) return; mNext = 0; musicT = setInterval(musicTick, 400); musicTick(); }catch(e){}
}
function musicStop(){ clearInterval(musicT); musicT = 0; }
/* THOÁT TRANG / ẨN TAB / KHOÁ MÀN HÌNH: dừng hẳn nhạc (tắt tiếng + treo bộ âm thanh), quay lại thì tự chạy tiếp */
function musicPause(){ clearInterval(musicT); musicT = 0; clearTimeout(mSw); try{ if(MG){ const t = AC.currentTime; MG.gain.cancelScheduledValues(t);
  MG.gain.setValueAtTime(.0001, t); } if(AC && AC.state === "running") AC.suspend(); }catch(e){} }
function musicResume(){ if(!MUSIC || !AC) return; try{ AC.resume().then(() => { if(MG){ const t = AC.currentTime; MG.gain.cancelScheduledValues(t);
  MG.gain.setValueAtTime(.0001, t); MG.gain.linearRampToValueAtTime(.8, t + 1.5); } mNext = 0; if(!musicT) musicT = setInterval(musicTick, 400); }); }catch(e){} }
function musicUi(){ const m = $("mMusic"); if(!m) return; m.setAttribute("aria-pressed", String(MUSIC)); m.style.opacity = MUSIC ? "1" : ".45"; m.firstChild.textContent = MUSIC ? "🎶" : "🎵"; }
["pointerdown", "touchstart", "keydown"].forEach(ev => addEventListener(ev, () => { if(MUSIC) musicStart(); }, { passive: true }));
document.addEventListener("visibilitychange", () => { if(document.hidden) musicPause(); else musicResume(); });
addEventListener("pagehide", musicPause);
addEventListener("beforeunload", musicPause);
addEventListener("pageshow", e => { if(e.persisted) musicResume(); });
