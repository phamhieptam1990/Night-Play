/* Kỹ năng Tiếng Việt + Tiếng Anh — dữ liệu Tiếng Việt: đọc hiểu, truyện văn học, sắp xếp đoạn văn.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var D = L.D;
    /* đọc hiểu: g = các lớp, t = đoạn, q = câu hỏi, a = đáp án (có TRONG đoạn), d = 3 đáp án nhiễu (KHÔNG có nghĩa đúng) */
    D.readVi = [
      { g: [1], t: "Em Lan có một con mèo. Con mèo tên là Mun.", q: "Con mèo tên là gì?", a: "Mun", d: ["Lan", "Mít", "Bông"] },
      { g: [1], t: "Sáng nay mẹ đưa em đi học. Em đi bằng xe đạp.", q: "Em đi học bằng gì?", a: "xe đạp", d: ["xe buýt", "ô tô", "xe máy"] },
      { g: [1, 2], t: "Trên cành cây có hai chú chim. Chúng hót rất vui.", q: "Trên cành có mấy chú chim?", a: "hai", d: ["một", "ba", "bốn"] },
      { g: [1], t: "Bố mua cho Nam một quả bóng đỏ.", q: "Quả bóng có màu gì?", a: "đỏ", d: ["xanh", "vàng", "trắng"] },
      { g: [2], t: "Chủ nhật, cả nhà em về quê thăm bà. Bà trồng rất nhiều rau và hoa trong vườn.", q: "Cả nhà về quê thăm ai?", a: "bà", d: ["ông", "cô", "dì"] },
      { g: [2], t: "Mai nuôi một chú cá nhỏ trong chiếc bình thủy tinh. Mỗi sáng, Mai cho cá ăn.", q: "Mỗi sáng Mai làm gì?", a: "cho cá ăn", d:
          ["tưới cây", "quét nhà", "đọc sách"] },
      { g: [2, 3], t: "Trời mưa to. Hà quên mang áo mưa nên bạn Tú cho Hà đi chung ô.", q: "Ai cho Hà đi chung ô?", a: "bạn Tú", d: ["mẹ", "cô giáo", "bạn Mai"] },
      { g: [3], t: "Con ong chăm chỉ bay từ hoa này sang hoa khác để hút mật. Nhờ vậy, những bông hoa được thụ phấn và kết thành quả.", q:
          "Ong bay từ hoa này sang hoa khác để làm gì?", a:
          "hút mật", d: ["bắt sâu", "làm tổ", "tìm nước"] },
      { g: [3], t: "Lớp em trồng một cây xanh ở sân trường. Mỗi ngày, các bạn thay phiên nhau tưới nước cho cây.", q: "Cây xanh được trồng ở đâu?", a:
          "sân trường", d: ["vườn nhà", "công viên", "trước cổng"] },
      { g: [4], t: "Mùa thu, bầu trời trong xanh và gió se lạnh. Lá vàng rơi đầy trên con đường làng. Các em nhỏ háo hức chuẩn bị đón Tết Trung thu.",
          q: "Các em nhỏ chuẩn bị đón dịp nào?",
          a: "Tết Trung thu", d: ["Tết Nguyên đán", "Giáng sinh", "ngày khai giảng"] },
      { g: [4], t: "Bác nông dân dậy từ sáng sớm để ra đồng cấy lúa. Dù nắng gắt, bác vẫn miệt mài làm việc đến khi mặt trời lặn.", q:
          "Bác nông dân làm việc đến khi nào?", a:
          "mặt trời lặn", d: ["trời sáng", "buổi trưa", "nửa đêm"] },
      { g: [5], t: "Thư viện trường em mở cửa từ bảy giờ ba mươi đến mười một giờ ba mươi mỗi buổi sáng. Học sinh được mượn tối đa hai cuốn sách trong một tuần.", q:
          "Mỗi học sinh được mượn tối đa mấy cuốn sách?", a: "hai cuốn", d: ["một cuốn", "ba cuốn", "năm cuốn"] },
      { g: [5], t: "Hà Nội là thủ đô của Việt Nam. Thành phố nổi tiếng với Hồ Gươm, Văn Miếu và những con phố cổ.", q:
          "Thành phố nào là thủ đô của Việt Nam?", a: "Hà Nội", d: ["Huế", "Đà Nẵng", "Cần Thơ"] },
      { g: [1], t: "Mẹ cho em một cái bánh. Em chia cho em gái một nửa.", q: "Em chia bánh cho ai?", a: "em gái", d: ["bố", "bà", "cô giáo"] },
      { g: [1], t: "Hôm nay trời mưa. Em mặc áo mưa đi học.", q: "Hôm nay trời thế nào?", a: "mưa", d: ["nắng", "gió to", "tuyết"] },
      { g: [1, 2], t: "Con chó nhà Nam tên là Vàng. Vàng rất thích chơi bóng.", q: "Con chó thích gì?", a: "chơi bóng", d: ["ăn cá", "ngủ", "bơi lội"] },
      { g: [2], t: "Sáng thứ Bảy, Lan cùng bố ra chợ mua cá. Bố chọn một con cá chép to.", q: "Bố chọn mua con gì?", a: "cá chép", d: ["cá thu", "con tôm", "con cua"] },
      { g: [2], t: "Ở sân trường có một cây phượng. Mùa hè, hoa phượng nở đỏ rực.", q: "Hoa phượng nở vào mùa nào?", a: "mùa hè", d: ["mùa đông",
          "mùa thu", "mùa xuân"] },
      { g: [2], t: "Em Na đang vẽ tranh. Em vẽ một ngôi nhà, một cái cây và một chú chim.", q: "Em Na đang làm gì?", a: "vẽ tranh", d: ["đọc sách", "hát", "nấu ăn"] },
      { g: [3], t: "Giờ ra chơi, các bạn nam đá bóng ở sân. Các bạn nữ nhảy dây dưới gốc cây.", q: "Các bạn nữ chơi trò gì?", a: "nhảy dây", d:
          ["đá bóng", "đuổi bắt", "cờ vua"] },
      { g: [3], t: "Bà ngoại em sống ở quê. Mỗi dịp hè, em về quê giúp bà cho gà ăn.", q: "Em giúp bà việc gì?", a: "cho gà ăn", d: ["quét nhà", "nấu cơm", "rửa bát"] },
      { g: [3], t: "Trường em có một thư viện nhỏ. Mỗi tuần, lớp em đến thư viện một lần để đọc sách.", q: "Lớp em đến thư viện mấy lần mỗi tuần?", a:
          "một lần", d: ["hai lần", "ba lần", "mỗi ngày"] },
      { g: [4], t: "Sông Hồng chảy qua Hà Nội. Nước sông mùa lũ đỏ phù sa, mùa cạn thì trong hơn.", q: "Nước sông mùa lũ đỏ vì có gì?", a: "phù sa",
          d: ["rác thải", "hoa đỏ", "sơn đỏ"] },
      { g: [4], t: "Chú ong thợ làm việc suốt ngày. Chú bay đi tìm mật hoa rồi mang về tổ để làm mật ong.", q: "Ong thợ mang gì về tổ?", a: "mật hoa",
          d: ["lá cây", "nước mưa", "hạt thóc"] },
      { g: [5], t: "Biển Việt Nam dài hơn ba nghìn cây số. Nhiều bãi biển đẹp thu hút khách du lịch mỗi năm.", q: "Điều gì thu hút khách du lịch?", a:
          "bãi biển đẹp", d: ["núi cao", "sa mạc", "tuyết trắng"] },
      { g: [5], t: "Nhờ chăm chỉ luyện tập, Minh đã đạt giải nhất cuộc thi chạy của trường. Minh nói đó là kết quả của nhiều buổi tập sáng sớm.", q:
          "Minh đạt giải nhờ điều gì?", a:
          "chăm chỉ luyện tập", d: ["may mắn", "đi học muộn", "nghỉ ngơi nhiều"] },
      {g: [1], t: "Nhà em có một cái ao. Trong ao có nhiều cá.", q: "Trong ao có gì?", a: "cá", d: ["tôm","ếch","vịt"]},
      {g: [1,2], t: "Chiều nay em giúp mẹ quét nhà. Mẹ khen em ngoan.", q: "Mẹ khen em thế nào?", a: "ngoan", d: ["lười","nhanh","giỏi"]},
      {g: [2,3], t: "Mùa xuân, hoa đào nở khắp nơi. Cả nhà em quây quần dọn dẹp để đón Tết.", q: "Mùa nào hoa đào nở?", a: "mùa xuân", d: ["mùa hạ",
          "mùa thu","mùa đông"]},
      {g: [3,4,5], t: "Con voi là loài vật to nhất trên cạn. Voi có chiếc vòi dài dùng để uống nước và lấy thức ăn.", q: "Voi dùng vòi để làm gì?", a:
          "uống nước", d: ["bay lên","đào hang","bắt cá"]},
      {g: [3,4], t: "Cây xanh hấp thụ khí các-bô-níc và thải ra khí ô-xi. Nhờ vậy, không khí quanh ta trong lành hơn.", q: "Cây xanh thải ra khí gì?",
          a: "ô-xi", d: ["ni-tơ","hơi nước","khói bụi"]},
      {g: [4,5], t: "Trái Đất quay quanh Mặt Trời một vòng hết một năm. Mặt Trăng quay quanh Trái Đất khoảng một tháng.", q:
          "Mặt Trăng quay quanh vật nào?", a: "Trái Đất", d: ["Mặt Trời","sao Hỏa","sao Kim"]},
      {g: [4,5], t: "Hà Nội là thủ đô của nước ta. Ở đây có Hồ Gươm, Văn Miếu và nhiều phố cổ. Mỗi năm, hàng triệu khách đến thăm.", q:
          "Thủ đô của nước ta là gì?", a: "Hà Nội", d: ["Huế",
          "Đà Nẵng","Hải Phòng"]},
      {g: [5], t: "Sông Mê Công chảy qua nhiều nước rồi đổ ra biển Đông. Ở Việt Nam, sông có tên là sông Cửu Long.", q: "Sông Mê Công đổ ra đâu?", a:
          "biển Đông", d: ["biển Tây","vịnh Bắc Bộ","hồ Ba Bể"]},
      {g: [4,5], t:
          "Làng em nằm bên một dòng sông hiền hòa. Sáng sớm, các bác nông dân ra đồng cấy lúa. Trưa đến, lũ trẻ rủ nhau tắm sông. Chiều về, khói bếp bay lên từ những mái nhà tranh. Đêm xuống, cả làng chìm trong tiếng ếch nhái. Em rất yêu quê hương mình.",
          q: "Sáng sớm, các bác nông dân làm gì?", a: "cấy lúa", d: ["tắm sông","nấu cơm","bắt ếch"]},
      {g: [4,5], t:
          "Làng em nằm bên một dòng sông hiền hòa. Sáng sớm, các bác nông dân ra đồng cấy lúa. Trưa đến, lũ trẻ rủ nhau tắm sông. Chiều về, khói bếp bay lên từ những mái nhà tranh. Đêm xuống, cả làng chìm trong tiếng ếch nhái. Em rất yêu quê hương mình.",
          q: "Lũ trẻ tắm sông vào lúc nào?", a: "trưa", d: ["sáng sớm","chiều","đêm"]},
      {g: [5], t:
          "Ong là loài côn trùng chăm chỉ. Mỗi con ong thợ bay đi tìm hoa để hút mật. Về tổ, chúng nhả mật vào các ngăn nhỏ. Ong chúa lo việc đẻ trứng cho đàn. Nhờ biết chia việc, cả đàn ong sống rất trật tự.",
          q: "Ong chúa lo việc gì?", a: "đẻ trứng", d: ["hút mật","xây tổ","tìm hoa"]}
    ];
    /* văn học: truyện ngắn + hỏi nhân vật / cảm xúc / thông điệp. Đáp án suy ra từ truyện, đáp án nhiễu mâu thuẫn với truyện */
    D.stories = [
      { g: [1, 2], t: "Thỏ con làm rơi củ cà rốt xuống suối. Sóc nhặt lên và trả lại cho Thỏ. Thỏ vui lắm và nói: “Cảm ơn bạn Sóc!”", q:
          "Sóc là người bạn như thế nào?", a: "tốt bụng", d:
          ["lười biếng", "tham lam", "nhút nhát"] },
      { g: [1, 2], t: "Thỏ con làm rơi củ cà rốt xuống suối. Sóc nhặt lên và trả lại cho Thỏ. Thỏ vui lắm và nói: “Cảm ơn bạn Sóc!”", q:
          "Thỏ cảm thấy thế nào khi được trả lại cà rốt?", a:
          "vui", d: ["giận", "sợ", "buồn"] },
      { g: [1, 2], t: "Gà con ham chơi, không chịu nghe lời mẹ. Gà con chạy ra xa, bị lạc đường. Gà con khóc và nhớ mẹ.", q: "Vì sao gà con bị lạc?",
          a: "không nghe lời mẹ", d:
          ["bị bạn đẩy", "mưa to quá", "đi học muộn"] },
      { g: [3, 4], t: "Mùa hè, Ve ca hát suốt ngày. Kiến chăm chỉ tha mồi về tổ. Đến mùa đông, Ve đói rét đến xin Kiến giúp.", q:
          "Vì sao mùa đông Ve bị đói?", a: "không dự trữ thức ăn", d:
          ["Kiến lấy hết thức ăn", "trời nắng quá", "Ve bị ốm"] },
      { g: [3, 4], t: "Mùa hè, Ve ca hát suốt ngày. Kiến chăm chỉ tha mồi về tổ. Đến mùa đông, Ve đói rét đến xin Kiến giúp.", q:
          "Câu chuyện khuyên chúng ta điều gì?", a:
          "chăm chỉ, biết lo xa", d: ["ca hát cả ngày", "đừng giúp bạn", "ngủ thật nhiều"] },
      { g: [3], t: "Trong giờ ra chơi, Nam thấy Lan bị ngã, đầu gối trầy xước. Nam vội đỡ Lan dậy và đưa bạn đến phòng y tế.", q:
          "Nam đã làm gì khi thấy Lan bị ngã?", a: "đỡ bạn dậy", d:
          ["bỏ đi chỗ khác", "cười bạn", "rủ bạn khác chơi"] },
      { g: [4, 5], t:
          "Quạ khát nước, tìm mãi mới thấy một chiếc bình. Nước ở đáy bình, mỏ Quạ không với tới. Quạ nghĩ ra cách nhặt từng viên sỏi thả vào bình. Nước dâng lên dần, Quạ uống được nước.",
          q: "Quạ đã làm gì để uống được nước?", a: "thả sỏi vào bình", d: ["đập vỡ bình", "chờ trời mưa", "nhờ bạn giúp"] },
      { g: [4, 5], t:
          "Quạ khát nước, tìm mãi mới thấy một chiếc bình. Nước ở đáy bình, mỏ Quạ không với tới. Quạ nghĩ ra cách nhặt từng viên sỏi thả vào bình. Nước dâng lên dần, Quạ uống được nước.",
          q: "Quạ là con vật như thế nào?", a: "thông minh, kiên trì", d: ["lười biếng", "nhút nhát", "hay khoe khoang"] },
      { g: [4], t:
          "Cô em Mai trồng một hạt đậu trong chậu nhỏ. Ngày nào Mai cũng tưới nước và đặt chậu ra chỗ nắng. Mấy hôm sau, mầm đậu nhú lên xanh mướt. Mai reo lên sung sướng.",
          q:
          "Điều gì làm Mai sung sướng?", a: "mầm đậu nhú lên", d: ["được đi chơi", "nhận quà", "được điểm mười"] },
      { g: [5], t:
          "Người thợ rèn già dạy cậu học trò: “Muốn rèn được con dao sắc, con phải kiên nhẫn đập sắt hết lần này đến lần khác.” Cậu em ban đầu nản chí nhưng rồi vẫn miệt mài luyện tập. Nhiều tháng sau, cậu rèn được con dao tốt.",
          q: "Câu chuyện muốn nói điều gì?", a: "kiên nhẫn sẽ thành công", d: ["làm nhanh là giỏi", "nên bỏ cuộc sớm", "dao quan trọng nhất"] },
      { g: [5], t:
          "Người thợ rèn già dạy cậu học trò: “Muốn rèn được con dao sắc, con phải kiên nhẫn đập sắt hết lần này đến lần khác.” Cậu em ban đầu nản chí nhưng rồi vẫn miệt mài luyện tập. Nhiều tháng sau, cậu rèn được con dao tốt.",
          q: "Lúc đầu, cậu học trò cảm thấy thế nào?", a: "nản chí", d: ["vui mừng", "tự hào", "tức giận"] },
      { g: [5], t:
          "Trong chuyến đi dã ngoại, cả lớp thấy một túi rác bị bỏ lại bên suối. Bạn Hà nói: “Chúng ta hãy nhặt rác để dòng suối luôn sạch.” Cả lớp cùng làm, chỉ một lúc, bờ suối đã sạch sẽ.",
          q: "Bạn Hà đề nghị điều gì?", a: "nhặt rác cho sạch suối", d: ["bỏ đi chỗ khác", "đổ thêm rác", "ngồi nghỉ ngơi"] },
      { g: [1, 2], t: "Vịt con thấy bạn Gà con bị mắc kẹt trong bụi cỏ. Vịt con kéo bạn ra. Gà con cười: “Cảm ơn bạn!”", q: "Vịt con đã làm gì?", a:
          "kéo bạn ra", d: ["bỏ đi", "cười bạn", "trốn mất"] },
      { g: [3, 4], t: "Hà quên làm bài tập nên rất lo lắng. Hà nói thật với cô giáo. Cô mỉm cười và cho Hà làm bù vào hôm sau.", q:
          "Hà đã làm điều gì đáng khen?", a: "nói thật với cô", d:
          ["nói dối cô", "chép bài bạn", "bỏ học"] },
      { g: [3, 4], t: "Hà quên làm bài tập nên rất lo lắng. Hà nói thật với cô giáo. Cô mỉm cười và cho Hà làm bù vào hôm sau.", q:
          "Câu chuyện khuyên điều gì?", a: "hãy luôn trung thực", d:
          ["đừng làm bài tập", "chép bài của bạn", "giấu lỗi của mình"] },
      { g: [4, 5], t: "Cậu em Nam thấy một chiếc ví rơi trên đường. Nam không giữ lại mà đem đến đồn công an. Người mất ví rất biết ơn Nam.", q:
          "Nam đã làm gì với chiếc ví?", a:
          "đem đến đồn công an", d: ["giữ lại cho mình", "vứt đi", "đưa cho bạn"] },
      { g: [4, 5], t: "Cậu em Nam thấy một chiếc ví rơi trên đường. Nam không giữ lại mà đem đến đồn công an. Người mất ví rất biết ơn Nam.", q:
          "Nam là người như thế nào?", a: "trung thực",
          d: ["tham lam", "lười biếng", "nhút nhát"] },
      {g: [3,4,5], t: "Sáng nay trời đen kịt, gió nổi mạnh. Mẹ vội thu quần áo phơi ngoài sân vào nhà.", q: "Vì sao mẹ vội thu quần áo?", a:
          "trời sắp mưa", d: ["trời sắp nắng",
          "nhà có khách","đến giờ ăn cơm"]},
      {g: [4,5], t: "Nam hứa sẽ về sớm giúp bà tưới rau. Nhưng chiều đó Nam mải đá bóng nên quên mất. Tối về, thấy luống rau héo, Nam rất áy náy.", q:
          "Nam cảm thấy thế nào khi thấy rau héo?", a: "áy náy", d: ["tự hào","hờ hững","vui sướng"]},
      {g: [1,2,3], t: "Bài thơ: Em có đôi bàn tay / Rửa sạch trước khi ăn / Em ngoan, em khỏe mạnh / Cả nhà đều vui lắm.", q:
          "Em rửa gì trước khi ăn?", a: "đôi bàn tay", d: ["đôi chân","khuôn mặt","bát đũa"]},
      {g: [3,4,5], t: "Bài thơ: Mặt trời dậy từ sớm / Gọi em thức dậy chơi / Hoa cười, chim hót vang / Ngày mới tới rồi thôi.", q:
          "Mặt trời gọi em làm gì?", a: "thức dậy", d: ["đi ngủ","ăn cơm","làm bài"]}
    ];
    /* sắp xếp câu thành đoạn: các câu ĐÚNG THỨ TỰ (có từ nối hoặc trình tự thời gian rõ) */
    D.paragraphs = [
      ["Đầu tiên, em rửa sạch rau.", "Sau đó, em cắt rau thành từng đoạn.", "Cắt xong, em cho rau vào nồi nấu.", "Cuối cùng, em múc canh ra bát."],
      ["Buổi sáng, em thức dậy và đánh răng.", "Sau đó, em ăn sáng cùng cả nhà.", "Rồi em đeo cặp đến trường.", "Chiều về, em làm bài tập."],
      ["Trước hết, bạn chuẩn bị giấy và bút màu.", "Sau đó, bạn vẽ hình ngôi nhà.", "Vẽ xong, bạn tô màu cho bức tranh.", "Cuối cùng, bạn ký tên vào góc tranh."],
      ["Hạt đậu được gieo xuống đất.", "Vài ngày sau, mầm đậu nhú lên.", "Mầm lớn dần thành cây non.", "Cuối cùng, cây ra hoa và kết quả."],
      ["Đầu tiên, em lấy cặp sách ra khỏi giá.", "Sau đó, em xếp sách vở theo thời khóa biểu.", "Xếp sách xong, em kiểm tra hộp bút.",
          "Cuối cùng, em đóng cặp và để gọn gàng."],
      ["Buổi sáng, bà ra vườn hái rau.", "Buổi trưa, bà nấu cơm cho cả nhà.", "Buổi chiều, bà ngồi khâu áo dưới hiên.", "Buổi tối, bà kể chuyện cho các cháu nghe."],
      ["Trước hết, chú thợ trộn vữa.", "Sau đó, chú xây từng hàng gạch.", "Xây xong, chú trát tường cho phẳng.", "Cuối cùng, chú quét sơn lên tường."],
      ["Sáng sớm, gà gáy báo trời sáng.", "Buổi trưa, nắng chiếu rực rỡ.", "Chiều đến, nắng nhạt dần.", "Tối đến, ánh trăng lên cao."],
      ["Sáng sớm, mặt trời mọc ở phía đông.", "Buổi trưa, nắng chiếu sáng gay gắt.", "Chiều tối, mặt trời lặn dần.", "Đêm đến, trăng sao lên cao."],
      ["Đầu tiên, em lấy bàn chải và kem đánh răng.", "Sau đó, em chải răng thật kĩ.", "Chải xong, em súc miệng bằng nước sạch.", "Cuối cùng, em cất bàn chải gọn gàng."]
    ];
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["data-vi-read"] = part;
})(typeof window !== "undefined" ? window : globalThis);
