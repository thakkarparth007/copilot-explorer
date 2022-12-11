Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
const i = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: {
    message: ({ params: { min: e, max: t } }) =>
      undefined === t
        ? M_codegen_maybe.str`must contain at least ${e} valid item(s)`
        : M_codegen_maybe.str`must contain at least ${e} and no more than ${t} valid item(s)`,
    params: ({ params: { min: e, max: t } }) =>
      undefined === t
        ? M_codegen_maybe._`{minContains: ${e}}`
        : M_codegen_maybe._`{minContains: ${e}, maxContains: ${t}}`,
  },
  code(e) {
    const { gen: t, schema: n, parentSchema: i, data: s, it: a } = e;
    let c;
    let l;
    const { minContains: u, maxContains: d } = i;
    if (a.opts.next) {
      c = undefined === u ? 1 : u;
      l = d;
    } else {
      c = 1;
    }
    const p = t.const("len", M_codegen_maybe._`${s}.length`);
    e.setParams({
      min: c,
      max: l,
    });
    if (void 0 === l && 0 === c)
      return void (0, M_ajv_utils_maybe.checkStrictMode)(
        a,
        '"minContains" == 0 without "maxContains": "contains" keyword ignored'
      );
    if (undefined !== l && c > l) {
      M_ajv_utils_maybe.checkStrictMode(
        a,
        '"minContains" > "maxContains" is always invalid'
      );
      return void e.fail();
    }
    if (M_ajv_utils_maybe.alwaysValidSchema(a, n)) {
      let t = M_codegen_maybe._`${p} >= ${c}`;
      if (undefined !== l) {
        t = M_codegen_maybe._`${t} && ${p} <= ${l}`;
      }
      return void e.pass(t);
    }
    a.items = !0;
    const h = t.name("valid");
    if (undefined === l && 1 === c) f(h, () => t.if(h, () => t.break()));
    else {
      t.let(h, !1);
      const e = t.name("_valid");
      const n = t.let("count", 0);
      f(e, () =>
        t.if(e, () =>
          (function (e) {
            t.code(M_codegen_maybe._`${e}++`);
            if (undefined === l) {
              t.if(M_codegen_maybe._`${e} >= ${c}`, () =>
                t.assign(h, !0).break()
              );
            } else {
              t.if(M_codegen_maybe._`${e} > ${l}`, () =>
                t.assign(h, !1).break()
              );
              if (1 === c) {
                t.assign(h, !0);
              } else {
                t.if(M_codegen_maybe._`${e} >= ${c}`, () => t.assign(h, !0));
              }
            }
          })(n)
        )
      );
    }
    function f(n, r) {
      t.forRange("i", 0, p, (t) => {
        e.subschema(
          {
            keyword: "contains",
            dataProp: t,
            dataPropType: M_ajv_utils_maybe.Type.Num,
            compositeRule: !0,
          },
          n
        );
        r();
      });
    }
    e.result(h, () => e.reset());
  },
};
exports.default = i;
