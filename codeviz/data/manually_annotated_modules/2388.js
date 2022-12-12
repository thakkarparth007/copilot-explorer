Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.launchSolutions = exports.normalizeCompletionText = undefined;
const M_uuid_utils = require("uuid-utils");
const M_async_iterable_utils_maybe = require("async-iterable-utils");
const M_config_stuff = require("config-stuff");
const M_completion_context = require("completion-context");
const M_logging_utils = require("logging-utils");
const M_openai_conn_utils = require("openai_conn_utils");
const M_openai_choices_utils = require("openai-choices-utils");
const M_status_reporter_maybe = require("status-reporter");
const M_context_extractor_from_identation_maybe = require("context-extractor-from-identation-maybe");
const M_prompt_extractor = require("prompt-extractor");
const M_get_prompt_parsing_utils_maybe = require("get-prompt-parsing-utils");
const M_background_context_provider = require("background-context-provider");
const M_postprocess_choice = require("postprocess-choice");
const M_telemetry_stuff = require("telemetry-stuff");
const M_location_factory = require("location-factory");
const logger = new M_logging_utils.Logger(
  M_logging_utils.LogLevel.INFO,
  "solutions"
);
function isBlockBodyFinished(e, t, n, r) {
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
async function solnList(statusReporter, cancellationToken, solnIter) {
  if (cancellationToken.isCancellationRequested) {
    statusReporter.removeProgress();
    return {
      status: "FinishedWithError",
      error: "Cancelled",
    };
  }
  const r = await solnIter.next();
  return !0 === r.done
    ? (statusReporter.removeProgress(),
      {
        status: "FinishedNormally",
      })
    : {
        status: "Solution",
        solution: r.value,
        next: solnList(statusReporter, cancellationToken, solnIter),
      };
}
exports.normalizeCompletionText = function (e) {
  return e.replace(/\s+/g, "");
};
exports.launchSolutions = async function (ctx, t) {
  var next;
  var prev;
  var w;

  const ctxInsertPos = t.completionContext.insertPosition;
  const ctxPrependToCompletion = t.completionContext.prependToCompletion;
  const ctxIndentation = t.completionContext.indentation;
  const locFactory = ctx.get(M_location_factory.LocationFactory);
  const doc = await t.getDocument();
  const k = await M_prompt_extractor.extractPrompt(ctx, doc, ctxInsertPos);

  if ("contextTooShort" === k.type) {
    t.reportCancelled();
    return {
      status: "FinishedWithError",
      error: "Context too short",
    };
  }

  const prompt = k.prompt;
  const trailingWs = k.trailingWs;
  if (trailingWs.length > 0) {
    t.startPosition = locFactory.position(
      t.startPosition.line,
      t.startPosition.character - trailingWs.length
    );
  }

  const cancellationToken = t.getCancellationToken();
  const requestId = M_uuid_utils.v4();
  t.savedTelemetryData = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued(
    {
      headerRequestId: requestId,
      languageId: doc.languageId,
      source: M_completion_context.completionTypeToString(
        t.completionContext.completionType
      ),
    },
    {
      ...M_telemetry_stuff.telemetrizePromptLength(prompt),
      solutionCount: t.solutionCountTarget,
      promptEndPos: doc.offsetAt(ctxInsertPos),
    }
  );

  if (
    t.completionContext.completionType ===
    M_completion_context.CompletionType.TODO_QUICK_FIX
  ) {
    const prefixLines = prompt.prefix.split("\n"),
      lastLine = prefixLines.pop(),
      secondLastLine = prefixLines.pop();
    if (secondLastLine) {
      const match = /^\W+(todo:?\s+)/i.exec(secondLastLine);
      if (match) {
        const o = match[1],
          i = secondLastLine.replace(o, "");
        prompt.prefix = prefixLines.join("\n") + "\n" + i + "\n" + lastLine;
      }
    }
  }

  if (
    t.completionContext.completionType ===
    M_completion_context.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX
  ) {
    prompt.prefix += t.completionContext.prependToCompletion;
  }

  logger.info(ctx, `prompt: ${JSON.stringify(prompt)}`);
  logger.debug(ctx, `prependToCompletion: ${ctxPrependToCompletion}`);

  M_telemetry_stuff.telemetry(ctx, "solution.requested", t.savedTelemetryData);

  const blockMode = await ctx
    .get(M_config_stuff.BlockModeConfig)
    .forLanguage(ctx, doc.languageId);
  const isLangSupported = M_get_prompt_parsing_utils_maybe.isSupportedLanguageId(
    doc.languageId
  );
  const contextIndentation = M_context_extractor_from_identation_maybe.contextIndentation(doc, ctxInsertPos);
  const postOptions = {
    stream: !0,
    extra: {
      language: doc.languageId,
      next_indent: null !== (next = contextIndentation.next) && undefined !== next ? next : 0,
    },
  };
  if ("parsing" !== blockMode || isLangSupported) {
    postOptions.stop = ["\n\n", "\r\n\r\n"];
  }
  const repoInfo = M_background_context_provider.extractRepoInfoInBackground(
    ctx,
    doc.fileName
  );
  const request = {
    prompt: prompt,
    languageId: doc.languageId,
    repoInfo: repoInfo,
    ourRequestId: requestId,
    engineUrl: await M_openai_conn_utils.getEngineURL(
      ctx,
      M_background_context_provider.tryGetGitHubNWO(repoInfo),
      doc.languageId,
      M_background_context_provider.getDogFood(repoInfo),
      await M_background_context_provider.getUserKind(ctx),
      t.savedTelemetryData
    ),
    count: t.solutionCountTarget,
    uiKind: M_openai_choices_utils.CopilotUiKind.Panel,
    postOptions: postOptions,
    requestLogProbs: !0,
  };
  
  let F;
  const completionType =
    t.completionContext.completionType ===
    M_completion_context.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX
      ? [
          M_completion_context.CompletionType.UNKNOWN_FUNCTION_QUICK_FIX,
          t.completionContext.prependToCompletion,
        ]
      : t.completionContext.completionType;

  switch (blockMode) {
    case M_config_stuff.BlockMode.Server:
      F = async (e) => {};
      postOptions.extra.force_indent = null !== (prev = contextIndentation.prev) && undefined !== prev ? prev : -1;
      postOptions.extra.trim_by_indentation = !0;
      break;
    case M_config_stuff.BlockMode.ParsingAndServer:
      F = isLangSupported ? isBlockBodyFinished(ctx, doc, t.startPosition, completionType) : async (e) => {};
      postOptions.extra.force_indent = null !== (w = contextIndentation.prev) && undefined !== w ? w : -1;
      postOptions.extra.trim_by_indentation = !0;
      break;
    case M_config_stuff.BlockMode.Parsing:
    default:
      F = isLangSupported ? isBlockBodyFinished(ctx, doc, t.startPosition, completionType) : async (e) => {};
  }

  ctx.get(M_status_reporter_maybe.StatusReporter).setProgress();
  const response = await ctx
    .get(M_openai_choices_utils.OpenAIFetcher)
    .fetchAndStreamCompletions(
      ctx,
      request,
      M_telemetry_stuff.TelemetryData.createAndMarkAsIssued(),
      F,
      cancellationToken
    );
  
  if ("failed" === response.type || "canceled" === response.type) {
    t.reportCancelled();
    ctx.get(M_status_reporter_maybe.StatusReporter).removeProgress();
    return {
      status: "FinishedWithError",
      error: `${response.type}: ${response.reason}`,
    };
  }

  let choices = response.choices;
  choices = (async function* (choices, prependToCompletion) {
    for await (const choice of choices) {
      const choice = {
        ...choice,
      };
      choice.completionText = prependToCompletion + choice.completionText.trimRight();
      yield choice;
    }
  })(choices, ctxPrependToCompletion);

  if (null !== ctxIndentation) {
    choices = M_openai_choices_utils.cleanupIndentChoices(choices, ctxIndentation);
  }
  choices = M_async_iterable_utils_maybe.asyncIterableMapFilter(choices, async (t) =>
    M_postprocess_choice.postProcessChoice(ctx, "solution", doc, ctxInsertPos, t, !1, logger)
  );

  const choicesProcessor = M_async_iterable_utils_maybe.asyncIterableMapFilter(
    choices,
    async (choice) => {
      let displayText = choice.completionText;
      logger.info(ctx, `Open Copilot completion: [${choice.completionText}]`);

      if (
        t.completionContext.completionType ===
          M_completion_context.CompletionType.OPEN_COPILOT ||
        t.completionContext.completionType ===
          M_completion_context.CompletionType.TODO_QUICK_FIX
      ) {
        let textBeforeInsertPosSameLine = "";
        const nodeStart = await M_context_extractor_from_identation_maybe.getNodeStart(
          ctx,
          doc,
          ctxInsertPos,
          choice.completionText
        );
        if (nodeStart)
          [textBeforeInsertPosSameLine] = M_prompt_extractor.trimLastLine(
            doc.getText(locFactory.range(locFactory.position(nodeStart.line, nodeStart.character), ctxInsertPos))
          );
        else {
          const e = locFactory.position(ctxInsertPos.line, 0);
          textBeforeInsertPosSameLine = doc.getText(locFactory.range(e, ctxInsertPos));
        }
        displayText = textBeforeInsertPosSameLine + displayText;
      }
      let completionText = choice.completionText;
      if (
        t.completionContext.completionType ===
        M_completion_context.CompletionType.TODO_QUICK_FIX
      ) {
        if (doc.lineAt(ctxInsertPos.line).isEmptyOrWhitespace) {
          completionText += "\n";
        }
      }
      if (trailingWs.length > 0 && completionText.startsWith(trailingWs)) {
        completionText = completionText.substring(trailingWs.length);
      }
      const meanLogProb = choice.meanLogProb;
      return {
        displayText: displayText,
        meanProb: undefined !== meanLogProb ? Math.exp(meanLogProb) : 0,
        meanLogProb: meanLogProb || 0,
        completionText: completionText,
        requestId: choice.requestId,
        choiceIndex: choice.choiceIndex,
        prependToCompletion: ctxPrependToCompletion,
      };
    }
  );

  return solnList(
    ctx.get(M_status_reporter_maybe.StatusReporter),
    cancellationToken,
    choicesProcessor[Symbol.asyncIterator]()
  );
};