Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = undefined;
const r = require(6776),
  o = require(4063),
  i = require(9461),
  s = require(540),
  a = new Set(["type", "format", "pattern", "maxLength", "minLength", "maxProperties", "minProperties", "maxItems", "minItems", "maximum", "minimum", "uniqueItems", "multipleOf", "required", "enum", "const"]);
exports.inlineRef = function (e, t = !0) {
  return "boolean" == typeof e || (!0 === t ? !l(e) : !!t && u(e) <= t);
};
const c = new Set(["$ref", "$recursiveRef", "$recursiveAnchor", "$dynamicRef", "$dynamicAnchor"]);
function l(e) {
  for (const t in e) {
    if (c.has(t)) return !0;
    const n = e[t];
    if (Array.isArray(n) && n.some(l)) return !0;
    if ("object" == typeof n && l(n)) return !0;
  }
  return !1;
}
function u(e) {
  let t = 0;
  for (const n in e) {
    if ("$ref" === n) return 1 / 0;
    t++;
    if (!a.has(n) && ("object" == typeof e[n] && (0, r.eachItem)(e[n], e => t += u(e)), t === 1 / 0)) return 1 / 0;
  }
  return t;
}
function d(e = "", t) {
  !1 !== t && (e = f(e));
  return p(s.parse(e));
}
function p(e) {
  return s.serialize(e).split("#")[0] + "#";
}
exports.getFullPath = d;
exports._getFullPath = p;
const h = /#\/?$/;
function f(e) {
  return e ? e.replace(h, "") : "";
}
exports.normalizeId = f;
exports.resolveUrl = function (e, t) {
  t = f(t);
  return s.resolve(e, t);
};
const m = /^[a-z_][-a-z0-9._]*$/i;
exports.getSchemaRefs = function (e, t) {
  if ("boolean" == typeof e) return {};
  const {
      schemaId: n
    } = this.opts,
    r = f(e[n] || t),
    a = {
      "": r
    },
    c = d(r, !1),
    l = {},
    u = new Set();
  i(e, {
    allKeys: !0
  }, (e, t, r, o) => {
    if (undefined === o) return;
    const i = c + t;
    let d = a[o];
    function g(t) {
      t = f(d ? s.resolve(d, t) : t);
      if (u.has(t)) throw h(t);
      u.add(t);
      let n = this.refs[t];
      "string" == typeof n && (n = this.refs[n]);
      "object" == typeof n ? p(e, n.schema, t) : t !== f(i) && ("#" === t[0] ? (p(e, l[t], t), l[t] = e) : this.refs[t] = i);
      return t;
    }
    function _(e) {
      if ("string" == typeof e) {
        if (!m.test(e)) throw new Error(`invalid anchor "${e}"`);
        g.call(this, `#${e}`);
      }
    }
    "string" == typeof e[n] && (d = g.call(this, e[n]));
    _.call(this, e.$anchor);
    _.call(this, e.$dynamicAnchor);
    a[t] = d;
  });
  return l;
  function p(e, t, n) {
    if (undefined !== t && !o(e, t)) throw h(n);
  }
  function h(e) {
    return new Error(`reference "${e}" resolves to more than one schema`);
  }
};