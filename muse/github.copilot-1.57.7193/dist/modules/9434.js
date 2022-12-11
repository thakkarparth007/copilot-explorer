Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(3487);
const o = require(6776);
const i = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: {
    message: ({ params: e }) => r.str`must match "${e.ifClause}" schema`,
    params: ({ params: e }) => r._`{failingKeyword: ${e.ifClause}}`,
  },
  code(e) {
    const { gen: t, parentSchema: n, it: i } = e;
    if (undefined === n.then && undefined === n.else) {
      o.checkStrictMode(i, '"if" without "then" and "else" is ignored');
    }
    const a = s(i, "then");
    const c = s(i, "else");
    if (!a && !c) return;
    const l = t.let("valid", !0);
    const u = t.name("_valid");
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
    } else a ? t.if(u, d("then")) : t.if((0, r.not)(u), d("else"));
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
          t.assign(o, r._`${n}`);
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
  return undefined !== n && !o.alwaysValidSchema(e, n);
}
exports.default = i;