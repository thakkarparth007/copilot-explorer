Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.extractPrompt =
  exports.trimLastLine =
  exports._contextTooShort =
  exports.MIN_PROMPT_CHARS =
    undefined;
const M_getPrompt_main_stuff = require("getPrompt-main-stuff"),
  M_config_stuff = require("config-stuff"),
  M_doc_tracker = require("doc-tracker"),
  M_task_NOTSURE = require("task"),
  M_text_doc_relative_path = require("text-doc-relative-path"),
  M_get_prompt_parsing_utils_NOTSURE = require("get-prompt-parsing-utils"),
  M_background_context_provider = require("background-context-provider");
function trimLastLine(e) {
  const t = e.split("\n"),
    n = t[t.length - 1],
    r = n.length - n.trimRight().length,
    o = e.slice(0, e.length - r),
    i = e.substr(o.length);
  return [n.length == r ? o : e, i];
}
async function d(e, n, d, p, h, f) {
  var m;
  const g =
      null !==
        (m = M_background_context_provider.tryGetGitHubNWO(
          M_background_context_provider.extractRepoInfoInBackground(e, h.fsPath)
        )) && undefined !== m
        ? m
        : "",
    _ = await M_config_stuff.suffixPercent(e, g, f),
    y = await M_config_stuff.fimSuffixLengthThreshold(e, g, f);
  if ((_ > 0 ? n.length : d) < exports.MIN_PROMPT_CHARS)
    return exports._contextTooShort;
  const v = Date.now(),
    {
      prefix: b,
      suffix: w,
      promptChoices: x,
      promptBackground: E,
      promptElementRanges: C,
    } = await (async function (e, t, n, u, d, p) {
      var h;
      let f = [];
      f = await (async function (e, t, n) {
        const r = [],
          o = M_doc_tracker.sortByAccessTimes(
            e.get(M_text_doc_relative_path.TextDocumentManager).textDocuments
          );
        let s = 0;
        for (const i of o) {
          if (r.length + 1 > 20 || s + i.getText().length > 2e5) break;
          if (
            "file" == i.uri.scheme &&
            i.fileName !== t &&
            i.languageId === n
          ) {
            r.push({
              uri: i.uri.toString(),
              relativePath: await e
                .get(M_text_doc_relative_path.TextDocumentManager)
                .getRelativePath(i),
              languageId: i.languageId,
              source: i.getText(),
            });
            s += i.getText().length;
          }
        }
        return r;
      })(e, d.fsPath, p);
      const m = {
          uri: d.toString(),
          source: t,
          offset: n,
          relativePath: u,
          languageId: p,
        },
        g =
          null !==
            (h = M_background_context_provider.tryGetGitHubNWO(
              M_background_context_provider.extractRepoInfoInBackground(
                e,
                d.fsPath
              )
            )) && undefined !== h
            ? h
            : "";
      let _ = {
        maxPromptLength:
          2048 -
          M_config_stuff.getConfig(e, M_config_stuff.ConfigKey.SolutionLength),
        neighboringTabs: await e
          .get(M_task_NOTSURE.Features)
          .neighboringTabsOption(g, p),
        suffixStartMode: await e
          .get(M_task_NOTSURE.Features)
          .suffixStartMode(g, p),
      };
      const y = await M_config_stuff.suffixPercent(e, g, p),
        v = await M_config_stuff.suffixMatchThreshold(e, g, p),
        b = await M_config_stuff.fimSuffixLengthThreshold(e, g, p);
      if (y > 0) {
        _ = {
          ..._,
          includeSiblingFunctions:
            M_getPrompt_main_stuff.SiblingOption.NoSiblings,
          suffixPercent: y,
          suffixMatchThreshold: v,
          fimSuffixLengthThreshold: b,
        };
      }
      const w = e.get(M_getPrompt_main_stuff.FileSystem);
      return await M_get_prompt_parsing_utils_NOTSURE.getPrompt(w, m, _, f);
    })(e, n, d, p, h, f),
    [S, T] = trimLastLine(b),
    k = Date.now();
  return {
    type: "prompt",
    prompt: {
      prefix: S,
      suffix: w,
      isFimEnabled: _ > 0 && w.length > y,
      promptElementRanges: C.ranges,
    },
    trailingWs: T,
    promptChoices: x,
    computeTimeMs: k - v,
    promptBackground: E,
  };
}
async function p(e, t, n) {
  const r = await e
    .get(M_text_doc_relative_path.TextDocumentManager)
    .getRelativePath(t);
  return d(e, t.getText(), t.offsetAt(n), r, t.uri, t.languageId);
}
exports.MIN_PROMPT_CHARS = 10;
exports._contextTooShort = {
  type: "contextTooShort",
};
exports.trimLastLine = trimLastLine;
exports.extractPrompt = function (e, t, n) {
  const r = e.get(M_text_doc_relative_path.TextDocumentManager).findNotebook(t);
  return undefined === r
    ? p(e, t, n)
    : (async function (e, t, n, r) {
        const o = n.getCells().find((e) => e.document.uri === t.uri);
        if (o) {
          const i = n
              .getCells()
              .filter(
                (e) =>
                  e.index < o.index &&
                  e.document.languageId === o.document.languageId
              ),
            s =
              i.length > 0
                ? i.map((e) => e.document.getText()).join("\n\n") + "\n\n"
                : "",
            c = s + t.getText(),
            l = s.length + t.offsetAt(r),
            u = await e
              .get(M_text_doc_relative_path.TextDocumentManager)
              .getRelativePath(t);
          return d(e, c, l, u, t.uri, o.document.languageId);
        }
        return p(e, t, r);
      })(e, t, r, n);
};
