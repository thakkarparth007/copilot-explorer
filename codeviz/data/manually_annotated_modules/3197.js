Object.defineProperty(exports, "__esModule", {
    value: !0,
  });
  exports.registerGhostText =
    exports.handleGhostTextPostInsert =
    exports.handleGhostTextShown =
    exports.provideInlineCompletions =
    exports.ghostTextLogger =
    exports.getInsertionTextFromCompletion =
      undefined;
  const M_vscode = require("vscode");
  const M_config_stuff = require("config-stuff");
  const M_completion_from_ghost_text = require("completion-from-ghost-text");
  const M_ghost_text_provider = require("ghost-text-provider");
  const M_ghost_text_telemetry = require("ghost-text-telemetry");
  const M_logging_utils = require("logging-utils");
  const M_post_accept_or_reject_tasks = require("post-accept-or-reject-tasks");
  const M_telemetry_stuff = require("telemetry-stuff");
  const M_ignore_document_or_not = require("ignore-document-or-not");
  
  // https://code.visualstudio.com/api/references/vscode-api#InlineCompletionItem
  const postInsertCmdName = "_ghostTextPostInsert"; // this command is called after an item is inserted
  
  function getInsertionTextFromCompletion(e) {
    return e.insertText;
  }
  
  // `f` and `m` seem to store state across suggestions
  // unable to completely decipher how they're updated, but
  // f seems to store positions, and m seems to store uri of the
  // document where the completion was shown.
  let f;
  let m;
  
  exports.getInsertionTextFromCompletion = getInsertionTextFromCompletion;
  exports.ghostTextLogger = new M_logging_utils.Logger(
    M_logging_utils.LogLevel.INFO,
    "ghostText"
  );
  let shownItemIdx;
  let shownItems = [];
  // this.ctx, doc, pos, completionCtx, cancellationToken
  async function provideInlineCompletions(ctx, doc, pos, completionCtx, cancellationToken) {
    const fn = await (async function (ctx, doc, pos, completionCtx, cancellationToken) {
      const telemetryData = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued();
      // check if inline suggestions are even enabled.
      if (
        !(function (ctx) {
          return M_config_stuff.getConfig(
            ctx,
            M_config_stuff.ConfigKey.InlineSuggestEnable
          );
        })(ctx)
      )
        return {
          type: "abortedBeforeIssued",
          reason: "ghost text is disabled",
        };
      
      // check if doc should be ignored
      if (M_ignore_document_or_not.ignoreDocument(ctx, doc))
        return {
          type: "abortedBeforeIssued",
          reason: "document is ignored",
        };
      
      exports.ghostTextLogger.debug(
        ctx,
        `Ghost text called at [${pos.line}, ${pos.character}], with triggerKind ${completionCtx.triggerKind}`
      );
  
      // don't proceed if cancelled already
      if (cancellationToken.isCancellationRequested)
        return (
          exports.ghostTextLogger.info(ctx, "Cancelled before extractPrompt"),
          {
            type: "abortedBeforeIssued",
            reason: "cancelled before extractPrompt",
          }
        );
      
      // nice, I didn't think of this while using copilot
      if (completionCtx.selectedCompletionInfo) {
        exports.ghostTextLogger.debug(
          ctx,
          "Not showing ghost text because autocomplete widget is displayed"
        );
        return {
          type: "abortedBeforeIssued",
          reason: "autocomplete widget is displayed",
        };
      }
  
      // the actual work happens here
      const ghostTextResult = await M_ghost_text_provider.getGhostText(
        ctx,
        doc,
        pos,
        completionCtx.triggerKind === M_vscode.InlineCompletionTriggerKind.Invoke,
        telemetryData,
        cancellationToken
      );
  
      if ("success" !== ghostTextResult.type) {
        exports.ghostTextLogger.debug(
          ctx,
          "Breaking, no results from getGhostText -- " + ghostTextResult.type + ": " + ghostTextResult.reason
        );
        return ghostTextResult;
      }
  
      // this b,w is hard to decipher. Need to get back to this.
      const [b, w] = ghostTextResult.value;
      if (
        f &&
        m &&
        (!f.isEqual(pos) || m !== doc.uri) &&
        w !== M_ghost_text_provider.ResultType.TypingAsSuggested
      ) {
        // i THINK what's happening here is if someone continues typing after seeing a suggestion
        // but the typing differs from the suggestion, then some stuff gets
        // sent to telemetry. Will get back to this.
        // my guess is _ contains stuff that's been typed so far....i think???????
        const t = shownItems.flatMap((shownItem) =>
          shownItem.displayText && shownItem.telemetry
            ? [
                {
                  completionText: shownItem.displayText,
                  completionTelemetryData: shownItem.telemetry,
                },
              ]
            : []
        );
        if (t.length > 0) {
          M_post_accept_or_reject_tasks.postRejectionTasks(
            ctx,
            "ghostText",
            doc.offsetAt(f),
            m,
            t
          );
        }
      }
      f = pos;
      m = doc.uri;
      shownItems = [];
  
      if (cancellationToken.isCancellationRequested)
        return (
          exports.ghostTextLogger.info(ctx, "Cancelled after getGhostText"),
          {
            type: "canceled",
            reason: "after getGhostText",
            telemetryData: {
              telemetryBlob: ghostTextResult.telemetryBlob,
            },
          }
        );
      
      
      const completions = M_completion_from_ghost_text.completionsFromGhostTextResults(
        ctx,
        b,
        w,
        doc,
        pos,
        (function (e) {
          const t = M_vscode.window.visibleTextEditors.find(
            (t) => t.document === e
          );
          return null == t ? undefined : t.options;
        })(doc),
        shownItemIdx
      );
  
      exports.ghostTextLogger.debug(ctx, "Completions", completions);
      
      const inlineCompletionItems = completions.map((completion) => {
        const { text: t, range: o } = completion;
        const i = new M_vscode.Range(
          new M_vscode.Position(o.start.line, o.start.character),
          new M_vscode.Position(o.end.line, o.end.character)
        );
        const item = new M_vscode.InlineCompletionItem(t, i);
        item.index = completion.index;
        item.telemetry = completion.telemetry;
        item.displayText = completion.displayText;
        item.resultType = completion.resultType;
        item.uri = doc.uri;
        item.insertOffset = doc.offsetAt(
          new M_vscode.Position(completion.position.line, completion.position.character)
        );
        // after this item is inserted, the `handleGhostTextPostInsert` will get called
        // because that's the fn registered as callback for `postInsertCmdName`
        item.command = {
          title: "PostInsertTask",
          command: postInsertCmdName,
          arguments: [item],
        };
        return item;
      });
  
      return 0 === inlineCompletionItems.length
        ? {
            type: "empty",
            reason: "no completions in final result",
            telemetryData: ghostTextResult.telemetryData,
          }
        : {
            ...ghostTextResult,
            value: inlineCompletionItems,
          };
    })(ctx, doc, pos, completionCtx, cancellationToken);
    return await M_ghost_text_telemetry.handleGhostTextResultTelemetry(ctx, fn);
  }
  exports.provideInlineCompletions = provideInlineCompletions;
  
  // implements vscode.InlineCompletionItemProvider
  class InlineCompletionItemProvider {
    constructor(e) {
      this.ctx = e;
    }
    // provideInlineCompletionItems(document: TextDocument, position: Position, context: InlineCompletionContext, token: CancellationToken): ProviderResult<InlineCompletionList<T> | T[]>;
    async provideInlineCompletionItems(doc, pos, completionCtx, cancellationToken) {
      return provideInlineCompletions(this.ctx, doc, pos, completionCtx, cancellationToken);
    }
    // undocumented function that gets called by vscode (whenever an item is shown?)
    // found info here: https://github.com/microsoft/vscode/issues/153754
    // https://github.com/juihanamshet1/HandleDidShowCompletionItem-bug/blob/9a48d06b3032b2b5dccc83aedbafeda7fa6d3786/inline-completions/src/extension.ts#L56
    handleDidShowCompletionItem(item) { // item is of type vscode.InlineCompletionItem
      handleGhostTextShown(this.ctx, item);
    }
  }
  
  function handleGhostTextShown(ctx, shownItem) {
    shownItemIdx = shownItem.index;
    if (!shownItems.find((e) => e.index === shownItem.index) &&
          (shownItems.push(shownItem), shownItem.telemetry)) {
      const fromCache = !(shownItem.resultType === M_ghost_text_provider.ResultType.Network);
      
      exports.ghostTextLogger.debug(
        ctx,
        `[${shownItem.telemetry.properties.headerRequestId}] shown choiceIndex: ${shownItem.telemetry.properties.choiceIndex}, fromCache ${fromCache}`
      );
  
        // record which item was shown to you.
        M_ghost_text_telemetry.telemetryShown(
          ctx,
          "ghostText",
          shownItem.telemetry,
          fromCache
        );
    }
  }
  
  // this function is called after an item is inserted
  async function handleGhostTextPostInsert(ctx, item) {
    // reset state variables.
    shownItems = [];
    m = undefined;
    f = undefined;
    exports.ghostTextLogger.debug(ctx, "Ghost text post insert");
    if (
      item.telemetry &&
      item.uri &&
      item.displayText &&
      undefined !== item.insertOffset &&
      item.range
    ) {
      // record that the item was inserted
      item.telemetry.measurements.compCharLen =
        getInsertionTextFromCompletion(item).length;
      await M_post_accept_or_reject_tasks.postInsertionTasks(
        ctx,
        "ghostText",
        item.displayText,
        item.insertOffset,
        item.uri,
        item.telemetry
      );
    }
  }
  
  exports.handleGhostTextShown = handleGhostTextShown;
  exports.handleGhostTextPostInsert = handleGhostTextPostInsert;
  exports.registerGhostText = function (ctx) {
    const t = new InlineCompletionItemProvider(ctx);
    return [
      M_vscode.languages.registerInlineCompletionItemProvider(
        {
          pattern: "**",
        },
        t
      ),
      M_vscode.commands.registerCommand(postInsertCmdName, async (item) =>
        handleGhostTextPostInsert(ctx, item)
      ),
    ];
  };
  