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
  
  var ResultType;
  
  // seems to be like some state variables
  // not fully understood them but it seems like I is used
  // for storing doc from start till the cursor position
  // that's used for detecting if user is "TypingAsSuggested"
  // P is storing the last prompt's cache key.
  // but my understanding is murky.
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
  
  function trimCompletion(choice, opt) {
    const n = {
      ...choice,
    };
    n.completionText = choice.completionText.trimEnd();
    if (opt.forceSingleLine) {
      n.completionText = n.completionText.split("\n")[0];
    }
    return n;
  }
  
  exports.ghostTextLogger = new M_logging_utils.Logger(
    M_logging_utils.LogLevel.INFO,
    "ghostText"
  );
  
  // There seem to be 4 types of Results: Network, Cache, TypingAsSuggested, Cycling
  (function (e) {
    e[(e.Network = 0)] = "Network";
    e[(e.Cache = 1)] = "Cache";
    e[(e.TypingAsSuggested = 2)] = "TypingAsSuggested";
    e[(e.Cycling = 3)] = "Cycling";
  })((ResultType = exports.ResultType || (exports.ResultType = {})));
  
  // Cache size is 100 (key is prompt, val is a list of choices)
  // Interestingly, the cache in the CopilotPanel workflow is of size 1e4.
  exports.completionCache = new M_prompt_cache.LRUCache(100);
  
  const debouncer = new M_debouncer.Debouncer();
  
  // just updates the state variables
  function R(e, t) {
    I = e;
    P = t;
  }
  
  // options seems to be of form {multiline: bool, choices: list}
  function cacheCompletion(ctx, promptWrapper, options) {
    const promptCacheKey = M_prompt_cache.keyForPrompt(promptWrapper.prompt);
    const cachedVal = exports.completionCache.get(promptCacheKey);
    if (cachedVal && cachedVal.multiline === options.multiline) {
      exports.completionCache.put(promptCacheKey, {
        multiline: cachedVal.multiline,
        choices: cachedVal.choices.concat(options.choices),
      });
    } else {
      exports.completionCache.put(promptCacheKey, options);
    }
    exports.ghostTextLogger.debug(
      ctx,
      `Appended cached ghost text for key: ${promptCacheKey}, multiline: ${options.multiline}, number of suggestions: ${options.choices.length}`
    );
  }
  
  function getCachedChoices(promptCacheKey, n) {
    const cachedVal = exports.completionCache.get(promptCacheKey);
    if (cachedVal && (!n || cachedVal.multiline))
        return cachedVal.choices;
  }
  
  // not exactly sure what's going on here but seems like some adjustment for whitespaces
  // i think it gets used when user keeps typing as suggestion is shown
  function adjustCompletionForWS(choiceIndex, completionText, trailingWs) {
    if (trailingWs.length > 0) {
      if (completionText.startsWith(trailingWs))
        return {
          completionIndex: choiceIndex,
          completionText: completionText,
          displayText: completionText.substr(trailingWs.length),
          displayNeedsWsOffset: !1,
        };
      {
        const r = completionText.substr(0, completionText.length - completionText.trimLeft().length);
        return trailingWs.startsWith(r)
          ? {
              completionIndex: choiceIndex,
              completionText: completionText,
              displayText: completionText.trimLeft(),
              displayNeedsWsOffset: !0,
            }
          : {
              completionIndex: choiceIndex,
              completionText: completionText,
              displayText: completionText,
              displayNeedsWsOffset: !1,
            };
      }
    }
    return {
      completionIndex: choiceIndex,
      completionText: completionText,
      displayText: completionText,
      displayNeedsWsOffset: !1,
    };
  }
  
  function getExtendedTelemetryObj(ctx, n) {
    const requestId = n.requestId;
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
    const telemetryObj = n.telemetryData.extendedBy(o, i);
    telemetryObj.extendWithRequestId(requestId);
    telemetryObj.measurements.confidence = M_ghost_text_score_maybe.ghostTextScoreConfidence(
      ctx,
      telemetryObj
    );
    telemetryObj.measurements.quantile = M_ghost_text_score_maybe.ghostTextScoreQuantile(
      ctx,
      telemetryObj
    );
    exports.ghostTextLogger.debug(
      ctx,
      `Extended telemetry for ${n.telemetryData.properties.headerRequestId} with retention confidence ${telemetryObj.measurements.confidence} (expected as good or better than about ${telemetryObj.measurements.quantile} of all suggestions)`
    );
    return telemetryObj;
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
  
  // The main stufffffffffff
  exports.getGhostText = async function (ctx, doc, pos, isCycling, d, cancellationToken) {
    var v;
    var j;
  
    const promptWrapper = await M_prompt_extractor.extractPrompt(ctx, doc, pos);
    if ("contextTooShort" === promptWrapper.type) {
      exports.ghostTextLogger.debug(ctx, "Breaking, not enough context");
      return {
        type: "abortedBeforeIssued",
        reason: "Not enough context",
      };
    }
  
    if (null == cancellationToken ? undefined : cancellationToken.isCancellationRequested) {
      exports.ghostTextLogger.info(ctx, "Cancelled after extractPrompt");
      return {
        type: "abortedBeforeIssued",
        reason: "Cancelled after extractPrompt",
      };
    }
    
    // 3 possible values:
    // undefined -- cursor in middle of line, can't insert
    // false -- cursor at end of line (maybe whitespace is there at the end but that's ignored)
    // true -- some brackets/semicolons follow the cursor, but nothing significant.
    const isMiddleOfLine = (function (doc, pos) {
      const hasSuffixOnLine =
        0 != doc.lineAt(pos).text.substr(pos.character).trim().length;
  
      const isSuffixIgnorable = (function (pos, doc) {
        const suffixOnLine = doc.lineAt(pos).text.substr(pos.character).trim();
        return /^\s*[)}\]"'`]*\s*[:{;,]?\s*$/.test(suffixOnLine);
      })(pos, doc);
  
      if (!hasSuffixOnLine || isSuffixIgnorable)
          return hasSuffixOnLine && isSuffixIgnorable;
    })(doc, pos);
  
    if (undefined === isMiddleOfLine) {
      exports.ghostTextLogger.debug(ctx, "Breaking, invalid middle of the line");
      return {
        type: "abortedBeforeIssued",
        reason: "Invalid middle of the line",
      };
    }
  
    const statusReporter = ctx.get(M_status_reporter_maybe.StatusReporter);
    const locationFactory = ctx.get(M_location_factory.LocationFactory);
    const requestOptions = await (async function (ctx, doc, pos, promptWrapper, isCycling, isMiddleOfLine) {
      // not really sure what blockmode is...but seems language dependent.
      const blockMode = await ctx
        .get(M_config_stuff.BlockModeConfig)
        .forLanguage(ctx, doc.languageId);
  
      switch (blockMode) {
        case M_config_stuff.BlockMode.Server:
          return {
            blockMode: M_config_stuff.BlockMode.Server,
            requestMultiline: true,
            isCyclingRequest: isCycling,
            finishedCb: async (e) => {},
          };
  
        case M_config_stuff.BlockMode.Parsing:
        case M_config_stuff.BlockMode.ParsingAndServer:
        default: {
          const requestMultiLine = await (async function (ctx, doc, pos, isMiddleOfLine) {
            // huh, interesting. skip multiline if it's a long file?
            if (doc.lineCount >= 8e3) {
              M_telemetry_stuff.telemetry(
                ctx,
                "ghostText.longFileMultilineSkip",
                M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
                  languageId: doc.languageId,
                  lineCount: String(doc.lineCount),
                  currentLine: String(pos.line),
                })
              );
            }
            else {
              if (
                !isMiddleOfLine &&
                M_getPrompt_main_stuff.isSupportedLanguageId(doc.languageId)
              )
                return await M_context_extractor_from_identation_maybe.isEmptyBlockStart(
                  doc,
                  pos
                );
              if (isMiddleOfLine && M_getPrompt_main_stuff.isSupportedLanguageId(doc.languageId))
                return (
                  (await M_context_extractor_from_identation_maybe.isEmptyBlockStart(
                    doc,
                    pos
                  )) ||
                  (await M_context_extractor_from_identation_maybe.isEmptyBlockStart(
                    doc,
                    doc.lineAt(pos).range.end
                  ))
                );
            }
            return false;
          })(ctx, doc, pos, isMiddleOfLine);
          return requestMultiLine
            ? {
                blockMode: blockMode,
                requestMultiline: !0,
                isCyclingRequest: !1,
                finishedCb: async (r) => {
                  // dk what `r` is. tried following calls to isBlockBodyFinished
                  // but it's rather deeply
                  let i;
                  i =
                    promptWrapper.trailingWs.length > 0 &&
                    !promptWrapper.prompt.prefix.endsWith(promptWrapper.trailingWs)
                      ? ctx
                          .get(M_location_factory.LocationFactory)
                          .position(
                            pos.line,
                            Math.max(pos.character - promptWrapper.trailingWs.length, 0)
                          )
                      : pos;
                  return M_context_extractor_from_identation_maybe.isBlockBodyFinished(
                    ctx,
                    doc,
                    i,
                    r
                  );
                },
              }
            : {
                blockMode: blockMode,
                requestMultiline: !1,
                isCyclingRequest: isCycling,
                finishedCb: async (e) => {},
              };
        }
      }
    })(ctx, doc, pos, promptWrapper, isCycling, isMiddleOfLine);
    if (null == cancellationToken ? undefined : cancellationToken.isCancellationRequested) {
      exports.ghostTextLogger.info(ctx, "Cancelled after requestMultiline");
      return {
        type: "abortedBeforeIssued",
        reason: "Cancelled after requestMultiline",
      };
    }
  
    // this looks like all text in doc till the cursor - but that's insane, especially
    // if you consider the following code. Am I getting something wrong?
    const [docTillCursor] = M_prompt_extractor.trimLastLine(
      doc.getText(locationFactory.range(locationFactory.position(0, 0), pos))
    );
  
    // get choices that either match whatever the user's typing
    // otherwise return cached choices - I don't fully understand the details
    // but this is what's being computed roughly
    let choices = (function (ctx, docTillCursor, prompt, requestMultiline) {
      // step1: filter out all cached choices that don't match whatever the user has typed
      const cachedChoicesMatchingTypedText = (function (ctx, docTillCursor, requestMultiline) {
        // I stores the doc till cursor from last "snapshot"
        if (!I || !P || !docTillCursor.startsWith(I)) return;
        const cachedChoices = getCachedChoices(P, requestMultiline);
        if (!cachedChoices) return;
        const i = docTillCursor.substring(I.length);
        exports.ghostTextLogger.debug(
          ctx,
          `Getting completions for user-typing flow - remaining prefix: ${i}`
        );
        const updatedChoices = [];
        cachedChoices.forEach((choice) => {
          const trimmedChoice = trimCompletion(choice, {
            forceSingleLine: false,
          });
          if (trimmedChoice.completionText.startsWith(i)) {
            trimmedChoice.completionText = trimmedChoice.completionText.substring(i.length);
            updatedChoices.push(trimmedChoice);
          }
        });
        return updatedChoices;
      })(ctx, docTillCursor, requestMultiline);
  
      if (cachedChoicesMatchingTypedText && cachedChoicesMatchingTypedText.length > 0)
          return [cachedChoicesMatchingTypedText, ResultType.TypingAsSuggested];
      
      const cachedChoices = (function (ctx, n, prompt, requestMultiline) {
        const promptCacheKey = M_prompt_cache.keyForPrompt(prompt);
        exports.ghostTextLogger.debug(
          ctx,
          `Trying to get completions from cache for key: ${promptCacheKey}`
        );
        const cachedChoices = getCachedChoices(promptCacheKey, requestMultiline);
        if (cachedChoices) {
          exports.ghostTextLogger.debug(
            ctx,
            `Got completions from cache for key: ${promptCacheKey}`
          );
          const trimmedChoices = [];
          cachedChoices.forEach((e) => {
            const t = trimCompletion(e, {
              forceSingleLine: !requestMultiline,
            });
            trimmedChoices.push(t);
          });
          // dk why this is there -- all choices would be non-empty ones, right?
          // i think i'm missing something in this code.
          const i = trimmedChoices.filter((e) => e.completionText);
          if (i.length > 0) {
            R(n, promptCacheKey);
          }
          return i;
        }
      })(ctx, docTillCursor, prompt, requestMultiline);
      return cachedChoices && cachedChoices.length > 0 ? [cachedChoices, ResultType.Cache] : undefined;
    })(ctx, docTillCursor, promptWrapper.prompt, requestOptions.requestMultiline);
  
    /* Now it looks like we're making request to the model */
  
    const requestId = M_uuid_utils.v4();
    const repoInfo = M_background_context_provider.extractRepoInfoInBackground(
      ctx,
      doc.fileName
    );
    const engineUrl = await M_openai_conn_utils.getEngineURL(
      ctx,
      M_background_context_provider.tryGetGitHubNWO(repoInfo),
      doc.languageId,
      M_background_context_provider.getDogFood(repoInfo),
      await M_background_context_provider.getUserKind(ctx),
      d
    );
  
    // I'm guessing this controls how long to wait before making request to model?
    const delayMs = await ctx
      .get(M_task_maybe.Features)
      .beforeRequestWaitMs(
        M_background_context_provider.tryGetGitHubNWO(repoInfo) || "",
        doc.languageId
      );
  
    // no clue what this parameter is for
    const multiLogitBias = await ctx
      .get(M_task_maybe.Features)
      .multiLogitBias(
        M_background_context_provider.tryGetGitHubNWO(repoInfo) || "",
        doc.languageId
      );
  
    const requestPayload = {
      blockMode: requestOptions.blockMode,
      languageId: doc.languageId,
      repoInfo: repoInfo,
      engineURL: engineUrl,
      ourRequestId: requestId,
      prefix: docTillCursor,
      prompt: promptWrapper.prompt,
      multiline: requestOptions.requestMultiline,
      indentation: M_context_extractor_from_identation_maybe.contextIndentation(
        doc,
        pos
      ),
      isCycling: isCycling,
      delayMs: delayMs,
      multiLogitBias: multiLogitBias,
    };
  
    const debouncePredict = await ctx.get(M_task_maybe.Features).debouncePredict();
    const contextualFilterEnabled = await ctx.get(M_task_maybe.Features).contextualFilterEnable();
    const contextualFilterAccThresh = await ctx
      .get(M_task_maybe.Features)
      .contextualFilterAcceptThreshold();
    let ne = false;
    if (debouncePredict || contextualFilterEnabled) {
      ne = true;
    }
    const telemetryObject = (function (ctx, doc, requestPayload, pos, promptWrapper, d, ne) {
      const locFactory = ctx.get(M_location_factory.LocationFactory);
      const lineAtPos = doc.lineAt(pos.line);
      const linePrefix = doc.getText(locFactory.range(lineAtPos.range.start, pos));
      const lineSuffix = doc.getText(locFactory.range(pos, lineAtPos.range.end));
      const d = {
        languageId: doc.languageId,
        beforeCursorWhitespace: JSON.stringify("" === linePrefix.trim()),
        afterCursorWhitespace: JSON.stringify("" === lineSuffix.trim()),
      };
      const p = {
        ...M_telemetry_stuff.telemetrizePromptLength(promptWrapper.prompt),
        promptEndPos: doc.offsetAt(pos),
        documentLength: doc.getText().length,
        delayMs: requestPayload.delayMs,
      };
      const f = d.extendedBy(d, p);
      f.properties.promptChoices = JSON.stringify(promptWrapper.promptChoices, (e, t) =>
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
      f.properties.promptBackground = JSON.stringify(promptWrapper.promptBackground, (e, t) =>
        t instanceof Map ? Array.from(t.values()) : t
      );
      f.measurements.promptComputeTimeMs = promptWrapper.computeTimeMs;
      if (ne) {
        f.measurements.contextualFilterScore =
          M_contextual_filter_manager.contextualFilterScore(ctx, f, promptWrapper.prompt);
      }
      const m = requestPayload.repoInfo;
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
        ctx,
        requestPayload.engineURL
      );
      f.properties.isMultiline = JSON.stringify(requestPayload.multiline);
      f.properties.blockMode = requestPayload.blockMode;
      f.properties.isCycling = JSON.stringify(requestPayload.isCycling);
      f.properties.headerRequestId = requestPayload.ourRequestId;
      M_telemetry_stuff.telemetry(ctx, "ghostText.issued", f);
      return f;
    })(ctx, doc, requestPayload, pos, promptWrapper, d, ne);
    
    if (
      (requestOptions.isCyclingRequest &&
        (null !== (v = null == choices ? undefined : choices[0].length) && undefined !== v
          ? v
          : 0) > 1) ||
      (!requestOptions.isCyclingRequest && undefined !== choices)
    )
      exports.ghostTextLogger.info(ctx, "Found inline suggestions locally");
    else {
      if (null == statusReporter) {
        statusReporter.setProgress();
      }
      if (requestOptions.isCyclingRequest) {
        const n = await (async function (ctx, requestPayload, telemetryObject, cancellationToken, finishedCb) {
          return A(ctx, requestPayload, telemetryObject, cancellationToken, finishedCb, "all completions", async (i, s, a, c) => {
            const l = [];
            for await (const n of c) {
              if (null == cancellationToken ? void 0 : cancellationToken.isCancellationRequested)
                return (
                  exports.ghostTextLogger.debug(
                    ctx,
                    "Cancelled after awaiting choices iterator"
                  ),
                  {
                    type: "canceled",
                    reason: "after awaiting choices iterator",
                    telemetryData: (0,
                    M_ghost_text_telemetry.mkCanceledResultTelemetry)(telemetryObject),
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
                (cacheCompletion(ctx, requestPayload, {
                  multiline: requestPayload.multiline,
                  choices: l,
                }),
                F(ctx, "cyclingPerformance", l[0], s, a)),
              {
                type: "success",
                value: l,
                telemetryData: (0, M_ghost_text_telemetry.mkBasicResultTelemetry)(
                  telemetryObject
                ),
                telemetryBlob: telemetryObject,
              }
            );
          });
        })(ctx, requestPayload, telemetryObject, cancellationToken, requestOptions.finishedCb);
        if ("success" === n.type) {
          const e =
            null !== (j = null == choices ? void 0 : choices[0]) && void 0 !== j ? j : [];
          n.value.forEach((t) => {
            -1 ===
              e.findIndex(
                (e) => e.completionText.trim() === t.completionText.trim()
              ) && e.push(t);
          }),
            (choices = [e, ResultType.Cycling]);
        } else if (void 0 === choices) return null == statusReporter || statusReporter.removeProgress(), n;
      } else {
        const n = await (0, M_ghost_text_debouncer_maybe.getDebounceLimit)(ctx, telemetryObject);
        try {
          await debouncer.debounce(n);
        } catch {
          return {
            type: "canceled",
            reason: "by debouncer",
            telemetryData: (0, M_ghost_text_telemetry.mkCanceledResultTelemetry)(
              telemetryObject
            ),
          };
        }
        if (null == cancellationToken ? void 0 : cancellationToken.isCancellationRequested)
          return (
            exports.ghostTextLogger.info(ctx, "Cancelled during debounce"),
            {
              type: "canceled",
              reason: "during debounce",
              telemetryData: (0,
              M_ghost_text_telemetry.mkCanceledResultTelemetry)(telemetryObject),
            }
          );
        if (
          contextualFilterEnabled &&
          telemetryObject.measurements.contextualFilterScore &&
          telemetryObject.measurements.contextualFilterScore < contextualFilterAccThresh / 100
        )
          return (
            exports.ghostTextLogger.info(ctx, "Cancelled by contextual filter"),
            {
              type: "canceled",
              reason: "contextualFilterScore below threshold",
              telemetryData: (0,
              M_ghost_text_telemetry.mkCanceledResultTelemetry)(telemetryObject),
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
                cacheCompletion(e, n, {
                  multiline: n.multiline,
                  choices: o,
                });
            });
            return (
              (0, M_runtime_mode_maybe.isRunningInTest)(e) && (await m),
              {
                type: "success",
                value: trimCompletion(d.value, {
                  forceSingleLine: !1,
                }),
                telemetryData: (0, M_ghost_text_telemetry.mkBasicResultTelemetry)(
                  r
                ),
                telemetryBlob: r,
              }
            );
          });
        })(ctx, requestPayload, telemetryObject, cancellationToken, requestOptions.finishedCb);
        if ("success" !== r.type) return null == statusReporter || statusReporter.removeProgress(), r;
        choices = [[r.value], ResultType.Network];
      }
      if (null == statusReporter) {
        statusReporter.removeProgress();
      }
    }
    if (undefined === choices)
      return {
        type: "failed",
        reason: "internal error: choices should be defined after network call",
        telemetryData: M_ghost_text_telemetry.mkBasicResultTelemetry(telemetryObject),
      };
    const [oe, ie] = choices;
    const se = M_async_iterable_utils_maybe.asyncIterableMapFilter(
      M_async_iterable_utils_maybe.asyncIterableFromArray(oe),
      async (r) =>
        M_postprocess_choice.postProcessChoice(
          ctx,
          "ghostText",
          doc,
          pos,
          r,
          isMiddleOfLine,
          exports.ghostTextLogger
        )
    );
    const ae = [];
    for await (const r of se) {
      const o = isMiddleOfLine && M_postprocess_choice.checkSuffix(doc, pos, r);
      if (null == cancellationToken ? undefined : cancellationToken.isCancellationRequested) {
        exports.ghostTextLogger.info(
          ctx,
          "Cancelled after post processing completions"
        );
        return {
          type: "canceled",
          reason: "after post processing completions",
          telemetryData: M_ghost_text_telemetry.mkCanceledResultTelemetry(telemetryObject),
        };
      }
      const i = getExtendedTelemetryObj(ctx, r);
      const a = {
        completion: adjustCompletionForWS(r.choiceIndex, r.completionText, promptWrapper.trailingWs),
        telemetry: i,
        isMiddleOfTheLine: isMiddleOfLine,
        coversSuffix: o,
      };
      ae.push(a);
    }
    return {
      type: "success",
      value: [ae, ie],
      telemetryData: M_ghost_text_telemetry.mkBasicResultTelemetry(telemetryObject),
      telemetryBlob: telemetryObject,
    };
  };
  