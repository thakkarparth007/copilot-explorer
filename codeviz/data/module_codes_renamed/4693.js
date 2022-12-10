Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_NOTSURE = require("codegen"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  M_ajv_runtime_equal_NOTSURE = require("ajv-runtime-equal"),
  s = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: e }) => M_codegen_NOTSURE._`{allowedValue: ${e}}`,
    },
    code(e) {
      const { gen: t, data: n, $data: s, schemaCode: a, schema: c } = e;
      if (s || (c && "object" == typeof c)) {
        e.fail$data(
          M_codegen_NOTSURE._`!${M_ajv_utils_NOTSURE.useFunc(
            t,
            M_ajv_runtime_equal_NOTSURE.default
          )}(${n}, ${a})`
        );
      } else {
        e.fail(M_codegen_NOTSURE._`${c} !== ${n}`);
      }
    },
  };
exports.default = s;
