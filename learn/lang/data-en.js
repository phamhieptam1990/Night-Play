/* Kỹ năng Tiếng Việt + Tiếng Anh — dữ liệu Tiếng Anh: màu, số, chủ đề từ vựng, danh từ/động từ, câu hỏi, chào hỏi, đọc hiểu.
   Một phần của learn/lang-skills.js (nạp theo thứ tự trong trình duyệt, require trong Node); dùng đối tượng chung L. */
(function (root) {
  "use strict";
  function part(L) {
    var D = L.D;
    /* ====================== TIẾNG ANH ====================== */
    D.colors = [["🔴", "red"], ["🔵", "blue"], ["🟢", "green"], ["🟡", "yellow"], ["🟠", "orange"], ["🟣", "purple"], ["⚫", "black"], ["⚪", "white"], ["🟤", "brown"]];
    D.numWords = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen",
        "fifteen", "sixteen", "seventeen",
        "eighteen", "nineteen", "twenty"];
    D.tensWords = { 20: "twenty", 30: "thirty", 40: "forty", 50: "fifty", 60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety", 100: "one hundred" };
    D.themes = {
      body: [["👁️", "eye"], ["👂", "ear"], ["👃", "nose"], ["👄", "mouth"], ["✋", "hand"], ["🦶", "foot"], ["🦷", "tooth"], ["🦵", "leg"]],
      food: [["🍎", "apple"], ["🍌", "banana"], ["🍞", "bread"], ["🥛", "milk"], ["🍚", "rice"], ["🥚", "egg"], ["🍗", "chicken"], ["🍰", "cake"],
          ["🍦", "ice cream"], ["🍊", "orange"],
          ["🍇", "grapes"], ["🍕", "pizza"]],
      clothes: [["👕", "shirt"], ["👗", "dress"], ["👟", "shoes"], ["🧢", "cap"], ["🧦", "socks"], ["🧥", "jacket"], ["🩳", "shorts"], ["🧣", "scarf"]],
      school: [["✏️", "pencil"], ["📖", "book"], ["🎒", "bag"], ["📏", "ruler"], ["✂️", "scissors"], ["🖊️", "pen"], ["💻", "computer"]],
      weather: [["☀️", "sunny"], ["🌧️", "rainy"], ["☁️", "cloudy"], ["💨", "windy"], ["❄️", "snowy"], ["⛈️", "stormy"]],
      transport: [["🚗", "car"], ["🚌", "bus"], ["🚲", "bike"], ["✈️", "plane"], ["🚢", "ship"], ["🚂", "train"], ["🏍️", "motorbike"], ["🚁", "helicopter"]],
      animals: [["🐱", "cat"], ["🐶", "dog"], ["🐟", "fish"], ["🐦", "bird"], ["🐘", "elephant"], ["🐒", "monkey"], ["🐴", "horse"], ["🐮", "cow"]],
      nature: [["🌳", "tree"], ["🌸", "flower"], ["🌙", "moon"], ["⭐", "star"], ["🌈", "rainbow"], ["⛰️", "mountain"]],
      house: [["🛏️", "bed"], ["🪑", "chair"], ["🚪", "door"], ["🪟", "window"], ["🔑", "key"], ["🕒", "clock"]],
      family: [["👶", "baby"], ["👵", "grandmother"], ["👴", "grandfather"], ["👦", "boy"], ["👧", "girl"], ["👪", "family"]],
      toys: [["⚽", "ball"], ["🧸", "teddy bear"], ["🪁", "kite"], ["🎈", "balloon"], ["🤖", "robot"], ["🎮", "game"]]
    };
    D.meanings = [["cook", "đầu bếp"], ["nurse", "y tá"], ["library", "thư viện"], ["market", "chợ"], ["hospital", "bệnh viện"], ["garden", "vườn"],
        ["father", "bố"], ["mother", "mẹ"],
        ["grandmother", "bà"], ["grandfather", "ông"], ["teacher", "giáo viên"], ["student", "học sinh"], ["friend", "bạn"], ["school", "trường học"],
            ["doctor", "bác sĩ"], ["farmer",
        "nông dân"], ["run", "chạy"], ["jump", "nhảy"], ["swim", "bơi"], ["sing", "hát"], ["draw", "vẽ"], ["sleep", "ngủ"], ["read", "đọc"], ["write", "viết"]];
    D.aWords = ["dog", "pen", "bag", "table", "bike", "ruler", "car", "tree", "fish", "hat", "pencil", "school", "chair", "bed", "window", "door",
        "key", "house", "moon"];
    D.anWords = ["orange", "umbrella", "elephant", "ice cream", "ant", "owl", "eraser", "arm", "eye", "ear", "onion", "uncle", "island"];
    D.plurals = ["cat", "dog", "book", "bus", "box", "watch", "dish", "baby", "city", "child", "man", "woman", "foot", "tooth", "mouse", "pen", "bag",
        "class", "fox", "boy", "toy", "day",
        "bird", "flower", "star", "kiss", "bench", "wish", "puppy", "key", "house"];
    D.irregularPlural = { child: "children", man: "men", woman: "women", foot: "feet", tooth: "teeth", mouse: "mice" };
    /* chủ ngữ ngôi thứ ba số ít dùng động từ thêm -s/-es */
    D.verbs = { play: ["plays", "playing", "played"], watch: ["watches", "watching", "watched"], go: ["goes", "going", "went"], study: ["studies",
        "studying", "studied"], like: ["likes",
        "liking", "liked"], eat: ["eats", "eating", "ate"],
      wash: ["washes", "washing", "washed"], fly: ["flies", "flying", "flew"], have: ["has", "having", "had"], do: ["does", "doing", "did"], help:
          ["helps", "helping", "helped"], cook:
          ["cooks", "cooking", "cooked"], sing: ["sings", "singing", "sang"], swim: ["swims", "swimming", "swam"] };
    D.subj3 = ["He", "She", "My mother", "Nam", "The cat", "My teacher"];
    D.subjPl = ["They", "We", "I", "You", "My friends"];
    D.wh = [
      ["___ is your name?", "My name is Mai.", "What", ["Where", "Who", "When"]], ["___ are you from?", "I'm from Hue.", "Where", ["What", "Who",
          "How many"]], ["___ is that man?",
          "He is my uncle.", "Who", ["Where", "When", "How many"]],
      ["___ old are you?", "I'm nine.", "How", ["What", "Who", "Where"]], ["___ pencils do you have?", "Five.", "How many", ["What", "Who", "Where"]],
          ["___ do you get up?",
          "At six o'clock.", "What time", ["Where", "Who", "How many"]],
      ["___ do you like this book?", "Because it's funny.", "Why", ["Where", "Who", "What time"]], ["___ is your birthday?", "It's in May.", "When",
          ["Who", "Where", "How many"]],
          ["___ is she doing?", "She's reading.", "What", ["Where", "Who", "How old"]],
      ["___ is your favourite colour?", "It's blue.", "What", ["Where", "Who", "How many"]], ["___ do you live?", "In Hanoi.", "Where", ["What",
          "Who", "How old"]], ["___ is your teacher?",
          "Ms Lan.", "Who", ["Where", "What time", "How many"]], ["___ brothers do you have?", "Two.", "How many", ["Who", "Where", "What time"]]
    ];
    D.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    D.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    D.greetings = [
      ["Hello!", "Hi!", ["Goodbye!", "Thank you.", "Sorry."]], ["How are you?", "I'm fine, thanks.", ["My name is Nam.", "I'm nine.", "See you."]],
          ["What's your name?", "My name is Lan.",
          ["I'm fine, thanks.", "Goodbye!", "It's Monday."]],
      ["Thank you.", "You're welcome.", ["Good morning.", "I'm sorry.", "Goodbye."]], ["Goodbye!", "Bye! See you.", ["Hello!", "I'm fine.",
          "You're welcome."]], ["Good morning!",
          "Good morning!", ["Good night!", "Goodbye!", "Thank you."]],
      ["I'm sorry.", "That's OK.", ["You're welcome.", "Hello!", "Good night."]], ["How old are you?", "I'm eight.", ["I'm fine, thanks.",
          "My name is Nam.", "It's Monday."]],
          ["Nice to meet you.", "Nice to meet you, too.", ["Goodbye!", "I'm eight.", "You're welcome."]],
      ["Good night!", "Good night!", ["Good morning!", "Thank you.", "I'm eight."]], ["See you tomorrow!", "See you!", ["Hello!", "I'm fine.",
          "Sorry."]], ["Happy birthday!", "Thank you!",
          ["Goodbye!", "I'm sorry.", "See you."]]
    ];
    D.readEn = [
      { g: [3], t: "This is Tom. He is eight. He has a dog. The dog is brown.", q: "What colour is the dog?", a: "brown", d: ["black", "white", "yellow"] },
      { g: [3], t: "I like apples. My sister likes bananas. We eat fruit every day.", q: "What does the sister like?", a: "bananas", d: ["apples", "oranges", "grapes"] },
      { g: [3, 4], t: "Mai has a red bag. In the bag, there are two books and a pen.", q: "How many books are in the bag?", a: "two", d: ["one", "three", "four"] },
      { g: [4], t: "Lan gets up at six o'clock. She has breakfast at six thirty. She goes to school at seven.", q: "What time does Lan go to school?",
          a: "at seven", d: ["at six",
          "at six thirty", "at eight"] },
      { g: [4], t: "My house has a garden. There are many flowers in the garden. My mother waters them every morning.", q: "Who waters the flowers?",
          a: "My mother", d: ["My father",
          "My sister", "My grandmother"] },
      { g: [5], t: "On Sunday, Nam and his friends play football in the park. After that, they have ice cream. They go home at five o'clock.", q:
          "Where do they play football?", a:
          "in the park", d: ["at school", "at home", "in the garden"] },
      { g: [5], t: "It is rainy today, so we stay at home. I read a book and my brother draws pictures.", q: "What does the brother do?", a:
          "draws pictures", d: ["reads a book",
          "plays football", "watches TV"] },
      { g: [3], t: "I have a cat. Her name is Kitty. She likes milk.", q: "What does Kitty like?", a: "milk", d: ["fish", "bread", "rice"] },
      { g: [3], t: "It is Monday. I go to school. I have English class.", q: "What day is it?", a: "Monday", d: ["Sunday", "Friday", "Tuesday"] },
      { g: [3, 4], t: "Ben has two pencils and one ruler in his bag.", q: "How many pencils does Ben have?", a: "two", d: ["one", "three", "five"] },
      { g: [4], t: "My father is a driver. He drives a bus. He works every day.", q: "What does the father drive?", a: "a bus", d: ["a car", "a taxi", "a train"] },
      { g: [4], t: "Linh gets up at six. She washes her face and brushes her teeth. Then she has breakfast.", q:
          "What does Linh do after she brushes her teeth?", a: "has breakfast", d:
          ["goes to school", "plays games", "watches TV"] },
      { g: [5], t: "My town has a big park. In the park, there is a lake and many trees. Children like to play there after school.", q:
          "When do children play in the park?", a:
          "after school", d: ["in the morning", "at night", "on Sunday"] },
      { g: [5], t: "Tom's favourite subject is Science. He likes doing experiments. He wants to be a scientist.", q: "What does Tom want to be?", a:
          "a scientist", d: ["a teacher", "a doctor", "a farmer"] },
      { g: [5], t: "Last Saturday, Mai visited her grandmother. They cooked dinner together and watched a film.", q: "Who did Mai visit?", a:
          "her grandmother", d: ["her friend", "her teacher", "her aunt"] },
      {g: [3], t: "I have a ball. The ball is red. I play with my brother.", q: "What colour is the ball?", a: "red", d: ["blue","green","yellow"]},
      {g: [3,4], t: "It is Monday. Nam goes to school by bike. He has Maths and English today.", q: "How does Nam go to school?", a: "by bike", d:
          ["by bus","on foot","by car"]},
      {g: [4,5], t: "My family is small. There are four people: my father, my mother, my sister and me. We live in a big house in Hue.", q:
          "Where do they live?", a: "in Hue", d:
          ["in Hanoi","in Da Nang","in Hai Phong"]},
      {g: [4,5], t: "Linh wants to be a doctor. She studies hard and helps her friends. Every Saturday, she visits the hospital with her mother.", q:
          "What does Linh want to be?", a:
          "a doctor", d: ["a teacher","a singer","a cook"]},
      {g: [5], t: "Last Sunday, we visited my grandmother. She cooked fish soup for us. After lunch, we played chess in the garden.", q:
          "What did the grandmother cook?", a: "fish soup", d:
          ["chicken soup","fried rice","noodles"]},
      {g: [5], t: "The weather in Da Lat is cool all year. Many tourists go there in December because the flowers are beautiful.", q:
          "How is the weather in Da Lat?", a: "cool", d: ["hot","cold","rainy"]},
      {g: [5], t:
          "Mai lives in a small town. Every morning, she walks to school with her friend Lan. They have English on Monday and Wednesday. After school, they play badminton in the yard. On Sunday, Mai helps her mother cook dinner.",
          q: "When do they have English?", a: "Monday and Wednesday", d: ["Tuesday","Friday","every day"]},
      {g: [5], t:
          "Mai lives in a small town. Every morning, she walks to school with her friend Lan. They have English on Monday and Wednesday. After school, they play badminton in the yard. On Sunday, Mai helps her mother cook dinner.",
          q: "What do they play after school?", a: "badminton", d: ["football","chess","volleyball"]}
    ];
  }
  if (typeof module !== "undefined" && module.exports) module.exports = part; else (root.LearnLangParts = root.LearnLangParts || {})["data-en"] = part;
})(typeof window !== "undefined" ? window : globalThis);
