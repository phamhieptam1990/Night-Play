/* Khu Chợ là môn TIẾNG ANH: tên quầy hiện bằng tiếng Anh (tên chủ đề gốc của chương trình là tiếng Việt). KC.enName(id, tênGốc). */
(function () {
  "use strict";
  const N = {
    "EN-G1-01": "Hello & Talk", "EN-G1-02": "Everyday Words", "EN-G1-03": "Sounds & Chat",
    "EN-G2-01": "Listen & Do", "EN-G2-02": "Say It Like Me", "EN-G2-03": "Word Topics",
    "EN-G3-01": "Listening", "EN-G3-02": "Speaking", "EN-G3-03": "Reading", "EN-G3-04": "Writing",
    "EN-G4-01": "Listening", "EN-G4-02": "Speaking", "EN-G4-03": "Reading", "EN-G4-04": "Writing",
    "EN-G5-01": "Listening", "EN-G5-02": "Speaking", "EN-G5-03": "Reading", "EN-G5-04": "Writing"
  };
  window.KC = window.KC || {};
  KC.enName = (id, fallback) => N[id] || fallback;
})();
