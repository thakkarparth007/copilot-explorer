Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.splitIntoWords =
  exports.WindowedMatcher =
  exports.SortOptions =
    undefined;
const r = require(1747);
var o;
!(function (e) {
  e.Ascending = "ascending";
  e.Descending = "descending";
  e.None = "none";
})((o = exports.SortOptions || (exports.SortOptions = {})));
class i {
  constructor(e) {
    var t;
    this.stopsForLanguage =
      null !== (t = u.get(e.languageId)) && undefined !== t ? t : l;
  }
  tokenize(e) {
    return new Set(
      splitIntoWords(e).filter((e) => !this.stopsForLanguage.has(e))
    );
  }
}
const s = new (class {
  constructor(e) {
    this.keys = [];
    this.cache = {};
    this.size = e;
  }
  put(e, t) {
    var n;
    this.cache[e] = t;
    if (this.keys.length > this.size) {
      this.keys.push(e);
      const t = null !== (n = this.keys.shift()) && void 0 !== n ? n : "";
      delete this.cache[t];
    }
  }
  get(e) {
    return this.cache[e];
  }
})(20);
function splitIntoWords(e) {
  return e.split(/[^a-zA-Z0-9]/).filter((e) => e.length > 0);
}
exports.WindowedMatcher = class {
  constructor(e) {
    this.tokenizer = new i(e);
    this.referenceTokens = this.tokenizer.tokenize(this.trimDocument(e));
  }
  sortScoredSnippets(e, t = o.Descending) {
    return t == o.Ascending
      ? e.sort((e, t) => (e.score > t.score ? 1 : -1))
      : t == o.Descending
      ? e.sort((e, t) => (e.score > t.score ? -1 : 1))
      : e;
  }
  retrieveAllSnippets(e, t = o.Descending) {
    var n;
    const r = [];
    if (0 === e.source.length || 0 === this.referenceTokens.size) return r;
    const i = e.source.split("\n"),
      a = this.id() + ":" + e.source,
      c = null !== (n = s.get(a)) && undefined !== n ? n : [],
      l = 0 == c.length,
      u = l ? i.map(this.tokenizer.tokenize, this.tokenizer) : [];
    for (const [e, [t, n]] of this.getWindowsDelineations(i).entries()) {
      if (l) {
        const e = new Set();
        u.slice(t, n).forEach((t) => t.forEach(e.add, e));
        c.push(e);
      }
      const o = c[e],
        i = this.similarityScore(o, this.referenceTokens);
      r.push({
        score: i,
        startLine: t,
        endLine: n,
      });
    }
    if (l) {
      s.put(a, c);
    }
    return this.sortScoredSnippets(r, t);
  }
  findMatches(e, t = r.SnippetSelectionOption.BestMatch, n) {
    if (t == r.SnippetSelectionOption.BestMatch) {
      const t = this.findBestMatch(e);
      return t ? [t] : [];
    }
    return (
      (t == r.SnippetSelectionOption.TopK && this.findTopKMatches(e, n)) || []
    );
  }
  findBestMatch(e) {
    if (0 === e.source.length || 0 === this.referenceTokens.size) return;
    const t = e.source.split("\n"),
      n = this.retrieveAllSnippets(e, o.Descending);
    return 0 !== n.length && 0 !== n[0].score
      ? {
          snippet: t.slice(n[0].startLine, n[0].endLine).join("\n"),
          ...n[0],
        }
      : undefined;
  }
  findTopKMatches(e, t = 1) {
    if (0 === e.source.length || 0 === this.referenceTokens.size || t < 1)
      return;
    const n = e.source.split("\n"),
      r = this.retrieveAllSnippets(e, o.Descending);
    if (0 === r.length || 0 === r[0].score) return;
    const i = [r[0]];
    for (let e = 1; e < r.length && i.length < t; e++)
      if (
        -1 ==
        i.findIndex(
          (t) => r[e].startLine < t.endLine && r[e].endLine > t.startLine
        )
      ) {
        i.push(r[e]);
      }
    return i.map((e) => ({
      snippet: n.slice(e.startLine, e.endLine).join("\n"),
      ...e,
    }));
  }
};
exports.splitIntoWords = splitIntoWords;
const c = new Set([
    "we",
    "our",
    "you",
    "it",
    "its",
    "they",
    "them",
    "their",
    "this",
    "that",
    "these",
    "those",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "can",
    "don",
    "t",
    "s",
    "will",
    "would",
    "should",
    "what",
    "which",
    "who",
    "when",
    "where",
    "why",
    "how",
    "a",
    "an",
    "the",
    "and",
    "or",
    "not",
    "no",
    "but",
    "because",
    "as",
    "until",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "above",
    "below",
    "to",
    "during",
    "before",
    "after",
    "of",
    "at",
    "by",
    "about",
    "between",
    "into",
    "through",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "just",
    "now",
  ]),
  l = new Set([
    "if",
    "then",
    "else",
    "for",
    "while",
    "with",
    "def",
    "function",
    "return",
    "TODO",
    "import",
    "try",
    "catch",
    "raise",
    "finally",
    "repeat",
    "switch",
    "case",
    "match",
    "assert",
    "continue",
    "break",
    "const",
    "class",
    "enum",
    "struct",
    "static",
    "new",
    "super",
    "this",
    "var",
    ...c,
  ]),
  u = new Map([]);