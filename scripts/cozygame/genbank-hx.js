/* Sinh parts/hoi-xoay-dap-xoay/bank9.js: câu đố mẹo dạng tính toán, đáp án do code tính nên không thể sai.
   Chạy: node scripts/cozygame/genbank-hx.js */
const fs = require("fs"), path = require("path");
const out = []; const add = (ic, qv, qe, ok, b1, b2, ev, ee) => { out.push([ic, qv, ok[0], b1[0], b2[0], ev].join("|"), [ic, qe, ok[1], b1[1], b2[1], ee].join("|")); };
const c = (n, vi) => vi ? String(n).replace(".", ",") : String(n); const both = n => [c(n, 1), c(n)];

// 1) So sánh số thập phân
[[0.8, 0.75], [0.5, 0.49], [0.6, 0.55], [0.3, 0.25], [0.4, 0.39], [0.7, 0.68], [5.6, 5.12], [3.4, 3.25], [1.9, 1.89], [2.5, 2.05], [4.7, 4.68], [6.3, 6.29], [0.5, 0.05], [8.1, 8.09]]
  .forEach(([a, b], i) => { const d = Math.max(String(a).split(".")[1].length, String(b).split(".")[1].length), A = a.toFixed(d), B = b.toFixed(d), big = Math.max(a, b), sm = Math.min(a, b);
    const q = i % 2 ? [`Số nào lớn hơn: ${c(sm, 1)} hay ${c(big, 1)}?`, `Which is bigger: ${sm} or ${big}?`] : [`Số nào lớn hơn: ${c(big, 1)} hay ${c(sm, 1)}?`, `Which is bigger: ${big} or ${sm}?`];
    add("🔢", q[0], q[1], both(big), both(sm), ["Bằng nhau", "They are equal"], `Viết cùng số chữ số thập phân: ${c(A, 1)} và ${c(B, 1)}, nên ${c(big, 1)} lớn hơn.`, `Write them with the same decimals: ${A} and ${B}, so ${big} is bigger.`); });

// 2) Lấy đi bao nhiêu thì CÓ bấy nhiêu
[["kẹo", "candies", "🍬", 5, 3], ["cuốn vở", "notebooks", "📓", 6, 4], ["quả cam", "oranges", "🍊", 8, 5], ["cái bút", "pens", "🖊️", 7, 2], ["viên bi", "marbles", "🔮", 9, 6], ["bông hoa", "flowers", "🌸", 10, 7]]
  .forEach(([vi, en, ic, n, k]) => add(ic, `Có ${n} ${vi} trên bàn, bạn lấy đi ${k} ${vi}. Bạn đang có mấy ${vi}?`, `There are ${n} ${en} on the table and you take ${k}. How many ${en} do you have?`,
    [`${k} ${vi}`, String(k)], [`${n - k} ${vi}`, String(n - k)], [`${n} ${vi}`, String(n)], `Bạn lấy ${k} thì trong tay bạn có ${k}. Trên bàn mới còn ${n - k}.`, `You took ${k}, so you have ${k}. Only ${n - k} are left on the table.`));

// 3) Cùng một cân
[["lông vũ", "chì", "feathers", "lead", "🪶"], ["bọt biển", "đá", "sponge", "stone", "🧽"], ["giấy", "vàng", "paper", "gold", "📄"], ["gạo", "cát", "rice", "sand", "🍚"], ["nước", "dầu ăn", "water", "cooking oil", "💧"], ["kẹo bông", "thép", "cotton candy", "steel", "🍭"], ["rơm", "gạch", "straw", "bricks", "🌾"], ["bóng bay", "đinh", "balloons", "nails", "🎈"]]
  .forEach(([a, b, ea, eb, ic]) => add(ic, `Một ki-lô-gam ${a} hay một ki-lô-gam ${b} nặng hơn?`, `Which is heavier: a kilogram of ${ea} or a kilogram of ${eb}?`, ["Bằng nhau", "They weigh the same"], [`Ki-lô-gam ${a}`, `The ${ea}`], [`Ki-lô-gam ${b}`, `The ${eb}`], `Cả hai đều một ki-lô-gam nên nặng bằng nhau, chỉ khác thể tích.`, `Both are one kilogram so they weigh the same; only the volume differs.`));

// 4) Thứ trong tuần
const WV = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"], WE = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
[[2, 30], [5, 45], [1, 20], [3, 100], [6, 15], [4, 50], [0, 60], [2, 365], [5, 28], [1, 90], [3, 10], [6, 200], [4, 77], [0, 33], [2, 500]].forEach(([w, d]) => { const r = (w + d) % 7, x = (r + 1) % 7, y = (r + 6) % 7;
  add("📅", `Hôm nay là ${WV[w]}. ${d} ngày nữa là thứ mấy?`, `Today is ${WE[w]}. What day will it be in ${d} days?`, [WV[r], WE[r]], [WV[x], WE[x]], [WV[y], WE[y]], `${d} chia 7 dư ${d % 7}, nên đi tiếp ${d % 7} ngày từ ${WV[w]} là ${WV[r]}.`, `${d} divided by 7 leaves ${d % 7}, so ${d % 7} days after ${WE[w]} is ${WE[r]}.`); });

// 5) Giờ giấc qua nửa đêm
const lv = h => h === 0 ? "12 giờ đêm" : h < 12 ? `${h} giờ sáng` : h === 12 ? "12 giờ trưa" : h < 18 ? `${h - 12} giờ chiều` : `${h - 12} giờ tối`;
const le = h => h === 0 ? "12 am (midnight)" : h < 12 ? `${h} am` : h === 12 ? "12 pm (noon)" : `${h - 12} pm`;
[[21, 5], [22, 9], [20, 8], [23, 4], [15, 10], [18, 9], [19, 7], [14, 11], [22, 3], [17, 8], [16, 12], [13, 13]].forEach(([h, m]) => { const r = (h + m) % 24, x = (r + 12) % 24, y = (r + 1) % 24;
  add("⏰", `Bây giờ là ${lv(h)}. ${m} tiếng nữa là mấy giờ?`, `It is ${le(h)} now. What time will it be in ${m} hours?`, [lv(r), le(r)], [lv(x), le(x)], [lv(y), le(y)], `${lv(h)} cộng ${m} tiếng thành ${lv(r)}${h + m >= 24 ? " của ngày hôm sau" : ""}.`, `${le(h)} plus ${m} hours is ${le(r)}${h + m >= 24 ? " the next day" : ""}.`); });

// 6) Phần trăm lên rồi xuống
[[10, "chiếc áo", "shirt", "👕"], [20, "đôi giày", "pair of shoes", "👟"], [25, "cái ba lô", "backpack", "🎒"], [30, "chiếc xe đạp", "bike", "🚲"], [50, "cái đồng hồ", "watch", "⌚"], [40, "cái mũ", "hat", "🧢"]].forEach(([p, vi, en, ic], i) => {
  const up = i % 2 === 0, end = 100 * (1 - p * p / 10000); const f = n => Math.round(n * 100) / 100;
  add(ic, up ? `Giá ${vi} tăng ${p}% rồi giảm ${p}%. So với giá ban đầu thì giá cuối thế nào?` : `Giá ${vi} giảm ${p}% rồi tăng ${p}%. So với giá ban đầu thì giá cuối thế nào?`,
    up ? `The price of a ${en} rises ${p}% then falls ${p}%. Compared with the start, the final price is?` : `The price of a ${en} falls ${p}% then rises ${p}%. Compared with the start, the final price is?`,
    ["Thấp hơn giá ban đầu", "Lower than the start"], ["Bằng giá ban đầu", "The same as the start"], ["Cao hơn giá ban đầu", "Higher than the start"],
    `Phần trăm thứ hai tính trên giá mới, nên giá cuối chỉ còn ${c(f(end), 1)}% giá ban đầu.`, `The second percentage applies to the new price, so the final price is only ${f(end)}% of the start.`); });

// 7) Đếm chữ số
[[100, 1], [50, 5], [99, 7], [30, 3], [100, 0], [200, 2], [60, 6], [45, 4]].forEach(([N, k]) => { let cnt = 0; for (let i = 1; i <= N; i++) cnt += String(i).split("").filter(ch => ch === String(k)).length;
  const naive = Math.floor(N / 10) === cnt ? cnt + 1 : Math.floor(N / 10); let w2 = cnt - 2 > 0 && cnt - 2 !== naive ? cnt - 2 : cnt + 3; if (w2 === naive) w2++;
  add("🔟", `Viết các số tự nhiên từ 1 đến ${N}, chữ số ${k} xuất hiện tất cả bao nhiêu lần?`, `Writing the whole numbers from 1 to ${N}, how many times does the digit ${k} appear?`, [`${cnt} lần`, String(cnt)], [`${naive} lần`, String(naive)], [`${w2} lần`, String(w2)],
    `Đếm cả hàng đơn vị lẫn hàng chục (và hàng trăm): tổng cộng ${cnt} lần.`, `Count the units, tens (and hundreds) places: ${cnt} times in all.`); });

// 8) Bắt tay
[4, 5, 6, 7, 8, 10, 12, 15].forEach(n => { const r = n * (n - 1) / 2;
  add("🤝", `${n} người gặp nhau, mỗi hai người bắt tay đúng một lần. Có tất cả bao nhiêu cái bắt tay?`, `${n} people meet and every pair shakes hands once. How many handshakes in all?`, [`${r} cái`, String(r)], [`${n * (n - 1)} cái`, String(n * (n - 1))], [`${n * n} cái`, String(n * n)],
    `Mỗi người bắt tay ${n - 1} người nhưng mỗi cái bắt tay tính cho 2 người nên chia đôi: ${n} x ${n - 1} / 2 = ${r}.`, `Each person shakes ${n - 1} hands but each handshake counts twice, so ${n} x ${n - 1} / 2 = ${r}.`); });

// 9) Bèo nhân đôi
[10, 12, 20, 30, 48, 60].forEach(N => add("🪷", `Bèo trong ao nhân đôi diện tích mỗi ngày và phủ kín ao vào ngày thứ ${N}. Ngày thứ mấy bèo phủ một nửa ao?`, `Lily pads double daily and cover the pond on day ${N}. On which day is the pond half covered?`,
  [`Ngày thứ ${N - 1}`, `Day ${N - 1}`], [`Ngày thứ ${N / 2}`, `Day ${N / 2}`], [`Ngày thứ ${N - 2}`, `Day ${N - 2}`], `Mỗi ngày gấp đôi nên ngày kín ao thì ngày liền trước chỉ phủ một nửa.`, `It doubles daily, so the day before it is full, the pond is half covered.`));

// 10) Đếm hình vuông trên bàn cờ
[2, 3, 4, 5, 6].forEach(n => { const r = n * (n + 1) * (2 * n + 1) / 6;
  add("♟️", `Một bàn cờ ${n} x ${n} ô có tất cả bao nhiêu hình vuông (mọi kích cỡ)?`, `How many squares of every size are on a ${n} x ${n} board?`, [`${r} hình`, String(r)], [`${n * n} hình`, String(n * n)], [`${n * n + n} hình`, String(n * n + n)],
    `Ngoài các ô nhỏ còn có hình vuông 2x2, 3x3,... Tổng cộng ${r} hình.`, `Besides the single cells there are 2x2, 3x3 squares and so on: ${r} in all.`); });

const n = out.length / 2;
fs.writeFileSync(path.join(__dirname, "parts", "hoi-xoay-dap-xoay", "bank9.js"),
  "/* SINH TỰ ĐỘNG bởi scripts/cozygame/genbank-hx.js — không sửa tay. Câu đố mẹo tính toán (" + n + " câu). Định dạng xem data.js (hàm P). */\nP([\n" + out.map(l => JSON.stringify(l)).join(",\n") + "\n]);\n");
console.log("bank9.js:", n, "câu");
