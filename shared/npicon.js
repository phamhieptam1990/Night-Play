/* BỘ ICON 2D (SVG) CHUNG — phong cách "sticker" cùng họ với linh vật: màu tự nhiên của từng vật, đổ bóng gradient, điểm sáng, nét viền tím than, viền trắng ngoài (die-cut) nên nổi trên nền tối.
   BẬT MẶC ĐỊNH (chủ site chọn gắn vào game). Tắt để quay lại emoji gốc: NPIcon.on = false. Xem thử: npicon-preview.html.
   TRUYỀN THEME: màu từng vật được pha một chút màu theme (--ic1), mặc định theo --accent của game. Biến CSS đặt ở bất kỳ phần tử nào (kế thừa xuống):
     --ic1 màu theme chính (nhóm A) · --ic2 màu theme phụ (nhóm B) · --ic-ink nét viền · --ic-stk viền trắng ngoài · --ic-mix tỉ lệ pha theme (mặc định 14%)
   API:  NPIcon.svg(name, {c1,c2,ink,sticker,mix,size,title}) → chuỗi SVG (theme riêng cho MỘT icon)
         NPIcon.theme({c1,c2,ink,sticker,mix}[, element])     → đổi theme cho cả trang (hoặc một phần tử); bỏ trống = mặc định
         NPIcon.name(emoji) · NPIcon.names() · NPIcon.apply(root) (thay emoji ô chế độ + nút "Random round" bằng SVG khi NPIcon.on)
   Không tải mạng, không filter, không bitmap. */
(function () {
  "use strict";
  if (window.NPIcon) return;
  /* Quy ước lớp: R đỏ O cam Y vàng G lục L lam P hồng V tím N nâu W ngà E da S xám xanh · A theme chính B theme phụ (tô gradient + viền) · F tô màu viền · K nét viền · H điểm sáng ·
     sR sO sY sG sL sP sV sN sE sS = nét dày màu (tay chân/chi tiết) */
  var P = {
    stopwatch: '<rect class="Y" x="26" y="3" width="12" height="8" rx="2.5"/><path class="K" d="M32 11v5"/><circle class="R" cx="32" cy="37" r="23"/><circle class="W" cx="32" cy="37" r="17"/><path class="K" d="M32 37V25M32 37l7 5"/><circle class="F" cx="32" cy="37" r="2.8"/><path class="H" d="M15 33a17 17 0 0 1 9-13"/>',
    music: '<path class="P" d="M23 15l23-7v11l-23 7z"/><path class="K" d="M23 20v29M46 13v28"/><ellipse class="P" cx="17.5" cy="50" rx="8.5" ry="6.2" transform="rotate(-18 17.5 50)"/><ellipse class="P" cx="40.5" cy="43" rx="8.5" ry="6.2" transform="rotate(-18 40.5 43)"/><path class="H" d="M13 49q3-3 7-2M36 42q3-3 7-2"/>',
    dice: '<g transform="rotate(-8 32 32)"><rect class="W" x="8" y="8" width="48" height="48" rx="13"/><circle class="R" cx="21" cy="21" r="5"/><circle class="R" cx="43" cy="21" r="5"/><circle class="R" cx="32" cy="32" r="5"/><circle class="R" cx="21" cy="43" r="5"/><circle class="R" cx="43" cy="43" r="5"/><path class="H" d="M13 19a9 9 0 0 1 8-8"/></g>',
    runner: '<path class="sG" d="M33 37l-8 7-9 11M41 39l9 7 6 9"/><path class="sE" d="M38 25l-13 3-5 9M43 29l11 3"/><path class="L" d="M35 20l14 7-5 15-12-5z"/><circle class="E" cx="41" cy="12" r="7"/><ellipse class="R" cx="14" cy="57" rx="7" ry="3.6"/><ellipse class="R" cx="57" cy="58" rx="7" ry="3.6"/>',
    ring: '<circle class="K" cx="32" cy="32" r="21" style="stroke-width:14"/><circle class="sR" cx="32" cy="32" r="21" style="stroke-width:8"/><path class="H" d="M19 22a16 16 0 0 1 10-8"/>',
    eyeoff: '<path class="W" d="M3 32C14 14 50 14 61 32 50 50 14 50 3 32z"/><circle class="L" cx="32" cy="32" r="11"/><circle class="F" cx="32" cy="32" r="5"/><circle fill="#fff" cx="29" cy="29" r="2"/><path class="K" d="M10 56L54 8" style="stroke-width:11"/><path class="sR" d="M10 56L54 8" style="stroke-width:6"/>',
    ghost: '<path class="W" d="M12 57V30a20 20 0 0 1 40 0v27l-6.7-5.3-6.6 5.3-6.7-5.3-6.7 5.3-6.6-5.3z"/><circle class="F" cx="25" cy="30" r="3.8"/><circle class="F" cx="39" cy="30" r="3.8"/><circle fill="#fff" cx="26.3" cy="28.7" r="1.3"/><circle fill="#fff" cx="40.3" cy="28.7" r="1.3"/><ellipse fill="#FF9BB8" cx="19" cy="38" rx="3.6" ry="2.4"/><ellipse fill="#FF9BB8" cx="45" cy="38" rx="3.6" ry="2.4"/><path class="K" d="M28 39q4 4.5 8 0"/><path class="H" d="M16 24a17 17 0 0 1 8-9"/>',
    cut: '<path class="N" d="M30 8a24 24 0 0 0 0 48z"/><path class="Y" d="M30 17a15 15 0 0 0 0 30z"/><path class="N" d="M36 8a24 24 0 0 1 0 48z"/><path class="Y" d="M36 17a15 15 0 0 1 0 30z"/><path class="K" d="M33 3v58" style="stroke-dasharray:3 5"/><path class="H" d="M11 24a20 20 0 0 1 12-12"/>',
    spin: '<path class="P" fill-rule="evenodd" d="M32 7a25 25 0 1 1 0 50 25 25 0 1 1 0-50zM32 24a8 8 0 1 0 0 16 8 8 0 1 0 0-16z"/><path class="sY" d="M20 18l4 3M44 17l-3 4M14 36l5-1M46 44l-4-3M26 50l1-5M50 31l-5 0"/>',
    pizza: '<path class="Y" d="M32 59L6 16C20 5 44 5 58 16z"/><path class="O" d="M6 16C20 5 44 5 58 16l-2.5 4C42 11 22 11 8.5 20z"/><circle class="R" cx="23" cy="25" r="5.2"/><circle class="R" cx="39" cy="26" r="5.2"/><circle class="R" cx="31" cy="42" r="5.2"/><path class="H" d="M14 21q8-6 17-6"/>',
    fog: '<path class="W" d="M16 37a11 11 0 0 1 3-21 15 15 0 0 1 28 5 10 10 0 0 1-2 16z"/><path class="sS" d="M10 46h30M18 55h34"/><path class="H" d="M20 22a8 8 0 0 1 6-5"/>',
    palette: '<path class="E" d="M32 6C16 6 5 18 5 32s11 26 25 26c6 0 7-4 5-7s-1-7 5-7h9c8 0 15-5 15-13C64 17 50 6 32 6z"/><circle class="R" cx="20" cy="27" r="5.2"/><circle class="Y" cx="33" cy="18" r="5.2"/><circle class="G" cx="47" cy="26" r="5.2"/><circle class="L" cx="19" cy="41" r="5.2"/><path class="H" d="M13 22a21 21 0 0 1 12-11"/>',
    swirl: '<path class="K" d="M32 32a4 4 0 1 1 4 4 8 8 0 1 1-8-8 13 13 0 1 1 13 13 18 18 0 1 1-18-18" style="stroke-width:12"/><path class="sV" d="M32 32a4 4 0 1 1 4 4 8 8 0 1 1-8-8 13 13 0 1 1 13 13 18 18 0 1 1-18-18" style="stroke-width:6"/>',
    bulb: '<path class="Y" d="M32 5a18 18 0 0 0-10 33c2 2 3 4 3 7h14c0-3 1-5 3-7A18 18 0 0 0 32 5z"/><rect class="S" x="24" y="46" width="16" height="10" rx="4"/><path class="K" d="M26 56h12M32 24v12M27 24l5 6 5-6"/><path class="H" d="M20 20a13 13 0 0 1 8-10"/>',
    tornado: '<path class="S" d="M5 12h54l-5 9H10z"/><path class="S" d="M11 24h42l-5 9H16z"/><path class="S" d="M17 36h30l-5 8H22z"/><path class="S" d="M24 47h16l-3 7h-10z"/><path class="sS" d="M28 58h8"/><path class="H" d="M10 15h20M16 27h14"/>',
    pen: '<g transform="rotate(45 32 32)"><rect class="P" x="26" y="3" width="12" height="9" rx="3"/><rect class="S" x="26" y="12" width="12" height="5"/><rect class="Y" x="26" y="17" width="12" height="30"/><path class="E" d="M26 47h12l-6 13z"/><path class="F" d="M30 55h4l-2 5z"/><path class="H" d="M29 20v24"/></g>',
    arrow: '<path class="G" d="M5 23h28V8l26 24-26 24V41H5z"/><path class="H" d="M10 27h22M36 17l12 11"/>',
    brain: '<path class="P" d="M31 10c-8-6-20-2-20 9-6 3-6 12 0 16-2 10 8 16 14 11 3 3 6 3 6 0z"/><path class="P" d="M33 10c8-6 20-2 20 9 6 3 6 12 0 16 2 10-8 16-14 11-3 3-6 3-6 0z"/><path class="K" d="M22 24q5 3 3 9M42 24q-5 3-3 9M24 42q4-2 7 1M40 42q-4-2-7 1"/><path class="H" d="M16 22a9 9 0 0 1 7-6"/>',
    twice: '<circle class="Y" cx="24" cy="34" r="17"/><circle class="Y" cx="40" cy="30" r="17"/><circle class="O" cx="40" cy="30" r="11" style="stroke-width:2"/><path class="K" d="M37 25l3-2v14"/><path class="H" d="M30 20a14 14 0 0 1 8-8"/>',
    drizzle: '<circle class="Y" cx="45" cy="17" r="10"/><path class="W" d="M13 40a10.5 10.5 0 0 1 3-20 14 14 0 0 1 27 4 9.5 9.5 0 0 1-2 16z"/><path class="sL" d="M20 47l-3 8M32 47l-3 8M44 47l-3 8"/><path class="H" d="M18 28a8 8 0 0 1 6-6"/>',
    storm: '<path class="S" d="M13 36a11 11 0 0 1 3-21 15 15 0 0 1 29 4 10 10 0 0 1-2 17z"/><path class="Y" d="M35 34l-10 16h8l-5 13 18-20h-10l7-9z"/><path class="H" d="M18 24a9 9 0 0 1 7-7"/>',
    car: '<path class="R" d="M5 43l5-16c1-4 4-6 8-6h28c4 0 7 2 8 6l5 16v11H5z"/><path class="L" d="M15 26h34l4 11H11z"/><path class="K" d="M32 26v11"/><circle class="F" cx="18" cy="54" r="7"/><circle class="F" cx="46" cy="54" r="7"/><circle class="S" cx="18" cy="54" r="3"/><circle class="S" cx="46" cy="54" r="3"/><circle class="Y" cx="11" cy="44" r="3.4"/><circle class="Y" cx="53" cy="44" r="3.4"/><path class="H" d="M12 31l3-6"/>',
    torch: '<path class="Y" d="M10 6h44l-14 20H24z" style="opacity:.9"/><path class="S" d="M20 24h24l-3 8H23z"/><rect class="R" x="23" y="32" width="18" height="26" rx="5"/><path class="K" d="M23 42h18"/><path class="H" d="M27 36v16"/>',
    scooter: '<path class="K" d="M13 47h25l9-30h9" style="stroke-width:12"/><path class="sO" d="M13 47h25l9-30h9" style="stroke-width:6"/><path class="sO" d="M38 47l-7-17h-11" style="stroke-width:6"/><rect class="F" x="14" y="24" width="20" height="7" rx="3.5"/><circle class="F" cx="13" cy="50" r="9"/><circle class="S" cx="13" cy="50" r="4"/><circle class="F" cx="52" cy="50" r="9"/><circle class="S" cx="52" cy="50" r="4"/>',
    sparkle: '<path class="Y" d="M25 4l7 18 18 7-18 7-7 18-7-18-18-7 18-7z"/><path class="W" d="M50 33l3.5 9 9 3.5-9 3.5-3.5 9-3.5-9-9-3.5 9-3.5z"/><path class="H" d="M20 16l4-5"/>',
    ice: '<path class="L" d="M8 22l24-13 24 13v24L32 59 8 46z"/><path class="W" d="M8 22l24 13 24-13-24-13z"/><path class="K" d="M32 35v24"/><path class="H" d="M14 28l2 11M24 17l10-5"/>',
    truck: '<rect class="W" x="3" y="14" width="37" height="31" rx="5"/><path class="O" d="M40 24h12l11 13v8H40z"/><path class="L" d="M45 28h6l6 9H45z"/><path class="sL" d="M10 24h22M10 32h22"/><circle class="F" cx="16" cy="48" r="7.5"/><circle class="F" cx="50" cy="48" r="7.5"/><circle class="S" cx="16" cy="48" r="3"/><circle class="S" cx="50" cy="48" r="3"/>',
    moneybag: '<path class="N" d="M23 6h18l-6 12c11 5 18 15 18 26 0 10-9 14-21 14S11 54 11 44c0-11 7-21 18-26z"/><path class="Y" d="M22 6q10 6 20 0l-2-3H24z"/><circle class="Y" cx="32" cy="38" r="11.5"/><path class="K" d="M32 31v14M36 34c-1-3-8-3-8 0s8 3 8 6-7 3-8 0"/><path class="H" d="M16 36a15 15 0 0 1 7-12"/>',
    envelope: '<rect class="R" x="12" y="4" width="40" height="56" rx="7"/><path class="O" d="M12 24q20 16 40 0v-6q-20 16-40 0z"/><circle class="Y" cx="32" cy="35" r="9"/><path class="K" d="M32 30v10M28 35h8" style="stroke-width:2.6"/><path class="H" d="M17 12v22"/>',
    hourglass: '<rect class="N" x="9" y="3" width="46" height="8" rx="4"/><rect class="N" x="9" y="53" width="46" height="8" rx="4"/><path class="W" d="M15 11h34v6L37 32l12 15v6H15v-6l12-15-12-15z"/><path class="Y" d="M21 52h22L32 40zM25 16h14l-7 9z"/><path class="H" d="M19 15v6"/>',
    cap: '<path class="V" d="M32 11L3 26l29 14 29-14z"/><path class="V" d="M15 35v12c0 4 8 9 17 9s17-5 17-9V35l-17 8z"/><path class="K" d="M58 28v17"/><circle class="Y" cx="58" cy="48" r="4.2"/><path class="H" d="M12 26l12-6"/>',
    bamboo: '<rect class="G" x="24" y="3" width="16" height="58" rx="4"/><path class="K" d="M24 19h16M24 38h16"/><path class="G" d="M40 28c9-2 16-8 16-15-9 0-16 6-16 15zM24 47c-9-2-16-8-16-15 9 0 16 6 16 15z"/><path class="H" d="M29 8v8M29 24v10M29 43v12"/>',
    island: '<path class="L" d="M2 54q10-6 20 0t20 0 20 0v8H2z"/><path class="Y" d="M6 52c8-14 44-14 52 0z"/><path class="K" d="M33 47c-1-12-1-20 3-27" style="stroke-width:8"/><path class="sN" d="M33 47c-1-12-1-20 3-27" style="stroke-width:4"/><path class="G" d="M36 20c-9-9-22-5-24 2 10-3 17-2 24-2zM36 20c8-9 21-5 23 3-10-4-17-3-23-3zM36 20c-2-9 4-16 12-16-3 5-4 10-12 16z"/>',
    raincloud: '<path class="S" d="M12 36a11 11 0 0 1 3-21 15 15 0 0 1 29 4 10 10 0 0 1-2 17z"/><path class="sL" d="M18 45l-4 11M30 45l-4 11M42 45l-4 11"/><path class="H" d="M17 24a9 9 0 0 1 7-7"/>',
    ox: '<path class="W" d="M8 20c-7-2-8-12-3-16 1 8 6 11 12 12zM56 20c7-2 8-12 3-16-1 8-6 11-12 12z"/><path class="N" d="M14 22c0-8 8-12 18-12s18 4 18 12v18c0 11-8 20-18 20S14 51 14 40z"/><ellipse class="P" cx="32" cy="46" rx="12" ry="9"/><circle class="F" cx="24" cy="30" r="3.6"/><circle class="F" cx="40" cy="30" r="3.6"/><circle class="F" cx="27" cy="46" r="2"/><circle class="F" cx="37" cy="46" r="2"/><path class="H" d="M19 18q8-5 16-4"/>',
    resume: '<circle class="G" cx="32" cy="32" r="27"/><path class="W" d="M25 19l20 13-20 13z"/><path class="H" d="M13 27a21 21 0 0 1 13-14"/>',
    sprout: '<path class="K" d="M32 58V30" style="stroke-width:5"/><path class="G" d="M32 32C18 34 10 26 9 14c14-1 22 6 23 18z"/><path class="G" d="M32 28C34 14 44 7 56 8c1 13-8 22-24 20z"/><path class="H" d="M16 17q8 1 12 8"/>',
    leaf: '<path class="G" d="M10 54C6 28 24 8 56 8c2 30-14 50-40 48z"/><path class="K" d="M14 50C26 36 38 24 50 14"/><path class="H" d="M22 24q8-8 20-10"/>',
    tree: '<rect class="N" x="27" y="38" width="10" height="20" rx="3"/><circle class="G" cx="32" cy="24" r="18"/><circle class="G" cx="20" cy="34" r="12"/><circle class="G" cx="44" cy="34" r="12"/><path class="H" d="M22 16q6-6 14-5"/>',
    fire: '<path class="O" d="M32 4c4 12 18 18 18 34a18 18 0 0 1-36 0c0-8 4-12 8-17 1 6 4 9 7 10-2-10-1-18 3-27z"/><path class="Y" d="M32 28c3 8 10 10 10 20a10 10 0 0 1-20 0c0-6 4-8 6-12 1 3 2 4 4 5-1-5-1-9 0-13z"/><path class="H" d="M20 36q-2 6 0 11"/>',
    infinity: '<path class="K" d="M32 32c-6-9-12-12-18-12a12 12 0 0 0 0 24c6 0 12-3 18-12s12-12 18-12a12 12 0 0 1 0 24c-6 0-12-3-18-12z" style="stroke-width:13"/><path class="sP" d="M32 32c-6-9-12-12-18-12a12 12 0 0 0 0 24c6 0 12-3 18-12s12-12 18-12a12 12 0 0 1 0 24c-6 0-12-3-18-12z" style="stroke-width:7"/>',
    tie: '<path class="W" d="M10 12h44l-6 46H16z"/><path class="L" d="M26 12l6 8 6-8z"/><path class="R" d="M28 22h8l4 28-8 8-8-8z"/><path class="H" d="M30 26l1 18"/>',
    speech: '<path class="W" d="M8 14a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H30L16 58V46h0a8 8 0 0 1-8-8z"/><circle class="F" cx="22" cy="26" r="3.4"/><circle class="F" cx="32" cy="26" r="3.4"/><circle class="F" cx="42" cy="26" r="3.4"/>',
    hearts: '<path class="P" d="M22 56C6 44 4 30 6 22a11 11 0 0 1 16-3 11 11 0 0 1 16 3c2 8 0 22-16 34z"/><path class="R" d="M44 46C32 38 30 28 32 22a8 8 0 0 1 12-2 8 8 0 0 1 12 2c2 6 0 16-12 24z"/><path class="H" d="M12 24q2-5 8-5"/>',
    building: '<rect class="S" x="12" y="6" width="40" height="52" rx="5"/><rect class="Y" x="19" y="14" width="8" height="8" rx="2"/><rect class="Y" x="37" y="14" width="8" height="8" rx="2"/><rect class="Y" x="19" y="28" width="8" height="8" rx="2"/><rect class="L" x="37" y="28" width="8" height="8" rx="2"/><rect class="N" x="27" y="44" width="10" height="14" rx="2"/>',
    house: '<path class="R" d="M4 32L32 8l28 24z"/><path class="W" d="M12 30h40v28H12z"/><rect class="N" x="26" y="40" width="12" height="18" rx="3"/><rect class="L" x="16" y="36" width="8" height="8" rx="2"/><rect class="L" x="40" y="36" width="8" height="8" rx="2"/><path class="H" d="M12 30l18-15"/>',
    noodle: '<path class="sY" d="M16 28q8-10 16 0t16 0M14 34q9-10 18 0t18 0" style="stroke-width:5"/><path class="R" d="M6 32h52c0 16-10 26-26 26S6 48 6 32z"/><path class="Y" d="M10 40h44"/><path class="sN" d="M40 6L28 30M48 8L34 30" style="stroke-width:4"/><path class="H" d="M12 38q4 10 12 14"/>',
    rocket: '<path class="W" d="M32 4c12 8 16 22 12 38H20C16 26 20 12 32 4z"/><path class="R" d="M32 4c5 3 9 8 11 13H21c2-5 6-10 11-13z"/><circle class="L" cx="32" cy="28" r="6"/><path class="R" d="M20 34L8 46l4 6 10-4zM44 34l12 12-4 6-10-4z"/><path class="Y" d="M26 46h12l-6 14z"/>',
    train: '<path class="R" d="M10 12h44v36H10z"/><rect class="L" x="16" y="18" width="14" height="12" rx="3"/><rect class="L" x="34" y="18" width="14" height="12" rx="3"/><rect class="S" x="6" y="44" width="52" height="8" rx="3"/><circle class="Y" cx="20" cy="38" r="3.4"/><circle class="Y" cx="44" cy="38" r="3.4"/><circle class="F" cx="18" cy="56" r="5"/><circle class="F" cx="46" cy="56" r="5"/>',
    lightning: '<path class="Y" d="M38 3L12 36h16l-6 25 30-36H35z"/><path class="H" d="M34 10L20 30"/>',
    chick: '<circle class="Y" cx="32" cy="34" r="24"/><path class="O" d="M26 36h12l-6 8z"/><circle class="F" cx="23" cy="28" r="3.4"/><circle class="F" cx="41" cy="28" r="3.4"/><path class="Y" d="M30 10q2-8 8-6"/><path class="H" d="M14 28a18 18 0 0 1 10-14"/>',
    fastdown: '<path class="G" d="M8 8l24 18 24-18v14L32 40 8 22z"/><path class="G" d="M8 30l24 18 24-18v14L32 62 8 44z"/>',
    book: '<path class="R" d="M8 8h22a6 6 0 0 1 6 6v44a6 6 0 0 0-6-6H8z"/><path class="W" d="M56 8H34a6 6 0 0 0-6 6v44a6 6 0 0 1 6-6h22z"/><path class="K" d="M34 20h16M34 28h16M34 36h12"/><path class="H" d="M13 14v28"/>',
    compass: '<circle class="Y" cx="32" cy="32" r="26"/><circle class="W" cx="32" cy="32" r="19"/><path class="R" d="M32 14l7 18-7 4-7-4z"/><path class="L" d="M32 50l-7-18 7-4 7 4z"/><circle class="F" cx="32" cy="32" r="3"/>',
    mountain: '<path class="S" d="M2 56L24 14l14 22 8-12 16 32z"/><path class="W" d="M24 14l8 14-8-4-8 5z"/><path class="W" d="M46 24l6 10-6-3-6 3z"/>',
    drop: '<path class="L" d="M32 4C44 20 52 30 52 40a20 20 0 0 1-40 0c0-10 8-20 20-36z"/><path class="H" d="M20 40q0 8 8 12"/>',
    coffee: '<path class="sS" d="M50 22c10 0 10 18 0 18" style="stroke-width:6"/><path class="W" d="M8 20h42v14a18 18 0 0 1-18 18h-6A18 18 0 0 1 8 34z"/><path class="N" d="M12 20h34v6H12z"/><path class="sS" d="M22 4q-4 6 0 10M32 4q-4 6 0 10M42 4q-4 6 0 10" style="stroke-width:3.5"/><rect class="S" x="6" y="54" width="46" height="6" rx="3"/>',
    moon: '<path class="Y" d="M44 6A26 26 0 1 0 58 44 22 22 0 0 1 44 6z"/><circle class="O" cx="30" cy="30" r="4"/><circle class="O" cx="26" cy="46" r="3"/><path class="H" d="M20 20a16 16 0 0 1 10-10"/>',
    cart: '<path class="sS" d="M4 8h10l8 30h28" style="stroke-width:5"/><path class="L" d="M16 18h42l-6 22H22z"/><circle class="F" cx="26" cy="52" r="5"/><circle class="F" cx="46" cy="52" r="5"/><path class="H" d="M22 24h28"/>',
    play: '<path class="G" d="M15 7l42 25-42 25z"/><path class="H" d="M21 16l14 9"/>',
    calendar: '<rect class="W" x="6" y="10" width="52" height="50" rx="9"/><path class="R" d="M6 19a9 9 0 0 1 9-9h34a9 9 0 0 1 9 9v10H6z"/><path class="K" d="M20 4v13M44 4v13"/><circle class="F" cx="20" cy="42" r="3.6"/><circle class="F" cx="32" cy="42" r="3.6"/><circle class="F" cx="44" cy="42" r="3.6"/><circle class="F" cx="20" cy="52" r="3.6"/><circle class="F" cx="32" cy="52" r="3.6"/>',
    trash: '<path class="S" d="M14 20l3 38h30l3-38z"/><rect class="S" x="8" y="13" width="48" height="8" rx="4"/><path class="K" d="M23 13v-6h18v6M25 30v20M32 30v20M39 30v20"/><path class="H" d="M18 28l2 22"/>',
    crown: '<path class="Y" d="M5 20l14 13 13-22 13 22 14-13-4 34H9z"/><rect class="O" x="9" y="49" width="46" height="8" rx="3"/><circle class="R" cx="32" cy="41" r="4.4"/><circle class="L" cx="18" cy="43" r="3.4"/><circle class="L" cx="46" cy="43" r="3.4"/><path class="H" d="M14 26l5 5"/>',
    lock: '<path class="K" d="M18 28V20a14 14 0 0 1 28 0v8" style="stroke-width:11"/><path class="sS" d="M18 28V20a14 14 0 0 1 28 0v8" style="stroke-width:5"/><rect class="Y" x="10" y="27" width="44" height="33" rx="9"/><circle class="F" cx="32" cy="42" r="4.6"/><path class="K" d="M32 44v8"/><path class="H" d="M16 34v14"/>'
  };
  var E = {   /* emoji → tên icon (bỏ ký tự biến thể U+FE0F) */
    "⏱": "stopwatch", "🎵": "music", "🎲": "dice", "🏃": "runner", "⭕": "ring", "🙈": "eyeoff", "👻": "ghost", "🥮": "cut", "🔄": "spin", "🍕": "pizza", "🌫": "fog",
    "🎨": "palette", "🌀": "swirl", "💡": "bulb", "🌪": "tornado", "✍": "pen", "➡": "arrow", "🧠": "brain", "✌": "twice", "🌦": "drizzle", "⛈": "storm", "🚗": "car",
    "🔦": "torch", "🛵": "scooter", "🆕": "sparkle", "🧊": "ice", "🚚": "truck", "💰": "moneybag", "🧧": "envelope", "⏳": "hourglass", "🎓": "cap", "🎋": "bamboo",
    "🏝": "island", "💬": "speech", "💞": "hearts", "🏢": "building", "🏠": "house", "🏡": "house", "🌱": "sprout", "🌿": "leaf", "🌳": "tree", "🔥": "fire", "♾": "infinity", "👔": "tie", "🍜": "noodle", "🚀": "rocket", "🚂": "train", "🌩": "storm", "⚡": "lightning", "🐥": "chick", "⏬": "fastdown", "📖": "book", "🧭": "compass", "🏔": "mountain", "🖋": "pen", "💧": "drop", "☕": "coffee", "🌙": "moon", "🛒": "cart", "🌧": "raincloud", "🐂": "ox", "📅": "calendar", "▶": "play", "🗑": "trash", "👑": "crown", "🔒": "lock"
  };
  var TOK = { R: "#F2475A", O: "#FF9A3D", Y: "#FFD23F", G: "#3DCB7B", L: "#3DA5F5", P: "#FF6FA8", V: "#8F6BFF", N: "#B3743A", W: "#FFFFFF", E: "#FFC9A0", S: "#B4BEDB" };
  var css = ".npic{display:block;width:1em;height:1em;max-width:none;flex:none;overflow:visible;--ic1:var(--ic1-t,var(--accent,#7C5CFF));--ic2:var(--ic2-t,color-mix(in srgb,var(--accent,#7C5CFF) 40%,#FFC857));--ink:var(--ic-ink-t,#2a1a55);--stk:var(--ic-stk-t,#fff);--mx:var(--ic-mix-t,14%);" +
    Object.keys(TOK).map(function (k) { return "--c" + k + ":color-mix(in srgb," + TOK[k] + ",var(--ic1) var(--mx));"; }).join("") + "}";
  function inject() { if (document.getElementById("npicCss")) return; var s = document.createElement("style"); s.id = "npicCss"; s.textContent = css; (document.head || document.documentElement).appendChild(s); }
  inject();
  /* ---- MÀU THEO THEME: chế độ "contrast" (mặc định) = xoay sắc độ các màu của vật về phía MÀU BÙ của màu theme (nổi trên nền theme); "match" = xoay về cùng tông theme; "off" = màu gốc ---- */
  function hex2hsl(h) { h = h.replace("#", ""); var r = parseInt(h.substr(0, 2), 16) / 255, g = parseInt(h.substr(2, 2), 16) / 255, b = parseInt(h.substr(4, 2), 16) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn, hh = 0, ss = 0;
    if (d) { ss = d / (1 - Math.abs(2 * l - 1)); hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; if (hh < 0) hh += 360; } return [hh, ss, l]; }
  function hsl2hex(h, s, l) { h = ((h % 360) + 360) % 360; var c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return "#" + [r, g, b].map(function (v) { v = Math.round((v + m) * 255); return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
  function themeHue(c1) {
    var v = c1; if (!v) { try { v = getComputedStyle(document.documentElement).getPropertyValue("--ic1-t") || getComputedStyle(document.documentElement).getPropertyValue("--accent"); } catch (e) {} }
    v = (v || "").trim(); if (/^#[0-9a-f]{3}$/i.test(v)) v = "#" + v[1] + v[1] + v[2] + v[2] + v[3] + v[3];
    if (!/^#[0-9a-f]{6}$/i.test(v)) { try { var cv = document.createElement("canvas").getContext("2d"); cv.fillStyle = v || "#7C5CFF"; v = cv.fillStyle; } catch (e) { v = "#7C5CFF"; } }
    return /^#[0-9a-f]{6}$/i.test(v) ? hex2hsl(v)[0] : 255;
  }
  var COLORFUL = { R: 1, O: 1, Y: 1, G: 1, L: 1, P: 1, V: 1 };
  function palette(c1, mode) {   /* {R:"#..",...} đã xoay; mode: contrast | match | off */
    var out = {}, th = themeHue(c1), delta = mode === "match" ? (th - 40) * 0.45 : mode === "off" ? 0 : (th + 180 - 40) * 0.5;
    Object.keys(TOK).forEach(function (k) { if (!COLORFUL[k] || !delta) { out[k] = TOK[k]; return; } var a = hex2hsl(TOK[k]); out[k] = hsl2hex(a[0] + delta, a[1], a[2]); });
    return out;
  }
  var MODE = "contrast";
  var uid = 0;
  function key(emoji) { return (emoji || "").replace(/[️‍]/g, "").replace(/\s+/g, "").trim(); }
  function nameOf(emoji) { var k = key(emoji), cp = Array.from(k)[0] || ""; return E[k] || E[cp] || ""; }
  function baseOf(c) { return c === "A" ? "var(--ic1)" : c === "B" ? "var(--ic2)" : "var(--c" + c + ")"; }
  function dress(body, id) {   /* kiểu 3D đất sét: khối tô gradient tròn (sáng trái-trên → tối phải-dưới), KHÔNG viền; chi tiết tối mờ; điểm sáng trắng mềm */
    return body.replace(/class="([A-Za-z]+)"/g, function (m, c) {
      if (c === "H") return 'fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3.4" stroke-linecap="round"';
      if (c === "K") return 'fill="none" stroke="var(--ink)" stroke-opacity=".55" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
      if (c === "F") return 'fill="var(--ink)" fill-opacity=".8"';
      if (/^s[A-Z]$/.test(c)) return 'fill="none" stroke="url(#g' + c.charAt(1) + id + ')" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"';
      return 'fill="url(#g' + c + id + ')"';
    });
  }
  function svg(name, o) {
    o = o || {}; var body = P[name]; if (!body) return "";
    var id = "-" + (++uid), st = "";
    if (o.c1) st += "--ic1-t:" + o.c1 + ";"; if (o.c2) st += "--ic2-t:" + o.c2 + ";"; if (o.ink) st += "--ic-ink-t:" + o.ink + ";"; if (o.mix != null) st += "--ic-mix-t:" + Math.round(o.mix * 100) + "%;";
    if (o.size) { var z = o.size + (typeof o.size === "number" ? "px" : ""); st += "width:" + z + ";height:" + z + ";"; }
    var pal = palette(o.c1, o.mode || MODE); Object.keys(pal).forEach(function (k) { st += "--c" + k + ":" + pal[k] + ";"; });
    var used = {}; body.replace(/class="(?:s)?([A-Z])"/g, function (m, c) { used[c] = 1; return m; });
    var defs = Object.keys(used).map(function (c) { var b = baseOf(c); return '<radialGradient id="g' + c + id + '" cx=".3" cy=".24" r=".95"><stop offset="0" stop-color="color-mix(in srgb,' + b + ' 55%,#fff)"/><stop offset=".38" stop-color="color-mix(in srgb,' + b + ' 92%,#fff)"/><stop offset=".72" stop-color="' + b + '"/><stop offset="1" stop-color="color-mix(in srgb,' + b + ' 62%,#14003a)"/></radialGradient>'; }).join("");
    return '<svg class="npic" viewBox="-3 -3 70 70" aria-hidden="true" focusable="false"' + (st ? ' style="' + st + '"' : "") + ">" + (o.title ? "<title>" + o.title + "</title>" : "") + "<defs>" + defs + '</defs><ellipse cx="33" cy="62" rx="22" ry="3.6" fill="#0a0020" fill-opacity=".28"/>' + dress(body, id) + "</svg>";
  }
  function theme(t, el) {
    el = el || document.documentElement; t = t || {};
    [["c1", "--ic1-t"], ["c2", "--ic2-t"], ["ink", "--ic-ink-t"], ["sticker", "--ic-stk-t"]].forEach(function (kv) { if (t[kv[0]]) el.style.setProperty(kv[1], t[kv[0]]); else el.style.removeProperty(kv[1]); });
    if (t.mode) MODE = t.mode;
    if (t.mix != null) el.style.setProperty("--ic-mix-t", Math.round(t.mix * 100) + "%"); else el.style.removeProperty("--ic-mix-t");
  }
  function apply(root) {
    if (!api.on && !window.NPIconOn) return;   /* chưa được duyệt → giữ emoji gốc */
    root = root || document; inject();
    Array.prototype.forEach.call(root.querySelectorAll(".ty .e,.mode .e,#home .e,#ovStart .e,.lv,.lvb,.dif"), function (e) {
      if (e.children.length && !e.querySelector("svg")) return; var tx = (e.textContent || "").trim(); if (Array.from(tx.replace(/[\uFE0F\u200D]/g, "")).length !== 1) return;
      if (e.querySelector("svg.npic")) return; var n = nameOf(e.textContent); if (n) { e.setAttribute("data-ic", n); e.innerHTML = svg(n); }
    });
    var f = root.querySelector && root.querySelector("#bFree");   /* nút "🎲 Random round": icon xúc xắc SVG đứng đầu chữ */
    if (f && !f.querySelector("svg.npic")) { var t = f.textContent || ""; if (/^\s*🎲/.test(t)) { f.innerHTML = '<span class="npic-in" style="display:inline-block;width:56px;height:56px;vertical-align:middle;margin-right:10px">' + svg("dice") + "</span>" + t.replace(/^\s*🎲\s*/, ""); } }
  }
  var api = { on: true, svg: svg, theme: theme, name: nameOf, apply: apply, names: function () { return Object.keys(P); } };
  window.NPIcon = api;
})();
