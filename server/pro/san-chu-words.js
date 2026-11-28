"use strict";
/* Từ bổ sung cho 4 chủ đề Night Pass của Săn Chữ Ẩn (nối thêm vào danh sách trong san-chu-an.js). Mỗi mục "TỪ:nghĩa" ngăn bằng ;. Chỉ A-Z, không dấu cách. */
const P = s => s.split(";").map(x => x.split(":"));
module.exports = {
  zoo: P("BEAR:gấu;WOLF:chó sói;FOX:cáo;DEER:nai;RHINO:tê giác;HIPPO:hà mã;GORILLA:khỉ đột;LEOPARD:báo hoa mai;CHEETAH:báo săn;OTTER:rái cá;SEAL:hải cẩu;PARROT:vẹt;FLAMINGO:hồng hạc;PEACOCK:công;OWL:cú mèo;" +
    "PENGUIN:chim cánh cụt;OSTRICH:đà điểu;KANGAROO:chuột túi;SLOTH:lười;LEMUR:vượn cáo;BISON:bò rừng;BUFFALO:trâu;YAK:bò Tây Tạng;GOAT:dê;SHEEP:cừu;DONKEY:lừa;PIG:heo;COW:bò;" +
    "TURTLE:rùa;CROCODILE:cá sấu;LIZARD:thằn lằn;FROG:ếch;TOAD:cóc;BAT:dơi;MOUSE:chuột;RABBIT:thỏ;SQUIRREL:sóc;HEDGEHOG:nhím;BADGER:lửng;BEAVER:hải ly;RACCOON:gấu mèo;SKUNK:chồn hôi;" +
    "SWAN:thiên nga;DUCK:vịt;GOOSE:ngỗng;ROOSTER:gà trống;HAWK:diều hâu;VULTURE:kền kền;TOUCAN:chim toucan;PIGEON:bồ câu;CRANE:sếu;STORK:cò;HYENA:linh cẩu;JAGUAR:báo đốm;PUMA:báo sư tử"),
  food: P("RICE:cơm;SOUP:súp;EGG:trứng;MEAT:thịt;FISH:cá;BEEF:thịt bò;PORK:thịt heo;CHICKEN:thịt gà;SHRIMP:tôm;TOFU:đậu phụ;BEAN:đậu;CORN:ngô;POTATO:khoai tây;CARROT:cà rốt;TOMATO:cà chua;" +
    "ONION:hành;GARLIC:tỏi;GINGER:gừng;PEPPER:tiêu;SALT:muối;SUGAR:đường;HONEY:mật ong;BUTTER:bơ;CREAM:kem tươi;YOGURT:sữa chua;COFFEE:cà phê;TEA:trà;COCOA:ca cao;SODA:nước ngọt;" +
    "BANANA:chuối;ORANGE:cam;MANGO:xoài;GRAPE:nho;LEMON:chanh;PEACH:đào;MELON:dưa;BERRY:quả mọng;COCONUT:dừa;PAPAYA:đu đủ;LYCHEE:vải;PINEAPPLE:dứa;PUDDING:bánh pudding;COOKIE:bánh quy;" +
    "BURGER:bánh kẹp thịt;TACO:bánh taco;PASTA:mì Ý;WAFFLE:bánh waffle;PANCAKE:bánh kếp;DONUT:bánh vòng;MUFFIN:bánh muffin;POPCORN:bắp rang;CEREAL:ngũ cốc;TOAST:bánh mì nướng;CURRY:cà ri"),
  space: P("SUN:mặt trời;VENUS:sao Kim;JUPITER:sao Mộc;SATURN:sao Thổ;URANUS:sao Thiên Vương;NEPTUNE:sao Hải Vương;MERCURY:sao Thủy;PLUTO:sao Diêm Vương;COSMOS:vũ trụ;SPACE:không gian;" +
    "ASTRONAUT:phi hành gia;SHUTTLE:tàu con thoi;SATELLITE:vệ tinh;TELESCOPE:kính thiên văn;CRATER:miệng hố;METEOR:sao băng;ASTEROID:tiểu hành tinh;NEBULA:tinh vân;SOLAR:thuộc mặt trời;LUNAR:thuộc mặt trăng;" +
    "ECLIPSE:nhật thực;GRAVITY:trọng lực;LIGHT:ánh sáng;BEAM:chùm tia;STARDUST:bụi sao;CONSTELLATION:chòm sao;UNIVERSE:vũ trụ;SKY:bầu trời;NIGHT:ban đêm;DAWN:bình minh;DUSK:hoàng hôn;" +
    "HELMET:mũ bảo hộ;SUIT:bộ đồ;CAPSULE:khoang tàu;LAUNCH:phóng;LANDER:tàu đổ bộ;ROVER:xe tự hành;PROBE:tàu thăm dò;STATION:trạm vũ trụ;MISSION:nhiệm vụ;COUNTDOWN:đếm ngược;ENGINE:động cơ;" +
    "SPIN:quay;FLOAT:lơ lửng;GLOW:phát sáng;SHINE:chiếu sáng;MARS:sao Hỏa;ROBOT:người máy;UFO:đĩa bay;BLACKHOLE:hố đen;PULSAR:sao xung;QUASAR:chuẩn tinh"),
  sea: P("OCEAN:đại dương;BEACH:bãi biển;SAND:cát;SALT:muối biển;TIDE:thủy triều;REEF:rạn san hô;ISLAND:hòn đảo;CAVE:hang động;ANCHOR:mỏ neo;SHIP:con tàu;SAIL:buồm;PIRATE:cướp biển;TREASURE:kho báu;" +
    "DOLPHIN:cá heo;OTTER:rái cá;WALRUS:hải mã;SEAHORSE:cá ngựa;JELLYFISH:sứa;STARFISH:sao biển;LOBSTER:tôm hùm;CLAM:nghêu;OYSTER:hàu;SNAIL:ốc;EEL:lươn biển;RAY:cá đuối;TUNA:cá ngừ;SALMON:cá hồi;" +
    "SHRIMP:tôm;SEAWEED:rong biển;KELP:tảo bẹ;PLANKTON:sinh vật phù du;MERMAID:nàng tiên cá;DIVER:thợ lặn;SNORKEL:ống thở;FLIPPER:chân vịt;BUBBLE:bong bóng;SPLASH:té nước;DIVE:lặn;SWIM:bơi;FLOAT:nổi;" +
    "BOAT:thuyền;CANOE:xuồng;PORT:cảng;HARBOR:bến cảng;LIGHTHOUSE:ngọn hải đăng;CURRENT:dòng hải lưu;STORM:bão;FOAM:bọt biển;PEBBLE:viên sỏi;NARWHAL:kỳ lân biển;ORCA:cá voi sát thủ")
};
