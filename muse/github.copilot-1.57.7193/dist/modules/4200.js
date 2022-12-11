Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(3487);
const o = require(6776);
const i = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: {
    message: "must match exactly one schema in oneOf",
    params: ({ params: e }) => r._`{passingSchemas: ${e.passing}}`,
  },
  code(e) {
    const { gen: t, schema: n, parentSchema: i, it: s } = e;
    if (!Array.isArray(n)) throw new Error("ajv implementation error");
    if (s.opts.discriminator && i.discriminator) return;
    const a = n;
    const c = t.let("valid", !1);
    const l = t.let("passing", null);
    const u = t.name("_valid");
    e.setParams({
      passing: l,
    });
    t.block(function () {
      a.forEach((n, i) => {
        let a;
        if (o.alwaysValidSchema(s, n)) {
          t.var(u, !0);
        } else {
          a = e.subschema(
            {
              keyword: "oneOf",
              schemaProp: i,
              compositeRule: !0,
            },
            u
          );
        }
        if (i > 0) {
          t.if(r._`${u} && ${c}`)
            .assign(c, !1)
            .assign(l, r._`[${l}, ${i}]`)
            .else();
        }
        t.if(u, () => {
          t.assign(c, !0);
          t.assign(l, i);
          if (a) {
            e.mergeEvaluated(a, r.Name);
          }
        });
      });
    });
    e.result(
      c,
      () => e.reset(),
      () => e.error(!0)
    );
  },
};
exports.default = i;