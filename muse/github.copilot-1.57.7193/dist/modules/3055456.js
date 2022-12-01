Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.Priorities =
  exports.PromptWishlist =
  exports.PromptElementRanges =
  exports.PromptChoices =
  exports.PromptBackground =
  exports.PromptElementKind =
    undefined;
const r = require(3055_312),
  o = require(3055_94);
var i;
!(function (e) {
  e.BeforeCursor = "BeforeCursor";
  e.AfterCursor = "AfterCursor";
  e.SimilarFile = "SimilarFile";
  e.ImportedFile = "ImportedFile";
  e.LanguageMarker = "LanguageMarker";
  e.PathMarker = "PathMarker";
})((i = exports.PromptElementKind || (exports.PromptElementKind = {})));
class PromptBackground {
  constructor() {
    this.used = new Map();
    this.unused = new Map();
  }
  markUsed(e) {
    if (this.IsNeighboringTab(e)) {
      this.used.set(e.id, this.convert(e));
    }
  }
  undoMarkUsed(e) {
    if (this.IsNeighboringTab(e)) {
      this.used.delete(e.id);
    }
  }
  markUnused(e) {
    if (this.IsNeighboringTab(e)) {
      this.unused.set(e.id, this.convert(e));
    }
  }
  convert(e) {
    return {
      score: e.score.toFixed(4),
      length: e.text.length,
    };
  }
  IsNeighboringTab(e) {
    return e.kind == i.SimilarFile;
  }
}
exports.PromptBackground = PromptBackground;
class PromptChoices {
  constructor() {
    this.used = new Map();
    this.unused = new Map();
  }
  markUsed(e) {
    this.used.set(e.kind, (this.used.get(e.kind) || 0) + e.tokens);
  }
  undoMarkUsed(e) {
    this.used.set(e.kind, (this.used.get(e.kind) || 0) - e.tokens);
  }
  markUnused(e) {
    this.unused.set(e.kind, (this.used.get(e.kind) || 0) + e.tokens);
  }
}
exports.PromptChoices = PromptChoices;
class PromptElementRanges {
  constructor(e) {
    this.ranges = new Array();
    let t,
      n = 0;
    for (const { element: r } of e)
      if (0 !== r.text.length) {
        if (t === i.BeforeCursor && r.kind === i.BeforeCursor) {
          this.ranges[this.ranges.length - 1].end += r.text.length;
        } else {
          this.ranges.push({
            kind: r.kind,
            start: n,
            end: n + r.text.length,
          });
        }
        t = r.kind;
        n += r.text.length;
      }
  }
}
exports.PromptElementRanges = PromptElementRanges;
exports.PromptWishlist = class {
  constructor(e) {
    this.content = [];
    this.lineEndingOption = e;
  }
  getContent() {
    return [...this.content];
  }
  convertLineEndings(e) {
    if (this.lineEndingOption === r.LineEndingOptions.ConvertToUnix) {
      e = e.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    }
    return e;
  }
  append(e, t, n, r = o.tokenLength(e), i = NaN) {
    e = this.convertLineEndings(e);
    const s = this.content.length;
    this.content.push({
      id: s,
      text: e,
      kind: t,
      priority: n,
      tokens: r,
      requires: [],
      excludes: [],
      score: i,
    });
    return s;
  }
  appendLineForLine(e, t, n) {
    const r = (e = this.convertLineEndings(e)).split("\n");
    for (let e = 0; e < r.length - 1; e++) r[e] += "\n";
    const o = [];
    r.forEach((e, t) => {
      if ("\n" === e && o.length > 0 && !o[o.length - 1].endsWith("\n\n")) {
        o[o.length - 1] += "\n";
      } else {
        o.push(e);
      }
    });
    const i = [];
    o.forEach((e, r) => {
      if ("" !== e) {
        i.push(this.append(e, t, n));
        if (r > 0) {
          this.content[this.content.length - 2].requires = [
            this.content[this.content.length - 1],
          ];
        }
      }
    });
    return i;
  }
  require(e, t) {
    const n = this.content.find((t) => t.id === e),
      r = this.content.find((e) => e.id === t);
    if (n && r) {
      n.requires.push(r);
    }
  }
  exclude(e, t) {
    const n = this.content.find((t) => t.id === e),
      r = this.content.find((e) => e.id === t);
    if (n && r) {
      n.excludes.push(r);
    }
  }
  fulfill(e) {
    const t = new PromptChoices(),
      n = new PromptBackground(),
      r = this.content.map((e, t) => ({
        element: e,
        index: t,
      }));
    r.sort((e, t) =>
      e.element.priority === t.element.priority
        ? t.index - e.index
        : t.element.priority - e.element.priority
    );
    const i = new Set(),
      l = new Set();
    let u;
    const d = [];
    let p = e;
    r.forEach((e) => {
      var r;
      const o = e.element,
        s = e.index;
      if (
        p >= 0 &&
        (p > 0 || undefined === u) &&
        o.requires.every((e) => i.has(e.id)) &&
        !l.has(o.id)
      ) {
        let a = o.tokens;
        const c =
          null ===
            (r = (function (e, t) {
              let n,
                r = 1 / 0;
              for (const o of e)
                if (o.index > t && o.index < r) {
                  n = o;
                  r = o.index;
                }
              return n;
            })(d, s)) || undefined === r
            ? undefined
            : r.element;
        if (o.text.endsWith("\n\n") && c && !c.text.match(/^\s/)) {
          a++;
        }
        if (p >= a) {
          p -= a;
          i.add(o.id);
          o.excludes.forEach((e) => l.add(e.id));
          t.markUsed(o);
          n.markUsed(o);
          d.push(e);
        } else {
          u = null != u ? u : e;
        }
      } else {
        t.markUnused(o);
        n.markUnused(o);
      }
    });
    d.sort((e, t) => e.index - t.index);
    let h = d.reduce((e, t) => e + t.element.text, ""),
      f = o.tokenLength(h);
    for (; f > e; ) {
      d.sort((e, t) =>
        t.element.priority === e.element.priority
          ? t.index - e.index
          : t.element.priority - e.element.priority
      );
      const e = d.pop();
      if (e) {
        t.undoMarkUsed(e.element);
        t.markUnused(e.element);
        n.undoMarkUsed(e.element);
        n.markUnused(e.element);
        u = undefined;
      }
      d.sort((e, t) => e.index - t.index);
      h = d.reduce((e, t) => e + t.element.text, "");
      f = o.tokenLength(h);
    }
    const m = [...d];
    if (undefined !== u) {
      m.push(u);
      m.sort((e, t) => e.index - t.index);
      const r = m.reduce((e, t) => e + t.element.text, ""),
        i = o.tokenLength(r);
      if (i <= e) {
        t.markUsed(u.element);
        n.markUsed(u.element);
        const e = new PromptElementRanges(m);
        return {
          prefix: r,
          suffix: "",
          prefixLength: i,
          suffixLength: 0,
          promptChoices: t,
          promptBackground: n,
          promptElementRanges: e,
        };
      }
      t.markUnused(u.element);
      n.markUnused(u.element);
    }
    const g = new PromptElementRanges(d);
    return {
      prefix: h,
      suffix: "",
      prefixLength: f,
      suffixLength: 0,
      promptChoices: t,
      promptBackground: n,
      promptElementRanges: g,
    };
  }
};
class Priorities {
  constructor() {
    this.registeredPriorities = [0, 1];
  }
  register(e) {
    if (e > Priorities.TOP || e < Priorities.BOTTOM)
      throw new Error("Priority must be between 0 and 1");
    this.registeredPriorities.push(e);
    return e;
  }
  justAbove(...e) {
    const t = Math.max(...e),
      n = Math.min(...this.registeredPriorities.filter((e) => e > t));
    return this.register((n + t) / 2);
  }
  justBelow(...e) {
    const t = Math.min(...e),
      n = Math.max(...this.registeredPriorities.filter((e) => e < t));
    return this.register((n + t) / 2);
  }
  between(e, t) {
    if (
      this.registeredPriorities.some((n) => n > e && n < t) ||
      !this.registeredPriorities.includes(e) ||
      !this.registeredPriorities.includes(t)
    )
      throw new Error("Priorities must be adjacent in the list of priorities");
    return this.register((e + t) / 2);
  }
}
exports.Priorities = Priorities;
Priorities.TOP = 1;
Priorities.BOTTOM = 0;