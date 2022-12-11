Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_number_comparison_maybe = require("number-comparison");
const M_multiple_of_validator_maybe = require("multiple-of-validator");
const M_string_length_validator_maybe = require("string-length-validator");
const M_pattern_validator_maybe = require("pattern-validator");
const M_object_key_count_validator_maybe = require("object-key-count-validator");
const M_ajv_keywords_required_maybe = require("ajv-keywords-required");
const M_array_length_validator_maybe = require("array-length-validator");
const M_ajv_unique_items_maybe = require("ajv-unique-items");
const M_const_keyword_maybe = require("const-keyword");
const M_enum_validator_maybe = require("enum-validator");
const h = [
  M_number_comparison_maybe.default,
  M_multiple_of_validator_maybe.default,
  M_string_length_validator_maybe.default,
  M_pattern_validator_maybe.default,
  M_object_key_count_validator_maybe.default,
  M_ajv_keywords_required_maybe.default,
  M_array_length_validator_maybe.default,
  M_ajv_unique_items_maybe.default,
  {
    keyword: "type",
    schemaType: ["string", "array"],
  },
  {
    keyword: "nullable",
    schemaType: "boolean",
  },
  M_const_keyword_maybe.default,
  M_enum_validator_maybe.default,
];
exports.default = h;
