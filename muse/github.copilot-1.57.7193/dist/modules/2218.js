Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.completionsFromGhostTextResults = undefined;
const r = require(2277),
  o = require(6403),
  i = require(9334),
  s = require(3286);
exports.completionsFromGhostTextResults = function (e, t, n, a, c, l, u) {
  const d = e.get(o.LocationFactory),
    p = a.lineAt(c);
  let h = t.map((e) => {
    let t,
      o = "";
    if (l) {
      e.completion = s.normalizeIndentCharacter(
        l,
        e.completion,
        p.isEmptyOrWhitespace
      );
    }
    if (e.completion.displayNeedsWsOffset && p.isEmptyOrWhitespace)
      (t = d.range(d.position(c.line, 0), c)),
        (o = e.completion.completionText);
    else if (
      p.isEmptyOrWhitespace &&
      e.completion.completionText.startsWith(p.text)
    )
      (t = d.range(d.position(c.line, 0), c)),
        (o = e.completion.completionText);
    else {
      const n = a.getWordRangeAtPosition(c);
      if (e.isMiddleOfTheLine) {
        const n = a.lineAt(c),
          r = d.range(d.position(c.line, 0), c),
          i = a.getText(r);
        (t = e.coversSuffix ? n.range : r), (o = i + e.completion.displayText);
      } else if (n) {
        const r = a.getText(n);
        (t = d.range(n.start, c)), (o = r + e.completion.completionText);
      } else {
        const n = d.range(d.position(c.line, 0), c);
        (t = n), (o = a.getText(n) + e.completion.displayText);
      }
    }
    return {
      uuid: r.v4(),
      text: o,
      range: t,
      file: a.uri,
      index: e.completion.completionIndex,
      telemetry: e.telemetry,
      displayText: e.completion.displayText,
      position: c,
      offset: a.offsetAt(c),
      resultType: n,
    };
  });
  if (n === i.ResultType.TypingAsSuggested && undefined !== u) {
    const e = h.find((e) => e.index === u);
    if (e) {
      const t = h.filter((e) => e.index !== u);
      h = [e, ...t];
    }
  }
  return h;
};
