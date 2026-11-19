/* MÀN CHÍNH 3 PHẦN (MỌI game Cozy có #home + #hHero và MỌI game Pop Play; ?home3=0 để tắt khi so sánh; Pop: #home/#village/#ovStart + #paHero + #title, "Chơi ngay" bấm hộ ô chế độ đầu tiên, màn ngang dùng một cột nút bên phải như Night):
   ① thanh trên: ← và ⋯ (menu)  ② tên game  ③ linh vật  ④ hai thẻ viền sáng: "Chơi ngay" + "Tiếp tục" (Tiếp tục chỉ còn icon, mọi cỡ màn).
   KHÔNG đo bằng JS: vị trí tính bằng CSS thuần theo tỉ lệ cố định của hình linh vật (khung vuông H: đầu ở 0.217H, chân/bóng đổ ở 0.975H → tâm hình = 0.596H):
     - tâm hình linh vật = GIỮA màn chơi (50cqh)
     - hai nút cách chân 28px (ngay dưới chân)
     - tên game ở GIỮA hàng menu (đáy 72px) và mép trên vùng bong bóng (54px trên khung linh vật)
   Phần tử cũ (thẻ hôm nay, loại chơi, chip…) chỉ bị ẩn bằng CSS, vẫn nằm trong DOM; "Chơi ngay" bấm hộ #bFree → #bCamp → #bDaily, "Tiếp tục" bấm hộ nút ▶ của #npResume
   (resume.js), chưa có ván dở thì vào ván như "Chơi ngay". Nạp từ shared/resume.js. Chỉ Cozy (#home + #hHero). */
(function () {
  "use strict";
  var q = new URLSearchParams(location.search).get("home3"), gid = (location.pathname.match(/\/games\/([^\/]+)/) || [])[1] || "";
  if (q === "0") return;   /* MỌI game Cozy có #home + #hHero (build() không làm gì nếu thiếu); ?home3=0 để tắt khi so sánh */
  var de = document.documentElement, $ = function (id) { return document.getElementById(id); };
  var vi = function () { return (de.lang || "vi").slice(0, 2) !== "en"; };
  var S = 'html.np-h3 #play[data-scr="home"] #home', S5 = 'html.np-h3.np-h3 #play[data-scr="home"] #home:not(#_):not(#__):not(#___)', C = 'html.np-h3 #play[data-scr="home"] #h3Cal', L = 'html.np-h3.np-h3 #play[data-scr="home"] #home:not(#_):not(#__)', calEl = null;
  var POP = /\/popplay\/|\/cozy-wings\//.test(location.pathname), HOSTS = ["home", "village", "ovStart"];
  var st = document.createElement("style");
  var css =
    '#h3Wrap,#h3Cal{display:none}' +
    'html.np-h3 #play[data-scr="home"] .top h1{opacity:0!important;pointer-events:none}' +
    /* H = cạnh khung vuông linh vật; ht = lề trên của #home trong #play; hy = đỉnh khung linh vật (trong #home) sao cho tâm hình ở giữa màn */
    S5 + '{--H:min(calc(100cqw - 2 * var(--pad)),46cqh);--ht:calc(var(--topH) + 30px);--h3y:calc(50cqh - var(--H) * var(--hc,.596) - var(--ht));top:calc(var(--topH) + 30px)!important;bottom:0!important;display:block!important}' +
    '@media (orientation:portrait){' + S5 + '{left:var(--pad)!important;right:var(--pad)!important;width:auto!important}}' +
    S + ' > *:not(#h3Wrap):not(.hl):not(.hr){display:none!important}' + S + ' > .hl,' + S + ' > .hr{display:contents!important}' + S + ' > .hl > *:not(#hHero),' + S + ' > .hr > *{display:none!important}' +
    S + ' > #h3Wrap{display:contents!important}' +
    /* các phần tử cũ trong .hl/.hr (độ khó, chế độ, nút Chơi…) bị luật layout-hand.css (!important, nhiều id) bật lại → ẩn bằng luật mạnh hơn */
    'html.np-h3.np-h3 #play[data-scr="home"] #home:not(#_):not(#__) :is(.hl,.hr) > *:not(#hHero):not(#_x){display:none!important}' +
    /* ③ linh vật: khung vuông H, tâm hình ở giữa màn */
    /* độ ưu tiên cao (5 id) để thắng quy tắc màn ngang của layout.css (#home.npl-one #hHero.npa-hero:not(#_), 4 id) vốn khoá cỡ/vị trí khung linh vật */
    'html.np-h3.np-h3 #play[data-scr="home"] #home #hHero:not(#_):not(#__){display:grid!important;position:absolute!important;left:0!important;right:0!important;top:var(--h3y)!important;width:auto!important;height:var(--H)!important;min-height:0!important;max-height:none!important;aspect-ratio:auto!important;flex:none!important;margin:0!important;touch-action:pan-y}' +
    /* bong bóng thoại sát đầu: mặc định nằm TRÊN khung linh vật (cách 10px) còn đầu nằm 0.217H bên dưới đỉnh khung → kéo xuống để đáy bong bóng cách đỉnh đầu 18px */
    S + ' #hHero .npa-bub{margin-bottom:calc(var(--H) * var(--rt,.217) * -1 + 8px)!important}' +
    /* hàng chấm báo skin (chỉ khi linh vật có từ 2 skin mở khoá trở lên): ngay dưới chân linh vật, trên hai nút */
    S + ' #h3Dots{position:absolute;left:0;right:0;top:calc(var(--h3y) + var(--H) * .975 + 6px);display:flex;justify-content:center;gap:7px;height:12px;pointer-events:none}' +
    S + ' #h3Dots[hidden]{display:none}' + S + ' #h3Dots i{width:8px;height:8px;border-radius:50%;background:var(--ink,#fff);opacity:.32}' + S + ' #h3Dots i.on{opacity:1;box-shadow:0 0 0 2px color-mix(in srgb,var(--accent,#7C5CFF) 60%,transparent)}' +
    /* NÚT LỊCH nổi (Thử thách hôm nay): CHỈ icon lịch (không khung), nằm NGAY DƯỚI nút menu ⋯ ở góc phải (cùng lề phải 16px với ⋯), lơ lửng nhẹ.
       #home bắt đầu ở y = ht trong #play; đáy hàng menu ở y = 72px → icon cách menu 10px. Icon cùng cỡ nút menu ⋯ (--tap-lg 56px), cố định để không bị nén. */
    C + '{position:absolute;z-index:31;right:var(--h3cr,calc(16px + env(safe-area-inset-right,0px)));top:var(--h3ct,calc(16px + var(--tap-lg,56px) + 10px + env(safe-area-inset-top,0px)));width:var(--h3cs,var(--tap-lg,56px));height:var(--h3cs,var(--tap-lg,56px));padding:0;margin:0;border:0;background:none;box-shadow:none;display:grid;place-items:center;cursor:pointer;touch-action:manipulation;color:var(--ink,#fff);animation:h3Float 3.2s ease-in-out infinite}' +
    C + '[hidden]{display:none}' + C + ' svg{width:var(--h3cs,var(--tap-lg,56px));height:var(--h3cs,var(--tap-lg,56px));max-width:none;display:block;flex:none}' + C + ':active{animation:none;transform:scale(.94)}' + C + ':focus-visible{outline:3px solid var(--accent,#7C5CFF);outline-offset:3px}' +
    '@keyframes h3Float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@media (prefers-reduced-motion:reduce){' + C + '{animation:none}}' +
    /* ② tên: giữa đáy menu (72px) và vùng bong bóng (54px trên khung linh vật) */
    S + ' #h3T{position:absolute;left:0;right:0;margin:0;height:44px;top:max(calc(94px - var(--ht)),calc((72px + (var(--h3y) + var(--ht)) - 54px - 40px) / 2 + 16px - var(--ht)));text-align:center;padding:0 60px;box-sizing:border-box;font:900 clamp(16px,5.4cqw,40px)/1.05 var(--font,inherit);color:var(--ink,#fff);display:flex;align-items:center;justify-content:center;overflow:hidden}' +
    /* ④ hai nút: ngay dưới chân (chân = 0.975H) */
    S + ' #h3Btns{--ch:56px;position:absolute;left:0;right:0;margin:0;top:calc(var(--h3y) + var(--H) * .975 + 28px);display:flex;flex-direction:row;justify-content:center;gap:var(--gap)}' +
    S + ' #h3Btns #h3Play{flex:0 1 clamp(150px,52%,260px);min-width:max-content}'+ S + ' #h3Btns #h3Play .h3b{overflow:visible;text-overflow:clip}' + S + ' #h3Btns #h3Play{padding:0 calc((var(--ch) - 1.1em) / 2) 0 8px}' + L + ' #h3Btns #h3Play{padding:0 calc((var(--ch) - 1.1em) / 2) 0 6px}' +
    S + ' #h3Btns button{flex:1 1 0;min-width:0;height:var(--ch);display:flex;align-items:center;justify-content:center;gap:6px;padding:0 10px;border-radius:calc(var(--ch)*.36);box-sizing:border-box;cursor:pointer;touch-action:manipulation;' +
      'color:var(--ink,#fff);font:800 clamp(15px,4.4cqw,20px)/1.1 var(--font,inherit);background:color-mix(in srgb,var(--panel,#10162b) 74%,transparent);' +
      'border:2.5px solid color-mix(in srgb,var(--ink,#fff) 92%,transparent);box-shadow:0 0 0 4px color-mix(in srgb,var(--ink,#fff) 20%,transparent),0 0 18px color-mix(in srgb,var(--accent,#7C5CFF) 50%,transparent)}' +
    S + ' #h3Btns .h3i{display:grid;place-items:center;flex:none;width:calc(var(--ch)*.78);height:calc(var(--ch)*.78)}' + S + ' #h3Btns .h3i svg{width:88%;height:88%;max-width:none;display:block}' +
    S + ' #h3Btns .h3b{flex:0 1 auto;min-width:0;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    /* "Tiếp tục": chỉ còn icon ở MỌI cỡ màn (nhãn ở aria-label + title) */
    S + ' #h3Btns #h3Res{flex:0 0 calc(var(--ch)*1.15);padding:0}' + S + ' #h3Btns #h3Res .h3b{display:none}' + S + ' #h3Btns #h3Res .h3i{width:calc(var(--ch)*.9);height:calc(var(--ch)*.9)}' + S + ' #h3Btns #h3Res .h3i svg{width:100%;height:100%}' +
    /* MỌI CỠ MÀN: cùng một bố cục dọc trong cột khung chơi. Màn ngang: linh vật to theo chiều cao (40cqh). Màn thấp (≤600px, bong bóng thoại bị layout.css ẩn): tên đặt giữa menu và ĐẦU linh vật */
    /* MÀN NGANG: 2 cột trong #home (rộng theo màn, chừa cột nút bên phải). Trái = linh vật vuông H (cao gần trọn màn); phải = tên + hàng nút ≥72px + lịch ở góc, cả cụm căn giữa dọc. Không bong bóng thoại. */
    '@media (orientation:landscape){' + S5 + '{--H:min(calc(100dvh - 16px),42vw);--h3y:max(0px,calc(50% - var(--H) * .596 + 5px));--ht:8px;--cg:16px;--ch:72px;--cw:calc(100% - var(--H) - var(--cg));top:8px!important;bottom:8px!important}' +
      L + ' #hHero:not(#___){left:0!important;right:auto!important;top:var(--h3y)!important;width:var(--H)!important;height:var(--H)!important}' +
      L + ' #hHero .npa-bub:not([hidden]){display:block!important;max-width:min(240px,calc(var(--H) - 24px))}' +
      L + ' #h3Dots{left:0;right:auto;width:var(--H);top:calc(var(--h3y) + var(--H) * .975 + 2px)}' +
      L + ' #h3T{padding:0;left:calc(var(--H) + var(--cg));right:0;top:auto;bottom:calc(50% + 32px);height:auto;text-shadow:0 2px 0 rgba(0,0,0,.45),0 4px 0 rgba(0,0,0,.28),0 6px 14px rgba(0,0,0,.55),0 0 18px color-mix(in srgb,var(--accent,#7C5CFF) 55%,transparent);max-height:2.2em;font-size:clamp(20px,4.2vw,36px);line-height:1.05;white-space:normal;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;text-overflow:clip}' +
      L + ' #h3Btns{--ch:72px;left:calc(var(--H) + var(--cg));right:24px;top:calc(50% - 2px);box-sizing:border-box;gap:10px}' + '@media (max-height:340px){' + L + ' #h3Btns{--ch:64px;top:calc(50% - 6px)}}' +
      L + ' #h3Btns #h3Play{flex:0 1 220px}' + L + ' #h3Btns #h3Res{flex:0 0 var(--ch);width:var(--ch);padding:0}' + L + ' #h3Btns #h3Res .h3i{width:calc(var(--ch)*.84);height:calc(var(--ch)*.84)}' + L + ' #h3Btns #h3Res .h3i svg{width:100%;height:100%}' + L + ' #h3Btns .h3i{width:calc(var(--ch)*.62);height:calc(var(--ch)*.62)}' + L + ' #h3Btns button{gap:4px;padding:0 6px;font-size:clamp(14px,2.6vw,20px)}' +
      L + ' #h3Cal{right:0;top:0;bottom:auto;--h3cs:48px;width:48px;height:48px}}' +
    '@media (max-height:600px){' + S + ' #h3T{top:calc((52px + var(--h3y) + var(--ht) + var(--H) * .217 - 40px) / 2 - var(--ht) + 6px);font-size:clamp(20px,6.4cqh,30px)}}' +
    S + ' #h3Btns button:active{transform:scale(.97)}' + S + ' #h3Btns button:focus-visible{outline:3px solid var(--accent,#7C5CFF);outline-offset:3px}';
  if (POP) {   /* POP PLAY: cùng bộ CSS, đổi tên phần tử (host #home/#village/#ovStart, linh vật #paHero, tên #title); không có layout.css nên tự cấp biến --topH/--pad/--row/--gap */
    css = css.split("#hHero").join(":is(#paHero,#cwHero)").split(".top h1").join("#title").split("#home").join(":is(#home,#village,#ovStart)")
      .split(":not(#h3Wrap):not(.hl)").join(":not(#h3Wrap):not(#paHero):not(#cwHero):not(.hl)").split("{--H:min(calc(100cqw").join("{--topH:56px;--pad:16px;--row:84px;--gap:12px;--tap-lg:56px;--H:min(calc(100cqw");
  }
  if (POP) {
    css += 'html.np-h3 #play[data-scr="home"]:not(:has(.ov:not([hidden]):not(#ovStart),#phOv:not([hidden]),#hlpOv:not([hidden]))){overflow:hidden!important;position:fixed!important;aspect-ratio:auto!important;min-height:0!important;max-height:none!important;left:0!important;top:0!important;right:0!important;bottom:0!important;width:auto!important;height:auto!important;max-width:none!important;margin:0!important;border-radius:0!important;border:0!important;box-shadow:none!important;background:transparent!important}' +
      'html.np-h3.np-h3home :is(#title,.hud){opacity:0!important;pointer-events:none!important}' +
      'html.np-h3.np-h3.np-h3home :is(#title,.hud):not(#_):not(#__){opacity:0!important;visibility:hidden!important;pointer-events:none!important}' +
      /* TÊN GAME (Night + Pop): đậm nhất, to, chữ trắng có viền bóng đậm bốn phía + bóng đổ (đọc rõ trên mọi nền) */
      'html.np-h3.np-h3.np-h3 #h3T:not(#_):not(#__):not(#___){font-weight:900!important;font-size:clamp(24px,7.4cqw,46px)!important;padding:0 56px!important;color:#fff!important;letter-spacing:.3px;-webkit-text-stroke:0;text-shadow:-2px 0 0 #2a1860,2px 0 0 #2a1860,0 -2px 0 #2a1860,0 2px 0 #2a1860,-1.5px -1.5px 0 #2a1860,1.5px -1.5px 0 #2a1860,-1.5px 1.5px 0 #2a1860,1.5px 1.5px 0 #2a1860,0 5px 0 rgba(20,10,60,.6),0 9px 16px rgba(0,0,0,.6)!important}' +
      '@media (orientation:landscape){html.np-h3.np-h3.np-h3 #h3T:not(#_):not(#__):not(#___){font-size:clamp(28px,5.4vw,50px)!important;padding:0!important}}' +
      /* dọc: tên nằm ngay trên bong bóng (bong bóng cao ~38px, cách đầu 8px) và dưới thanh nút (y ≥ 78px) */
      '@media (orientation:portrait){html.np-h3.np-h3.np-h3 #play[data-scr="home"] :is(#home,#village,#ovStart) #h3T:not(#_):not(#__):not(#___){height:40px!important;top:max(calc(78px - var(--ht)),calc(var(--h3y) + var(--H) * var(--rt,.217) - 92px))!important}}' +
      '@media (orientation:landscape){html.np-h3.np-h3.np-h3 #play[data-scr="home"] :is(#home,#village,#ovStart) #h3T:not(#_):not(#__):not(#___){font-size:clamp(26px,5vw,46px)!important;height:auto}}' +
      /* huy hiệu độ khó ở GIỮA thanh trên (chỗ tên game cũ), giữa ← và 🔊; màn ngang: giữa mép trên */
      'html.np-h3.np-h3home #npDifBadge{left:50%!important;top:31px!important;transform:translateX(-50%)!important;right:auto!important;bottom:auto!important}@media (orientation:landscape){html.np-h3.np-h3home #npDifBadge{top:8px!important}}' +
      /* MÀN NGANG: giống Night Play — vùng nội dung chừa MỘT cột nút bên PHẢI (không phải hai cột bên trái như bố cục Pop cũ) */
      '@media (orientation:landscape){html.np-h3.np-h3.np-h3 #play[data-scr="home"] :is(#home,#village,#ovStart):not(#_):not(#__):not(#___):not(#____){left:var(--h3l,calc(12px + env(safe-area-inset-left,0px)))!important;right:var(--h3r,calc(60px + env(safe-area-inset-right,0px)))!important;width:auto!important;height:calc(100dvh - 16px)!important;max-height:none!important}' +
      'html.np-h3.np-h3.np-h3 #play[data-scr="home"] :is(#home,#village,#ovStart):not(#_):not(#__):not(#___):not(#____){--H:min(calc(100dvh - 70px),38vw,max(170px,calc(100vw - var(--h3l,12px) - var(--h3r,60px) - 300px)));--h3y:calc(50dvh - var(--H) / 2 + 11px)}' +
      'html.np-h3.np-h3.np-h3 #play[data-scr="home"] :is(#home,#village,#ovStart) #paHero .npa-bub,html.np-h3.np-h3.np-h3 #play[data-scr="home"] :is(#home,#village,#ovStart) #cwHero .npa-bub{margin-bottom:calc(var(--H) * var(--rt,.217) * -1 + 8px)!important}' +
      'html.np-h3.np-h3home .top{position:fixed!important;right:max(6px,env(safe-area-inset-right))!important;left:auto!important;top:6px!important;bottom:6px!important;width:42px!important;height:auto!important;margin:0!important;padding:0!important;display:flex!important;flex-direction:column!important;flex-wrap:nowrap!important;justify-content:flex-start;align-items:center;gap:4px!important;z-index:40;grid-column:auto!important;grid-row:auto!important}' +
      'html.np-h3.np-h3home .top>h1{display:none!important}html.np-h3.np-h3.np-h3home .top>.ib:not(#_):not(#__){width:38px!important;height:38px!important;min-width:38px!important;min-height:38px!important;max-width:38px!important;max-height:38px!important;flex:none!important;position:static!important;margin:0!important;padding:0!important;font-size:15px!important}html.np-h3.np-h3.np-h3home .top>.ib:not(#_) svg{width:22px!important;height:22px!important}}' +
      '@media (orientation:landscape) and (max-height:340px){html.np-h3.np-h3.np-h3home .top{gap:2px!important}html.np-h3.np-h3.np-h3home .top>.ib:not(#_):not(#__){width:32px!important;height:32px!important;min-width:32px!important;min-height:32px!important;max-width:32px!important;max-height:32px!important}}';
  }
  css += 'html.np-h3 #play[data-scr="home"] :is(#home,#village,#ovStart):not(#_):not(#__){overflow:visible!important}';   /* đạo cụ của linh vật (bảng 2048, ly…) tràn khỏi khung #home không bị cắt thẳng ở mép; trang vẫn không cuộn nhờ html/body overflow:hidden */
  css += 'html:has(.ov:not([hidden]):not(#ovStart),#phOv:not([hidden]),#hlpOv:not([hidden]),.sheet:not([hidden])) #h3Cal{display:none!important}   /* popup/thẻ cách chơi đang mở → nút lịch của màn chọn không nổi đè lên */';
  css += 'html.np-h3 #play:has(>.ov:not([hidden]):not(#ovStart)) :is(#home,#village,#ovStart){visibility:hidden!important}   /* thẻ che nền: màn chọn phía sau không lộ chữ mờ */';
  /* VÀO VÁN: game ẩn màn chọn bằng thuộc tính hidden, nhưng luật hiện màn chọn mới (display:block!important) từng thắng nó → màn chọn đè lên bàn chơi. Ẩn lại bằng độ ưu tiên cao hơn; nút lịch + các phần của màn chọn nằm ngoài #home cũng ẩn theo. */
  css += 'html.np-h3 #play :is(#home,#village,#ovStart)[hidden]:not(#_):not(#__):not(#___):not(#____):not(#_____){display:none!important}html.np-h3:not(.np-h3at) :is(#h3Cal,#h3Wrap,#h3Dots){display:none!important}';
  css += 'html.np-h3,html.np-h3 body{overflow:hidden!important;overflow:clip!important;max-width:100vw!important;overscroll-behavior:none}html.np-h3 :is(#hHero,#paHero,#cwHero) .npa-box,html.np-h3 :is(#hHero,#paHero,#cwHero) svg{overflow:visible!important}';   /* bảng/ly/đạo cụ của linh vật tràn khỏi khung SVG không bị cắt thẳng */
  css += 'html[data-theme=light].np-h3 #h3Btns button{box-shadow:0 0 0 4px color-mix(in srgb,var(--npacc,var(--accent,#7C5CFF)) 22%,transparent),0 0 14px color-mix(in srgb,var(--npacc,var(--accent,#7C5CFF)) 28%,transparent)!important}';
  css += 'html[data-theme=light].np-h3.np-h3.np-h3 #h3T:not(#_):not(#__):not(#___){color:var(--ink,#241a5a)!important;-webkit-text-stroke:0;text-shadow:-2px 0 0 #fff,2px 0 0 #fff,0 -2px 0 #fff,0 2px 0 #fff,-1.5px -1.5px 0 #fff,1.5px -1.5px 0 #fff,-1.5px 1.5px 0 #fff,1.5px 1.5px 0 #fff,0 5px 0 rgba(255,255,255,.55),0 8px 14px rgba(60,40,120,.35)!important}';   /* giao diện SÁNG: chữ đậm màu tối + viền trắng (chữ trắng chìm vào nền sáng) */
  css += 'html.np-h3 #h3T:not(#_):not(#__):not(#___){white-space:nowrap!important;-webkit-line-clamp:unset!important;max-height:none!important;text-overflow:clip!important}';   /* tên game LUÔN MỘT dòng: fitTitle() thu cỡ chữ cho vừa */
  st.textContent = css;
  document.head.appendChild(st);
  function titleEl() { return POP ? $("title") : ($("ttl") || document.querySelector("#play .top h1,.top h1")); }
  function heroEl() { return POP ? ($("paHero") || $("cwHero")) : $("hHero"); }
  function host() { for (var i = 0; i < (POP ? 3 : 1); i++) { var e = $(HOSTS[i]); if (e && !e.hidden && e.getClientRects().length) return e; } return null; }
  function firstTile() { var c = window.NPCC && NPCC.modeEl && NPCC.modeEl(); if (c) return c; var t = document.querySelector(".tiles>.tile,#cards>.tile"); return t && (t.querySelector(".main") || t); }
  function dailyBtn() { return $("bDaily") || document.querySelector(".dbar,#dailyRow .dbar,#dailyRow,#ovStart .tile.daily,.tile.daily"); }
  function build() {
    var h = host(), t = titleEl(), hero = heroEl(); if (!h || !t || !hero) return !!$("h3Wrap");
    if ($("h3Wrap")) { if ($("h3Wrap").parentNode === h) return true; $("h3Wrap").remove(); }
    var w = document.createElement("div"); w.id = "h3Wrap";
    w.innerHTML = '<h2 id="h3T"></h2><div id="h3Dots" hidden aria-hidden="true"></div><div id="h3Btns"><button type="button" id="h3Play"><span class="h3i"></span><span class="h3b"></span></button><button type="button" id="h3Res"><span class="h3i"></span><span class="h3b"></span></button></div>';
    h.insertBefore(w, h.firstChild);
    /* icon có sẵn của NPIcon ("rocket", "resume") — hệ icon sticker chung, tự theo theme; chưa nạp được thì dùng ▶ */
    var ic = function (n) { return (window.NPIcon && NPIcon.svg && NPIcon.svg(n)) || '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>'; };
    calEl = document.createElement("button"); calEl.type = "button"; calEl.id = "h3Cal"; calEl.hidden = true; calEl.innerHTML = ic("calendar");
    calEl.onclick = function () { var b = dailyBtn(); if (b) b.click(); };
    $("h3Play").firstChild.innerHTML = ic("rocket"); $("h3Res").firstChild.innerHTML = ic("resume");
    /* nút vào ván có sẵn của từng game: chơi tự do (#bFree) → chiến dịch (#bCamp) → thử thách hôm nay (#bDaily) */
    var go = function () { var ids = ["bPlay", "bFree", "bCamp", "bDaily"], i, b; if (POP) return firstTile() || dailyBtn(); for (i = 0; i < ids.length; i++) { b = $(ids[i]); if (b) return b; } return null; };
    $("h3Play").onclick = function () { var b = go(); if (b) b.click(); };
    $("h3Res").onclick = function () { var b = document.querySelector("#npResume .npr-go") || go(); if (b) b.click(); };
    /* VUỐT NGANG trên linh vật = đổi skin (chỉ các skin đã mở khoá; vuốt trái = skin kế, vuốt phải = skin trước, vòng tròn) */
    var hero = heroEl(), sx = 0, sy = 0, sd = false;
    if (hero) {
      hero.addEventListener("pointerdown", function (e) { sx = e.clientX; sy = e.clientY; sd = true; });
      hero.addEventListener("pointercancel", function () { sd = false; });
      hero.addEventListener("pointerup", function (e) {
        if (!sd) return; sd = false; var dx = e.clientX - sx, dy = e.clientY - sy;
        if (!de.classList.contains("np-h3") || Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        var L = skinList(); if (L.length < 2) return;
        var i = L.indexOf(window.NPMascot2.getSkin(gid)); if (i < 0) i = 0;
        i = (i + (dx < 0 ? 1 : -1) + L.length) % L.length;
        try { window.NPMascot2.setSkin(gid, L[i]); } catch (err) {}
        dots();
      });
    }
    return true;
  }
  function skinList() { try { return (window.NPMascot2 && NPMascot2.unlocked && NPMascot2.unlocked(gid)) || []; } catch (e) { return []; } }
  /* nút lịch ngay DƯỚI nút menu ⋯ thật (#npFab của Cozy / #npPmFab của Pop): cùng lề phải, cùng cỡ, cách 10px. Đọc hình học của nút ⋯ (iPad: khung chơi hẹp hơn cửa sổ nên lề cố định không trùng). Chỉ ghi khi đổi. */
  function placeCal() {
    var f = $("npFab") || $("npPmFab"), pl = $("play"); if (!f || !pl || !calEl) return;
    if (innerWidth > innerHeight) { ["--h3cr", "--h3ct", "--h3cs"].forEach(function (k) { calEl.style.removeProperty(k); }); return; }
    var fr = f.getBoundingClientRect(), pr = pl.getBoundingClientRect(); if (!fr.width || !pr.width) return;
    var v = { "--h3cr": Math.round(pr.right - fr.right) + "px", "--h3ct": Math.round(fr.bottom - pr.top + 10) + "px", "--h3cs": Math.round(fr.width) + "px" };
    for (var k in v) if (calEl.style.getPropertyValue(k) !== v[k]) calEl.style.setProperty(k, v[k]);
  }
  var dk = "";
  function dots() {
    var d = $("h3Dots"); if (!d) return; var L = skinList(), cur = 0, k;
    try { cur = Math.max(0, L.indexOf(window.NPMascot2.getSkin(gid))); } catch (e) {}
    k = L.length + "|" + cur; if (k === dk) return; dk = k;
    d.hidden = L.length < 2; d.innerHTML = L.length < 2 ? "" : L.map(function (s, i) { return '<i' + (i === cur ? ' class="on"' : "") + "></i>"; }).join("");
  }
  function sync() {
    de.classList.toggle("np-h3at", !!host() && (!$("play") || ($("play").getAttribute("data-scr") || "home") === "home" || POP));
    if (POP) { var pl0 = $("play"), sc = host() ? "home" : "game"; if (pl0 && pl0.getAttribute("data-scr") !== sc) pl0.setAttribute("data-scr", sc); de.classList.toggle("np-h3home", sc === "home"); }
    if (!build()) return;
    de.classList.toggle("np-h3", true);   /* màn ngang: tạm giữ layout cũ (layout mới chưa làm riêng cho ngang) */
    var t = titleEl(), v = vi();
    if ($("h3T").textContent !== t.textContent) $("h3T").textContent = t.textContent;
    var p = v ? "Chơi ngay" : "Play now", c = v ? "Tiếp tục" : "Resume";
    var pb = $("h3Play").lastChild, rb = $("h3Res").lastChild;
    if (pb.textContent !== p) pb.textContent = p; if (rb.textContent !== c) rb.textContent = c;
    var re = $("h3Res"); if (re.getAttribute("aria-label") !== c) { re.setAttribute("aria-label", c); re.title = c; }
    var cal = calEl, top0 = $("play"), has = !!dailyBtn();
    var land = innerWidth > innerHeight, par = land ? $("h3Wrap") : top0;
    if (par && cal.parentNode !== par) par.appendChild(cal);   /* con của #play (position:relative): right:16px trùng lề phải nút ⋯ (neo vào .top bị lệch 80px vì .top có padding-right 80px) */
    var cl = v ? "Thử thách hôm nay" : "Daily challenge";
    if (cal.hidden === has) cal.hidden = !has; if (cal.getAttribute("aria-label") !== cl) { cal.setAttribute("aria-label", cl); cal.title = cl; }
    placeCal();
    dots(); fit(); fitTitle(); rails();
  }
  /* có popup đang mở: #play bị thu nhẹ/mờ, các nút lề dịch chỗ → KHÔNG đo bố cục lúc này (từng ghi lề sai rồi giữ lại sau khi đóng popup = layout lệch) */
  function popupOpen() { return !!document.querySelector(".sheet:not([hidden]),.ov:not([hidden]):not(#ovStart),#hlpOv:not([hidden]),#phOv:not([hidden]),.overlay:not([hidden]),.nps-sheet:not([hidden]),.nps-dlg:not([hidden]),dialog[open],#ccRoot.on") || !!document.querySelector("#play.ph-open,html.ph-open,html.np-pop-open"); }
  var rk = "";
  function rails() {
    if (!POP || popupOpen()) return;   /* hai mép màn hình: nút cố định (←, 🔊, ⋯, cột nút…) ở mép trái/phải → chừa đúng chỗ cho vùng nội dung ngang, không cắt, không chừa thừa */
    if (innerWidth <= innerHeight) { var h0 = host(); if (h0 && (h0.style.getPropertyValue("--h3l") || h0.style.getPropertyValue("--h3r"))) { h0.style.removeProperty("--h3l"); h0.style.removeProperty("--h3r"); rk = ""; } return; }
    var h = host(); if (!h) return; var L = 0, R = innerWidth, w = innerWidth, bs = document.querySelectorAll("button,.ib,[role=button]"), i, e, r, cs;
    for (i = 0; i < bs.length; i++) { e = bs[i]; if (e.id === "ccOpen" || e.closest("#home,#village,#ovStart,#h3Wrap,.ov,#hlpOv")) continue; r = e.getBoundingClientRect(); if (r.width < 20 || r.height < 20 || r.width > 130 || r.height > 130 || r.bottom < 0 || r.top > innerHeight) continue;
      cs = getComputedStyle(e); if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity < .05) continue; var pos = cs.position; if (pos !== "fixed" && !e.closest(".top")) continue;
      if (r.right < w * .35) L = Math.max(L, r.right); else if (r.left > w * .65) R = Math.min(R, r.left); }
    var l = Math.min(96, Math.max(12, L ? Math.ceil(L) + 12 : 0)), rr = Math.min(96, Math.max(12, R < w ? Math.ceil(w - R) + 12 : 0)), k = l + "|" + rr; if (k === rk) return; rk = k;   /* trần 96px: dù cột nút rộng/lặp thế nào vùng nội dung vẫn đủ chỗ cho tên + hai nút */
    h.style.setProperty("--h3l", l + "px"); h.style.setProperty("--h3r", rr + "px");
  }
  var tk = "";
  function fitTitle() {
    if (popupOpen()) return;   /* một dòng, không cắt: chữ dài thì thu cỡ chữ (tối thiểu 13px) cho vừa bề rộng nội dung */
    var t = $("h3T"); if (!t) return; var cs = getComputedStyle(t), w = t.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0), k = t.textContent + "|" + w + "|" + innerWidth + "x" + innerHeight; if (k === tk || w < 40) return; tk = k;
    t.style.removeProperty("font-size"); var fs = parseFloat(getComputedStyle(t).fontSize) || 24, sw = t.scrollWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    if (sw > w + 1) t.style.setProperty("font-size", Math.max(13, Math.floor(fs * w / sw) - 1) + "px", "important");
  }
  /* TÂM HÌNH linh vật (không phải tâm khung): đo hộp nội dung SVG so với khung → tỉ lệ --hc; mỗi linh vật một tỉ lệ nên căn giữa chính xác. Chỉ ghi khi đổi > 0.015. */
  function fit() {
    if (popupOpen()) return;   /* ĐỈNH hình linh vật (đầu/mũ/đạo cụ) so với đỉnh khung → --rt; bong bóng thoại nằm sát ngay trên đỉnh hình, đúng cho từng linh vật. Chỉ ghi khi đổi > 0.01. */
    try {
      var h = host(), hero = heroEl(), sv = hero && (hero.querySelector(".npa-box svg") || hero.querySelector("svg")); if (!h || !sv) return;
      var hr = hero.getBoundingClientRect(); if (hr.height < 60) return;
      var bb = sv.getBBox(), m = sv.getScreenCTM(); if (!bb || !m || !bb.height) return;
      var r = (m.f + bb.y * m.d - hr.top) / hr.height; if (!(r > -.05 && r < .5)) return;
      var cur = parseFloat(h.style.getPropertyValue("--rt")); if (isNaN(cur) || Math.abs(cur - r) > .01) h.style.setProperty("--rt", r.toFixed(3));
      if (POP && innerHeight >= innerWidth) {   /* Pop dọc: hình lấp đầy khung (tâm ≈ 0.5H, không phải 0.596H của hình Night) → tâm thật + 0.04 (bóng đổ dưới chân kéo hộp xuống) để nhìn cân giữa màn như Night */
        var rc = (m.f + (bb.y + bb.height / 2) * m.d - hr.top) / hr.height + .04, cc = parseFloat(h.style.getPropertyValue("--hc"));
        if (rc > .4 && rc < .75 && (isNaN(cc) || Math.abs(cc - rc) > .012)) h.style.setProperty("--hc", rc.toFixed(3));
      } else if (POP && h.style.getPropertyValue("--hc")) h.style.removeProperty("--hc");
    } catch (e) {}
  }
  var go0 = function () { var pl = $("play") || document.body; if (!pl) return setTimeout(go0, 200); try { new MutationObserver(function () { sync(); }).observe(pl, { attributes: true, subtree: true, attributeFilter: ["hidden", "data-scr", "class"] }); } catch (e) {} }; go0();
  /* lớp np-h3 được bật sớm bởi layout.js / layout-pop.js; không dựng được màn chọn mới (không có linh vật/tên…) → gỡ để layout cũ chạy như trước, tránh màn trống */
  /* trang không bao giờ được cuộn lệch (xoay máy, mở popup, bàn phím…): về gốc khi xoay/đổi cỡ và khi bị cuộn */
  var home0 = function () { try { if (scrollX || scrollY) scrollTo(0, 0); var d = document.scrollingElement; if (d && (d.scrollLeft || d.scrollTop)) { d.scrollLeft = 0; d.scrollTop = 0; } } catch (e) {} };
  addEventListener("resize", home0); addEventListener("orientationchange", home0); addEventListener("scroll", home0, { passive: true });
  var bail = function () { if (!$("h3Wrap") && !build()) de.classList.remove("np-h3"); };
  if (document.readyState === "complete") setTimeout(bail, 0); else addEventListener("load", function () { setTimeout(bail, 400); });
  sync(); setInterval(sync, 700); addEventListener("resize", function () { placeCal(); fitTitle(); rk = ""; rails(); }); addEventListener("orientationchange", placeCal);
})();
/* LINH VẬT KHÔNG BỊ CẮT Ở MÀN CHỌN: nhiều tranh vẽ vượt khỏi viewBox 0 0 256 256 (tai thỏ cao hơn 25 đơn vị…) mà khung hero overflow:hidden → tai/mũ bị cắt phẳng.
   Mở rộng viewBox của bản SVG hero cho vừa trọn nét vẽ (tự co nhỏ đều, không dịch chuyển/biến hình); làm một lần cho mỗi SVG, theo dõi khi game đổi skin/vẽ lại. */
(function () {
  "use strict";
  var SEL = "#hHero svg,#paHero svg,#cwHero svg";
  function fit() {
    try {
      [].forEach.call(document.querySelectorAll(SEL), function (s) {
        if (s.getAttribute("data-vbfit")) return;
        var vb = (s.getAttribute("viewBox") || "").trim().split(/[\s,]+/).map(Number);
        if (vb.length !== 4 || vb[2] !== 256 || vb[3] !== 256) return;
        var b; try { b = s.getBBox(); } catch (e) { return; }
        if (!b || !b.width || !b.height) return;
        var t = Math.min(0, b.y) - 4, bt = Math.max(256, b.y + b.height) + 4, l = Math.min(0, b.x) - 4, r = Math.max(256, b.x + b.width) + 4;
        s.setAttribute("data-vbfit", "1");
        var vx = 0, vy = 0, vh = 256;
        if (t < -4.5 || bt > 260.5 || l < -4.5 || r > 260.5) {
          var w = r - l, h = bt - t, m = Math.max(w, h);   /* vuông, căn giữa: không đổi tỉ lệ khung */
          vx = l - (m - w) / 2; vy = t - (m - h) / 2; vh = m;
          s.setAttribute("viewBox", vx + " " + vy + " " + m + " " + m);
        }
        /* BÓNG THOẠI KHÔNG ĐÈ LINH VẬT: CSS kéo bóng chồng xuống khung hero --rt (mặc định 21,7% chiều cao) vì tưởng phần trên của tranh luôn trống; tranh có tai/mái che sát đỉnh thì bóng che mất.
           Đặt --rt = tỉ lệ khoảng trống THẬT phía trên nét vẽ của từng tranh (trừ một chút), bóng chỉ chồng vào phần trống */
        var hero = s.closest("#hHero,#paHero,#cwHero");
        if (hero) { var top = Math.max(0, Math.min(.217, (b.y - vy) / vh - .02)); hero.style.setProperty("--rt", top.toFixed(3)); }
      });
    } catch (e) {}
  }
  function go() { fit(); setInterval(fit, 1200); try { new MutationObserver(function () { setTimeout(fit, 30); }).observe(document.body, { childList: true, subtree: true }); } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
})();
