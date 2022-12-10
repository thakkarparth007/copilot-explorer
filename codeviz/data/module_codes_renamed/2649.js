Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_number_comparison_NOTSURE = require("number-comparison"),
  M_multiple_of_validator_NOTSURE = require("multiple-of-validator"),
  M_string_length_validator_NOTSURE = require("string-length-validator"),
  M_pattern_validator_NOTSURE = require("pattern-validator"),
  M_object_key_count_validator_NOTSURE = require("object-key-count-validator"),
  M_ajv_keywords_required_NOTSURE = require("ajv-keywords-required"),
  M_array_length_validator_NOTSURE = require("array-length-validator"),
  M_ajv_unique_items_NOTSURE = require("ajv-unique-items"),
  M_const_keyword_NOTSURE = require("const-keyword"),
  M_enum_validator_NOTSURE = require("enum-validator"),
  h = [
    M_number_comparison_NOTSURE.default,
    M_multiple_of_validator_NOTSURE.default,
    M_string_length_validator_NOTSURE.default,
    M_pattern_validator_NOTSURE.default,
    M_object_key_count_validator_NOTSURE.default,
    M_ajv_keywords_required_NOTSURE.default,
    M_array_length_validator_NOTSURE.default,
    M_ajv_unique_items_NOTSURE.default,
    {
      keyword: "type",
      schemaType: ["string", "array"],
    },
    {
      keyword: "nullable",
      schemaType: "boolean",
    },
    M_const_keyword_NOTSURE.default,
    M_enum_validator_NOTSURE.default,
  ];
exports.default = h;
