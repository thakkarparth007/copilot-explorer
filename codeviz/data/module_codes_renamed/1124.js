Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.checkSuffix = exports.postProcessChoice = undefined;
const M_task_maybe = require("task");
const M_get_prompt_parsing_utils_maybe = require("get-prompt-parsing-utils");
const M_telemetry_stuff = require("telemetry-stuff");
const M_runtime_mode_maybe = require("runtime-mode");
const M_repetition_filter_maybe = require("repetition-filter");
exports.postProcessChoice = async function (e, t, n, c, l, u, d) {
  if (
    M_repetition_filter_maybe.isRepetitive(
      l.tokens,
      await e.get(M_task_maybe.Features).repetitionFilterMode()
    )
  ) {
    const t = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued();
    t.extendWithRequestId(l.requestId);
    M_telemetry_stuff.telemetry(e, "repetition.detected", t, !0);
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
      return !1;
    })(n, c, p.completionText)
  ) {
    const t = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued();
    t.extendWithRequestId(l.requestId);
    M_telemetry_stuff.telemetry(e, "completion.alreadyInDocument", t);
    M_telemetry_stuff.telemetry(
      e,
      "completion.alreadyInDocument",
      t.extendedBy({
        completionTextJson: JSON.stringify(p.completionText),
      }),
      !0
    );
    return void d.info(e, "Filtered out solution matching next line");
  }
  p.completionText = await (async function (e, t, n, r, i) {
    var a;
    if ("" === r) return r;
    let c = "}";
    try {
      c =
        null !==
          (a = M_get_prompt_parsing_utils_maybe.getBlockCloseToken(
            t.languageId
          )) && undefined !== a
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
        if (M_runtime_mode_maybe.shouldFailForDebugPurposes(e))
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
    if (-1 !== n.completionText.indexOf(r)) return !0;
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
  return !1;
};
