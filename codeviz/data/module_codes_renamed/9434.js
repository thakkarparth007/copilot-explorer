Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_NOTSURE = require("codegen"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  i = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: e }) =>
        M_codegen_NOTSURE.str`must match "${e.ifClause}" schema`,
      params: ({ params: e }) =>
        M_codegen_NOTSURE._`{failingKeyword: ${e.ifClause}}`,
    },
    code(e) {
      const { gen: t, parentSchema: n, it: i } = e;
      if (undefined === n.then && undefined === n.else) {
        M_ajv_utils_NOTSURE.checkStrictMode(
          i,
          '"if" without "then" and "else" is ignored'
        );
      }
      const a = s(i, "then"),
        c = s(i, "else");
      if (!a && !c) return;
      const l = t.let("valid", !0),
        u = t.name("_valid");
      (function () {
        const t = e.subschema(
          {
            keyword: "if",
            compositeRule: !0,
            createErrors: !1,
            allErrors: !1,
          },
          u
        );
        e.mergeEvaluated(t);
      })();
      e.reset();
      if (a && c) {
        const n = t.let("ifClause");
        e.setParams({
          ifClause: n,
        }),
          t.if(u, d("then", n), d("else", n));
      } else
        a ? t.if(u, d("then")) : t.if((0, M_codegen_NOTSURE.not)(u), d("else"));
      function d(n, o) {
        return () => {
          const i = e.subschema(
            {
              keyword: n,
            },
            u
          );
          t.assign(l, u);
          e.mergeValidEvaluated(i, l);
          if (o) {
            t.assign(o, M_codegen_NOTSURE._`${n}`);
          } else {
            e.setParams({
              ifClause: n,
            });
          }
        };
      }
      e.pass(l, () => e.error(!0));
    },
  };
function s(e, t) {
  const n = e.schema[t];
  return undefined !== n && !M_ajv_utils_NOTSURE.alwaysValidSchema(e, n);
}
exports.default = i;
