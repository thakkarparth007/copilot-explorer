Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.extractPrompt =
  exports.trimLastLine =
  exports._contextTooShort =
  exports.MIN_PROMPT_CHARS =
    undefined;
const r = require(3055563),
  o = require(1133),
  i = require(1839),
  s = require(9189),
  a = require(3136),
  c = require(2533),
  l = require(766);
function trimLastLine(e) {
  const t = e.split("\n"),
    n = t[t.length - 1],
    r = n.length - n.trimRight().length,
    o = e.slice(0, e.length - r),
    i = e.substr(o.length);
  return [n.length == r ? o : e, i];
}
async function d(e, n, d, p, h, f) {
  var m;
  const g =
      null !==
        (m = l.tryGetGitHubNWO(l.extractRepoInfoInBackground(e, h.fsPath))) &&
      undefined !== m
        ? m
        : "",
    _ = await o.suffixPercent(e, g, f),
    y = await o.fimSuffixLengthThreshold(e, g, f);
  if ((_ > 0 ? n.length : d) < exports.MIN_PROMPT_CHARS)
    return exports._contextTooShort;
  const v = Date.now(),
    {
      prefix: b,
      suffix: w,
      promptChoices: x,
      promptBackground: E,
      promptElementRanges: C,
    } = await (async function (e, t, n, u, d, p) {
      var h;
      let f = [];
      f = await (async function (e, t, n) {
        const r = [],
          o = i.sortByAccessTimes(e.get(a.TextDocumentManager).textDocuments);
        let s = 0;
        for (const i of o) {
          if (r.length + 1 > 20 || s + i.getText().length > 2e5) break;
          if (
            "file" == i.uri.scheme &&
            i.fileName !== t &&
            i.languageId === n
          ) {
            r.push({
              uri: i.uri.toString(),
              relativePath: await e
                .get(a.TextDocumentManager)
                .getRelativePath(i),
              languageId: i.languageId,
              source: i.getText(),
            });
            s += i.getText().length;
          }
        }
        return r;
      })(e, d.fsPath, p);
      const m = {
          uri: d.toString(),
          source: t,
          offset: n,
          relativePath: u,
          languageId: p,
        },
        g =
          null !==
            (h = l.tryGetGitHubNWO(
              l.extractRepoInfoInBackground(e, d.fsPath)
            )) && undefined !== h
            ? h
            : "";
      let _ = {
        maxPromptLength: 2048 - o.getConfig(e, o.ConfigKey.SolutionLength),
        neighboringTabs: await e.get(s.Features).neighboringTabsOption(g, p),
        suffixStartMode: await e.get(s.Features).suffixStartMode(g, p),
      };
      const y = await o.suffixPercent(e, g, p),
        v = await o.suffixMatchThreshold(e, g, p),
        b = await o.fimSuffixLengthThreshold(e, g, p);
      if (y > 0) {
        _ = {
          ..._,
          includeSiblingFunctions: r.SiblingOption.NoSiblings,
          suffixPercent: y,
          suffixMatchThreshold: v,
          fimSuffixLengthThreshold: b,
        };
      }
      const w = e.get(r.FileSystem);
      return await c.getPrompt(w, m, _, f);
    })(e, n, d, p, h, f),
    [S, T] = trimLastLine(b),
    k = Date.now();
  return {
    type: "prompt",
    prompt: {
      prefix: S,
      suffix: w,
      isFimEnabled: _ > 0 && w.length > y,
      promptElementRanges: C.ranges,
    },
    trailingWs: T,
    promptChoices: x,
    computeTimeMs: k - v,
    promptBackground: E,
  };
}
async function p(e, t, n) {
  const r = await e.get(a.TextDocumentManager).getRelativePath(t);
  return d(e, t.getText(), t.offsetAt(n), r, t.uri, t.languageId);
}
exports.MIN_PROMPT_CHARS = 10;
exports._contextTooShort = {
  type: "contextTooShort",
};
exports.trimLastLine = trimLastLine;
exports.extractPrompt = function (e, t, n) {
  const r = e.get(a.TextDocumentManager).findNotebook(t);
  return undefined === r
    ? p(e, t, n)
    : (async function (e, t, n, r) {
        const o = n.getCells().find((e) => e.document.uri === t.uri);
        if (o) {
          const i = n
              .getCells()
              .filter(
                (e) =>
                  e.index < o.index &&
                  e.document.languageId === o.document.languageId
              ),
            s =
              i.length > 0
                ? i.map((e) => e.document.getText()).join("\n\n") + "\n\n"
                : "",
            c = s + t.getText(),
            l = s.length + t.offsetAt(r),
            u = await e.get(a.TextDocumentManager).getRelativePath(t);
          return d(e, c, l, u, t.uri, o.document.languageId);
        }
        return p(e, t, r);
      })(e, t, r, n);
};