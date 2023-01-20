Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.CodeGen =
  exports.Name =
  exports.nil =
  exports.stringify =
  exports.str =
  exports._ =
  exports.KeywordCxt =
    undefined;
const r = require(7159);
const o = require(3924);
const i = require(1240);
const s = require(98);
const a = ["/properties"];
const c = "http://json-schema.org/draft-07/schema";
class l extends r.default {
  _addVocabularies() {
    super._addVocabularies();
    o.default.forEach((e) => this.addVocabulary(e));
    if (this.opts.discriminator) {
      this.addKeyword(i.default);
    }
  }
  _addDefaultMetaSchema() {
    super._addDefaultMetaSchema();
    if (!this.opts.meta) return;
    const e = this.opts.$data ? this.$dataMetaSchema(s, a) : s;
    this.addMetaSchema(e, c, false);
    this.refs["http://json-schema.org/schema"] = c;
  }
  defaultMeta() {
    return (this.opts.defaultMeta =
      super.defaultMeta() || (this.getSchema(c) ? c : undefined));
  }
}
module.exports = exports = l;
Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.default = l;
var u = require(4815);
exports.KeywordCxt = u.KeywordCxt;
var d = require(3487);
exports._ = d._;
exports.str = d.str;
exports.stringify = d.stringify;
exports.nil = d.nil;
exports.Name = d.Name;
exports.CodeGen = d.CodeGen;