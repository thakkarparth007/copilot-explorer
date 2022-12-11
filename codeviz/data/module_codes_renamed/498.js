Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_maybe = require("codegen");
const o = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: {
    message({ keyword: e, schemaCode: t }) {
      const n = "maxProperties" === e ? "more" : "fewer";
      return M_codegen_maybe.str`must NOT have ${n} than ${t} items`;
    },
    params: ({ schemaCode: e }) => M_codegen_maybe._`{limit: ${e}}`,
  },
  code(e) {
    const { keyword: t, data: n, schemaCode: o } = e;
    const i =
      "maxProperties" === t
        ? M_codegen_maybe.operators.GT
        : M_codegen_maybe.operators.LT;
    e.fail$data(M_codegen_maybe._`Object.keys(${n}).length ${i} ${o}`);
  },
};
exports.default = o;
