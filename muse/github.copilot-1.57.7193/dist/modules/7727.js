Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.indentationBlockFinished =
  exports.completionCutOrContinue =
  exports.contextIndentationFromText =
  exports.contextIndentation =
  exports.getNodeStart =
  exports.isBlockBodyFinishedWithPrefix =
  exports.isBlockBodyFinished =
  exports.isEmptyBlockStart =
    undefined;
const r = require(6403);
const o = require(2533);
exports.isEmptyBlockStart = function (e, t) {
  return o.isEmptyBlockStart(e.languageId, e.getText(), e.offsetAt(t));
};
exports.isBlockBodyFinished = function (e, t, n, i) {
  const s = e.get(r.LocationFactory);
  const a = t.getText(s.range(s.position(0, 0), n));
  const c = t.offsetAt(n);
  return o.isBlockBodyFinished(t.languageId, a, i, c);
};
exports.isBlockBodyFinishedWithPrefix = function (e, t, n, i, s) {
  const a = e.get(r.LocationFactory);
  const c = t.getText(a.range(a.position(0, 0), n));
  const l = t.offsetAt(n);
  return o.isBlockBodyFinished(t.languageId, c + s, i, l + s.length);
};
exports.getNodeStart = async function (e, t, n, i) {
  const s = e.get(r.LocationFactory);
  const a = t.getText(s.range(s.position(0, 0), n)) + i;
  const c = await o.getNodeStart(t.languageId, a, t.offsetAt(n));
  if (c) return t.positionAt(c);
};
const i = ["\\{", "\\}", "\\[", "\\]", "\\(", "\\)"].concat(
  [
    "then",
    "else",
    "elseif",
    "elif",
    "catch",
    "finally",
    "fi",
    "done",
    "end",
    "loop",
    "until",
    "where",
    "when",
  ].map((e) => e + "\\b")
);
const s = new RegExp(`^(${i.join("|")})`);
function a(e) {
  return s.test(e.trimLeft().toLowerCase());
}
function c(e) {
  const t = /^(\s*)([^]*)$/.exec(e);
  return t && t[2] && t[2].length > 0 ? t[1].length : undefined;
}
function contextIndentationFromText(e, t, n) {
  const r = e.slice(0, t).split("\n");
  const o = e.slice(t).split("\n");
  function i(e, t, r) {
    let o;
    let i;
    let s = t;
    for (; undefined === o && s >= 0 && s < e.length; ) {
      o = c(e[s]);
      i = s;
      s += r;
    }
    if ("python" === n && -1 === r) {
      s++;
      const t = e[s].trim();
      if (t.endsWith('"""')) {
        if (!t.startsWith('"""') || '"""' === t)
          for (s--; s >= 0 && !e[s].trim().startsWith('"""'); ) s--;
        if (s >= 0)
          for (o = undefined, s--; undefined === o && s >= 0; ) {
            o = c(e[s]);
            i = s;
            s--;
          }
      }
    }
    return [o, i];
  }
  const [s, a] = i(r, r.length - 1, -1);
  const l = (() => {
    if (undefined !== s && undefined !== a)
      for (let e = a - 1; e >= 0; e--) {
        const t = c(r[e]);
        if (undefined !== t && t < s) return t;
      }
  })();
  const [u] = i(o, 1, 1);
  return {
    prev: l,
    current: null != s ? s : 0,
    next: u,
  };
}
function completionCutOrContinue(e, t, n) {
  var r;
  const o = e.split("\n");
  const i = undefined !== n;
  const s = null == n ? undefined : n.split("\n").pop();
  let l = 0;
  if (i && "" != (null == s ? undefined : s.trim()) && "" !== o[0].trim()) {
    l++;
  }
  if (i) {
    l++;
  }
  if (o.length === l) return "continue";
  const u = Math.max(
    t.current,
    null !== (r = t.next) && undefined !== r ? r : 0
  );
  for (let e = l; e < o.length; e++) {
    let t = o[e];
    if (0 == e && undefined !== s) {
      t = s + t;
    }
    const n = c(t);
    if (undefined !== n && (n < u || (n === u && !a(t))))
      return o.slice(0, e).join("\n").length;
  }
  return "continue";
}
exports.contextIndentation = function (e, t) {
  return contextIndentationFromText(e.getText(), e.offsetAt(t), e.languageId);
};
exports.contextIndentationFromText = contextIndentationFromText;
exports.completionCutOrContinue = completionCutOrContinue;
exports.indentationBlockFinished = function (e, t) {
  return async (n) => {
    const r = completionCutOrContinue(n, e, t);
    return "continue" === r ? undefined : r;
  };
};