const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBOuLlFGbxi67Re84MguESalTT-O-IsGJs",

  authDomain: "thevariablegame.firebaseapp.com",

  databaseURL: "https://thevariablegame-default-rtdb.firebaseio.com",

  projectId: "thevariablegame",

  storageBucket: "thevariablegame.firebasestorage.app",

  messagingSenderId: "646873118503",

  appId: "1:646873118503:web:38cd1be48bd351443a5b02",

  measurementId: "G-0Q605WKXHH"

};

const PlayerState = {
  KEY_NICKNAME: "vg_nickname",
  KEY_STREAK: "vg_streak_cache",
  KEY_VISITED: "vg_has_visited",
  KEY_TUTORIAL_DONE: "vg_tutorial_done",
 
  getNickname() { return localStorage.getItem(this.KEY_NICKNAME); },
  setNickname(n) { localStorage.setItem(this.KEY_NICKNAME, n); },
  hasVisited() { return localStorage.getItem(this.KEY_VISITED) === "1"; },
  markVisited() { localStorage.setItem(this.KEY_VISITED, "1"); },
  tutorialDone() { return localStorage.getItem(this.KEY_TUTORIAL_DONE) === "1"; },
  markTutorialDone() { localStorage.setItem(this.KEY_TUTORIAL_DONE, "1"); },
  getStreakCache() {
    const raw = localStorage.getItem(this.KEY_STREAK);
    if (!raw) return { daily: 0, win: 0, lastPlayDate: null};
    return JSON.parse(raw);
  },
  setStreakCache(s) { localStorage.setItem(this.KEY_STREAK, JSON.stringify(s)); },
};

const BASIC_BLOCKLIST = atob("ZnVjayxzaGl0LGJpdGNoLG5pZ2dlcixuaWdnYSxmYWdnb3QsY3VudCxyZXRhcmQscmFwZSxzbHV0LHdob3Jl").split(",");
function looksCleanClientSide(name) {
    if (!name || typeof name !== "string") return false;
    if (name.trim().length < 3 || name.trim().length > 15) return false;
    const lower = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    return !BASIC_BLOCKLIST.some((bad) => lower.includes(bad));
}
