Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(3487);
const o = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: true,
  error: {
    message({ keyword: e, schemaCode: t }) {
      const n = "maxItems" === e ? "more" : "fewer";
      return r.str`must NOT have ${n} than ${t} items`;
    },
    params: ({ schemaCode: e }) => r._`{limit: ${e}}`,
  },
  code(e) {
    const { keyword: t, data: n, schemaCode: o } = e;
    const i = "maxItems" === t ? r.operators.GT : r.operators.LT;
    e.fail$data(r._`${n}.length ${i} ${o}`);
  },
};
exports.default = o;