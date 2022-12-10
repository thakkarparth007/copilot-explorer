Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.CodeGen =
  exports.Name =
  exports.nil =
  exports.stringify =
  exports.str =
  exports._ =
  exports.KeywordCxt =
    undefined;
const M_json_schema_to_typescript_NOTSURE = require("json-schema-to-typescript"),
  M_vocabularies_NOTSURE = require("vocabularies"),
  M_discriminator_validator_NOTSURE = require("discriminator-validator"),
  M_json_schema_draft_07_schema_NOTSURE = require("json-schema-draft-07-schema"),
  a = ["/properties"],
  c = "http://json-schema.org/draft-07/schema";
class l extends M_json_schema_to_typescript_NOTSURE.default {
  _addVocabularies() {
    super._addVocabularies();
    M_vocabularies_NOTSURE.default.forEach((e) => this.addVocabulary(e));
    if (this.opts.discriminator) {
      this.addKeyword(M_discriminator_validator_NOTSURE.default);
    }
  }
  _addDefaultMetaSchema() {
    super._addDefaultMetaSchema();
    if (!this.opts.meta) return;
    const e = this.opts.$data
      ? this.$dataMetaSchema(M_json_schema_draft_07_schema_NOTSURE, a)
      : M_json_schema_draft_07_schema_NOTSURE;
    this.addMetaSchema(e, c, !1);
    this.refs["http://json-schema.org/schema"] = c;
  }
  defaultMeta() {
    return (this.opts.defaultMeta =
      super.defaultMeta() || (this.getSchema(c) ? c : undefined));
  }
}
module.exports = exports = l;
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.default = l;
var M_compiler_utils_NOTSURE = require("compiler-utils");
exports.KeywordCxt = M_compiler_utils_NOTSURE.KeywordCxt;
var M_codegen_NOTSURE = require("codegen");
exports._ = M_codegen_NOTSURE._;
exports.str = M_codegen_NOTSURE.str;
exports.stringify = M_codegen_NOTSURE.stringify;
exports.nil = M_codegen_NOTSURE.nil;
exports.Name = M_codegen_NOTSURE.Name;
exports.CodeGen = M_codegen_NOTSURE.CodeGen;
