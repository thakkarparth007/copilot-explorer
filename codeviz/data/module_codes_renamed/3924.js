Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_json_schema_keywords_maybe = require("json-schema-keywords");
const M_json_schema_keywords_maybe = require("json-schema-keywords");
const M_get_all_commands_maybe = require("get-all-commands");
const M_copilot_language_support_maybe = require("copilot-language-support");
const M_openapi_vocabulary_maybe = require("openapi-vocabulary");
const c = [
  M_json_schema_keywords_maybe.default,
  M_json_schema_keywords_maybe.default,
  M_get_all_commands_maybe.default(),
  M_copilot_language_support_maybe.default,
  M_openapi_vocabulary_maybe.metadataVocabulary,
  M_openapi_vocabulary_maybe.contentVocabulary,
];
exports.default = c;
