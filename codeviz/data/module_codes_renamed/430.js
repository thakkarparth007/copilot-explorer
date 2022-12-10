Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_NOTSURE = require("codegen"),
  o = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: e }) =>
        M_codegen_NOTSURE.str`must be multiple of ${e}`,
      params: ({ schemaCode: e }) => M_codegen_NOTSURE._`{multipleOf: ${e}}`,
    },
    code(e) {
      const { gen: t, data: n, schemaCode: o, it: i } = e,
        s = i.opts.multipleOfPrecision,
        a = t.let("res"),
        c = s
          ? M_codegen_NOTSURE._`Math.abs(Math.round(${a}) - ${a}) > 1e-${s}`
          : M_codegen_NOTSURE._`${a} !== parseInt(${a})`;
      e.fail$data(
        M_codegen_NOTSURE._`(${o} === 0 || (${a} = ${n}/${o}, ${c}))`
      );
    },
  };
exports.default = o;
