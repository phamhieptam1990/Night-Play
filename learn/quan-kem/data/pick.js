/* Chọn lớp cho quán: ?grade=N trên địa chỉ > learn:grade > 1; nạp tệp dữ liệu quán của lớp đó (shop-g<N>.js) rồi menu.js trộn phần chung. */
(function () {
  var g = 0; try { g = +new URLSearchParams(location.search).get("grade") || +localStorage.getItem("learn:grade") || 0; } catch (e) {}
  if (!(g >= 1 && g <= 5)) g = 1;
  window.QK_GRADE = g;
  document.write('<script src="data/shop-g' + g + '.js"><\/script>');
})();
