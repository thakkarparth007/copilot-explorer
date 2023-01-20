Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getSiblingFunctionStart = exports.getSiblingFunctions = undefined;
const r = require(1747);
const o = require(464);
exports.getSiblingFunctions = async function ({
  source: e,
  offset: t,
  languageId: n,
}) {
  var i;
  var s;
  const a = [];
  let c = "";
  let l = e.substring(0, t);
  if (o.isSupportedLanguageId(n)) {
    const u = await o.parseTree(n, e);
    try {
      let d = t;
      for (; d >= 0 && /\s/.test(e[d]); ) d--;
      const p = u.rootNode.descendantForIndex(d);
      const h = o.getAncestorWithSiblingFunctions(n, p);
      if (h) {
        const u = o.getFirstPrecedingComment(h);
        const d =
          null !== (i = null == u ? undefined : u.startIndex) && undefined !== i
            ? i
            : h.startIndex;
        let p;
        let f = 0;
        for (; " " == (p = e[d - f - 1]) || "\t" == p; ) f++;
        const m = e.substring(d - f, d);
        for (let i = h.nextSibling; i; i = i.nextSibling)
          if (o.isFunctionDefinition(n, i)) {
            const n = o.getFirstPrecedingComment(i);
            const c =
              null !== (s = null == n ? undefined : n.startIndex) &&
              undefined !== s
                ? s
                : i.startIndex;
            if (c < t) continue;
            const l = e.substring(c, i.endIndex);
            const u = r.newLineEnded(l) + "\n" + m;
            a.push(u);
          }
        c = e.substring(0, d);
        l = e.substring(d, t);
      }
    } finally {
      u.delete();
    }
  }
  return {
    siblings: a,
    beforeInsertion: c,
    afterInsertion: l,
  };
};
exports.getSiblingFunctionStart = async function ({
  source: e,
  offset: t,
  languageId: n,
}) {
  var r;
  if (o.isSupportedLanguageId(n)) {
    const i = await o.parseTree(n, e);
    try {
      let s = t;
      for (; s >= 0 && /\s/.test(e[s]); ) s--;
      const a = i.rootNode.descendantForIndex(s);
      const c = o.getAncestorWithSiblingFunctions(n, a);
      if (c) {
        for (let e = c.nextSibling; e; e = e.nextSibling)
          if (o.isFunctionDefinition(n, e)) {
            const n = o.getFirstPrecedingComment(e);
            const i =
              null !== (r = null == n ? undefined : n.startIndex) &&
              undefined !== r
                ? r
                : e.startIndex;
            if (i < t) continue;
            return i;
          }
        if (c.endIndex >= t) return c.endIndex;
      }
    } finally {
      i.delete();
    }
  }
  return t;
};