Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getGhostText =
  exports.completionCache =
  exports.ResultType =
  exports.ghostTextLogger =
    undefined;
const M_getPrompt_main_stuff = require("getPrompt-main-stuff");
const M_uuid_utils = require("uuid-utils");
const M_prompt_cache = require("prompt-cache");
const M_debouncer = require("debouncer");
const M_async_iterable_utils_maybe = require("async-iterable-utils");
const M_config_stuff = require("config-stuff");
const M_task_maybe = require("task");
const M_logging_utils = require("logging-utils");
const M_helix_fetcher_and_network_stuff = require("helix-fetcher-and-network-stuff");
const M_openai_conn_utils = require("openai_conn_utils");
const M_live_openai_fetcher = require("live-openai-fetcher");
const M_openai_choices_utils = require("openai-choices-utils");
const M_status_reporter_maybe = require("status-reporter");
const M_context_extractor_from_identation_maybe = require("context-extractor-from-identation-maybe");
const M_prompt_extractor = require("prompt-extractor");
const M_background_context_provider = require("background-context-provider");
const M_ghost_text_score_maybe = require("ghost-text-score");
const M_postprocess_choice = require("postprocess-choice");
const M_telemetry_stuff = require("telemetry-stuff");
const M_runtime_mode_maybe = require("runtime-mode");
const M_location_factory = require("location-factory");
const M_contextual_filter_manager = require("contextual-filter-manager");
const M_ghost_text_debouncer_maybe = require("ghost-text-debouncer");
const M_ghost_text_telemetry = require("ghost-text-telemetry");
var k;
let I;
let P;
async function A(e, n, r, o, i, s, a) {
  var u;
  var p;
  var m;
  exports.ghostTextLogger.debug(e, `Getting ${s} from network`);
  r = r.extendedBy();
  const g = await (async function (e, t) {
    const n = await e.get(M_task_maybe.Features).overrideNumGhostCompletions();
    return n
      ? t.isCycling
        ? Math.max(0, 3 - n)
        : n
      : M_config_stuff.shouldDoParsingTrimming(t.blockMode) && t.multiline
      ? M_config_stuff.getConfig(e, M_config_stuff.ConfigKey.InlineSuggestCount)
      : t.isCycling
      ? 2
      : 1;
  })(e, n);
  const _ = M_openai_choices_utils.getTemperatureForSamples(e, g);
  const y = {
    stream: !0,
    n: g,
    temperature: _,
    extra: {
      language: n.languageId,
      next_indent: null !== (u = n.indentation.next) && undefined !== u ? u : 0,
      trim_by_indentation: M_config_stuff.shouldDoServerTrimming(n.blockMode),
    },
  };
  if (n.multiline) {
    y.stop = ["\n"];
  }
  if (n.multiline && n.multiLogitBias) {
    y.logit_bias = {
      50256: -100,
    };
  }
  const v = Date.now();
  const b = {
    endpoint: "completions",
    uiKind: M_live_openai_fetcher.CopilotUiKind.GhostText,
    isCycling: JSON.stringify(n.isCycling),
    temperature: JSON.stringify(_),
    n: JSON.stringify(g),
    stop:
      null !== (p = JSON.stringify(y.stop)) && undefined !== p ? p : "unset",
    logit_bias: JSON.stringify(
      null !== (m = y.logit_bias) && undefined !== m ? m : null
    ),
  };
  const E = M_telemetry_stuff.telemetrizePromptLength(n.prompt);
  Object.assign(r.properties, b);
  Object.assign(r.measurements, E);
  try {
    const s = {
      prompt: n.prompt,
      languageId: n.languageId,
      repoInfo: n.repoInfo,
      ourRequestId: n.ourRequestId,
      engineUrl: n.engineURL,
      count: g,
      uiKind: M_live_openai_fetcher.CopilotUiKind.GhostText,
      postOptions: y,
    };
    if (n.delayMs > 0) {
      await new Promise((e) => setTimeout(e, n.delayMs));
    }
    const c = await e
      .get(M_live_openai_fetcher.OpenAIFetcher)
      .fetchAndStreamCompletions(e, s, r, i, o);
    return "failed" === c.type
      ? {
          type: "failed",
          reason: c.reason,
          telemetryData: M_ghost_text_telemetry.mkBasicResultTelemetry(r),
        }
      : "canceled" === c.type
      ? (exports.ghostTextLogger.debug(
          e,
          "Cancelled after awaiting fetchCompletions"
        ),
        {
          type: "canceled",
          reason: c.reason,
          telemetryData: M_ghost_text_telemetry.mkCanceledResultTelemetry(r),
        })
      : a(g, v, c.getProcessingTime(), c.choices);
  } catch (n) {
    if (M_helix_fetcher_and_network_stuff.isAbortError(n))
      return {
        type: "canceled",
        reason: "network request aborted",
        telemetryData: M_ghost_text_telemetry.mkCanceledResultTelemetry(r, {
          cancelledNetworkRequest: !0,
        }),
      };
    exports.ghostTextLogger.error(e, `Error on ghost text request ${n}`);
    if ((0, M_runtime_mode_maybe.shouldFailForDebugPurposes)(e)) throw n;
    return {
      type: "failed",
      reason: "non-abort error on ghost text request",
      telemetryData: M_ghost_text_telemetry.mkBasicResultTelemetry(r),
    };
  }
}
function O(e, t) {
  const n = {
    ...e,
  };
  n.completionText = e.completionText.trimEnd();
  if (t.forceSingleLine) {
    n.completionText = n.completionText.split("\n")[0];
  }
  return n;
}
exports.ghostTextLogger = new M_logging_utils.Logger(
  M_logging_utils.LogLevel.INFO,
  "ghostText"
);
(function (e) {
  e[(e.Network = 0)] = "Network";
  e[(e.Cache = 1)] = "Cache";
  e[(e.TypingAsSuggested = 2)] = "TypingAsSuggested";
  e[(e.Cycling = 3)] = "Cycling";
})((k = exports.ResultType || (exports.ResultType = {})));
exports.completionCache = new M_prompt_cache.LRUCache(100);
const N = new M_debouncer.Debouncer();
function R(e, t) {
  I = e;
  P = t;
}
function M(e, n, r) {
  const o = M_prompt_cache.keyForPrompt(n.prompt);
  const s = exports.completionCache.get(o);
  if (s && s.multiline === r.multiline) {
    exports.completionCache.put(o, {
      multiline: s.multiline,
      choices: s.choices.concat(r.choices),
    });
  } else {
    exports.completionCache.put(o, r);
  }
  exports.ghostTextLogger.debug(
    e,
    `Appended cached ghost text for key: ${o}, multiline: ${r.multiline}, number of suggestions: ${r.choices.length}`
  );
}
function L(e, n) {
  const r = exports.completionCache.get(e);
  if (r && (!n || r.multiline)) return r.choices;
}
function $(e, t, n) {
  if (n.length > 0) {
    if (t.startsWith(n))
      return {
        completionIndex: e,
        completionText: t,
        displayText: t.substr(n.length),
        displayNeedsWsOffset: !1,
      };
    {
      const r = t.substr(0, t.length - t.trimLeft().length);
      return n.startsWith(r)
        ? {
            completionIndex: e,
            completionText: t,
            displayText: t.trimLeft(),
            displayNeedsWsOffset: !0,
          }
        : {
            completionIndex: e,
            completionText: t,
            displayText: t,
            displayNeedsWsOffset: !1,
          };
    }
  }
  return {
    completionIndex: e,
    completionText: t,
    displayText: t,
    displayNeedsWsOffset: !1,
  };
}
function D(e, n) {
  const r = n.requestId;
  const o = {
    choiceIndex: n.choiceIndex.toString(),
  };
  const i = {
    numTokens: n.numTokens,
    compCharLen: n.completionText.length,
    numLines: n.completionText.split("\n").length,
  };
  if (n.meanLogProb) {
    i.meanLogProb = n.meanLogProb;
  }
  if (n.meanAlternativeLogProb) {
    i.meanAlternativeLogProb = n.meanAlternativeLogProb;
  }
  const s = n.telemetryData.extendedBy(o, i);
  s.extendWithRequestId(r);
  s.measurements.confidence = M_ghost_text_score_maybe.ghostTextScoreConfidence(
    e,
    s
  );
  s.measurements.quantile = M_ghost_text_score_maybe.ghostTextScoreQuantile(
    e,
    s
  );
  exports.ghostTextLogger.debug(
    e,
    `Extended telemetry for ${n.telemetryData.properties.headerRequestId} with retention confidence ${s.measurements.confidence} (expected as good or better than about ${s.measurements.quantile} of all suggestions)`
  );
  return s;
}
function F(e, t, n, r, o) {
  const i = Date.now() - r;
  const s = i - o;
  const a = n.telemetryData.extendedBy(
    {},
    {
      completionCharLen: n.completionText.length,
      requestTimeMs: i,
      processingTimeMs: o,
      deltaMs: s,
      meanLogProb: n.meanLogProb || NaN,
      meanAlternativeLogProb: n.meanAlternativeLogProb || NaN,
      numTokens: n.numTokens,
    }
  );
  a.extendWithRequestId(n.requestId);
  M_telemetry_stuff.telemetry(e, `ghostText.${t}`, a);
}
exports.getGhostText = async function (e, n, s, u, d, f) {
  var v;
  var j;
  const q = await M_prompt_extractor.extractPrompt(e, n, s);
  if ("contextTooShort" === q.type) {
    exports.ghostTextLogger.debug(e, "Breaking, not enough context");
    return {
      type: "abortedBeforeIssued",
      reason: "Not enough context",
    };
  }
  if (null == f ? undefined : f.isCancellationRequested) {
    exports.ghostTextLogger.info(e, "Cancelled after extractPrompt");
    return {
      type: "abortedBeforeIssued",
      reason: "Cancelled after extractPrompt",
    };
  }
  const B = (function (e, t) {
    const n =
      ((o = t), 0 != e.lineAt(o).text.substr(o.character).trim().length);
    const r = (function (e, t) {
      const n = t.lineAt(e).text.substr(e.character).trim();
      return /^\s*[)}\]"'`]*\s*[:{;,]?\s*$/.test(n);
    })(t, e);
    var o;
    if (!n || r) return n && r;
  })(n, s);
  if (undefined === B) {
    exports.ghostTextLogger.debug(e, "Breaking, invalid middle of the line");
    return {
      type: "abortedBeforeIssued",
      reason: "Invalid middle of the line",
    };
  }
  const U = e.get(M_status_reporter_maybe.StatusReporter);
  const H = e.get(M_location_factory.LocationFactory);
  const z = await (async function (e, t, n, o, i, s) {
    const a = await e
      .get(M_config_stuff.BlockModeConfig)
      .forLanguage(e, t.languageId);
    switch (a) {
      case M_config_stuff.BlockMode.Server:
        return {
          blockMode: M_config_stuff.BlockMode.Server,
          requestMultiline: !0,
          isCyclingRequest: i,
          finishedCb: async (e) => {},
        };
      case M_config_stuff.BlockMode.Parsing:
      case M_config_stuff.BlockMode.ParsingAndServer:
      default: {
        const c = await (async function (e, t, n, o) {
          if (t.lineCount >= 8e3)
            M_telemetry_stuff.telemetry(
              e,
              "ghostText.longFileMultilineSkip",
              M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
                languageId: t.languageId,
                lineCount: String(t.lineCount),
                currentLine: String(n.line),
              })
            );
          else {
            if (
              !o &&
              M_getPrompt_main_stuff.isSupportedLanguageId(t.languageId)
            )
              return await M_context_extractor_from_identation_maybe.isEmptyBlockStart(
                t,
                n
              );
            if (o && M_getPrompt_main_stuff.isSupportedLanguageId(t.languageId))
              return (
                (await M_context_extractor_from_identation_maybe.isEmptyBlockStart(
                  t,
                  n
                )) ||
                (await M_context_extractor_from_identation_maybe.isEmptyBlockStart(
                  t,
                  t.lineAt(n).range.end
                ))
              );
          }
          return !1;
        })(e, t, n, s);
        return c
          ? {
              blockMode: a,
              requestMultiline: !0,
              isCyclingRequest: !1,
              finishedCb: async (r) => {
                let i;
                i =
                  o.trailingWs.length > 0 &&
                  !o.prompt.prefix.endsWith(o.trailingWs)
                    ? e
                        .get(M_location_factory.LocationFactory)
                        .position(
                          n.line,
                          Math.max(n.character - o.trailingWs.length, 0)
                        )
                    : n;
                return M_context_extractor_from_identation_maybe.isBlockBodyFinished(
                  e,
                  t,
                  i,
                  r
                );
              },
            }
          : {
              blockMode: a,
              requestMultiline: !1,
              isCyclingRequest: i,
              finishedCb: async (e) => {},
            };
      }
    }
  })(e, n, s, q, u, B);
  if (null == f ? undefined : f.isCancellationRequested) {
    exports.ghostTextLogger.info(e, "Cancelled after requestMultiline");
    return {
      type: "abortedBeforeIssued",
      reason: "Cancelled after requestMultiline",
    };
  }
  const [G] = M_prompt_extractor.trimLastLine(
    n.getText(H.range(H.position(0, 0), s))
  );
  let V = (function (e, n, r, o) {
    const s = (function (e, n, r) {
      if (!I || !P || !n.startsWith(I)) return;
      const o = L(P, r);
      if (!o) return;
      const i = n.substring(I.length);
      exports.ghostTextLogger.debug(
        e,
        `Getting completions for user-typing flow - remaining prefix: ${i}`
      );
      const s = [];
      o.forEach((e) => {
        const t = O(e, {
          forceSingleLine: !1,
        });
        if (t.completionText.startsWith(i)) {
          t.completionText = t.completionText.substring(i.length);
          s.push(t);
        }
      });
      return s;
    })(e, n, o);
    if (s && s.length > 0) return [s, k.TypingAsSuggested];
    const a = (function (e, n, r, o) {
      const s = M_prompt_cache.keyForPrompt(r);
      exports.ghostTextLogger.debug(
        e,
        `Trying to get completions from cache for key: ${s}`
      );
      const a = L(s, o);
      if (a) {
        exports.ghostTextLogger.debug(
          e,
          `Got completions from cache for key: ${s}`
        );
        const r = [];
        a.forEach((e) => {
          const t = O(e, {
            forceSingleLine: !o,
          });
          r.push(t);
        });
        const i = r.filter((e) => e.completionText);
        if (i.length > 0) {
          R(n, s);
        }
        return i;
      }
    })(e, n, r, o);
    return a && a.length > 0 ? [a, k.Cache] : undefined;
  })(e, G, q.prompt, z.requestMultiline);
  const W = M_uuid_utils.v4();
  const K = M_background_context_provider.extractRepoInfoInBackground(
    e,
    n.fileName
  );
  const J = await M_openai_conn_utils.getEngineURL(
    e,
    M_background_context_provider.tryGetGitHubNWO(K),
    n.languageId,
    M_background_context_provider.getDogFood(K),
    await M_background_context_provider.getUserKind(e),
    d
  );
  const X = await e
    .get(M_task_maybe.Features)
    .beforeRequestWaitMs(
      M_background_context_provider.tryGetGitHubNWO(K) || "",
      n.languageId
    );
  const Q = await e
    .get(M_task_maybe.Features)
    .multiLogitBias(
      M_background_context_provider.tryGetGitHubNWO(K) || "",
      n.languageId
    );
  const Y = {
    blockMode: z.blockMode,
    languageId: n.languageId,
    repoInfo: K,
    engineURL: J,
    ourRequestId: W,
    prefix: G,
    prompt: q.prompt,
    multiline: z.requestMultiline,
    indentation: M_context_extractor_from_identation_maybe.contextIndentation(
      n,
      s
    ),
    isCycling: u,
    delayMs: X,
    multiLogitBias: Q,
  };
  const Z = await e.get(M_task_maybe.Features).debouncePredict();
  const ee = await e.get(M_task_maybe.Features).contextualFilterEnable();
  const te = await e
    .get(M_task_maybe.Features)
    .contextualFilterAcceptThreshold();
  let ne = !1;
  if (Z || ee) {
    ne = !0;
  }
  const re = (function (e, t, n, r, o, i, s) {
    const a = e.get(M_location_factory.LocationFactory);
    const c = t.lineAt(r.line);
    const l = t.getText(a.range(c.range.start, r));
    const u = t.getText(a.range(r, c.range.end));
    const d = {
      languageId: t.languageId,
      beforeCursorWhitespace: JSON.stringify("" === l.trim()),
      afterCursorWhitespace: JSON.stringify("" === u.trim()),
    };
    const p = {
      ...M_telemetry_stuff.telemetrizePromptLength(o.prompt),
      promptEndPos: t.offsetAt(r),
      documentLength: t.getText().length,
      delayMs: n.delayMs,
    };
    const f = i.extendedBy(d, p);
    f.properties.promptChoices = JSON.stringify(o.promptChoices, (e, t) =>
      t instanceof Map
        ? Array.from(t.entries()).reduce(
            (e, [t, n]) => ({
              ...e,
              [t]: n,
            }),
            {}
          )
        : t
    );
    f.properties.promptBackground = JSON.stringify(o.promptBackground, (e, t) =>
      t instanceof Map ? Array.from(t.values()) : t
    );
    f.measurements.promptComputeTimeMs = o.computeTimeMs;
    if (s) {
      f.measurements.contextualFilterScore =
        M_contextual_filter_manager.contextualFilterScore(e, f, o.prompt);
    }
    const m = n.repoInfo;
    f.properties.gitRepoInformation =
      undefined === m
        ? "unavailable"
        : m === M_background_context_provider.ComputationStatus.PENDING
        ? "pending"
        : "available";
    if (
      undefined !== m &&
      m !== M_background_context_provider.ComputationStatus.PENDING
    ) {
      f.properties.gitRepoUrl = m.url;
      f.properties.gitRepoHost = m.hostname;
      f.properties.gitRepoOwner = m.owner;
      f.properties.gitRepoName = m.repo;
      f.properties.gitRepoPath = m.pathname;
    }
    f.properties.engineName = M_live_openai_fetcher.extractEngineName(
      e,
      n.engineURL
    );
    f.properties.isMultiline = JSON.stringify(n.multiline);
    f.properties.blockMode = n.blockMode;
    f.properties.isCycling = JSON.stringify(n.isCycling);
    f.properties.headerRequestId = n.ourRequestId;
    M_telemetry_stuff.telemetry(e, "ghostText.issued", f);
    return f;
  })(e, n, Y, s, q, d, ne);
  if (
    (z.isCyclingRequest &&
      (null !== (v = null == V ? undefined : V[0].length) && undefined !== v
        ? v
        : 0) > 1) ||
    (!z.isCyclingRequest && undefined !== V)
  )
    exports.ghostTextLogger.info(e, "Found inline suggestions locally");
  else {
    if (null == U) {
      U.setProgress();
    }
    if (z.isCyclingRequest) {
      const n = await (async function (e, n, r, o, i) {
        return A(e, n, r, o, i, "all completions", async (i, s, a, c) => {
          const l = [];
          for await (const n of c) {
            if (null == o ? void 0 : o.isCancellationRequested)
              return (
                exports.ghostTextLogger.debug(
                  e,
                  "Cancelled after awaiting choices iterator"
                ),
                {
                  type: "canceled",
                  reason: "after awaiting choices iterator",
                  telemetryData: (0,
                  M_ghost_text_telemetry.mkCanceledResultTelemetry)(r),
                }
              );
            if (n.completionText.trimEnd()) {
              if (
                -1 !==
                l.findIndex(
                  (e) => e.completionText.trim() === n.completionText.trim()
                )
              )
                continue;
              l.push(n);
            }
          }
          return (
            l.length > 0 &&
              (M(e, n, {
                multiline: n.multiline,
                choices: l,
              }),
              F(e, "cyclingPerformance", l[0], s, a)),
            {
              type: "success",
              value: l,
              telemetryData: (0, M_ghost_text_telemetry.mkBasicResultTelemetry)(
                r
              ),
              telemetryBlob: r,
            }
          );
        });
      })(e, Y, re, f, z.finishedCb);
      if ("success" === n.type) {
        const e =
          null !== (j = null == V ? void 0 : V[0]) && void 0 !== j ? j : [];
        n.value.forEach((t) => {
          -1 ===
            e.findIndex(
              (e) => e.completionText.trim() === t.completionText.trim()
            ) && e.push(t);
        }),
          (V = [e, k.Cycling]);
      } else if (void 0 === V) return null == U || U.removeProgress(), n;
    } else {
      const n = await (0, M_ghost_text_debouncer_maybe.getDebounceLimit)(e, re);
      try {
        await N.debounce(n);
      } catch {
        return {
          type: "canceled",
          reason: "by debouncer",
          telemetryData: (0, M_ghost_text_telemetry.mkCanceledResultTelemetry)(
            re
          ),
        };
      }
      if (null == f ? void 0 : f.isCancellationRequested)
        return (
          exports.ghostTextLogger.info(e, "Cancelled during debounce"),
          {
            type: "canceled",
            reason: "during debounce",
            telemetryData: (0,
            M_ghost_text_telemetry.mkCanceledResultTelemetry)(re),
          }
        );
      if (
        ee &&
        re.measurements.contextualFilterScore &&
        re.measurements.contextualFilterScore < te / 100
      )
        return (
          exports.ghostTextLogger.info(e, "Cancelled by contextual filter"),
          {
            type: "canceled",
            reason: "contextualFilterScore below threshold",
            telemetryData: (0,
            M_ghost_text_telemetry.mkCanceledResultTelemetry)(re),
          }
        );
      const r = await (async function (e, n, r, o, s) {
        return A(e, n, r, o, s, "completions", async (s, a, c, l) => {
          const u = l[Symbol.asyncIterator](),
            d = await u.next();
          if (d.done)
            return (
              exports.ghostTextLogger.debug(e, "All choices redacted"),
              {
                type: "empty",
                reason: "all choices redacted",
                telemetryData: (0,
                M_ghost_text_telemetry.mkBasicResultTelemetry)(r),
              }
            );
          if (null == o ? void 0 : o.isCancellationRequested)
            return (
              exports.ghostTextLogger.debug(
                e,
                "Cancelled after awaiting redactedChoices iterator"
              ),
              {
                type: "canceled",
                reason: "after awaiting redactedChoices iterator",
                telemetryData: (0,
                M_ghost_text_telemetry.mkCanceledResultTelemetry)(r),
              }
            );
          const p = d.value;
          if (void 0 === p)
            return (
              exports.ghostTextLogger.debug(
                e,
                "Got undefined choice from redactedChoices iterator"
              ),
              {
                type: "empty",
                reason: "got undefined choice from redactedChoices iterator",
                telemetryData: (0,
                M_ghost_text_telemetry.mkBasicResultTelemetry)(r),
              }
            );
          F(e, "performance", p, a, c);
          const h = s - 1;
          exports.ghostTextLogger.debug(
            e,
            `Awaited first result, id:  ${p.choiceIndex}`
          ),
            (function (e, n, r) {
              const o = (0, M_prompt_cache.keyForPrompt)(n.prompt);
              R(n.prefix, o),
                exports.completionCache.put(o, r),
                exports.ghostTextLogger.debug(
                  e,
                  `Cached ghost text for key: ${o}, multiline: ${r.multiline}, number of suggestions: ${r.choices.length}`
                );
            })(e, n, {
              multiline: n.multiline,
              choices: [p],
            });
          const f = [];
          for (let e = 0; e < h; e++) f.push(u.next());
          const m = Promise.all(f).then((r) => {
            exports.ghostTextLogger.debug(
              e,
              `Awaited remaining results, number of results: ${r.length}`
            );
            const o = [];
            for (const n of r) {
              const r = n.value;
              if (
                void 0 !== r &&
                (exports.ghostTextLogger.info(
                  e,
                  `GhostText later completion: [${r.completionText}]`
                ),
                r.completionText.trimEnd())
              ) {
                if (
                  -1 !==
                  o.findIndex(
                    (e) => e.completionText.trim() === r.completionText.trim()
                  )
                )
                  continue;
                if (r.completionText.trim() === p.completionText.trim())
                  continue;
                o.push(r);
              }
            }
            o.length > 0 &&
              M(e, n, {
                multiline: n.multiline,
                choices: o,
              });
          });
          return (
            (0, M_runtime_mode_maybe.isRunningInTest)(e) && (await m),
            {
              type: "success",
              value: O(d.value, {
                forceSingleLine: !1,
              }),
              telemetryData: (0, M_ghost_text_telemetry.mkBasicResultTelemetry)(
                r
              ),
              telemetryBlob: r,
            }
          );
        });
      })(e, Y, re, f, z.finishedCb);
      if ("success" !== r.type) return null == U || U.removeProgress(), r;
      V = [[r.value], k.Network];
    }
    if (null == U) {
      U.removeProgress();
    }
  }
  if (undefined === V)
    return {
      type: "failed",
      reason: "internal error: choices should be defined after network call",
      telemetryData: M_ghost_text_telemetry.mkBasicResultTelemetry(re),
    };
  const [oe, ie] = V;
  const se = M_async_iterable_utils_maybe.asyncIterableMapFilter(
    M_async_iterable_utils_maybe.asyncIterableFromArray(oe),
    async (r) =>
      M_postprocess_choice.postProcessChoice(
        e,
        "ghostText",
        n,
        s,
        r,
        B,
        exports.ghostTextLogger
      )
  );
  const ae = [];
  for await (const r of se) {
    const o = B && M_postprocess_choice.checkSuffix(n, s, r);
    if (null == f ? undefined : f.isCancellationRequested) {
      exports.ghostTextLogger.info(
        e,
        "Cancelled after post processing completions"
      );
      return {
        type: "canceled",
        reason: "after post processing completions",
        telemetryData: M_ghost_text_telemetry.mkCanceledResultTelemetry(re),
      };
    }
    const i = D(e, r);
    const a = {
      completion: $(r.choiceIndex, r.completionText, q.trailingWs),
      telemetry: i,
      isMiddleOfTheLine: B,
      coversSuffix: o,
    };
    ae.push(a);
  }
  return {
    type: "success",
    value: [ae, ie],
    telemetryData: M_ghost_text_telemetry.mkBasicResultTelemetry(re),
    telemetryBlob: re,
  };
};
