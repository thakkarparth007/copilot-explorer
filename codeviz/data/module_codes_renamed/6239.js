Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_compiler_utils_NOTSURE = require("compiler-utils"),
  M_validate_properties_NOTSURE = require("validate-properties"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  M_additional_properties_keyword_NOTSURE = require("additional-properties-keyword"),
  a = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(e) {
      const { gen: t, schema: n, parentSchema: a, data: c, it: l } = e;
      if (
        "all" === l.opts.removeAdditional &&
        undefined === a.additionalProperties
      ) {
        M_additional_properties_keyword_NOTSURE.default.code(
          new M_compiler_utils_NOTSURE.KeywordCxt(
            l,
            M_additional_properties_keyword_NOTSURE.default,
            "additionalProperties"
          )
        );
      }
      const u = M_validate_properties_NOTSURE.allSchemaProperties(n);
      for (const e of u) l.definedProperties.add(e);
      if (l.opts.unevaluated && u.length && !0 !== l.props) {
        l.props = M_ajv_utils_NOTSURE.mergeEvaluated.props(
          t,
          M_ajv_utils_NOTSURE.toHash(u),
          l.props
        );
      }
      const d = u.filter(
        (e) => !M_ajv_utils_NOTSURE.alwaysValidSchema(l, n[e])
      );
      if (0 === d.length) return;
      const p = t.name("valid");
      for (const n of d) {
        if (h(n)) {
          f(n);
        } else {
          t.if(
            M_validate_properties_NOTSURE.propertyInData(
              t,
              c,
              n,
              l.opts.ownProperties
            )
          );
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
