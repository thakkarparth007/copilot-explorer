Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_maybe = require("codegen");
const o = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: {
    message: ({ schemaCode: e }) =>
      M_codegen_maybe.str`must be multiple of ${e}`,
    params: ({ schemaCode: e }) => M_codegen_maybe._`{multipleOf: ${e}}`,
  },
  code(e) {
    const { gen: t, data: n, schemaCode: o, it: i } = e;
    const s = i.opts.multipleOfPrecision;
    const a = t.let("res");
    const c = s
      ? M_codegen_maybe._`Math.abs(Math.round(${a}) - ${a}) > 1e-${s}`
      : M_codegen_maybe._`${a} !== parseInt(${a})`;
    e.fail$data(M_codegen_maybe._`(${o} === 0 || (${a} = ${n}/${o}, ${c}))`);
  },
};
exports.default = o;
