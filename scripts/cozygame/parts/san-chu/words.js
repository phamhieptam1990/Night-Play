/* Săn Chữ Ẩn — bộ từ chủ đề miễn phí "Trở lại trường": mỗi mục "TỪ:nghĩa", ngăn bằng dấu ;. Chủ đề Night Pass nằm ở server/pro/san-chu-words.js. */
const WORDS = (
  "BUS:xe buýt;DESK:bàn học;SCHOOL:trường;GAMES:trò chơi;RECESS:giờ ra chơi;LUNCH:bữa trưa;BELL:chuông;READ:đọc;FRIENDS:bạn bè;TEACHER:giáo viên;FUN:vui;MATH:toán;BOOK:sách;PENCIL:bút chì;CLASS:lớp học;STUDY:học bài;" +
  "PEN:bút mực;ERASER:cục tẩy;RULER:thước kẻ;BAG:cặp sách;NOTEBOOK:vở;CHALK:phấn;BOARD:bảng;LESSON:bài học;HOMEWORK:bài tập về nhà;EXAM:bài thi;TEST:kiểm tra;GRADE:điểm số;PUPIL:học sinh;STUDENT:sinh viên;" +
  "SCIENCE:khoa học;HISTORY:lịch sử;ART:mỹ thuật;MUSIC:âm nhạc;SPORT:thể thao;ENGLISH:tiếng Anh;WRITE:viết;DRAW:vẽ;PAINT:tô màu;SING:hát;JUMP:nhảy;RUN:chạy;PLAY:chơi;LEARN:học;THINK:suy nghĩ;ASK:hỏi;ANSWER:trả lời;" +
  "LISTEN:lắng nghe;SPEAK:nói;COUNT:đếm;SPELL:đánh vần;WORD:từ;LETTER:chữ cái;NUMBER:số;STORY:câu chuyện;POEM:bài thơ;PAGE:trang;COVER:bìa;GLUE:hồ dán;SCISSORS:cái kéo;PAPER:giấy;CRAYON:bút sáp màu;MARKER:bút lông;" +
  "FOLDER:cặp hồ sơ;LOCKER:tủ khóa;HALL:hành lang;GYM:phòng tập;LIBRARY:thư viện;CANTEEN:căng tin;YARD:sân trường;GATE:cổng;FLAG:lá cờ;CLOCK:đồng hồ;CALENDAR:lịch;MAP:bản đồ;GLOBE:quả địa cầu;" +
  "UNIFORM:đồng phục;SHOES:giày;SOCKS:tất;BOTTLE:chai nước;SNACK:đồ ăn vặt;APPLE:quả táo;SANDWICH:bánh mì kẹp;MILK:sữa;WATER:nước;BREAK:giờ nghỉ;GROUP:nhóm;TEAM:đội;CLUB:câu lạc bộ;PROJECT:dự án;" +
  "SMART:thông minh;KIND:tốt bụng;HELP:giúp đỡ;SHARE:chia sẻ;SMILE:nụ cười;HAPPY:vui vẻ;PROUD:tự hào;BRAVE:dũng cảm;QUIET:yên lặng;EARLY:sớm;LATE:muộn;NEW:mới;" +
  "MONDAY:thứ Hai;FRIDAY:thứ Sáu;WEEK:tuần;TERM:học kỳ;YEAR:năm học;PRIZE:giải thưởng;MEDAL:huy chương;CHAMP:nhà vô địch;REPORT:phiếu báo điểm;CHART:biểu đồ"
).split(";").map(s => s.split(":"));
