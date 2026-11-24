"use strict";
const C = window.PARENT_COPY, E = window.LearnEngine, LL = window.LearnLimit, $ = id => document.getElementById(id);
let PG = (() => { try{ const c = +new URLSearchParams(location.search).get("grade"); return c >= 1 && c <= 5 ? c : 0; }catch(e){ return 0; } })();   /* ?grade=N: mặc định theo lớp bé đang học */
const ls = (k, v, s) => { try{ const st = s ? sessionStorage : localStorage; if(v === undefined) return st.getItem(k); st.setItem(k, v); }catch(e){} return null; };
const SUBJ = ["toan", "tviet", "tanh"], SF = {toan: "math", tviet: "vietnamese", tanh: "english"};
let lang = ls("lang") === "en" ? "en" : "vi";
try{ const u = new URLSearchParams(location.search).get("lang"); if(u === "vi" || u === "en") lang = u; }catch(e){}
let subj = ls("learn:subj"); if(SUBJ.indexOf(subj) < 0) subj = "toan";
const U = () => C.UI[lang], L = () => lang === "en" ? 1 : 0, esc = x => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
