Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_json_schema_validator_additional_items_NOTSURE = require("json-schema-validator-additional-items"),
  M_prefix_items_NOTSURE = require("prefix-items"),
  M_validate_tuple_NOTSURE = require("validate-tuple"),
  M_max_items_keyword_NOTSURE = require("max-items-keyword"),
  M_ajv_min_contains_keyword_NOTSURE = require("ajv-min-contains-keyword"),
  M_dependencies_NOTSURE = require("dependencies"),
  M_property_names_validator_NOTSURE = require("property-names-validator"),
  M_additional_properties_keyword_NOTSURE = require("additional-properties-keyword"),
  M_json_schema_properties_NOTSURE = require("json-schema-properties"),
  M_pattern_properties_NOTSURE = require("pattern_properties"),
  M_not_NOTSURE = require("not"),
  M_anyOf_NOTSURE = require("anyOf"),
  M_ajv_codegen_oneof_NOTSURE = require("ajv-codegen-oneof"),
  M_ajv_keyword_allof_NOTSURE = require("ajv-keyword-allof"),
  M_schema_validation_utils_NOTSURE = require("schema_validation_utils"),
  M_then_else_keyword_handler_NOTSURE = require("then-else-keyword-handler");
exports.default = function (e = !1) {
  const t = [
    M_not_NOTSURE.default,
    M_anyOf_NOTSURE.default,
    M_ajv_codegen_oneof_NOTSURE.default,
    M_ajv_keyword_allof_NOTSURE.default,
    M_schema_validation_utils_NOTSURE.default,
    M_then_else_keyword_handler_NOTSURE.default,
    M_property_names_validator_NOTSURE.default,
    M_additional_properties_keyword_NOTSURE.default,
    M_dependencies_NOTSURE.default,
    M_json_schema_properties_NOTSURE.default,
    M_pattern_properties_NOTSURE.default,
  ];
  if (e) {
    t.push(M_prefix_items_NOTSURE.default, M_max_items_keyword_NOTSURE.default);
  } else {
    t.push(
      M_json_schema_validator_additional_items_NOTSURE.default,
      M_validate_tuple_NOTSURE.default
    );
  }
  t.push(M_ajv_min_contains_keyword_NOTSURE.default);
  return t;
};
