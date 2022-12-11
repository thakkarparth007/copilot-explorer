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
const M_json_schema_to_typescript_maybe = require("json-schema-to-typescript");
const M_vocabularies_maybe = require("vocabularies");
const M_discriminator_validator_maybe = require("discriminator-validator");
const M_json_schema_draft_07_schema_maybe = require("json-schema-draft-07-schema");
const a = ["/properties"];
const c = "http://json-schema.org/draft-07/schema";
class l extends M_json_schema_to_typescript_maybe.default {
  _addVocabularies() {
    super._addVocabularies();
    M_vocabularies_maybe.default.forEach((e) => this.addVocabulary(e));
    if (this.opts.discriminator) {
      this.addKeyword(M_discriminator_validator_maybe.default);
    }
  }
  _addDefaultMetaSchema() {
    super._addDefaultMetaSchema();
    if (!this.opts.meta) return;
    const e = this.opts.$data
      ? this.$dataMetaSchema(M_json_schema_draft_07_schema_maybe, a)
      : M_json_schema_draft_07_schema_maybe;
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
var M_compiler_utils_maybe = require("compiler-utils");
exports.KeywordCxt = M_compiler_utils_maybe.KeywordCxt;
var M_codegen_maybe = require("codegen");
exports._ = M_codegen_maybe._;
exports.str = M_codegen_maybe.str;
exports.stringify = M_codegen_maybe.stringify;
exports.nil = M_codegen_maybe.nil;
exports.Name = M_codegen_maybe.Name;
exports.CodeGen = M_codegen_maybe.CodeGen;
