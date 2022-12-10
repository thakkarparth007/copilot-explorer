Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_NOTSURE = require("codegen"),
  o = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: e, schemaCode: t }) {
        const n = "maxItems" === e ? "more" : "fewer";
        return M_codegen_NOTSURE.str`must NOT have ${n} than ${t} items`;
      },
      params: ({ schemaCode: e }) => M_codegen_NOTSURE._`{limit: ${e}}`,
    },
    code(e) {
      const { keyword: t, data: n, schemaCode: o } = e,
        i =
          "maxItems" === t
            ? M_codegen_NOTSURE.operators.GT
            : M_codegen_NOTSURE.operators.LT;
      e.fail$data(M_codegen_NOTSURE._`${n}.length ${i} ${o}`);
    },
  };
exports.default = o;
