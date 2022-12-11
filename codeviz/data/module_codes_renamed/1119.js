Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
const M_validate_properties_maybe = require("validate-properties");
const M_json_schema_validator_additional_items_maybe = require("json-schema-validator-additional-items");
const a = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: {
    message: ({ params: { len: e } }) =>
      M_codegen_maybe.str`must NOT have more than ${e} items`,
    params: ({ params: { len: e } }) => M_codegen_maybe._`{limit: ${e}}`,
  },
  code(e) {
    const { schema: t, parentSchema: n, it: r } = e;
    const { prefixItems: a } = n;
    r.items = !0;
    if (M_ajv_utils_maybe.alwaysValidSchema(r, t)) {
      if (a) {
        M_json_schema_validator_additional_items_maybe.validateAdditionalItems(
          e,
          a
        );
      } else {
        e.ok(M_validate_properties_maybe.validateArray(e));
      }
    }
  },
};
exports.default = a;
