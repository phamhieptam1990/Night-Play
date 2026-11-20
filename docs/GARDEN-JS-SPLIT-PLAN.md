# Kế hoạch tách JS của Vườn Học Vui (bàn giao cho phiên sau)

**Yêu cầu của chủ site:** tách JS theo **từng chức năng, mỗi chức năng một tệp** cho dễ quản lý và sửa; **một tệp điều phối (engine)** là đủ.

**Hiện trạng:** toàn bộ JS của trang vườn tương tác nằm trong MỘT khối `<script>` (khoảng 43.000 ký tự, 162 dòng, 81 câu lệnh cấp cao nhất) bên trong chuỗi mẫu của [scripts/learn/gen-scene-art.js](../scripts/learn/gen-scene-art.js) (từ dòng `<script>` khoảng 669 đến `</script></body></html>` khoảng 830, biến `html2`). Trang sinh ra: `shared/art/garden/preview-garden-play.html`.

**Chưa làm gì trong code.** Đã commit mọi tính năng trước đó và đã push (`f1b4102`).

## Cách làm (không dùng module, dùng script thường chung phạm vi toàn cục)
1. Mỗi tệp chỉ chứa **định nghĩa** (function, var). Việc chạy lúc tải trang (tạo ô, gắn sự kiện, khởi động) gói vào hàm `init...()`.
2. `learn/garden/garden-engine.js` là tệp **duy nhất** gọi: `initLevels`... theo đúng thứ tự (xem dưới), chạy khi DOM sẵn sàng.
3. Bộ sinh `gen-scene-art.js`: (a) ghi `shared/art/garden/garden-data.js` chứa dữ liệu mẫu (dòng `var CATS = ... W = 1280, H = 880;` và `var SLOTS = ..., DOOR = [150, 800];`), (b) thay khối `<script>...</script>` bằng các thẻ `<script src>` theo thứ tự tải.
4. Các tệp JS tách ra là **mã viết tay** (không sinh); chỉ `garden-data.js` là sinh.

## Bản đồ tệp (theo chỉ số câu lệnh khi phân tích bằng esprima; dùng `esprima` có sẵn ở thư mục tạm, hoặc tự cắt tay)
| Tệp (`learn/garden/`) | Nội dung | Gói vào init |
|---|---|---|
| `garden-data.js` (SINH, `shared/art/garden/`) | CATS, CI, PLOTS, IDS, ST, W, H, SLOTS, DOOR | không |
| `garden-core.js` | `stage, tip, ov, card, toastEl, cur, lastFocus`, `toast`, `bumpNum`, `mkFx` | không |
| `garden-levels.js` | `LVS, LV`, `applyLv` | `initLevels` (nạp LV từ localStorage, gắn nút cấp, `applyLv(LV)`) |
| `garden-plots.js` | `SN, ths, stg, icon, mins, reward, badge` | `initPlots` (tạo vùng bấm các ô) |
| `garden-tooltip.js` | `placeTip, showTip, hideTip` | không |
| `garden-popup.js` | `closeCard, skin, bindTabs, speakCard, stopSpeak, showCardH` | không |
| `garden-plant-card.js` | `openCard, masB` | không |
| `garden-missions.js` | `DAYS, getDaily, saveDaily, MIS, renderMis, doneMis` | `initMissions` (`renderMis()`) |
| `garden-events.js` | `HURT, EV, CHEER, clearEv, evBanner, startEv, openRescue` | `initEvents` (nút sự kiện) |
| `garden-fx.js` | `fxHarvest, fxPlant` | không |
| `garden-animals.js` | `AVB, ANAME, ACLS, ALOCK, ASC, savedA, aPos, aLayout, aMove, openAnimal, openStable`, `zzz` | `initAnimals` (nạp savedA, tạo vật nuôi, zzz, nút chuồng) |
| `garden-time.js` | `PHASE, curPhase, PIMG, phaseNow, setPhase` | `initTime` (nút giờ, `setPhase("auto", true)`, interval) |
| `garden-buildings.js` | `BLD` | `initBuildings` (tạo vùng bấm nhà/kho/ao) |
| `garden-menu.js` | `mnov, openMn, closeMn` | `initMenu` (nút 📅 ☰, đóng bằng nền/Esc) |
| `garden-engine.js` | điều phối | gọi theo thứ tự |

## Thứ tự tải thẻ `<script src>`
data → core → levels → plots → tooltip → popup → plant-card → missions → events → fx → animals → time → buildings → menu → engine.

## Thứ tự khởi động trong engine (giữ đúng như bản gốc để không đổi lớp xếp chồng)
`initPlots → initAnimals → initTime → initBuildings → initMissions → initEvents → initLevels → initMenu`.

## Kiểm thử sau khi tách (đã có sẵn trong thư mục tạm của phiên trước, viết lại nếu mất)
Chạy trang bằng Chrome và kiểm: không lỗi trang; 55+ vùng ô; 44 vật nuôi; thu hoạch và trồng (cả cây lâu năm) tăng/giảm số ở góc; đổi giờ thì vật nuôi vào/ra chuồng; mở popup cây (3 tab), menu (5 tab), cứu vườn; bấm nhà/kho/ao; tooltip trong khung. Rồi `node scripts/cozygame/check.js --learn`.

## Lưu ý
- Hàm gọi nhau lúc chạy nên không cần thứ tự giữa các tệp, **trừ** các `var` khởi tạo phụ thuộc nhau lúc tải (xem bảng).
- Có biểu thức chính quy bị mất dấu `\` nếu viết lại trong chuỗi mẫu; sau khi chuyển sang tệp JS thật thì dùng bình thường.
- Quy tắc dự án: không push khi chưa được yêu cầu; kiểm tra bằng Chrome thật trước khi báo xong.
