Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(4815);
const o = require(412);
const i = require(6776);
const s = require(9351);
const a = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, parentSchema: a, data: c, it: l } = e;
    if (
      "all" === l.opts.removeAdditional &&
      undefined === a.additionalProperties
    ) {
      s.default.code(new r.KeywordCxt(l, s.default, "additionalProperties"));
    }
    const u = o.allSchemaProperties(n);
    for (const e of u) l.definedProperties.add(e);
    if (l.opts.unevaluated && u.length && !0 !== l.props) {
      l.props = i.mergeEvaluated.props(t, i.toHash(u), l.props);
    }
    const d = u.filter((e) => !i.alwaysValidSchema(l, n[e]));
    if (0 === d.length) return;
    const p = t.name("valid");
    for (const n of d) {
      if (h(n)) {
        f(n);
      } else {
        t.if(o.propertyInData(t, c, n, l.opts.ownProperties));
        f(n);
        if (l.allErrors) {
          t.else().var(p, !0);
        }
        t.endIf();
      }
      e.it.definedProperties.add(n);
      e.ok(p);
    }
    function h(e) {
      return (
        l.opts.useDefaults && !l.compositeRule && undefined !== n[e].default
      );
    }
    function f(t) {
      e.subschema(
        {
          keyword: "properties",
          schemaProp: t,
          dataProp: t,
        },
        p
      );
    }
  },
};
exports.default = a;