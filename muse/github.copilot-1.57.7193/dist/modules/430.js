Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(3487),
  o = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: e }) => r.str`must be multiple of ${e}`,
      params: ({ schemaCode: e }) => r._`{multipleOf: ${e}}`,
    },
    code(e) {
      const { gen: t, data: n, schemaCode: o, it: i } = e,
        s = i.opts.multipleOfPrecision,
        a = t.let("res"),
        c = s
          ? r._`Math.abs(Math.round(${a}) - ${a}) > 1e-${s}`
          : r._`${a} !== parseInt(${a})`;
      e.fail$data(r._`(${o} === 0 || (${a} = ${n}/${o}, ${c}))`);
    },
  };
exports.default = o;