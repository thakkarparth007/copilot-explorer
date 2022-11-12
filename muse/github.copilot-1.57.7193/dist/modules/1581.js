Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = undefined;
const r = require(7159),
  o = require(3924),
  i = require(1240),
  s = require(98),
  a = ["/properties"],
  c = "http://json-schema.org/draft-07/schema";
class l extends r.default {
  _addVocabularies() {
    super._addVocabularies();
    o.default.forEach(e => this.addVocabulary(e));
    this.opts.discriminator && this.addKeyword(i.default);
  }
  _addDefaultMetaSchema() {
    super._addDefaultMetaSchema();
    if (!this.opts.meta) return;
    const e = this.opts.$data ? this.$dataMetaSchema(s, a) : s;
    this.addMetaSchema(e, c, !1);
    this.refs["http://json-schema.org/schema"] = c;
  }
  defaultMeta() {
    return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : undefined);
  }
}
module.exports = exports = l;
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.default = l;
var u = require(4815);
Object.defineProperty(exports, "KeywordCxt", {
  enumerable: !0,
  get: function () {
    return u.KeywordCxt;
  }
});
var d = require(3487);
Object.defineProperty(exports, "_", {
  enumerable: !0,
  get: function () {
    return d._;
  }
});
Object.defineProperty(exports, "str", {
  enumerable: !0,
  get: function () {
    return d.str;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: !0,
  get: function () {
    return d.stringify;
  }
});
Object.defineProperty(exports, "nil", {
  enumerable: !0,
  get: function () {
    return d.nil;
  }
});
Object.defineProperty(exports, "Name", {
  enumerable: !0,
  get: function () {
    return d.Name;
  }
});
Object.defineProperty(exports, "CodeGen", {
  enumerable: !0,
  get: function () {
    return d.CodeGen;
  }
});