Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
const M_ucs2length_maybe = require("ucs2length");
const s = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: {
    message({ keyword: e, schemaCode: t }) {
      const n = "maxLength" === e ? "more" : "fewer";
      return M_codegen_maybe.str`must NOT have ${n} than ${t} characters`;
    },
    params: ({ schemaCode: e }) => M_codegen_maybe._`{limit: ${e}}`,
  },
  code(e) {
    const { keyword: t, data: n, schemaCode: s, it: a } = e;
    const c =
      "maxLength" === t
        ? M_codegen_maybe.operators.GT
        : M_codegen_maybe.operators.LT;
    const l =
      !1 === a.opts.unicode
        ? M_codegen_maybe._`${n}.length`
        : M_codegen_maybe._`${M_ajv_utils_maybe.useFunc(
            e.gen,
            M_ucs2length_maybe.default
          )}(${n})`;
    e.fail$data(M_codegen_maybe._`${l} ${c} ${s}`);
  },
};
exports.default = s;
