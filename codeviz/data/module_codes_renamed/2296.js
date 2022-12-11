Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_validate_properties_maybe = require("validate-properties");
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
const M_ajv_utils_maybe = require("ajv-utils");
const a = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, data: a, parentSchema: c, it: l } = e;
    const { opts: u } = l;
    const d = M_validate_properties_maybe.allSchemaProperties(n);
    const p = d.filter((e) => M_ajv_utils_maybe.alwaysValidSchema(l, n[e]));
    if (
      0 === d.length ||
      (p.length === d.length && (!l.opts.unevaluated || !0 === l.props))
    )
      return;
    const h = u.strictSchema && !u.allowMatchingProperties && c.properties;
    const f = t.name("valid");
    if (!0 === l.props || l.props instanceof M_codegen_maybe.Name) {
      l.props = M_ajv_utils_maybe.evaluatedPropsToName(t, l.props);
    }
    const { props: m } = l;
    function g(e) {
      for (const t in h)
        if (new RegExp(e).test(t)) {
          M_ajv_utils_maybe.checkStrictMode(
            l,
            `property ${t} matches pattern ${e} (use allowMatchingProperties)`
          );
        }
    }
    function _(n) {
      t.forIn("key", a, (i) => {
        t.if(
          M_codegen_maybe._`${M_validate_properties_maybe.usePattern(
            e,
            n
          )}.test(${i})`,
          () => {
            const r = p.includes(n);
            if (r) {
              e.subschema(
                {
                  keyword: "patternProperties",
                  schemaProp: n,
                  dataProp: i,
                  dataPropType: M_ajv_utils_maybe.Type.Str,
                },
                f
              );
            }
            if (l.opts.unevaluated && !0 !== m) {
              t.assign(M_codegen_maybe._`${m}[${i}]`, !0);
            } else {
              if (r || l.allErrors) {
                t.if(M_codegen_maybe.not(f), () => t.break());
              }
            }
          }
        );
      });
    }
    !(function () {
      for (const e of d) {
        if (h) {
          g(e);
        }
        if (l.allErrors) {
          _(e);
        } else {
          t.var(f, !0);
          _(e);
          t.if(f);
        }
      }
    })();
  },
};
exports.default = a;
