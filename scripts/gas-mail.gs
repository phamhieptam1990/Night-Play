/* Google Apps Script gửi mail OTP cho Night Play (đăng nhập Gmail nightplay.support@gmail.com).
   Cài đặt: script.google.com > Dự án mới > dán file này > Cài đặt dự án > Thuộc tính tập lệnh: thêm SECRET = <chuỗi ngẫu nhiên dài>
   > Triển khai > Ứng dụng web: Thực thi bằng "Tôi", Ai có quyền truy cập "Bất kỳ ai" > lấy URL (kết thúc bằng /exec). */
function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents || "{}");
    var secret = PropertiesService.getScriptProperties().getProperty("SECRET");
    if (!secret || d.secret !== secret) return out({ ok: false, error: "forbidden" });
    var to = String(d.to || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || to.length > 120) return out({ ok: false, error: "bad_to" });
    if (MailApp.getRemainingDailyQuota() < 1) return out({ ok: false, error: "quota" });
    var text = String(d.text || "").slice(0, 2000);
    MailApp.sendEmail({ to: to, subject: String(d.subject || "Night Play").slice(0, 120), body: text,
      name: String(d.name || "Night Play").slice(0, 40), noReply: true });
    return out({ ok: true });
  } catch (err) { return out({ ok: false, error: "err" }); }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
