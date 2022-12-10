Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_NOTSURE = require("codegen"),
  o = M_codegen_NOTSURE.operators,
  i = {
    maximum: {
      okStr: "<=",
      ok: o.LTE,
      fail: o.GT,
    },
    minimum: {
      okStr: ">=",
      ok: o.GTE,
      fail: o.LT,
    },
    exclusiveMaximum: {
      okStr: "<",
      ok: o.LT,
      fail: o.GTE,
    },
    exclusiveMinimum: {
      okStr: ">",
      ok: o.GT,
      fail: o.LTE,
    },
  },
  s = {
    message: ({ keyword: e, schemaCode: t }) =>
      M_codegen_NOTSURE.str`must be ${i[e].okStr} ${t}`,
    params: ({ keyword: e, schemaCode: t }) =>
      M_codegen_NOTSURE._`{comparison: ${i[e].okStr}, limit: ${t}}`,
  },
  a = {
    keyword: Object.keys(i),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: s,
    code(e) {
      const { keyword: t, data: n, schemaCode: o } = e;
      e.fail$data(M_codegen_NOTSURE._`${n} ${i[t].fail} ${o} || isNaN(${n})`);
    },
  };
exports.default = a;
