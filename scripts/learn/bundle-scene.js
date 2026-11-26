#!/usr/bin/env node
/* Gộp các <script> của learn/story/scene.html thành vài tệp để ít request hơn.
   Chạy: node scripts/learn/bundle-scene.js   (sửa nguồn rồi chạy lại; sinh learn/story/bundle/*.js)
   Thứ tự = thứ tự cũ. ../voice.js dùng document.currentScript nên GIỮ riêng (không gộp). */
"use strict";
const fs = require("fs"), path = require("path");
const BASE = path.join(__dirname, "../../learn/story");
const OUT = path.join(BASE, "bundle");
const CORE_A = ["../slot.js", "../content/phrases.js", "../mascot-kit.js", "../mascot-fx.js", "../hint-texts.js",
  "../content/curriculum.js", "../content/bank.js", "../lang/data-vi.js", "../lang/data-vi-read.js", "../lang/data-en.js",
  "../lang/rules.js", "../lang/gen-base.js", "../lang/gen-vi.js", "../lang/gen-listen.js", "../lang/gen-en.js",
  "../lang/register.js", "../lang-skills.js", "../content/math5.js", "../engine/core.js", "../engine/gen-arith.js",
  "../engine/gen-geo.js", "../engine/gen-measure.js", "../engine/gen-fraction.js", "../engine/gen-g5.js",
  "../engine/topics.js", "../engine/progress.js", "../engine/round.js", "../engine/report.js", "../engine.js",
  "../content/qtypes-hi.js", "../content/write-topics.js", "../content/write-check.js", "../content/qtypes/core.js",
  "../content/qtypes/gen-basic.js", "../content/qtypes/gen-lang.js", "../content/qtypes/gen-more.js",
  "../content/qtypes.js", "../hint.js", "../path.js", "../content/lessons/index.js", "../content/lesson-en.js", "../content/lesson-en-g23.js", "../content/lesson-en-g45.js", "../content/parent-copy.js",
  "../limit.js"];
// (../voice.js nạp riêng giữa CORE_A và CORE_B)
const CORE_B = ["../farm.js", "../habit.js", "../adventure.js", "../content/buddies.js", "../glyph-a.js", "../buddy.js", "../album.js",
  "../lop/js/shape-buddies.js", "../lop/js/shape-defs.js", "js/sfx-ambient.js", "sfx.js"];
const APP = ["js/story-default.js", "js/core.js", "js/speaker-gate.js", "scene/js/strings.js", "scene/js/util.js",
  "scene/js/fx.js", "scene/js/voice.js", "scene/js/props.js", "scene/js/frame.js", "scene/js/kinds-learn-a.js",
  "scene/js/kinds-learn-b.js", "scene/js/kinds-learn-c.js", "scene/js/learn-flow.js", "scene/js/bank.js",
  "scene/js/kinds-test-pick.js", "scene/js/kinds-test-count.js", "scene/js/kinds-test-tiles.js",
  "scene/js/kinds-test-cards.js", "scene/js/kinds-test-input.js", "scene/js/kinds-test-draw.js", "scene/js/test-flow.js",
  "scene/js/end.js", "scene/js/boot.js"];
const BUNDLES = { "scene-core-a.js": CORE_A, "scene-core-b.js": CORE_B, "scene-app.js": APP };
fs.mkdirSync(OUT, { recursive: true });
Object.keys(BUNDLES).forEach(name => {
  const parts = BUNDLES[name].map(f => "/* ---- " + f + " ---- */\n" + fs.readFileSync(path.join(BASE, f), "utf8"));
  const txt = "/* SINH TỰ ĐỘNG bởi scripts/learn/bundle-scene.js — không sửa tay (sửa các tệp nguồn rồi chạy lại). */\n" + parts.join("\n;\n") + "\n;\n";
  fs.writeFileSync(path.join(OUT, name), txt);
  console.log("✓ bundle/" + name + " (" + BUNDLES[name].length + " tệp, " + txt.length + " byte)");
});
