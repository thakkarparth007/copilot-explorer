Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_NOTSURE = require("codegen"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  M_validate_properties_NOTSURE = require("validate-properties"),
  M_json_schema_validator_additional_items_NOTSURE = require("json-schema-validator-additional-items"),
  a = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: e } }) =>
        M_codegen_NOTSURE.str`must NOT have more than ${e} items`,
      params: ({ params: { len: e } }) => M_codegen_NOTSURE._`{limit: ${e}}`,
    },
    code(e) {
      const { schema: t, parentSchema: n, it: r } = e,
        { prefixItems: a } = n;
      r.items = !0;
      if (M_ajv_utils_NOTSURE.alwaysValidSchema(r, t)) {
        if (a) {
          M_json_schema_validator_additional_items_NOTSURE.validateAdditionalItems(
            e,
            a
          );
        } else {
          e.ok(M_validate_properties_NOTSURE.validateArray(e));
        }
      }
    },
  };
exports.default = a;
