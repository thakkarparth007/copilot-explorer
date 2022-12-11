Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.completionsFromGhostTextResults = undefined;
const M_uuid_utils = require("uuid-utils");
const M_location_factory = require("location-factory");
const M_ghost_text_provider = require("ghost-text-provider");
const M_indentation_normalizer_maybe = require("indentation-normalizer");
exports.completionsFromGhostTextResults = function (e, t, n, a, c, l, u) {
  const d = e.get(M_location_factory.LocationFactory);
  const p = a.lineAt(c);
  let h = t.map((e) => {
    let t;
    let o = "";
    if (l) {
      e.completion = M_indentation_normalizer_maybe.normalizeIndentCharacter(
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
      uuid: M_uuid_utils.v4(),
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
  if (
    n === M_ghost_text_provider.ResultType.TypingAsSuggested &&
    undefined !== u
  ) {
    const e = h.find((e) => e.index === u);
    if (e) {
      const t = h.filter((e) => e.index !== u);
      h = [e, ...t];
    }
  }
  return h;
};
