Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_NOTSURE = require("codegen"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  M_ucs2length_NOTSURE = require("ucs2length"),
  s = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: e, schemaCode: t }) {
        const n = "maxLength" === e ? "more" : "fewer";
        return M_codegen_NOTSURE.str`must NOT have ${n} than ${t} characters`;
      },
      params: ({ schemaCode: e }) => M_codegen_NOTSURE._`{limit: ${e}}`,
    },
    code(e) {
      const { keyword: t, data: n, schemaCode: s, it: a } = e,
        c =
          "maxLength" === t
            ? M_codegen_NOTSURE.operators.GT
            : M_codegen_NOTSURE.operators.LT,
        l =
          !1 === a.opts.unicode
            ? M_codegen_NOTSURE._`${n}.length`
            : M_codegen_NOTSURE._`${M_ajv_utils_NOTSURE.useFunc(
                e.gen,
                M_ucs2length_NOTSURE.default
              )}(${n})`;
      e.fail$data(M_codegen_NOTSURE._`${l} ${c} ${s}`);
    },
  };
exports.default = s;
