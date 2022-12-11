Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_json_schema_validator_additional_items_maybe = require("json-schema-validator-additional-items");
const M_prefix_items_maybe = require("prefix-items");
const M_validate_tuple_maybe = require("validate-tuple");
const M_max_items_keyword_maybe = require("max-items-keyword");
const M_ajv_min_contains_keyword_maybe = require("ajv-min-contains-keyword");
const M_dependencies_maybe = require("dependencies");
const M_property_names_validator_maybe = require("property-names-validator");
const M_additional_properties_keyword_maybe = require("additional-properties-keyword");
const M_json_schema_properties_maybe = require("json-schema-properties");
const M_pattern_properties_maybe = require("pattern_properties");
const M_not_maybe = require("not");
const M_anyOf_maybe = require("anyOf");
const M_ajv_codegen_oneof_maybe = require("ajv-codegen-oneof");
const M_ajv_keyword_allof_maybe = require("ajv-keyword-allof");
const M_schema_validation_utils_maybe = require("schema_validation_utils");
const M_then_else_keyword_handler_maybe = require("then-else-keyword-handler");
exports.default = function (e = !1) {
  const t = [
    M_not_maybe.default,
    M_anyOf_maybe.default,
    M_ajv_codegen_oneof_maybe.default,
    M_ajv_keyword_allof_maybe.default,
    M_schema_validation_utils_maybe.default,
    M_then_else_keyword_handler_maybe.default,
    M_property_names_validator_maybe.default,
    M_additional_properties_keyword_maybe.default,
    M_dependencies_maybe.default,
    M_json_schema_properties_maybe.default,
    M_pattern_properties_maybe.default,
  ];
  if (e) {
    t.push(M_prefix_items_maybe.default, M_max_items_keyword_maybe.default);
  } else {
    t.push(
      M_json_schema_validator_additional_items_maybe.default,
      M_validate_tuple_maybe.default
    );
  }
  t.push(M_ajv_min_contains_keyword_maybe.default);
  return t;
};
