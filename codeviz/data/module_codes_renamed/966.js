Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
const M_ajv_runtime_equal_maybe = require("ajv-runtime-equal");
const s = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: {
    message: "must be equal to one of the allowed values",
    params: ({ schemaCode: e }) => M_codegen_maybe._`{allowedValues: ${e}}`,
  },
  code(e) {
    const { gen: t, data: n, $data: s, schema: a, schemaCode: c, it: l } = e;
    if (!s && 0 === a.length) throw new Error("enum must have non-empty array");
    const u = a.length >= l.opts.loopEnum;
    const d = M_ajv_utils_maybe.useFunc(t, M_ajv_runtime_equal_maybe.default);
    let p;
    if (u || s) {
      p = t.let("valid");
      e.block$data(p, function () {
        t.assign(p, !1);
        t.forOf("v", c, (e) =>
          t.if(M_codegen_maybe._`${d}(${n}, ${e})`, () =>
            t.assign(p, !0).break()
          )
        );
      });
    } else {
      if (!Array.isArray(a)) throw new Error("ajv implementation error");
      const e = t.const("vSchema", c);
      p = M_codegen_maybe.or(
        ...a.map((t, o) =>
          (function (e, t) {
            const o = a[t];
            return "object" == typeof o && null !== o
              ? M_codegen_maybe._`${d}(${n}, ${e}[${t}])`
              : M_codegen_maybe._`${n} === ${o}`;
          })(e, o)
        )
      );
    }
    e.pass(p);
  },
};
exports.default = s;
