// prompt-choices-and-wishlist.js
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
const M_get_prompt_actual = require("get-prompt-actual");
const M_tokenizer = require("tokenizer");
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
  constructor(elems) {
    this.ranges = new Array();
    let lastKind;
    let n = 0;
    for (const { element: elem } of elems)
      if (0 !== elem.text.length) {
        if (lastKind === i.BeforeCursor && elem.kind === i.BeforeCursor) {
          // merge adjacent BeforeCursor elements
          this.ranges[this.ranges.length - 1].end += elem.text.length;
        } else {
          // add a new range otherwise
          this.ranges.push({
            kind: elem.kind,
            start: n,
            end: n + elem.text.length,
          });
        }
        lastKind = elem.kind;
        n += elem.text.length;
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

  convertLineEndings(text) {
    if (
      this.lineEndingOption ===
      M_get_prompt_actual.LineEndingOptions.ConvertToUnix
    ) {
      text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    }
    return text;
  }

  append(text, kind, priority, nTokens = M_tokenizer.tokenLength(text), score = NaN) {
    text = this.convertLineEndings(text);
    const idx = this.content.length;
    this.content.push({
      id: idx,
      text: text,
      kind: kind,
      priority: priority,
      tokens: nTokens,
      requires: [],
      excludes: [],
      score: score,
    });
    return idx;
  }

  appendLineForLine(text, kind, priority) {
    const lines = (text = this.convertLineEndings(text)).split("\n");
    for (let i = 0; i < lines.length - 1; i++) lines[i] += "\n";

    // merge double newlines
    const lines2 = [];
    lines.forEach((line, i) => {
      if ("\n" === line && lines2.length > 0 && !lines2[lines2.length - 1].endsWith("\n\n")) {
        lines2[lines2.length - 1] += "\n";
      } else {
        lines2.push(line);
      }
    });

    const insertIdxs = [];
    lines2.forEach((line, lineNo) => {
      if ("" !== line) {
        insertIdxs.push(this.append(line, kind, priority));
        if (lineNo > 0) {
          // require the previous line
          this.content[this.content.length - 2].requires = [
            this.content[this.content.length - 1],
          ];
        }
      }
    });

    return insertIdxs;
  }

  require(idx1, idx2) {
    const el1 = this.content.find((t) => t.id === idx1);
    const el2 = this.content.find((e) => e.id === idx2);
    if (el1 && el2) {
      el1.requires.push(el2);
    }
  }

  exclude(idx1, idx2) {
    const el1 = this.content.find((t) => t.id === idx1);
    const el2 = this.content.find((e) => e.id === idx2);
    if (el1 && el2) {
      el1.excludes.push(el2);
    }
  }

  fulfill(tokenBudget) {
    // fulfill the wishlist given a token budget

    const promptChoices = new PromptChoices();
    const promptBackground = new PromptBackground();
    const wishlist = this.content.map((elem, idx) => ({
      element: elem,
      index: idx,
    }));

    // sort by (priority, index)
    wishlist.sort((e, t) =>
      e.element.priority === t.element.priority
        ? t.index - e.index
        : t.element.priority - e.element.priority
    );

    // sets of included and excluded indices
    const included = new Set();
    const excluded = new Set();
    let firstOutOfBudgetElem; // the first element that is out of budget
                              // keeping track of this because:
                              // sum(len(elem.tokens) for elem in elems) >= sum(len(tokenize(cat(elem.text for elem in elems)))
                              // and the loop checks number of consumed tokens using the equation on the left,
                              // which is an overestimate of actual number of tokens (on the right)
                              // so we remember which was the almost-included element,
                              // concat all text of included and this element, see if we're under budget
                              // if so, we can get a tiny bit of more information in the prompt.
                              // i really don't know how much benefit this can provide,
                              // but interesting to think about. lol.
    const addedElems = []; // same as included, but sorted, and with elements, i.e., [{element, index}, ...]
    let availableTokens = tokenBudget;

    wishlist.forEach((elemWithIdx) => {
      var followingElemWithIdx;
      const elem = elemWithIdx.element;
      const idx = elemWithIdx.index;

      if (
        availableTokens >= 0 &&
        (availableTokens > 0 || undefined === firstOutOfBudgetElem) &&
        elem.requires.every((e) => included.has(e.id)) &&
        !excluded.has(elem.id)
      ) {
        let nTokens = elem.tokens;
        // oof, crazy obfuscated code
        const followingElem =
          null ===
            (followingElemWithIdx = (function (addedElems, idx) {
              let followingElemWithIdx;
              let minIdx = 1 / 0;
              for (const addedElem of addedElems)
                if (addedElem.index > idx && addedElem.index < minIdx) {
                  followingElemWithIdx = addedElem;
                  minIdx = addedElem.index;
                }
              return followingElemWithIdx;
            })(addedElems, idx)) || undefined === followingElemWithIdx
            ? undefined
            : followingElemWithIdx.element;
        
        // some edge case handling about token computation and whitespaces.
        if (elem.text.endsWith("\n\n") && followingElem && !followingElem.text.match(/^\s/)) {
          nTokens++;
        }

        if (availableTokens >= nTokens) {
          availableTokens -= nTokens;
          included.add(elem.id);
          elem.excludes.forEach((e) => excluded.add(e.id));
          promptChoices.markUsed(elem);
          promptBackground.markUsed(elem);
          addedElems.push(elemWithIdx);
        } else {
          firstOutOfBudgetElem = null != firstOutOfBudgetElem ? firstOutOfBudgetElem : elemWithIdx;
        }
      } else {
        promptChoices.markUnused(elem);
        promptBackground.markUnused(elem);
      }
    });

    // even though we process elements by priority, the prompt is generated
    // after sorting by index, so that the order of elements is preserved
    addedElems.sort((e, t) => e.index - t.index);
    
    let prefix = addedElems.reduce((result, cur) => result + cur.element.text, "");
    let prefixLen = M_tokenizer.tokenLength(prefix);
    
    // while we're exceeding the token budget, remove the last element
    for (; prefixLen > tokenBudget;) {
      // sort by (priority, index)
      addedElems.sort((e, t) =>
        t.element.priority === e.element.priority
          ? t.index - e.index
          : t.element.priority - e.element.priority
      );

      const lastImpElem = addedElems.pop();
      if (lastImpElem) {
        // if we remove this, shouldn't we also respect its requires and excludes?
        // doesn't look like that's happening here
        promptChoices.undoMarkUsed(lastImpElem.element);
        promptChoices.markUnused(lastImpElem.element);
        promptBackground.undoMarkUsed(lastImpElem.element);
        promptBackground.markUnused(lastImpElem.element);
        firstOutOfBudgetElem = undefined;
      }

      addedElems.sort((e, t) => e.index - t.index);
      prefix = addedElems.reduce((e, t) => e + t.element.text, "");
      prefixLen = M_tokenizer.tokenLength(prefix);
    }

    // why do we need to copy this?
    const addedElemsCopy = [...addedElems];
    
    // if we almost included an element, but didn't because we ran out of budget,
    // recompute the number of tokens more precisely
    if (undefined !== firstOutOfBudgetElem) {
      addedElemsCopy.push(firstOutOfBudgetElem);
      addedElemsCopy.sort((e, t) => e.index - t.index);
      
      const prefix = addedElemsCopy.reduce((e, t) => e + t.element.text, "");
      const prefixLen = M_tokenizer.tokenLength(prefix);
      
      if (prefixLen <= tokenBudget) {
        // yay, we squeezed in a tiny bit more information
        promptChoices.markUsed(firstOutOfBudgetElem.element);
        promptBackground.markUsed(firstOutOfBudgetElem.element);
        const promptElemRngs = new PromptElementRanges(addedElemsCopy);
        
        return {
          prefix: prefix,
          suffix: "",
          prefixLength: prefixLen,
          suffixLength: 0,
          promptChoices: promptChoices,
          promptBackground: promptBackground,
          promptElementRanges: promptElemRngs,
        };
      }
      promptChoices.markUnused(firstOutOfBudgetElem.element);
      promptBackground.markUnused(firstOutOfBudgetElem.element);
    }

    const promptElemRngs = new PromptElementRanges(addedElems);
    return {
      prefix: prefix,
      suffix: "",
      prefixLength: prefixLen,
      suffixLength: 0,
      promptChoices: promptChoices,
      promptBackground: promptBackground,
      promptElementRanges: promptElemRngs,
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
    const t = Math.max(...e);
    const n = Math.min(...this.registeredPriorities.filter((e) => e > t));
    return this.register((n + t) / 2);
  }
  justBelow(...e) {
    const t = Math.min(...e);
    const n = Math.max(...this.registeredPriorities.filter((e) => e < t));
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
