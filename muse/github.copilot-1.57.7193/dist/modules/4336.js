Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(412);
const o = require(3487);
const i = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: {
    message: ({ schemaCode: e }) => o.str`must match pattern "${e}"`,
    params: ({ schemaCode: e }) => o._`{pattern: ${e}}`,
  },
  code(e) {
    const { data: t, $data: n, schema: i, schemaCode: s, it: a } = e;
    const c = a.opts.unicodeRegExp ? "u" : "";
    const l = n ? o._`(new RegExp(${s}, ${c}))` : r.usePattern(e, i);
    e.fail$data(o._`!${l}.test(${t})`);
  },
};
exports.default = i;