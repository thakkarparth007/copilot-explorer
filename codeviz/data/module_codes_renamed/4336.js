Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_validate_properties_maybe = require("validate-properties");
const M_codegen_maybe = require("codegen");
const i = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: {
    message: ({ schemaCode: e }) =>
      M_codegen_maybe.str`must match pattern "${e}"`,
    params: ({ schemaCode: e }) => M_codegen_maybe._`{pattern: ${e}}`,
  },
  code(e) {
    const { data: t, $data: n, schema: i, schemaCode: s, it: a } = e;
    const c = a.opts.unicodeRegExp ? "u" : "";
    const l = n
      ? M_codegen_maybe._`(new RegExp(${s}, ${c}))`
      : M_validate_properties_maybe.usePattern(e, i);
    e.fail$data(M_codegen_maybe._`!${l}.test(${t})`);
  },
};
exports.default = i;
