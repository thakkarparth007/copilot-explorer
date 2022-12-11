Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ValueScope =
  exports.ValueScopeName =
  exports.Scope =
  exports.varKinds =
  exports.UsedValueState =
    undefined;
const r = require(7023);
class o extends Error {
  constructor(e) {
    super(`CodeGen: "code" for ${e} not defined`);
    this.value = e.value;
  }
}
var i;
!(function (e) {
  e[(e.Started = 0)] = "Started";
  e[(e.Completed = 1)] = "Completed";
})((i = exports.UsedValueState || (exports.UsedValueState = {})));
exports.varKinds = {
  const: new r.Name("const"),
  let: new r.Name("let"),
  var: new r.Name("var"),
};
class Scope {
  constructor({ prefixes: e, parent: t } = {}) {
    this._names = {};
    this._prefixes = e;
    this._parent = t;
  }
  toName(e) {
    return e instanceof r.Name ? e : this.name(e);
  }
  name(e) {
    return new r.Name(this._newName(e));
  }
  _newName(e) {
    return `${e}${(this._names[e] || this._nameGroup(e)).index++}`;
  }
  _nameGroup(e) {
    var t;
    var n;
    if (
      (null ===
        (n =
          null === (t = this._parent) || undefined === t
            ? undefined
            : t._prefixes) || undefined === n
        ? undefined
        : n.has(e)) ||
      (this._prefixes && !this._prefixes.has(e))
    )
      throw new Error(`CodeGen: prefix "${e}" is not allowed in this scope`);
    return (this._names[e] = {
      prefix: e,
      index: 0,
    });
  }
}
exports.Scope = Scope;
class ValueScopeName extends r.Name {
  constructor(e, t) {
    super(t);
    this.prefix = e;
  }
  setValue(e, { property: t, itemIndex: n }) {
    this.value = e;
    this.scopePath = r._`.${new r.Name(t)}[${n}]`;
  }
}
exports.ValueScopeName = ValueScopeName;
const c = r._`\n`;
exports.ValueScope = class extends Scope {
  constructor(e) {
    super(e);
    this._values = {};
    this._scope = e.scope;
    this.opts = {
      ...e,
      _n: e.lines ? c : r.nil,
    };
  }
  get() {
    return this._scope;
  }
  name(e) {
    return new ValueScopeName(e, this._newName(e));
  }
  value(e, t) {
    var n;
    if (undefined === t.ref)
      throw new Error("CodeGen: ref must be passed in value");
    const r = this.toName(e);
    const { prefix: o } = r;
    const i = null !== (n = t.key) && undefined !== n ? n : t.ref;
    let s = this._values[o];
    if (s) {
      const e = s.get(i);
      if (e) return e;
    } else s = this._values[o] = new Map();
    s.set(i, r);
    const a = this._scope[o] || (this._scope[o] = []);
    const c = a.length;
    a[c] = t.ref;
    r.setValue(t, {
      property: o,
      itemIndex: c,
    });
    return r;
  }
  getValue(e, t) {
    const n = this._values[e];
    if (n) return n.get(t);
  }
  scopeRefs(e, t = this._values) {
    return this._reduceValues(t, (t) => {
      if (undefined === t.scopePath)
        throw new Error(`CodeGen: name "${t}" has no value`);
      return r._`${e}${t.scopePath}`;
    });
  }
  scopeCode(e = this._values, t, n) {
    return this._reduceValues(
      e,
      (e) => {
        if (undefined === e.value)
          throw new Error(`CodeGen: name "${e}" has no value`);
        return e.value.code;
      },
      t,
      n
    );
  }
  _reduceValues(e, n, s = {}, a) {
    let c = r.nil;
    for (const l in e) {
      const u = e[l];
      if (!u) continue;
      const d = (s[l] = s[l] || new Map());
      u.forEach((e) => {
        if (d.has(e)) return;
        d.set(e, i.Started);
        let s = n(e);
        if (s) {
          const n = this.opts.es5
            ? exports.varKinds.var
            : exports.varKinds.const;
          c = r._`${c}${n} ${e} = ${s};${this.opts._n}`;
        } else {
          if (!(s = null == a ? undefined : a(e))) throw new o(e);
          c = r._`${c}${s}${this.opts._n}`;
        }
        d.set(e, i.Completed);
      });
    }
    return c;
  }
};