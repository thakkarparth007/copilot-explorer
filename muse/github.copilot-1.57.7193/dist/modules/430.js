Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(3487);
const o = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: true,
  error: {
    message: ({ schemaCode: e }) => r.str`must be multiple of ${e}`,
    params: ({ schemaCode: e }) => r._`{multipleOf: ${e}}`,
  },
  code(e) {
    const { gen: t, data: n, schemaCode: o, it: i } = e;
    const s = i.opts.multipleOfPrecision;
    const a = t.let("res");
    const c = s
      ? r._`Math.abs(Math.round(${a}) - ${a}) > 1e-${s}`
      : r._`${a} !== parseInt(${a})`;
    e.fail$data(r._`(${o} === 0 || (${a} = ${n}/${o}, ${c}))`);
  },
};
exports.default = o;