Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getTemperatureForSamples =
  exports.calculateMeanAlternativeLogProb =
  exports.calculateMeanLogProb =
  exports.cleanupIndentChoices =
  exports.convertToAPIChoice =
  exports.DEFAULT_CHARACTER_MULTIPLIER =
  exports.MAX_PROMPT_LENGTH =
  exports.OpenAIFetcher =
  exports.LiveOpenAIFetcher =
  exports.getRequestId =
  exports.CopilotUiKind =
    undefined;
const r = require(1133);
const o = require(9899);
const i = require(6333);
const s = require(70);
var a = require(4419);
function calculateMeanLogProb(e, t) {
  var n;
  if (
    null === (n = null == t ? undefined : t.logprobs) || undefined === n
      ? undefined
      : n.token_logprobs
  )
    try {
      let e = 0;
      let n = 0;
      let r = 50;
      for (
        let o = 0;
        o < t.logprobs.token_logprobs.length - 1 && r > 0;
        o++, r--
      ) {
        e += t.logprobs.token_logprobs[o];
        n += 1;
      }
      return n > 0 ? e / n : undefined;
    } catch (t) {
      o.logger.error(e, `Error calculating mean prob: ${t}`);
    }
}
function calculateMeanAlternativeLogProb(e, t) {
  var n;
  if (
    null === (n = null == t ? undefined : t.logprobs) || undefined === n
      ? undefined
      : n.top_logprobs
  )
    try {
      let e = 0;
      let n = 0;
      let r = 50;
      for (
        let o = 0;
        o < t.logprobs.token_logprobs.length - 1 && r > 0;
        o++, r--
      ) {
        const r = {
          ...t.logprobs.top_logprobs[o],
        };
        delete r[t.logprobs.tokens[o]];
        e += Math.max(...Object.values(r));
        n += 1;
      }
      return n > 0 ? e / n : undefined;
    } catch (t) {
      o.logger.error(e, `Error calculating mean prob: ${t}`);
    }
}
exports.CopilotUiKind = a.CopilotUiKind;
exports.getRequestId = a.getRequestId;
exports.LiveOpenAIFetcher = a.LiveOpenAIFetcher;
exports.OpenAIFetcher = a.OpenAIFetcher;
exports.MAX_PROMPT_LENGTH = 1500;
exports.DEFAULT_CHARACTER_MULTIPLIER = 3;
exports.convertToAPIChoice = function (e, t, n, r, o, s, a, u) {
  i.logEngineCompletion(e, t, n, o, r);
  return {
    completionText: t,
    meanLogProb: calculateMeanLogProb(e, n),
    meanAlternativeLogProb: calculateMeanAlternativeLogProb(e, n),
    choiceIndex: r,
    requestId: o,
    modelInfo: u,
    blockFinished: s,
    tokens: n.tokens,
    numTokens: n.tokens.length,
    telemetryData: a,
  };
};
exports.cleanupIndentChoices = async function* (e, t) {
  for await (const n of e) {
    const e = {
      ...n,
    };
    const r = e.completionText.split("\n");
    for (let e = 0; e < r.length; ++e) {
      const n = r[e].trimLeft();
      r[e] = "" === n ? n : t + n;
    }
    e.completionText = r.join("\n");
    yield e;
  }
};
exports.calculateMeanLogProb = calculateMeanLogProb;
exports.calculateMeanAlternativeLogProb = calculateMeanAlternativeLogProb;
exports.getTemperatureForSamples = function (e, t) {
  if (s.isRunningInTest(e)) return 0;
  const n = parseFloat(r.getConfig(e, r.ConfigKey.Temperature));
  return n >= 0 && n <= 1 ? n : t <= 1 ? 0 : t < 10 ? 0.2 : t < 20 ? 0.4 : 0.8;
};