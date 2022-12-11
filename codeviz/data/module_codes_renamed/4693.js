Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
const M_ajv_runtime_equal_maybe = require("ajv-runtime-equal");
const s = {
  keyword: "const",
  $data: !0,
  error: {
    message: "must be equal to constant",
    params: ({ schemaCode: e }) => M_codegen_maybe._`{allowedValue: ${e}}`,
  },
  code(e) {
    const { gen: t, data: n, $data: s, schemaCode: a, schema: c } = e;
    if (s || (c && "object" == typeof c)) {
      e.fail$data(
        M_codegen_maybe._`!${M_ajv_utils_maybe.useFunc(
          t,
          M_ajv_runtime_equal_maybe.default
        )}(${n}, ${a})`
      );
    } else {
      e.fail(M_codegen_maybe._`${c} !== ${n}`);
    }
  },
};
exports.default = s;
