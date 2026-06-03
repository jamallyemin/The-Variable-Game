(function () {
'use strict';

const editor    = document.getElementById('code-editor');
const lineNums  = document.getElementById('line-numbers');
const lineCount = document.getElementById('line-count-display');
const rulesList = document.getElementById('rules-list');
const progress  = document.getElementById('rules-progress');
const timerEl   = document.getElementById('timer-display');
const saveBtn   = document.getElementById('save-btn');
const winScreen = document.getElementById('success-srceen');

let shown = 1, secs = 45, dead = false, tick = null, shred = null;

// parser 
// only cares about name = value lines. skips comments, blanks, anything weird.
// three formats: number, quoted string, list (inline or split across lines).

function parse(src) {
    const w = { strings: {}, numbers: {}, lists: {}, variables: {} };
    const lines = src.replace(/\r/g, '').split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();
        if (!line || line[0] === '#') { i++; continue; }

        try {
            // multi line list
            let m = line.match(/^([A-Za-z_]\w*)\s*=\s*\[\s*$/);
            if (m) {
                const key = m[1], items = [];
                for (i++; i < lines.length; i++) {
                    const cur = lines[i].trim();
                    if (cur === ']' || cur === '],') break;
                    const q = cur.match(/^["']([^"']*)["']\s*,?$/);
                    if (q) items.push(q[1]);
                }
                set(w, 'list', key, items);
                i++; continue;
            }

            // number
            m = line.match(/^([A-Za-z_]\w*)\s*=\s*(-?\d+(?:\.\d+)?)\s*$/);
            if (m) { set(w, 'num', m[1], Number(m[2])); i++; continue; }

            // string
            m = line.match(/^([A-Za-z_]\w*)\s*=\s*["']([^"']*)["']\s*$/);
            if (m) { set(w, 'str', m[1], m[2]); i++; continue; }

            // inline list
            m = line.match(/^([A-Za-z_]\w*)\s*=\s*\[(.*)\]\s*$/);
            if (m) {
                const items = [], re = /["']([^"']*)["']/g;
                let h;
                while ((h = re.exec(m[2]))) items.push(h[1]);
                set(w, 'list', m[1], items);
            }
        } catch (_) {}

        i++;
    }
    return w;
}

function set(w, type, key, val) {
    if (type === 'num')  w.numbers[key]  = val;
    if (type === 'str')  w.strings[key]  = val;
    if (type === 'list') w.lists[key]    = val;
    w.variables[key] = val;
}



function prime(n) {
    if (!Number.isInteger(n) || n < 2) return false;
    for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
}

const flist = w => { const k = Object.keys(w.lists); return k.length ? w.lists[k[0]] : null; };
const nsum  = w => Object.values(w.numbers).reduce((a, b) => a + b, 0);


// s

const rules = [
    { id:1,  text:'Create at least one variable.',
      check: w => Object.keys(w.variables).length >= 1 },

    { id:2,  text:'Create a string variable.',
      check: w => Object.keys(w.strings).length >= 1 },

    { id:3,  text:'Create a numeric variable.',
      check: w => Object.keys(w.numbers).length >= 1 },

    { id:4,  text:'Sum of all numbers must equal 50.',
      supersededBy:18, check: w => nsum(w) === 50 },

    { id:5,  text:'Create a list variable.',
      check: w => Object.keys(w.lists).length >= 1 },

    { id:6,  text:'The list must contain exactly 3 items.',
      check: w => { const l = flist(w); return !!(l && l.length === 3); } },

    { id:7,  text:'The longest variable name must be exactly 6 letters.',
      supersededBy:23,
      check: w => {
          const ns = Object.keys(w.variables);
          return ns.length > 0 && Math.max(...ns.map(n => n.length)) === 6;
      }},

    { id:8,  text:'At least one variable name must contain no vowels.',
      check: w => Object.keys(w.variables).some(n => !/[aeiou]/i.test(n)) },


    { id:9,  text:'The largest number must be prime.',
      check: w => { const v = Object.values(w.numbers); return v.length > 0 && prime(Math.max(...v)); } },

    { id:10, text:'There must be exactly 2 numeric variables.',
      check: w => Object.keys(w.numbers).length === 2 },

    { id:11, text:'All list items must be unique.',
      check: w => { const l = flist(w); return !!(l && new Set(l).size === l.length); } },

    { id:12, text:'The shortest string value must contain the letter "x".',
      check: w => {
          const v = Object.values(w.strings);
          return v.length > 0 && /x/i.test(v.slice().sort((a,b) => a.length - b.length)[0]);
      }},

    { id:13, text:'Combined length of all string values must equal 12.',
      check: w => Object.values(w.strings).reduce((t, s) => t + s.length, 0) === 12 },

    { id:14, text:'Every variable name must start with a unique letter.',
      check: w => {
          const ns = Object.keys(w.variables);
          return new Set(ns.map(n => n[0].toLowerCase())).size === ns.length;
      }},

    { id:15, text:'One number must equal the length of some variable name.',
      check: w => {
          const nums = Object.values(w.numbers), names = Object.keys(w.variables);
          return nums.some(v => names.some(n => n.length === Math.abs(v)));
      }},

    { id:16, text:'No number or string value may contain the digit 7.',
      supersededBy:7,
      check: w => !Object.values(w.numbers).some(n => String(n).includes('7'))
               && !Object.values(w.strings).some(s => s.includes('7')) },

    { id:17, text:'The largest number must still be prime.',
      check: w => { const v = Object.values(w.numbers); return v.length > 0 && prime(Math.max(...v)); } },

    { id:18, text:'Sum of all numbers must now equal 75.',
      check: w => nsum(w) === 75 },

    { id:19, text:'List items must be sorted alphabetically.',
      check: w => { const l = flist(w); return !!l && l.join('|') === [...l].sort().join('|'); } },

    { id:20, text:'Exactly one string value must be a palindrome.',
      check: w => Object.values(w.strings)
                     .filter(s => s.length > 0 && s === [...s].reverse().join('')).length === 1 },

    { id:21, text:'The average of all numbers must equal 37.5.',
      check: w => { const v = Object.values(w.numbers); return v.length > 0 && nsum(w)/v.length === 37.5; } },

    { id:22, text:'Total variable count must equal exactly 6.',
      check: w => Object.keys(w.variables).length === 6 },

    { id:23, text:'One variable name must be exactly 8 letters long.',
      check: w => Object.keys(w.variables).some(n => n.length === 8) },

    { id:24, text:'Total characters across all variable names must equal 30.',
      check: w => Object.keys(w.variables).reduce((t, n) => t + n.length, 0) === 30 },


    { id:25, text:'All active rules must pass simultaneously.', check: () => true }
];

const live = r => !r.supersededBy || shown < r.supersededBy;

//

function buildRules() {
    rulesList.innerHTML = '';
    rules.forEach(r => {
        const li = document.createElement('li');
        li.className = 'rule-item';
        li.id = 'rule-' + r.id;
        li.innerHTML = '<div class="rule-num">' + r.id + '</div>'
            + '<div class="rule-body"><div class="rule-text">' + r.text + '</div>'
            + '<div class="rule-status">LOCKED</div></div>';
        rulesList.appendChild(li);
    });
}

function updateLines() {
    const n = editor.value.split('\n').length;
    lineCount.textContent = 'Lines: ' + n;
    lineNums.textContent  = Array.from({length: n}, (_, i) => i + 1).join('\n');
}



function run() {
    if (dead) return;
    const w = parse(editor.value);
    let ok = 0;

    rules.forEach(r => {
        const el = document.getElementById('rule-' + r.id);
        if (!el || r.id > shown) return;
        el.classList.add('visible');

        let pass;
        if (!live(r)) {
            pass = true;
        } else if (r.id === 25) {
            pass = rules.filter(x => x.id < 25).every(x => !live(x) || x.check(w));
        } else {
            try { pass = r.check(w); } catch(_) { pass = false; }
        }

        const badge = el.querySelector('.rule-status');
        el.classList.toggle('passed', pass);
        el.classList.toggle('failed', !pass);
        badge.textContent = pass ? (live(r) ? '✓ SATISFIED' : '✓ SUPERSEDED') : '✗ NOT MET';
        if (pass) ok++;
    });

;
    if (shown < rules.length) {
        const allPass = rules.slice(0, shown).every(r => !live(r) || (() => {
            try { return r.check(w); } catch(_) { return false; }
        })());
        if (allPass) { shown++; run(); return; }
    }

    progress.textContent = ok + ' / ' + rules.length;
    if (shown === rules.length && rules.every(r => !live(r) || r.check(w))) win();
}

function win() {
    dead = true;
    clearInterval(tick);
    clearInterval(shred);
    shred = null;
    editor.classList.remove('destroying');
    winScreen && winScreen.classList.remove('hidden');
}


function drawTimer() {
    timerEl.textContent = secs;
    timerEl.classList.toggle('urgent', secs <= 15);
}

function startShredding() {
    if (shred || dead) return;
    editor.classList.add('destroying');
    shred = setInterval(() => {
        const lines = editor.value.split('\n');
        editor.value = lines.length > 1 ? lines.slice(0, -1).join('\n') : '';
        updateLines();
        run();
    }, 1000);
}

function save() {
    if (dead) return;
    secs = 45;
    clearInterval(shred); shred = null;
    editor.classList.remove('destroying');
    saveBtn.classList.add('flash');
    setTimeout(() => saveBtn.classList.remove('flash'), 300);
    drawTimer();
}

tick = setInterval(() => {
    if (dead) return;
    if (--secs <= 0) { secs = 0; startShredding(); }
    drawTimer();
}, 1000);


editor.addEventListener('input',  () => { updateLines(); run(); });
editor.addEventListener('scroll', () => { lineNums.scrollTop = editor.scrollTop; });
editor.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const s = editor.selectionStart;
    editor.value = editor.value.slice(0, s) + '    ' + editor.value.slice(editor.selectionEnd);
    editor.selectionStart = editor.selectionEnd = s + 4;
    updateLines(); run();
});
saveBtn.addEventListener('click', save);

buildRules(); updateLines(); drawTimer(); run();

})();