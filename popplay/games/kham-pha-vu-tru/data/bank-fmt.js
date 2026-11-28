"use strict";
/* Bộ nạp gọn cho các tệp data/bank-t0..t3.js. Mỗi câu 2 dòng. Dòng vi: bậc|hình|hỏi|ĐÚNG|sai1|sai2|điều thú vị. Dòng en: hỏi|ĐÚNG|sai1|sai2|điều thú vị. */
function ST(t, a) {
  for (let i = 0; i < a.length; i += 2) {
    const v = a[i].split("|"), e = a[i + 1].split("|");
    BANK[t].push([+v[0], v[1], v[2], e[0], [v[3], e[1]], [v[4], e[2]], [v[5], e[3]], v[6], e[4]]);
  }
}
