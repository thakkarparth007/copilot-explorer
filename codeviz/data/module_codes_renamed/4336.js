Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_validate_properties_NOTSURE = require("validate-properties"),
  M_codegen_NOTSURE = require("codegen"),
  i = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: e }) =>
        M_codegen_NOTSURE.str`must match pattern "${e}"`,
      params: ({ schemaCode: e }) => M_codegen_NOTSURE._`{pattern: ${e}}`,
    },
    code(e) {
      const { data: t, $data: n, schema: i, schemaCode: s, it: a } = e,
        c = a.opts.unicodeRegExp ? "u" : "",
        l = n
          ? M_codegen_NOTSURE._`(new RegExp(${s}, ${c}))`
          : M_validate_properties_NOTSURE.usePattern(e, i);
      e.fail$data(M_codegen_NOTSURE._`!${l}.test(${t})`);
    },
  };
exports.default = i;
