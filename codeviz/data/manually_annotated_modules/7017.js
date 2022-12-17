Object.defineProperty(exports, "__esModule", {
    value: true,
  });
  exports.postInsertionTasks =
    exports.postRejectionTasks =
    exports.captureCode =
      undefined;
  const M_change_tracker = require("change-tracker");
  const M_ghost_text_telemetry = require("ghost-text-telemetry");
  const M_logging_utils = require("logging-utils");
  const M_context_extractor_from_identation_maybe = require("context-extractor-from-identation-maybe");
  const M_prompt_extractor = require("prompt-extractor");
  const M_edit_distance_maybe = require("edit-distance");
  const M_telemetry_stuff = require("telemetry-stuff");
  const M_text_doc_relative_path = require("text-doc-relative-path");
  const d = new M_logging_utils.Logger(
    M_logging_utils.LogLevel.INFO,
    "post-insertion"
  );
  // These appear to be different timestamps when the measurements are taken.
  const measurementConfigs = [
    {
      seconds: 15,
      captureCode: false,
      captureRejection: false,
    },
    {
      seconds: 30,
      captureCode: true,
      captureRejection: true,
    },
    {
      seconds: 120,
      captureCode: false,
      captureRejection: false,
    },
    {
      seconds: 300,
      captureCode: false,
      captureRejection: false,
    },
    {
      seconds: 600,
      captureCode: false,
      captureRejection: false,
    },
  ];
  // ctx, docUri, chngTracker.offset
  async function captureCode(ctx, docUri, insertionOffset) {
    const doc = await ctx
      .get(M_text_doc_relative_path.TextDocumentManager)
      .getTextDocument(docUri);
    if (!doc) {
      d.info(
        ctx,
        `Could not get document for ${docUri.fsPath}. Maybe it was closed by the editor.`
      );
      return {
        prompt: {
          prefix: "",
          suffix: "",
          isFimEnabled: false,
          promptElementRanges: [],
        },
        capturedCode: "",
        terminationOffset: 0,
      };
    }
    const docText = doc.getText();
    const prefix = docText.substring(0, insertionOffset);
    const insertionPos = doc.positionAt(insertionOffset);
    // huh - you extract the prompt afresh? interesting. very interesting.
    // so now, instead of "remembering" what the original prompt was
    // and therefore "marking" that prompt lead/didn't lead to correct
    // completion.......instead of doing that, you're just collecting
    // new training data -- you're saying that at this inspection timestamp,
    // extract prompt that'd be used to complete at the insertion position
    // and we now already have ground truth of this insertion position
    // (stable version of the code after T seconds.)
    //
    // Interesting idea, except this capture-code method gets called
    // just 30s after accept/reject. So...chances are that it was done
    // this way just to not remember the prompt? Who knows.
    const promptWrapper = await M_prompt_extractor.extractPrompt(ctx, doc, insertionPos);
    const prompt =
      "prompt" === promptWrapper.type
        ? promptWrapper.prompt
        : {
            prefix: prefix,
            suffix: "",
            isFimEnabled: false,
            promptElementRanges: [],
          };
    const suffixAfterInsertion = docText.substring(insertionOffset);
    // absolutely no clue what this context-indentation-from-text thing is.
    // what does the name even mean.
    const f =
      M_context_extractor_from_identation_maybe.contextIndentationFromText(
        prefix,
        insertionOffset,
        doc.languageId
      );
    const m = M_context_extractor_from_identation_maybe.indentationBlockFinished(
      f,
      undefined
    );
    const g = await m(suffixAfterInsertion);
    const _ = Math.min(docText.length, insertionOffset + (g ? 2 * g : 500));
    // but basically looks like it's used to determine how much of the code
    // after the insertion point is relevant for this code completion.
    // because capturedCode is docText.substring(insertionOffset, _)
    return {
      prompt: prompt,
      capturedCode: docText.substring(insertionOffset, _),
      terminationOffset: null != g ? g : -1,
    };
  }
  // docText, displayText, 50, chngTracker.offset
  // docText, displayText, 1500, chngTracker.offset
  // This function appears to compute edit distance between
  // a window around where the suggestion was inserted,
  // and the suggestion itself.
  // not sure why window is considered here exactly.
  // window size is 50 and 1500 resp.
  function f(docText, choiceDisplayText, n, offset) {
    const windowAroundInsertion = docText.substring(
      Math.max(0, offset - n),
      Math.min(docText.length, offset + choiceDisplayText.length + n)
    );
    const i = M_edit_distance_maybe.lexEditDistance(windowAroundInsertion, choiceDisplayText);
    const s = i.lexDistance / i.needleLexLength;
    const { distance: a } = M_edit_distance_maybe.editDistance(
      windowAroundInsertion.substring(i.startOffset, i.endOffset),
      choiceDisplayText
    );
    return {
      relativeLexEditDistance: s,
      charEditDistance: a,
      completionLexLength: i.needleLexLength,
      foundOffset: i.startOffset + Math.max(0, offset - n),
      lexEditDistance: i.lexDistance,
      stillInCodeHeuristic: s <= 0.5 ? 1 : 0,
    };
  }
  exports.captureCode = captureCode;
  exports.postRejectionTasks = function (e, t, n, i, s) {
    s.forEach(({ completionText: n, completionTelemetryData: r }) => {
      d.debug(e, `${t}.rejected choiceIndex: ${r.properties.choiceIndex}`);
      M_ghost_text_telemetry.telemetryRejected(e, t, r);
    });
    const a = new M_change_tracker.ChangeTracker(e, i, n);
    measurementConfigs.filter((e) => e.captureRejection).map((r) => {
      a.push(async () => {
        d.debug(e, `Original offset: ${n}, Tracked offset: ${a.offset}`);
        const { completionTelemetryData: o } = s[0];
        const {
          prompt: c,
          capturedCode: u,
          terminationOffset: p,
        } = await captureCode(e, i, a.offset);
        let f;
        f = c.isFimEnabled
          ? {
              hypotheticalPromptPrefixJson: JSON.stringify(c.prefix),
              hypotheticalPromptSuffixJson: JSON.stringify(c.suffix),
            }
          : {
              hypotheticalPromptJson: JSON.stringify(c.prefix),
            };
        const m = o.extendedBy(
          {
            ...f,
            capturedCodeJson: JSON.stringify(u),
          },
          {
            timeout: r.seconds,
            insertionOffset: n,
            trackedOffset: a.offset,
            terminationOffsetInCapturedCode: p,
          }
        );
        d.debug(
          e,
          `${t}.capturedAfterRejected choiceIndex: ${o.properties.choiceIndex}`,
          m
        );
        M_telemetry_stuff.telemetry(e, t + ".capturedAfterRejected", m, true);
      }, 1e3 * r.seconds);
    });
  };
  
  // ctx, "ghostText", item.displayText, item.insertOffset, item.uri, item.telemetry
  exports.postInsertionTasks = async function (ctx, flow, choiceDisplayText, insertOffset, docUri, telemetry) {
    d.debug(ctx, `${flow}.accepted choiceIndex: ${telemetry.properties.choiceIndex}`);
    M_ghost_text_telemetry.telemetryAccepted(ctx, flow, telemetry);
    const chngTracker = new M_change_tracker.ChangeTracker(ctx, docUri, insertOffset);
    const displayText = choiceDisplayText.trim();
    // set a timeout for every measurement config shown above
    // i.e., after 15s, 30s, 2min, 5min, 10min
    measurementConfigs.map((mConf) =>
      chngTracker.push(
        () =>
          (async function (ctx, flow, displayText, insertOffset, docUri, mConf, telemetry, chngTracker) {
            const doc = await ctx
              .get(M_text_doc_relative_path.TextDocumentManager)
              .getTextDocument(docUri);
            if (doc) {
              const docText = doc.getText();
              let p = f(docText, displayText, 50, chngTracker.offset);
              if (p.stillInCodeHeuristic) {
                p = f(docText, displayText, 1500, chngTracker.offset);
              }
              d.debug(
                ctx,
                `stillInCode: ${
                  p.stillInCodeHeuristic ? "Found" : "Not found"
                }! Completion '${displayText}' in file ${
                  docUri.fsPath
                }. lexEditDistance fraction was ${
                  p.relativeLexEditDistance
                }. Char edit distance was ${
                  p.charEditDistance
                }. Inserted at ${insertOffset}, tracked at ${chngTracker.offset}, found at ${
                  p.foundOffset
                }. choiceIndex: ${telemetry.properties.choiceIndex}`
              );
              const m = telemetry
                .extendedBy(
                  {},
                  {
                    timeout: mConf.seconds,
                    insertionOffset: insertOffset,
                    trackedOffset: chngTracker.offset,
                  }
                )
                .extendedBy({}, p);
              M_telemetry_stuff.telemetry(ctx, flow + ".stillInCode", m);
              if (mConf.captureCode) {
                const {
                  prompt: prompt,
                  capturedCode: c,
                  terminationOffset: u,
                } = await captureCode(ctx, docUri, chngTracker.offset);
                let p;
                p = prompt.isFimEnabled
                  ? {
                      hypotheticalPromptPrefixJson: JSON.stringify(prompt.prefix),
                      hypotheticalPromptSuffixJson: JSON.stringify(prompt.suffix),
                    }
                  : {
                      hypotheticalPromptJson: JSON.stringify(prompt.prefix),
                    };
                const f = telemetry.extendedBy(
                  {
                    ...p,
                    capturedCodeJson: JSON.stringify(c),
                  },
                  {
                    timeout: mConf.seconds,
                    insertionOffset: insertOffset,
                    trackedOffset: chngTracker.offset,
                    terminationOffsetInCapturedCode: u,
                  }
                );
                d.debug(
                  ctx,
                  `${flow}.capturedAfterAccepted choiceIndex: ${telemetry.properties.choiceIndex}`,
                  m
                ),
                  (0, M_telemetry_stuff.telemetry)(
                    ctx,
                    flow + ".capturedAfterAccepted",
                    f,
                    true
                  );
              }
            }
          })(ctx, flow, displayText, insertOffset, docUri, mConf, telemetry, chngTracker),
        1e3 * mConf.seconds
      )
    );
  };
  