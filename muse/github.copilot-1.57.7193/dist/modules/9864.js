Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(3487);
const o = require(6776);
const i = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: {
    message: ({ params: { min: e, max: t } }) =>
      undefined === t
        ? r.str`must contain at least ${e} valid item(s)`
        : r.str`must contain at least ${e} and no more than ${t} valid item(s)`,
    params: ({ params: { min: e, max: t } }) =>
      undefined === t
        ? r._`{minContains: ${e}}`
        : r._`{minContains: ${e}, maxContains: ${t}}`,
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
    const p = t.const("len", r._`${s}.length`);
    e.setParams({
      min: c,
      max: l,
    });
    if (void 0 === l && 0 === c)
      return void (0, o.checkStrictMode)(
        a,
        '"minContains" == 0 without "maxContains": "contains" keyword ignored'
      );
    if (undefined !== l && c > l) {
      o.checkStrictMode(a, '"minContains" > "maxContains" is always invalid');
      return void e.fail();
    }
    if (o.alwaysValidSchema(a, n)) {
      let t = r._`${p} >= ${c}`;
      if (undefined !== l) {
        t = r._`${t} && ${p} <= ${l}`;
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
            t.code(r._`${e}++`);
            if (undefined === l) {
              t.if(r._`${e} >= ${c}`, () => t.assign(h, !0).break());
            } else {
              t.if(r._`${e} > ${l}`, () => t.assign(h, !1).break());
              if (1 === c) {
                t.assign(h, !0);
              } else {
                t.if(r._`${e} >= ${c}`, () => t.assign(h, !0));
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
            dataPropType: o.Type.Num,
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