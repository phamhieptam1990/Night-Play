"use strict";
/* Sudoku Con Vật — tiện ích chung: DOM, localStorage, ngôn ngữ, ngẫu nhiên theo hạt giống, theo dõi paywall, ngày hôm nay. */
const $ = id => document.getElementById(id);
const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
let LANG = (() => {
  const q = new URLSearchParams(location.search).get("lang"); if (q === "vi" || q === "en") return q;
  try { const s = localStorage.getItem("lang"); if (s === "vi" || s === "en") return s; } catch (e) {}
  return /^vi/i.test(navigator.language || "") ? "vi" : "en";
})();
let RNG = Math.random; const MR = Math.random;
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const sub = (seed, k) => mulberry32((seed ^ Math.imul(k + 1, 2654435761)) >>> 0);
const rand = (a, b) => a + Math.floor(RNG() * (b - a + 1));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(RNG() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const track = (f, k) => { try { fetch("/api/paywall", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ f, k }), keepalive: true }).catch(() => {}); } catch (e) {} };
const subUrl = () => "../../../subscribe.html?from=" + encodeURIComponent("popplay/index.html#sudoku-con-vat") + "&plan=month";
const passToken = () => { try { const p = JSON.parse(localStorage.getItem("pass")); return p && p.token; } catch (e) { return null; } };
const today = () => new Date(Date.now() + 252e5).toISOString().slice(0, 10);
const LVE = ["🌱", "🌿", "🌳"], LV_MAX = 8, lvIcon = l => LVE[l - 1] || "🔥";   /* cấp 1-3 = chip ở màn chọn; cấp 4-8 = mở qua popup Chọn level (ít gợi ý hơn) */
const TY_ICON = ["🐶", "🦊", "🐱", "🦁"];
const MAXS = 300;
