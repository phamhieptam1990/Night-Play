/* Nút ← của vườn: luôn quay về trang học ĐÚNG lớp + môn của vườn đang xem (L3-05).
   Trước đây href="../index.html" trơn, hồ sơ mới bị đưa về lớp 1. Nay: địa chỉ đích mang grade/subj/lang, và vào vườn thì nhớ learn:grade / learn:subj. */
function gardenBackHref(grade, subj, lang) {
  var q = [];
  if (grade >= 1 && grade <= 5) q.push("grade=" + grade);
  if (subj === "toan" || subj === "tviet" || subj === "tanh") q.push("subj=" + subj);
  if (lang === "vi" || lang === "en") q.push("lang=" + lang);
  return "../index.html" + (q.length ? "?" + q.join("&") : "");
}
function initNav() {
  var a = document.querySelector(".hud .hl a.hb"), S = window.LearnSlot, p = S && S.parts && S.parts(); if (!a || !p) return;
  var lang = ""; try { lang = localStorage.getItem("lang") || ""; } catch (e) {}
  try { localStorage.setItem("learn:grade", String(p.grade)); localStorage.setItem("learn:subj", p.subj); } catch (e) {}
  a.href = gardenBackHref(p.grade, p.subj, lang);
}
if (typeof module !== "undefined" && module.exports) module.exports = { gardenBackHref: gardenBackHref };
