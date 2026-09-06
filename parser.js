// reads player code and turns it into { names, numbers, strings, list }
// supports: name = 42 / name = "hi" / name = ["a","b"] (multiline lists too)
(function (root) {
  function parseCode(code) {
    const names = [];
    const numbers = [];
    const strings = [];
    const list = [];

    // collapse multiline list assignments onto one line before splitting
    const collapsed = code.replace(/=\s*\[[^\]]*\]/gs, (m) => m.replace(/\s+/g, " "));
    const lines = collapsed.split("\n");

    for (let raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;

      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
      if (!match) continue;
      const [, name, valueRaw] = match;
      const value = valueRaw.trim();

      if (/^-?\d+(\.\d+)?$/.test(value)) {
        names.push(name);
        numbers.push(parseFloat(value));
      } else if (/^"(.*)"$/.test(value) || /^'(.*)'$/.test(value)) {
        names.push(name);
        strings.push(value.slice(1, -1));
      } else if (/^\[.*\]$/.test(value)) {
        names.push(name);
        const inner = value.slice(1, -1).trim();
        if (!inner) {
          list.push([]);
        } else {
          const items = [];
          for (const part of inner.split(",")) {
            const t = part.trim();
            items.push(/^-?\d+(\.\d+)?$/.test(t) ? parseFloat(t) : t.replace(/^["']|["']$/g, ""));
          }
          list.push(items);
        }
      }
      // anything else just gets skipped
    }

    return { names, numbers, strings, list };
  }

  const api = { parseCode };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CodeParser = api;
})(typeof window !== "undefined" ? window : globalThis);