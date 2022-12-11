Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_validate_properties_maybe = require("validate-properties");
const M_codegen_maybe = require("codegen");
const M_json_schema_default_names_maybe = require("json-schema-default-names");
const M_ajv_utils_maybe = require("ajv-utils");
const a = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: {
    message: "must NOT have additional properties",
    params: ({ params: e }) =>
      M_codegen_maybe._`{additionalProperty: ${e.additionalProperty}}`,
  },
  code(e) {
    const {
      gen: t,
      schema: n,
      parentSchema: a,
      data: c,
      errsCount: l,
      it: u,
    } = e;
    if (!l) throw new Error("ajv implementation error");
    const { allErrors: d, opts: p } = u;
    u.props = !0;
    if (
      "all" !== p.removeAdditional &&
      (0, M_ajv_utils_maybe.alwaysValidSchema)(u, n)
    )
      return;
    const h = M_validate_properties_maybe.allSchemaProperties(a.properties);
    const f = M_validate_properties_maybe.allSchemaProperties(
      a.patternProperties
    );
    function m(e) {
      t.code(M_codegen_maybe._`delete ${c}[${e}]`);
    }
    function g(r) {
      if ("all" === p.removeAdditional || (p.removeAdditional && !1 === n))
        m(r);
      else {
        if (!1 === n) {
          e.setParams({
            additionalProperty: r,
          });
          e.error();
          return void (d || t.break());
        }
        if (
          "object" == typeof n &&
          !M_ajv_utils_maybe.alwaysValidSchema(u, n)
        ) {
          const n = t.name("valid");
          if ("failing" === p.removeAdditional) {
            _(r, n, !1);
            t.if(M_codegen_maybe.not(n), () => {
              e.reset();
              m(r);
            });
          } else {
            _(r, n);
            if (d) {
              t.if(M_codegen_maybe.not(n), () => t.break());
            }
          }
        }
      }
    }
    function _(t, n, r) {
      const o = {
        keyword: "additionalProperties",
        dataProp: t,
        dataPropType: M_ajv_utils_maybe.Type.Str,
      };
      if (!1 === r) {
        Object.assign(o, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1,
        });
      }
      e.subschema(o, n);
    }
    t.forIn("key", c, (n) => {
      if (h.length || f.length) {
        t.if(
          (function (n) {
            let i;
            if (h.length > 8) {
              const e = M_ajv_utils_maybe.schemaRefOrVal(
                u,
                a.properties,
                "properties"
              );
              i = M_validate_properties_maybe.isOwnProperty(t, e, n);
            } else
              i = h.length
                ? M_codegen_maybe.or(
                    ...h.map((e) => M_codegen_maybe._`${n} === ${e}`)
                  )
                : M_codegen_maybe.nil;
            if (f.length) {
              i = M_codegen_maybe.or(
                i,
                ...f.map(
                  (t) =>
                    M_codegen_maybe._`${M_validate_properties_maybe.usePattern(
                      e,
                      t
                    )}.test(${n})`
                )
              );
            }
            return M_codegen_maybe.not(i);
          })(n),
          () => g(n)
        );
      } else {
        g(n);
      }
    });
    e.ok(
      M_codegen_maybe._`${l} === ${M_json_schema_default_names_maybe.default.errors}`
    );
  },
};
exports.default = a;
