Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.LRUCache = exports.keyForPrompt = undefined;
const M_react_dom_maybe = require("react-dom");
exports.keyForPrompt = function (e) {
  return M_react_dom_maybe.SHA256(e.prefix + e.suffix).toString();
};
exports.LRUCache = class {
  constructor(e = 10) {
    this.values = new Map();
    this.lruKeys = [];
    this.size = e;
  }
  removeKeyFromLRU(e) {
    const t = this.lruKeys.indexOf(e);
    if (-1 !== t) {
      this.lruKeys.splice(t, 1);
    }
  }
  touchKeyInLRU(e) {
    this.removeKeyFromLRU(e);
    this.lruKeys.push(e);
  }
  clear() {
    this.values.clear();
    this.lruKeys = [];
  }
  deleteKey(e) {
    this.removeKeyFromLRU(e);
    if (undefined !== this.values.get(e)) {
      this.values.delete(e);
    }
  }
  get(e) {
    if (this.values.has(e)) {
      const t = this.values.get(e);
      this.touchKeyInLRU(e);
      return t;
    }
  }
  put(e, t) {
    let n = [];
    if (this.values.has(e)) {
      n = [e];
    } else {
      if (this.lruKeys.length >= this.size) {
        n = this.lruKeys.splice(0, 1);
      }
    }
    for (const e of n) this.deleteKey(e);
    this.values.set(e, t);
    this.touchKeyInLRU(e);
  }
};
