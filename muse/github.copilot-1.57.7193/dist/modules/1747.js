Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getPrompt =
  exports.newLineEnded =
  exports.normalizeLanguageId =
  exports.PromptOptions =
  exports.SuffixStartMode =
  exports.SuffixMatchOption =
  exports.SuffixOption =
  exports.LineEndingOptions =
  exports.LocalImportContextOption =
  exports.SnippetSelectionOption =
  exports.NeighboringTabsPositionOption =
  exports.NeighboringTabsOption =
  exports.SiblingOption =
  exports.PathMarkerOption =
  exports.LanguageMarkerOption =
  exports.TOKENS_RESERVED_FOR_SUFFIX_ENCODING =
  exports.MAX_EDIT_DISTANCE_LENGTH =
  exports.MAX_PROMPT_LENGTH =
    undefined;
const r = require(1788),
  o = require(3507),
  i = require(9931),
  s = require(820),
  a = require(9852),
  c = require(7408),
  l = require(4431);
let u = {
  text: "",
  tokens: [],
};
var d, p, h, f, m, g, _, y, v, b, w;
exports.MAX_PROMPT_LENGTH = 1500;
exports.MAX_EDIT_DISTANCE_LENGTH = 50;
exports.TOKENS_RESERVED_FOR_SUFFIX_ENCODING = 5;
(function (e) {
  e.NoMarker = "nomarker";
  e.Top = "top";
  e.Always = "always";
})((d = exports.LanguageMarkerOption || (exports.LanguageMarkerOption = {})));
(function (e) {
  e.NoMarker = "nomarker";
  e.Top = "top";
  e.Always = "always";
})((p = exports.PathMarkerOption || (exports.PathMarkerOption = {})));
(function (e) {
  e.NoSiblings = "nosiblings";
  e.SiblingsOverContext = "siblingabove";
  e.ContextOverSiblings = "contextabove";
})((h = exports.SiblingOption || (exports.SiblingOption = {})));
(function (e) {
  e.None = "none";
  e.Conservative = "conservative";
  e.Medium = "medium";
  e.Eager = "eager";
  e.EagerButLittle = "eagerButLittle";
})((f = exports.NeighboringTabsOption || (exports.NeighboringTabsOption = {})));
(function (e) {
  e.TopOfText = "top";
  e.DirectlyAboveCursor = "aboveCursor";
  e.AfterSiblings = "afterSiblings";
})(
  (m =
    exports.NeighboringTabsPositionOption ||
    (exports.NeighboringTabsPositionOption = {}))
);
(function (e) {
  e.BestMatch = "bestMatch";
  e.TopK = "topK";
})(
  (g = exports.SnippetSelectionOption || (exports.SnippetSelectionOption = {}))
);
(function (e) {
  e.NoContext = "nocontext";
  e.Declarations = "declarations";
})(
  (_ =
    exports.LocalImportContextOption || (exports.LocalImportContextOption = {}))
);
(function (e) {
  e.ConvertToUnix = "unix";
  e.KeepOriginal = "keep";
})((y = exports.LineEndingOptions || (exports.LineEndingOptions = {})));
(w = exports.SuffixOption || (exports.SuffixOption = {})).None = "none";
w.FifteenPercent = "fifteenPercent";
(function (e) {
  e.Equal = "equal";
  e.Levenshtein = "levenshteineditdistance";
})((v = exports.SuffixMatchOption || (exports.SuffixMatchOption = {})));
(function (e) {
  e.Cursor = "cursor";
  e.CursorTrimStart = "cursortrimstart";
  e.SiblingBlock = "siblingblock";
  e.SiblingBlockTrimStart = "siblingblocktrimstart";
})((b = exports.SuffixStartMode || (exports.SuffixStartMode = {})));
class PromptOptions {
  constructor(e, n) {
    this.fs = e;
    this.maxPromptLength = exports.MAX_PROMPT_LENGTH;
    this.languageMarker = d.Top;
    this.pathMarker = p.Top;
    this.includeSiblingFunctions = h.ContextOverSiblings;
    this.localImportContext = _.Declarations;
    this.neighboringTabs = f.Eager;
    this.neighboringTabsPosition = m.TopOfText;
    this.lineEnding = y.ConvertToUnix;
    this.suffixPercent = 0;
    this.suffixStartMode = b.Cursor;
    this.suffixMatchThreshold = 0;
    this.suffixMatchCriteria = v.Levenshtein;
    this.fimSuffixLengthThreshold = 0;
    if (n) for (const e in n) this[e] = n[e];
    if (this.suffixPercent < 0 || this.suffixPercent > 100)
      throw new Error(
        `suffixPercent must be between 0 and 100, but was ${this.suffixPercent}`
      );
    if (this.suffixPercent > 0 && this.includeSiblingFunctions != h.NoSiblings)
      throw new Error(
        `Invalid option combination. Cannot set suffixPercent > 0 (${this.suffixPercent}) and includeSiblingFunctions ${this.includeSiblingFunctions}`
      );
    if (this.suffixMatchThreshold < 0 || this.suffixMatchThreshold > 100)
      throw new Error(
        `suffixMatchThreshold must be at between 0 and 100, but was ${this.suffixMatchThreshold}`
      );
    if (this.fimSuffixLengthThreshold < -1)
      throw new Error(
        `fimSuffixLengthThreshold must be at least -1, but was ${this.fimSuffixLengthThreshold}`
      );
    if (
      null != this.indentationMinLength &&
      null != this.indentationMaxLength &&
      this.indentationMinLength > this.indentationMaxLength
    )
      throw new Error(
        `indentationMinLength must be less than or equal to indentationMaxLength, but was ${this.indentationMinLength} and ${this.indentationMaxLength}`
      );
    if (
      this.snippetSelection === g.TopK &&
      undefined === this.snippetSelectionK
    )
      throw new Error("snippetSelectionK must be defined.");
    if (
      this.snippetSelection === g.TopK &&
      this.snippetSelectionK &&
      this.snippetSelectionK <= 0
    )
      throw new Error(
        `snippetSelectionK must be greater than 0, but was ${this.snippetSelectionK}`
      );
  }
}
exports.PromptOptions = PromptOptions;
const E = {
  javascriptreact: "javascript",
  jsx: "javascript",
  typescriptreact: "typescript",
  jade: "pug",
  cshtml: "razor",
};
function normalizeLanguageId(e) {
  var t;
  e = e.toLowerCase();
  return null !== (t = E[e]) && undefined !== t ? t : e;
}
function newLineEnded(e) {
  return "" == e || e.endsWith("\n") ? e : e + "\n";
}
exports.normalizeLanguageId = normalizeLanguageId;
exports.newLineEnded = newLineEnded;
exports.getPrompt = async function (e, n, g = {}, y = []) {
  var w;
  const E = new PromptOptions(e, g);
  let T = !1;
  const { source: k, offset: I } = n;
  if (I < 0 || I > k.length) throw new Error(`Offset ${I} is out of range.`);
  n.languageId = normalizeLanguageId(n.languageId);
  const P = new c.Priorities(),
    A = P.justBelow(c.Priorities.TOP),
    O =
      E.languageMarker == d.Always
        ? P.justBelow(c.Priorities.TOP)
        : P.justBelow(A),
    N =
      E.pathMarker == p.Always ? P.justBelow(c.Priorities.TOP) : P.justBelow(A),
    R =
      E.includeSiblingFunctions == h.ContextOverSiblings
        ? P.justBelow(A)
        : P.justAbove(A),
    M = P.justBelow(A, R),
    L = P.justBelow(M),
    $ = new c.PromptWishlist(E.lineEnding);
  let D, F;
  if (E.languageMarker != d.NoMarker) {
    const e = newLineEnded(r.getLanguageMarker(n));
    D = $.append(e, c.PromptElementKind.LanguageMarker, O);
  }
  if (E.pathMarker != p.NoMarker) {
    const e = newLineEnded(r.getPathMarker(n));
    if (e.length > 0) {
      F = $.append(e, c.PromptElementKind.PathMarker, N);
    }
  }
  if (E.localImportContext != _.NoContext)
    for (const e of await o.extractLocalImportContext(n, E.fs))
      $.append(newLineEnded(e), c.PromptElementKind.ImportedFile, M);
  const j =
    E.neighboringTabs == f.None || 0 == y.length
      ? []
      : await i.getNeighborSnippets(
          n,
          y,
          E.neighboringTabs,
          E.indentationMinLength,
          E.indentationMaxLength,
          E.snippetSelectionOption,
          E.snippetSelectionK
        );
  function q() {
    j.forEach((e) =>
      $.append(
        e.snippet,
        c.PromptElementKind.SimilarFile,
        L,
        a.tokenLength(e.snippet),
        e.score
      )
    );
  }
  if (E.neighboringTabsPosition == m.TopOfText) {
    q();
  }
  const B = [];
  let U;
  if (E.includeSiblingFunctions == h.NoSiblings) U = k.substring(0, I);
  else {
    const {
      siblings: e,
      beforeInsertion: t,
      afterInsertion: r,
    } = await s.getSiblingFunctions(n);
    $.appendLineForLine(t, c.PromptElementKind.BeforeCursor, A).forEach((e) =>
      B.push(e)
    );
    let o = R;
    e.forEach((e) => {
      $.append(e, c.PromptElementKind.AfterCursor, o);
      o = P.justBelow(o);
    });
    if (E.neighboringTabsPosition == m.AfterSiblings) {
      q();
    }
    U = r;
  }
  if (E.neighboringTabsPosition == m.DirectlyAboveCursor) {
    const e = U.lastIndexOf("\n") + 1,
      t = U.substring(0, e),
      n = U.substring(e);
    $.appendLineForLine(t, c.PromptElementKind.BeforeCursor, A).forEach((e) =>
      B.push(e)
    );
    q();
    if (n.length > 0) {
      B.push($.append(n, c.PromptElementKind.AfterCursor, A));
      if (B.length > 1) {
        $.require(B[B.length - 2], B[B.length - 1]);
      }
    }
  } else
    $.appendLineForLine(U, c.PromptElementKind.BeforeCursor, A).forEach((e) =>
      B.push(e)
    );
  if (d.Top == E.languageMarker && B.length > 0 && undefined !== D) {
    $.require(D, B[0]);
  }
  if (p.Top == E.pathMarker && B.length > 0 && undefined !== F) {
    if (D) {
      $.require(F, D);
    } else {
      $.require(F, B[0]);
    }
  }
  if (undefined !== D && undefined !== F) {
    $.exclude(F, D);
  }
  let H = k.slice(I);
  if (0 == E.suffixPercent || H.length <= E.fimSuffixLengthThreshold)
    return $.fulfill(E.maxPromptLength);
  {
    let e = n.offset;
    if (
      E.suffixStartMode !== b.Cursor &&
      E.suffixStartMode !== b.CursorTrimStart
    ) {
      e = await s.getSiblingFunctionStart(n);
    }
    const r = E.maxPromptLength - exports.TOKENS_RESERVED_FOR_SUFFIX_ENCODING;
    let o = Math.floor((r * (100 - E.suffixPercent)) / 100),
      i = $.fulfill(o);
    const c = r - i.prefixLength;
    let d = k.slice(e);
    if (
      E.suffixStartMode != b.SiblingBlockTrimStart &&
      E.suffixStartMode != b.CursorTrimStart
    ) {
      d = d.trimStart();
    }
    const p = a.takeFirstTokens(d, c);
    if (p.tokens.length <= c - 3) {
      o = r - p.tokens.length;
      i = $.fulfill(o);
    }
    if (E.suffixMatchCriteria == v.Equal) {
      if (
        p.tokens.length === u.tokens.length &&
        p.tokens.every((e, t) => e === u.tokens[t])
      ) {
        T = !0;
      }
    } else {
      if (
        E.suffixMatchCriteria == v.Levenshtein &&
        p.tokens.length > 0 &&
        E.suffixMatchThreshold > 0 &&
        100 *
          (null ===
            (w = l.findEditDistanceScore(
              p.tokens.slice(0, exports.MAX_EDIT_DISTANCE_LENGTH),
              u.tokens.slice(0, exports.MAX_EDIT_DISTANCE_LENGTH)
            )) || undefined === w
            ? undefined
            : w.score) <
          E.suffixMatchThreshold *
            Math.min(exports.MAX_EDIT_DISTANCE_LENGTH, p.tokens.length)
      ) {
        T = !0;
      }
    }
    if (!0 === T && u.tokens.length <= c) {
      if (u.tokens.length <= c - 3) {
        o = r - u.tokens.length;
        i = $.fulfill(o);
      }
      i.suffix = u.text;
      i.suffixLength = u.tokens.length;
    } else {
      i.suffix = p.text;
      i.suffixLength = p.tokens.length;
      u = p;
    }
    return i;
  }
};
