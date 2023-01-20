Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.checkSuffix = exports.postProcessChoice = undefined;
const r = require(9189);
const o = require(2533);
const i = require(6333);
const s = require(70);
const a = require(9657);
exports.postProcessChoice = async function (e, t, n, c, l, u, d) {
  if (
    a.isRepetitive(l.tokens, await e.get(r.Features).repetitionFilterMode())
  ) {
    const t = i.TelemetryData.createAndMarkAsIssued();
    t.extendWithRequestId(l.requestId);
    i.telemetry(e, "repetition.detected", t, true);
    return void d.info(e, "Filtered out repetitive solution");
  }
  const p = {
    ...l,
  };
  if (
    (function (e, t, n) {
      let r = "";
      let o = t.line + 1;
      for (; "" === r && o < e.lineCount; ) {
        r = e.lineAt(o).text.trim();
        if (r === n.trim()) return !0;
        o++;
      }
      return false;
    })(n, c, p.completionText)
  ) {
    const t = i.TelemetryData.createAndMarkAsIssued();
    t.extendWithRequestId(l.requestId);
    i.telemetry(e, "completion.alreadyInDocument", t);
    i.telemetry(
      e,
      "completion.alreadyInDocument",
      t.extendedBy({
        completionTextJson: JSON.stringify(p.completionText),
      }),
      true
    );
    return void d.info(e, "Filtered out solution matching next line");
  }
  p.completionText = await (async function (e, t, n, r, i) {
    var a;
    if ("" === r) return r;
    let c = "}";
    try {
      c =
        null !== (a = o.getBlockCloseToken(t.languageId)) && undefined !== a
          ? a
          : "}";
    } catch (e) {}
    let l = r.length;
    do {
      const o = r.lastIndexOf("\n", l - 2) + 1;
      const a = r.substring(o, l);
      if (a.trim() === c) {
        for (let e = n.line; e < t.lineCount; e++) {
          let s = t.lineAt(e).text;
          if (e === n.line) {
            s = s.substr(n.character);
          }
          if (s.startsWith(a.trimRight()))
            return r.substring(0, Math.max(0, i ? o : o - 1));
          if ("" !== s.trim()) break;
        }
        break;
      }
      if (l === o) {
        if (s.shouldFailForDebugPurposes(e))
          throw Error(
            `Aborting: maybeSnipCompletion would have looped on completion: ${r}`
          );
        break;
      }
      l = o;
    } while (l > 1);
    return r;
  })(e, n, c, p.completionText, u);
  return p.completionText ? p : undefined;
};
exports.checkSuffix = function (e, t, n) {
  const r = e.lineAt(t.line).text.substring(t.character);
  if (r.length > 0) {
    if (-1 !== n.completionText.indexOf(r)) return true;
    {
      let e = 0;
      for (const t of r) {
        const r = n.completionText.indexOf(t, e + 1);
        if (!(r > e)) {
          e = -1;
          break;
        }
        e = r;
      }
      return -1 !== e;
    }
  }
  return false;
};