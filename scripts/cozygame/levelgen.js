/* Sinh mã LÊN LEVEL cho game Cozy có spec.level = { max, rules:[[trường, "mul"|"add", bước, giới hạn]], won?:"biểu thức JS" } (shared/levelup.js).
   Level L (0..max-1) chỉnh các tham số số của CFG[t] từ bản gốc: mul: v*(1+bước*L), add: v+bước*L; bước < 0 thì kẹp dưới giới hạn, bước > 0 thì kẹp trên giới hạn
   (giá trị gốc đã vượt giới hạn thì giữ nguyên, không bị kéo ngược). Mảng thì áp từng phần tử. Chỉ ván "free" (không thách đấu) dùng level; ván hôm nay luôn level 0. */
module.exports = function levelJs(sp) {
  const L = sp.level; if (!L) return "";
  if (L.custom) return "\n/* ===== LÊN LEVEL (tuỳ biến theo game) ===== */\n" + L.custom + "\n";
  const max = Math.max(2, Math.min(10, L.max | 0));
  return `
/* ===== LÊN LEVEL (sinh từ spec.level; trần ${max} level, tham số bị kẹp) ===== */
const LVU_MAX=${max},LVU_K="${sp.prefix}-lvu",LVU_R=${JSON.stringify(L.rules)},CFG_0=JSON.parse(JSON.stringify(CFG));
let LVU=Math.max(0,Math.min(LVU_MAX-1,Math.floor(+LS.get(LVU_K,0))||0)),LPLAY=0;
function applyLvu(L){CFG.forEach((c,i)=>{const o=CFG_0[i];for(const k in o)c[k]=o[k];LVU_R.forEach(([k,m,s,lim])=>{const f=v=>{if(typeof v!=="number"||v<=0)return v;let x=m==="mul"?v*(1+s*L):v+s*L;x=s<0?Math.max(x,Math.min(v,lim)):Math.min(x,Math.max(v,lim));return Math.round(x*100)/100};if(Array.isArray(o[k]))c[k]=o[k].map(f);else if(typeof o[k]==="number")c[k]=f(o[k])})})}
const begin_0=begin;begin=function(seed,mode,t,ch){const L=mode==="free"&&!ch?LVU:0;applyLvu(L);LPLAY=L;return begin_0.apply(this,arguments)};
window.NPLevel&&NPLevel.attach({levels:LVU_MAX,cur:()=>G?LPLAY:-1,won:()=>!!G&&(${L.won || "true"}),skip:()=>!G||G.mode!=="free"||!!G.ch,go:i=>{LVU=i;LS.set(LVU_K,i);if(PF.pro&&PF.pro.trial)PF.lockPro();begin(newSeed(),"free",G?G.t:TY,null)}});
`;
};
