Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.launchSolutions = exports.normalizeCompletionText = undefined;
const M_uuid_utils = require("uuid-utils"),
  M_async_iterable_utils_NOTSURE = require("async-iterable-utils"),
  M_config_stuff = require("config-stuff"),
  M_completion_context = require("completion-context"),
  M_logging_utils = require("logging-utils"),
  M_openai_conn_utils = require("openai_conn_utils"),
  M_openai_choices_utils = require("openai-choices-utils"),
  M_status_reporter_NOTSURE = require("status-reporter"),
  M_context_extractor_from_identation_maybe = require("context-extractor-from-identation-maybe"),
  M_prompt_extractor = require("prompt-extractor"),
  M_get_prompt_parsing_utils_NOTSURE = require("get-prompt-parsing-utils"),
  M_background_context_provider = require("background-context-provider"),
  M_postprocess_choice = require("postprocess-choice"),
  M_telemetry_stuff = require("telemetry-stuff"),
  M_location_factory = require("location-factory"),
  y = new M_logging_utils.Logger(M_logging_utils.LogLevel.INFO, "solutions");
function v(e, t, n, r) {
  return async (o) => {
    if (r instanceof Array) {
      const [i, s] = r;
      return M_context_extractor_from_identation_maybe.isBlockBodyFinishedWithPrefix(
        e,
        t,
        n,
        o,
        s
      );
    }
    return M_context_extractor_from_identation_maybe.isBlockBodyFinished(
      e,
      t,
      n,
      o
    );
  };
}
async function b(e, t, n) {
  if (t.isCancellationRequested) {
    e.removeProgress();
    return {
      status: "FinishedWithError",
      error: "Cancelled",
    };
  }
  const r = await n.next();
  return !0 === r.done
    ? (e.removeProgress(),
      {
        status: "FinishedNormally",
      })
    : {
        status: "Solution",
        solution: r.value,
        next: b(e, t, n),
      };
}
exports.normalizeCompletionText = function (e) {
  return e.replace(/\s+/g, "");
};
exports.launchSolutions = async function (e, t) {
  var n, a, w;
  const x = t.completionContext.insertPosition,
    E = t.completionContext.prependToCompletion,
    C = t.completionContext.indentation,
    S = e.get(M_location_factory.LocationFactory),
    T = await t.getDocument(),
    k = await M_prompt_extractor.extractPrompt(e, T, x);
  if ("contextTooShort" === k.type) {
    t.reportCancelled();
    return {
      status: "FinishedWithError",
      error: "Context too short",
    };
  }
  const I = k.prompt,
    P = k.trailingWs;
  if (P.length > 0) {
    t.startPosition = S.position(
      t.startPosition.line,
      t.startPosition.character - P.length
    );
  }
  const A = t.getCancellationToken(),
    O = M_uuid_utils.v4();
  t.savedTelemetryData = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued(
    {
      headerRequestId: O,
      languageId: T.languageId,
      source: M_completion_context.completionTypeToString(
        t.completionContext.completionType
      ),
    },
    {
      ...M_telemetry_stuff.telemetrizePromptLength(I),
      solutionCount: t.solutionCountTarget,
      promptEndPos: T.offsetAt(x),
    }
  );
  if (
    t.completionContext.completionType ===
    M_completion_context.CompletionType.TODO_QUICK_FIX
  ) {
    const e = I.prefix.split("\n"),
      t = e.pop(),
      n = e.pop();
    if (n) {
      const r = /^\W+(todo:?\s+)/i.exec(n);
      if (r) {
        const o = r[1],
          i = n.replace(o, "");
        I.prefix = e.join("\n") + "\n" + i + "\n" + t;
      }
    }
  }
  if (
    t.completionContext.completionType ===
    M_completion_context.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX
  ) {
    I.prefix += t.completionContext.prependToCompletion;
  }
  y.info(e, `prompt: ${JSON.stringify(I)}`);
  y.debug(e, `prependToCompletion: ${E}`);
  M_telemetry_stuff.telemetry(e, "solution.requested", t.savedTelemetryData);
  const N = await e
      .get(M_config_stuff.BlockModeConfig)
      .forLanguage(e, T.languageId),
    R = M_get_prompt_parsing_utils_NOTSURE.isSupportedLanguageId(T.languageId),
    M = M_context_extractor_from_identation_maybe.contextIndentation(T, x),
    L = {
      stream: !0,
      extra: {
        language: T.languageId,
        next_indent: null !== (n = M.next) && undefined !== n ? n : 0,
      },
    };
  if ("parsing" !== N || R) {
    L.stop = ["\n\n", "\r\n\r\n"];
  }
  const $ = M_background_context_provider.extractRepoInfoInBackground(
      e,
      T.fileName
    ),
    D = {
      prompt: I,
      languageId: T.languageId,
      repoInfo: $,
      ourRequestId: O,
      engineUrl: await M_openai_conn_utils.getEngineURL(
        e,
        M_background_context_provider.tryGetGitHubNWO($),
        T.languageId,
        M_background_context_provider.getDogFood($),
        await M_background_context_provider.getUserKind(e),
        t.savedTelemetryData
      ),
      count: t.solutionCountTarget,
      uiKind: M_openai_choices_utils.CopilotUiKind.Panel,
      postOptions: L,
      requestLogProbs: !0,
    };
  let F;
  const j =
    t.completionContext.completionType ===
    M_completion_context.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX
      ? [
          M_completion_context.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX,
          t.completionContext.prependToCompletion,
        ]
      : t.completionContext.completionType;
  switch (N) {
    case M_config_stuff.BlockMode.Server:
      F = async (e) => {};
      L.extra.force_indent = null !== (a = M.prev) && undefined !== a ? a : -1;
      L.extra.trim_by_indentation = !0;
      break;
    case M_config_stuff.BlockMode.ParsingAndServer:
      F = R ? v(e, T, t.startPosition, j) : async (e) => {};
      L.extra.force_indent = null !== (w = M.prev) && undefined !== w ? w : -1;
      L.extra.trim_by_indentation = !0;
      break;
    case M_config_stuff.BlockMode.Parsing:
    default:
      F = R ? v(e, T, t.startPosition, j) : async (e) => {};
  }
  e.get(M_status_reporter_NOTSURE.StatusReporter).setProgress();
  const q = await e
    .get(M_openai_choices_utils.OpenAIFetcher)
    .fetchAndStreamCompletions(
      e,
      D,
      M_telemetry_stuff.TelemetryData.createAndMarkAsIssued(),
      F,
      A
    );
  if ("failed" === q.type || "canceled" === q.type) {
    t.reportCancelled();
    e.get(M_status_reporter_NOTSURE.StatusReporter).removeProgress();
    return {
      status: "FinishedWithError",
      error: `${q.type}: ${q.reason}`,
    };
  }
  let B = q.choices;
  B = (async function* (e, t) {
    for await (const n of e) {
      const e = {
        ...n,
      };
      e.completionText = t + e.completionText.trimRight();
      yield e;
    }
  })(B, E);
  if (null !== C) {
    B = M_openai_choices_utils.cleanupIndentChoices(B, C);
  }
  B = M_async_iterable_utils_NOTSURE.asyncIterableMapFilter(B, async (t) =>
    M_postprocess_choice.postProcessChoice(e, "solution", T, x, t, !1, y)
  );
  const U = M_async_iterable_utils_NOTSURE.asyncIterableMapFilter(
    B,
    async (n) => {
      let r = n.completionText;
      y.info(e, `Open Copilot completion: [${n.completionText}]`);
      if (
        t.completionContext.completionType ===
          M_completion_context.CompletionType.OPEN_COPILOT ||
        t.completionContext.completionType ===
          M_completion_context.CompletionType.TODO_QUICK_FIX
      ) {
        let t = "";
        const o = await (0,
        M_context_extractor_from_identation_maybe.getNodeStart)(
          e,
          T,
          x,
          n.completionText
        );
        if (o)
          [t] = (0, M_prompt_extractor.trimLastLine)(
            T.getText(S.range(S.position(o.line, o.character), x))
          );
        else {
          const e = S.position(x.line, 0);
          t = T.getText(S.range(e, x));
        }
        r = t + r;
      }
      let o = n.completionText;
      if (
        t.completionContext.completionType ===
        M_completion_context.CompletionType.TODO_QUICK_FIX
      ) {
        if (T.lineAt(x.line).isEmptyOrWhitespace) {
          o += "\n";
        }
      }
      if (P.length > 0 && o.startsWith(P)) {
        o = o.substring(P.length);
      }
      const i = n.meanLogProb;
      return {
        displayText: r,
        meanProb: undefined !== i ? Math.exp(i) : 0,
        meanLogProb: i || 0,
        completionText: o,
        requestId: n.requestId,
        choiceIndex: n.choiceIndex,
        prependToCompletion: E,
      };
    }
  );
  return b(
    e.get(M_status_reporter_NOTSURE.StatusReporter),
    A,
    U[Symbol.asyncIterator]()
  );
};
