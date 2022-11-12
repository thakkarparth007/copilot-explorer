Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.regexpCode = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = undefined;
class n {}
exports._CodeOrName = n;
exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
class r extends n {
  constructor(e) {
    super();
    if (!exports.IDENTIFIER.test(e)) throw new Error("CodeGen: name must be a valid identifier");
    this.str = e;
  }
  toString() {
    return this.str;
  }
  emptyStr() {
    return !1;
  }
  get names() {
    return {
      [this.str]: 1
    };
  }
}
exports.Name = r;
class o extends n {
  constructor(e) {
    super();
    this._items = "string" == typeof e ? [e] : e;
  }
  toString() {
    return this.str;
  }
  emptyStr() {
    if (this._items.length > 1) return !1;
    const e = this._items[0];
    return "" === e || '""' === e;
  }
  get str() {
    var e;
    return null !== (e = this._str) && undefined !== e ? e : this._str = this._items.reduce((e, t) => `${e}${t}`, "");
  }
  get names() {
    var e;
    return null !== (e = this._names) && undefined !== e ? e : this._names = this._items.reduce((e, t) => (t instanceof r && (e[t.str] = (e[t.str] || 0) + 1), e), {});
  }
}
function i(e, ...t) {
  const n = [e[0]];
  let r = 0;
  for (; r < t.length;) {
    c(n, t[r]);
    n.push(e[++r]);
  }
  return new o(n);
}
exports._Code = o;
exports.nil = new o("");
exports._ = i;
const s = new o("+");
function a(e, ...t) {
  const n = [u(e[0])];
  let r = 0;
  for (; r < t.length;) {
    n.push(s);
    c(n, t[r]);
    n.push(s, u(e[++r]));
  }
  (function (e) {
    let t = 1;
    for (; t < e.length - 1;) {
      if (e[t] === s) {
        const n = l(e[t - 1], e[t + 1]);
        if (undefined !== n) {
          e.splice(t - 1, 3, n);
          continue;
        }
        e[t++] = "+";
      }
      t++;
    }
  })(n);
  return new o(n);
}
function c(e, t) {
  var n;
  t instanceof o ? e.push(...t._items) : t instanceof r ? e.push(t) : e.push("number" == typeof (n = t) || "boolean" == typeof n || null === n ? n : u(Array.isArray(n) ? n.join(",") : n));
}
function l(e, t) {
  if ('""' === t) return e;
  if ('""' === e) return t;
  if ("string" == typeof e) {
    if (t instanceof r || '"' !== e[e.length - 1]) return;
    return "string" != typeof t ? `${e.slice(0, -1)}${t}"` : '"' === t[0] ? e.slice(0, -1) + t.slice(1) : undefined;
  }
  return "string" != typeof t || '"' !== t[0] || e instanceof r ? undefined : `"${e}${t.slice(1)}`;
}
function u(e) {
  return JSON.stringify(e).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
exports.str = a;
exports.addCodeArg = c;
exports.strConcat = function (e, t) {
  return t.emptyStr() ? e : e.emptyStr() ? t : a`${e}${t}`;
};
exports.stringify = function (e) {
  return new o(u(e));
};
exports.safeStringify = u;
exports.getProperty = function (e) {
  return "string" == typeof e && exports.IDENTIFIER.test(e) ? new o(`.${e}`) : i`[${e}]`;
};
exports.regexpCode = function (e) {
  return new o(e.toString());
};