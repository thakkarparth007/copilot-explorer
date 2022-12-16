// prompt-extractor.js
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.extractPrompt =
  exports.trimLastLine =
  exports._contextTooShort =
  exports.MIN_PROMPT_CHARS =
    undefined;

const M_getPrompt_main_stuff = require("getPrompt-main-stuff");
const M_config_stuff = require("config-stuff");
const M_doc_tracker = require("doc-tracker");
const M_task_maybe = require("task");
const M_text_doc_relative_path = require("text-doc-relative-path");
const M_get_prompt_parsing_utils_maybe = require("get-prompt-parsing-utils");
const M_background_context_provider = require("background-context-provider");

function trimLastLine(str) { // returns [trimmedString, ws]
  const lines = str.split("\n");
  const lastLine = lines[lines.length - 1];
  const nTrailingWS = lastLine.length - lastLine.trimRight().length;
  const beforeWS = str.slice(0, str.length - nTrailingWS);
  const ws = str.substr(beforeWS.length);
  return [lastLine.length == nTrailingWS ? beforeWS : str, ws];
}

// (ctx, doc.getText(), doc.offsetAt(insertPos), relativePath, doc.uri, doc.languageId)
async function getPromptHelper(ctx, docText, insertOffset, docRelPath, docUri, docLangId) {
  var githubNWORaw; // NWO = "name with owner", e.g., "microsoft/vscode"
  const githubNWO =
    null !==
      (githubNWORaw = M_background_context_provider.tryGetGitHubNWO(
        M_background_context_provider.extractRepoInfoInBackground(ctx, docUri.fsPath)
      )) && undefined !== githubNWORaw
      ? githubNWORaw
      : "";
  
  const suffixPercent = await M_config_stuff.suffixPercent(ctx, githubNWO, docLangId);
  const fimSuffixLengthThresh = await M_config_stuff.fimSuffixLengthThreshold(ctx, githubNWO, docLangId);
  // if suffixPercent > 0, then we're in FIM mode, which means the context can be the whole file
  // otherwise, it's everything till the cursor.
  // context size is determined based on the above two conditions.
  if ((suffixPercent > 0 ? docText.length : insertOffset) < exports.MIN_PROMPT_CHARS)
    return exports._contextTooShort;
  
  const now = Date.now();
  const {
    prefix: prefix,
    suffix: suffix,
    promptChoices: promptChoices,
    promptBackground: promptBackground,
    promptElementRanges: promptElementRanges,
  } = await (async function (ctx, docText, insertOffset, docRelPath, docUri, docLangId) {
    var h;
    let relevantDocs = []; // list of atmost 20 other files in the workspace that are of the same language as the current file
    relevantDocs = await (async function (ctx, docFsPath, docLangId) {
      // stores a list of {uri, relativePath, languageId, source} for all OTHER files in the workspace
      // that are of the same language as the current file
      const relevantDocs = [];

      // sortedTextDocs is a sorted array of all "text docs known to the editor"
      // https://code.visualstudio.com/api/references/vscode-api
      const sortedTextDocs = M_doc_tracker.sortByAccessTimes(
        ctx.get(M_text_doc_relative_path.TextDocumentManager).textDocuments
      );

      let totalSize = 0;
      for (const doc of sortedTextDocs) {
        // if we've already added 20 files, or the total size of all files is > 200k, stop
        if (relevantDocs.length + 1 > 20 || totalSize + doc.getText().length > 2e5) break;

        if ("file" == doc.uri.scheme && doc.fileName !== docFsPath && doc.languageId === docLangId) {
          relevantDocs.push({
            uri: doc.uri.toString(),
            relativePath: await ctx
              .get(M_text_doc_relative_path.TextDocumentManager)
              .getRelativePath(doc), // takes care of edge cases like "Untitled-1"
            languageId: doc.languageId,
            source: doc.getText(),
          });
        
          totalSize += doc.getText().length;
        }
      }
      return relevantDocs;
    })(ctx, docUri.fsPath, docLangId);
    
    const thisFile = {
      uri: docUri.toString(),
      source: docText,
      offset: insertOffset,
      relativePath: docRelPath,
      languageId: docLangId,
    };

    const githubNWO =
      null !==
        (h = M_background_context_provider.tryGetGitHubNWO(
          M_background_context_provider.extractRepoInfoInBackground(ctx, docUri.fsPath)
        )) && undefined !== h
        ? h
        : "";

    let promptOptions = {
      // copilot still uses contextSize = 2048
      maxPromptLength:
        2048 -
        M_config_stuff.getConfig(ctx, M_config_stuff.ConfigKey.SolutionLength),

      neighboringTabs: await ctx
        .get(M_task_maybe.Features)
        .neighboringTabsOption(githubNWO, docLangId),

      // one of Cursor, CursorTrimStart, SiblingBlock, SiblingBlockTrimStart
      // (getPrompt-main-stuff)
      suffixStartMode: await ctx.get(M_task_maybe.Features).suffixStartMode(githubNWO, docLangId),
    };

    const suffixPercent = await M_config_stuff.suffixPercent(ctx, githubNWO, docLangId);
    const suffixMatchThresh = await M_config_stuff.suffixMatchThreshold(ctx, githubNWO, docLangId);
    const fimSuffixLengthThresh = await M_config_stuff.fimSuffixLengthThreshold(ctx, githubNWO, docLangId);

    if (suffixPercent > 0) {
      promptOptions = {
        ...promptOptions,
        // huh, this one's hardcoded in this version.
        includeSiblingFunctions:
          M_getPrompt_main_stuff.SiblingOption.NoSiblings,

        suffixPercent: suffixPercent,
        suffixMatchThreshold: suffixMatchThresh,
        fimSuffixLengthThreshold: fimSuffixLengthThresh,
      };
    }
    const fs = ctx.get(M_getPrompt_main_stuff.FileSystem);
    return await M_get_prompt_parsing_utils_maybe.getPrompt(fs, thisFile, promptOptions, relevantDocs);
  })(ctx, docText, insertOffset, docRelPath, docUri, docLangId);

  const [trimmedPrefix, trailingWs] = trimLastLine(prefix);
  const now2 = Date.now();

  return {
    type: "prompt",
    prompt: {
      prefix: trimmedPrefix,
      suffix: suffix,
      isFimEnabled: suffixPercent > 0 && suffix.length > fimSuffixLengthThresh,
      promptElementRanges: promptElementRanges.ranges,
    },
    trailingWs: trailingWs,
    promptChoices: promptChoices,
    computeTimeMs: now2 - now,
    promptBackground: promptBackground,
  };
}

async function getPromptForRegularDoc(ctx, doc, insertPos) {
  const relativePath = await ctx
    .get(M_text_doc_relative_path.TextDocumentManager)
    .getRelativePath(doc);
  return getPromptHelper(ctx, doc.getText(), doc.offsetAt(insertPos), relativePath, doc.uri, doc.languageId);
}

exports.MIN_PROMPT_CHARS = 10;
exports._contextTooShort = {
  type: "contextTooShort",
};

exports.trimLastLine = trimLastLine;

exports.extractPrompt = function (ctx, doc, insertPos) {
  const nb = ctx.get(M_text_doc_relative_path.TextDocumentManager).findNotebook(doc);
  return undefined === nb
    ? getPromptForRegularDoc(ctx, doc, insertPos)
    : (async function (ctx, doc, nb, insertPos) {
        const theCell = nb.getCells().find((e) => e.document.uri === doc.uri);
        if (theCell) {
          const beforeCells = nb
            .getCells()
            .filter(
              (e) =>
                e.index < theCell.index &&
                e.document.languageId === theCell.document.languageId
            );
          const beforeCellsCatted =
            beforeCells.length > 0
              ? beforeCells.map((e) => e.document.getText()).join("\n\n") + "\n\n"
              : "";
          // wait won't this variable contain duplicate code if doc.getText returns all code?
          // idk the notebook api
          const codeTillThisCell = beforeCellsCatted + doc.getText();
          const l = beforeCellsCatted.length + doc.offsetAt(insertPos);
          const u = await ctx
            .get(M_text_doc_relative_path.TextDocumentManager)
            .getRelativePath(doc);
          return getPromptHelper(ctx, codeTillThisCell, l, u, doc.uri, theCell.document.languageId);
        }
        return getPromptForRegularDoc(ctx, doc, insertPos);
      })(ctx, doc, nb, insertPos);
};
