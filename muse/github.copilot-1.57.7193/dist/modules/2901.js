Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.prepareSolutionForReturn =
  exports.processSSE =
  exports.splitChunk =
    undefined;
const r = require(9899),
  o = require(6333),
  i = require(937),
  s = new r.Logger(r.LogLevel.INFO, "streamChoices");
function splitChunk(e) {
  const t = e.split("\n"),
    n = t.pop();
  return [t.filter((e) => "" != e), n];
}
exports.splitChunk = splitChunk;
exports.processSSE = async function* (e, t, n, r, c) {
  var l, u, d, p, h, f, m, g, _;
  const y = await t.body();
  y.setEncoding("utf8");
  let v = i.getRequestId(t);
  s.debug(e, `requestId: ${v.headerRequestId}`);
  const b = {};
  let w = "";
  for await (const x of y) {
    if (null == c ? undefined : c.isCancellationRequested) {
      s.info(e, "Cancelled after awaiting body chunk");
      return void y.destroy();
    }
    s.debug(e, "chunk", x.toString());
    const [E, C] = splitChunk(w + x.toString());
    w = C;
    for (const a of E) {
      const w = a.slice("data:".length).trim();
      if ("[DONE]" == w) {
        for (const [t, n] of Object.entries(b)) {
          const r = Number(t);
          if (
            null != n &&
            (yield {
              solution: n,
              finishOffset: undefined,
              reason: "DONE",
              requestId: v,
              index: r,
            },
            null == c ? undefined : c.isCancellationRequested)
          ) {
            s.debug(e, "Cancelled after yielding on DONE");
            return void y.destroy();
          }
        }
        return;
      }
      let x;
      try {
        x = JSON.parse(w);
      } catch (t) {
        s.error(e, "Error parsing JSON stream data", a);
        continue;
      }
      if (undefined !== x.choices || undefined === x.error) {
        if (0 == v.created) {
          v = i.getRequestId(t, x);
          if (0 == v.created) {
            s.error(
              e,
              `Request id invalid, should have "completionId" and "created": ${v}`,
              v
            );
          }
        }
        for (let t = 0; t < x.choices.length; t++) {
          const i = x.choices[t];
          s.debug(e, "choice", i);
          if (i.index in b) {
            b[i.index] = {
              logprobs: [],
              top_logprobs: [],
              text: [],
              text_offset: [],
              tokens: [],
            };
          }
          const a = b[i.index];
          if (null == a) continue;
          let w;
          a.text.push(i.text);
          a.tokens.push(
            null !==
              (u =
                null === (l = i.logprobs) || undefined === l
                  ? undefined
                  : l.tokens) && undefined !== u
              ? u
              : []
          );
          a.text_offset.push(
            null !==
              (p =
                null === (d = i.logprobs) || undefined === d
                  ? undefined
                  : d.text_offset) && undefined !== p
              ? p
              : []
          );
          a.logprobs.push(
            null !==
              (f =
                null === (h = i.logprobs) || undefined === h
                  ? undefined
                  : h.token_logprobs) && undefined !== f
              ? f
              : []
          );
          a.top_logprobs.push(
            null !==
              (g =
                null === (m = i.logprobs) || undefined === m
                  ? undefined
                  : m.top_logprobs) && undefined !== g
              ? g
              : []
          );
          if (
            (i.finish_reason || i.text.indexOf("\n") > -1) &&
            ((w = await n(a.text.join(""))),
            null == c ? void 0 : c.isCancellationRequested)
          )
            return (
              s.debug(e, "Cancelled after awaiting finishedCb"),
              void y.destroy()
            );
          if (i.finish_reason || undefined !== w) {
            const t =
              null !== (_ = i.finish_reason) && undefined !== _
                ? _
                : "client-trimmed";
            o.telemetry(
              e,
              "completion.finishReason",
              r.extendedBy({
                completionChoiceFinishReason: t,
              })
            );
            yield {
              solution: a,
              finishOffset: w,
              reason: JSON.stringify(i.finish_reason),
              requestId: v,
              index: i.index,
            };
            if (null == c ? void 0 : c.isCancellationRequested)
              return (
                s.debug(e, "Cancelled after yielding finished choice"),
                void y.destroy()
              );
            b[i.index] = null;
          }
        }
      } else s.error(e, "Error in response:", x.error.message);
    }
  }
  for (const [t, n] of Object.entries(b)) {
    const r = Number(t);
    if (
      null != n &&
      (yield {
        solution: n,
        finishOffset: undefined,
        reason: "Iteration Done",
        requestId: v,
        index: r,
      },
      null == c ? undefined : c.isCancellationRequested)
    ) {
      s.debug(e, "Cancelled after yielding after iteration done");
      return void y.destroy();
    }
  }
  if (w.length > 0)
    try {
      const t = JSON.parse(w);
      if (undefined !== t.error) {
        s.error(e, `Error in response: ${t.error.message}`, t.error);
      }
    } catch (t) {
      s.error(e, `Error parsing extraData: ${w}`);
    }
};
exports.prepareSolutionForReturn = function (e, t, n) {
  let r = t.solution.text.join(""),
    o = !1;
  if (undefined !== t.finishOffset) {
    s.debug(e, `solution ${t.index}: early finish at offset ${t.finishOffset}`);
    r = r.substring(0, t.finishOffset);
    o = !0;
  }
  s.info(
    e,
    `solution ${t.index} returned. finish reason: [${t.reason}] finishOffset: [${t.finishOffset}] completionId: [{${t.requestId.completionId}}] created: [{${t.requestId.created}}]`
  );
  const a = (function (e, t) {
    const n = {
      text: t.text.join(""),
      tokens: t.text,
    };
    if (0 === t.logprobs.length) return n;
    const r = t.logprobs.reduce((e, t) => e.concat(t), []),
      o = t.top_logprobs.reduce((e, t) => e.concat(t), []),
      i = t.text_offset.reduce((e, t) => e.concat(t), []),
      s = t.tokens.reduce((e, t) => e.concat(t), []);
    return {
      ...n,
      logprobs: {
        token_logprobs: r,
        top_logprobs: o,
        text_offset: i,
        tokens: s,
      },
    };
  })(0, t.solution);
  return i.convertToAPIChoice(e, r, a, t.index, t.requestId, o, n);
};