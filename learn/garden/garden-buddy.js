/* BÉ CHỌN BẠN LÀM VƯỜN lần đầu vào vườn: 3 nhân vật (Bác Rễ · Bạn trai · Bạn gái) × 2 độ tuổi (5-7 · 8-10), mỗi dáng có 5 cấp (shared/art/garden/mascot_gardener_*.svg).
   Chỉ là KIỂU HÌNH để bé thấy mình trong nhân vật; lưu trên máy ("gardenBuddy" = { w: chung|nam|nu, a: nho|lon }), không gửi đi đâu, không hỏi tên hay thông tin khác.
   Độ tuổi gợi ý sẵn theo lớp của bé (learn:grade: lớp 1-2 → 5-7 tuổi, lớp 3-5 → 8-10 tuổi). Đổi lại bất cứ lúc nào: bấm vào hình Bác Rễ trong bảng Chăm vườn.
   Xoá tiến độ KHÔNG xoá lựa chọn này (là sở thích, không phải tiến độ). */
var BUDDY_KEY = "gardenBuddy", BUDDY_W = { chung: "Bác Rễ", nam: "Bạn trai", nu: "Bạn gái" }, BUDDY_ICON = { chung: "🧔", nam: "👦", nu: "👧" };
function buddyGet(){ try { var o = JSON.parse(localStorage.getItem(BUDDY_KEY) || "null"); if(o && BUDDY_W[o.w] && (o.a === "nho" || o.a === "lon")) return o; } catch (e) {} return null; }
function buddyGradeAge(){ var g = 0; try { g = +localStorage.getItem("learn:grade") || 0; } catch (e) {} return g >= 3 ? "lon" : "nho"; }
function buddyNow(){ return buddyGet() || { w: "chung", a: buddyGradeAge() }; }
function buddySave(o){ try { localStorage.setItem(BUDDY_KEY, JSON.stringify({ w: o.w, a: o.a })); } catch (e) {} }
function buddyImg(w, a, lv){ return GardenLayout.ART + "mascot_gardener_" + w + "_" + a + "_l" + lv + ".svg"; }
var buddySel = null, buddyDone = null, buddyEl = null, buddyAgain = false;
function buddyRender(){
  var c = document.getElementById("buddyCard"), s = buddySel;
  c.innerHTML =
    "<h2>Chọn bạn làm vườn của em</h2>" +
    "<div class='bd-who' role='group' aria-label='Chọn bạn'>" + ["chung", "nam", "nu"].map(function(w){ return "<button type='button' class='bd-c" + (s.w === w ? " on" : "") + "' data-w='" + w + "' aria-pressed='" + (s.w === w) + "'><img src='" + buddyImg(w, s.a, 3) + "' alt=''><b>" + BUDDY_ICON[w] + " " + BUDDY_W[w] + "</b></button>"; }).join("") + "</div>" +
    (buddyAgain ? "<p class='bd-q'>Em mấy tuổi?</p><div class='bd-age' role='group' aria-label='Độ tuổi'><button type='button' data-a='nho' class='" + (s.a === "nho" ? "on" : "") + "' aria-pressed='" + (s.a === "nho") + "'>5–7 tuổi</button><button type='button' data-a='lon' class='" + (s.a === "lon" ? "on" : "") + "' aria-pressed='" + (s.a === "lon") + "'>8–10 tuổi</button></div>" : "") +
    "<button type='button' class='bd-ok' id='bdOk'>Chọn bạn này ✓</button>" +
    "<p class='bd-note'>" + (buddyAgain ? "<button type='button' class='bd-x' id='bdX'>Giữ như cũ</button>" : "Sau này em đổi lại được.") + "</p>";
  c.querySelectorAll(".bd-c").forEach(function(b){ b.onclick = function(){ buddySel.w = b.getAttribute("data-w"); buddyRender(); var o = document.getElementById("bdOk"); if(o) o.focus(); }; });
  c.querySelectorAll(".bd-age button").forEach(function(b){ b.onclick = function(){ buddySel.a = b.getAttribute("data-a"); buddyRender(); }; });
  document.getElementById("bdOk").onclick = function(){ buddySave(buddySel); closeBuddy(true); };
  var x = document.getElementById("bdX"); if(x) x.onclick = function(){ closeBuddy(false); };
}
function openBuddy(done, again){ buddyEl = document.getElementById("buddyov"); if(!buddyEl) { if(done) done(); return; } buddyDone = done || null; buddyAgain = !!again; buddySel = JSON.parse(JSON.stringify(buddyNow())); buddyRender(); buddyEl.classList.add("on"); document.getElementById("bdOk").focus(); }
function closeBuddy(saved){ if(buddyEl) buddyEl.classList.remove("on"); if(saved && typeof refreshUnlock === "function") refreshUnlock(false); var f = buddyDone; buddyDone = null; if(f) f(); }
