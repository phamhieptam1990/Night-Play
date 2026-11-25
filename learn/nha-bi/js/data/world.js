/* BỘ MÁY DỮ LIỆU: chọn thú theo LỚP (?grade=N → learn:grade → 3) rồi ghép phần CHUNG (khu nhà, trang phục, mini-game) với dữ liệu riêng của lớp (pet-g<N>.js).
   Mỗi lớp một thế giới: khoá lưu riêng (lớp 3 giữ khoá cũ "learn:nhabi:world" để không mất dữ liệu). Game thuần chơi, không dạy học. */
(function () {
  "use strict";
  function pickGrade() {
    var g = 0; try { g = +new URLSearchParams(location.search).get("grade"); } catch (e) {}
    if (!(g >= 1 && g <= 5)) { try { g = +localStorage.getItem("learn:grade"); } catch (e) { g = 0; } }
    return g >= 1 && g <= 5 && window.NB_PETS[g] ? g : 3;
  }
  var grade = pickGrade(), P = window.NB_PETS[grade];
  window.NB_DATA = {
    grade: grade, key: grade === 3 ? "learn:nhabi:world" : "learn:nhabi:world:" + grade, id: P.id, house: P.house,
    pet: P.pet, foods: P.foods, toys: P.toys, scene: P.scene || {}, start: P.start, say: P.say,
    /* khu của ngôi nhà: [id khu, việc chăm (care), tranh biểu tượng, cấp mở khoá (theo tình cảm)] */
    zones: [["living", "play", "ghe-sofa", 0], ["kitchen", "feed", "tu-lanh", 0], ["bath", "bath", "bon-tam", 0], ["bedroom", "sleep", "giuong-cun", 1], ["yard", "yard", "cay", 1]],
    /* trang phục: [tranh, cấp mở khoá, tên] */
    outfits: [["do-no", 1, "nơ"], ["mu-sinh-nhat", 2, "mũ"], ["kinh", 3, "kính"], ["vuong-mien", 4, "vương miện"]],
    /* mini-game: ngưỡng điểm cho từng bậc quà, khu chứa, số giây; perDay = số ván/ngày còn nhận đồ (sau đó vẫn chơi lấy sao) */
    mg: { stars: { th: [5, 10, 16, 22], zone: "yard", secs: 30 }, ball: { th: [8, 14, 20, 28], zone: "living", secs: 30 }, perDay: 6 }
  };
})();
