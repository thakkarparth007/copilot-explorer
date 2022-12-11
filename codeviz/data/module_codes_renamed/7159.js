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
var M_compiler_utils_maybe = require("compiler-utils");
exports.KeywordCxt = M_compiler_utils_maybe.KeywordCxt;
var M_codegen_maybe = require("codegen");
exports._ = M_codegen_maybe._;
exports.str = M_codegen_maybe.str;
exports.stringify = M_codegen_maybe.stringify;
exports.nil = M_codegen_maybe.nil;
exports.Name = M_codegen_maybe.Name;
exports.CodeGen = M_codegen_maybe.CodeGen;
const M_ajv_validation_error_maybe = require("ajv-validation-error");
const M_missing_reference_error_maybe = require("missing-reference-error");
const M_json_schema_rules_maybe = require("json-schema-rules");
const M_schema_compiler_maybe = require("schema-compiler");
const M_codegen_maybe = require("codegen");
const M_schema_ref_utils_maybe = require("schema-ref-utils");
const M_data_type_checker_maybe = require("data-type-checker");
const M_ajv_utils_maybe = require("ajv-utils");
const M_ajv_refs_data_maybe = require("ajv-refs-data");
const f = ["removeAdditional", "useDefaults", "coerceTypes"];
const m = new Set([
  "validate",
  "serialize",
  "parse",
  "wrapper",
  "root",
  "schema",
  "keyword",
  "pattern",
  "formats",
  "validate$data",
  "func",
  "obj",
  "Error",
]);
const g = {
  errorDataPath: "",
  format: "`validateFormats: false` can be used instead.",
  nullable: '"nullable" keyword is supported by default.',
  jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
  extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
  missingRefs:
    "Pass empty schema with $id that should be ignored to ajv.addSchema.",
  processCode:
    "Use option `code: {process: (code, schemaEnv: object) => string}`",
  sourceCode: "Use option `code: {source: true}`",
  strictDefaults: "It is default now, see option `strict`.",
  strictKeywords: "It is default now, see option `strict`.",
  uniqueItems: '"uniqueItems" keyword is always validated.',
  unknownFormats:
    "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
  cache: "Map is used as cache, schema object as key.",
  serialize: "Map is used as cache, schema object as key.",
  ajvErrors: "It is default now.",
};
const _ = {
  ignoreKeywordsWithRef: "",
  jsPropertySyntax: "",
  unicode: '"minLength"/"maxLength" account for unicode characters by default.',
};
function y(e) {
  var t;
  var n;
  var r;
  var o;
  var i;
  var s;
  var a;
  var c;
  var l;
  var u;
  var d;
  var p;
  var h;
  var f;
  var m;
  var g;
  var _;
  var y;
  var v;
  var b;
  var w;
  var x;
  const E = e.strict;
  const C = null === (t = e.code) || undefined === t ? undefined : t.optimize;
  const S = !0 === C || undefined === C ? 1 : C || 0;
  return {
    strictSchema:
      null === (r = null !== (n = e.strictSchema) && undefined !== n ? n : E) ||
      undefined === r ||
      r,
    strictNumbers:
      null ===
        (i = null !== (o = e.strictNumbers) && undefined !== o ? o : E) ||
      undefined === i ||
      i,
    strictTypes:
      null !== (a = null !== (s = e.strictTypes) && undefined !== s ? s : E) &&
      undefined !== a
        ? a
        : "log",
    strictTuples:
      null !== (l = null !== (c = e.strictTuples) && undefined !== c ? c : E) &&
      undefined !== l
        ? l
        : "log",
    strictRequired:
      null !==
        (d = null !== (u = e.strictRequired) && undefined !== u ? u : E) &&
      undefined !== d &&
      d,
    code: e.code
      ? {
          ...e.code,
          optimize: S,
        }
      : {
          optimize: S,
        },
    loopRequired: null !== (p = e.loopRequired) && undefined !== p ? p : 200,
    loopEnum: null !== (h = e.loopEnum) && undefined !== h ? h : 200,
    meta: null === (f = e.meta) || undefined === f || f,
    messages: null === (m = e.messages) || undefined === m || m,
    inlineRefs: null === (g = e.inlineRefs) || undefined === g || g,
    schemaId: null !== (_ = e.schemaId) && undefined !== _ ? _ : "$id",
    addUsedSchema: null === (y = e.addUsedSchema) || undefined === y || y,
    validateSchema: null === (v = e.validateSchema) || undefined === v || v,
    validateFormats: null === (b = e.validateFormats) || undefined === b || b,
    unicodeRegExp: null === (w = e.unicodeRegExp) || undefined === w || w,
    int32range: null === (x = e.int32range) || undefined === x || x,
  };
}
class v {
  constructor(e = {}) {
    this.schemas = {};
    this.refs = {};
    this.formats = {};
    this._compilations = new Set();
    this._loading = {};
    this._cache = new Map();
    e = this.opts = {
      ...e,
      ...y(e),
    };
    const { es5: t, lines: n } = this.opts.code;
    this.scope = new M_codegen_maybe.ValueScope({
      scope: {},
      prefixes: m,
      es5: t,
      lines: n,
    });
    this.logger = (function (e) {
      if (!1 === e) return T;
      if (undefined === e) return console;
      if (e.log && e.warn && e.error) return e;
      throw new Error("logger must implement log, warn and error methods");
    })(e.logger);
    const r = e.validateFormats;
    e.validateFormats = !1;
    this.RULES = M_json_schema_rules_maybe.getRules();
    b.call(this, g, e, "NOT SUPPORTED");
    b.call(this, _, e, "DEPRECATED", "warn");
    this._metaOpts = S.call(this);
    if (e.formats) {
      E.call(this);
    }
    this._addVocabularies();
    this._addDefaultMetaSchema();
    if (e.keywords) {
      C.call(this, e.keywords);
    }
    if ("object" == typeof e.meta) {
      this.addMetaSchema(e.meta);
    }
    x.call(this);
    e.validateFormats = r;
  }
  _addVocabularies() {
    this.addKeyword("$async");
  }
  _addDefaultMetaSchema() {
    const { $data: e, meta: t, schemaId: n } = this.opts;
    let r = M_ajv_refs_data_maybe;
    if ("id" === n) {
      r = {
        ...M_ajv_refs_data_maybe,
      };
      r.id = r.$id;
      delete r.$id;
    }
    if (t && e) {
      this.addMetaSchema(r, r[n], !1);
    }
  }
  defaultMeta() {
    const { meta: e, schemaId: t } = this.opts;
    return (this.opts.defaultMeta =
      "object" == typeof e ? e[t] || e : undefined);
  }
  validate(e, t) {
    let n;
    if ("string" == typeof e) {
      n = this.getSchema(e);
      if (!n) throw new Error(`no schema with key or ref "${e}"`);
    } else n = this.compile(e);
    const r = n(t);
    if ("$async" in n) {
      this.errors = n.errors;
    }
    return r;
  }
  compile(e, t) {
    const n = this._addSchema(e, t);
    return n.validate || this._compileSchemaEnv(n);
  }
  compileAsync(e, t) {
    if ("function" != typeof this.opts.loadSchema)
      throw new Error("options.loadSchema should be a function");
    const { loadSchema: n } = this.opts;
    return r.call(this, e, t);
    async function r(e, t) {
      await o.call(this, e.$schema);
      const n = this._addSchema(e, t);
      return n.validate || i.call(this, n);
    }
    async function o(e) {
      if (e && !this.getSchema(e)) {
        await r.call(
          this,
          {
            $ref: e,
          },
          !0
        );
      }
    }
    async function i(e) {
      try {
        return this._compileSchemaEnv(e);
      } catch (t) {
        if (!(t instanceof M_missing_reference_error_maybe.default)) throw t;
        a.call(this, t);
        await c.call(this, t.missingSchema);
        return i.call(this, e);
      }
    }
    function a({ missingSchema: e, missingRef: t }) {
      if (this.refs[e])
        throw new Error(`AnySchema ${e} is loaded but ${t} cannot be resolved`);
    }
    async function c(e) {
      const n = await l.call(this, e);
      if (this.refs[e]) {
        await o.call(this, n.$schema);
      }
      if (this.refs[e]) {
        this.addSchema(n, e, t);
      }
    }
    async function l(e) {
      const t = this._loading[e];
      if (t) return t;
      try {
        return await (this._loading[e] = n(e));
      } finally {
        delete this._loading[e];
      }
    }
  }
  addSchema(e, t, n, r = this.opts.validateSchema) {
    if (Array.isArray(e)) {
      for (const t of e) this.addSchema(t, undefined, n, r);
      return this;
    }
    let o;
    if ("object" == typeof e) {
      const { schemaId: t } = this.opts;
      o = e[t];
      if (void 0 !== o && "string" != typeof o)
        throw new Error(`schema ${t} must be string`);
    }
    t = M_schema_ref_utils_maybe.normalizeId(t || o);
    this._checkUnique(t);
    this.schemas[t] = this._addSchema(e, n, t, r, !0);
    return this;
  }
  addMetaSchema(e, t, n = this.opts.validateSchema) {
    this.addSchema(e, t, !0, n);
    return this;
  }
  validateSchema(e, t) {
    if ("boolean" == typeof e) return !0;
    let n;
    n = e.$schema;
    if (void 0 !== n && "string" != typeof n)
      throw new Error("$schema must be a string");
    n = n || this.opts.defaultMeta || this.defaultMeta();
    if (!n)
      return (
        this.logger.warn("meta-schema not available"), (this.errors = null), !0
      );
    const r = this.validate(n, e);
    if (!r && t) {
      const e = "schema is invalid: " + this.errorsText();
      if ("log" !== this.opts.validateSchema) throw new Error(e);
      this.logger.error(e);
    }
    return r;
  }
  getSchema(e) {
    let t;
    for (; "string" == typeof (t = w.call(this, e)); ) e = t;
    if (undefined === t) {
      const { schemaId: n } = this.opts;
      const r = new M_schema_compiler_maybe.SchemaEnv({
        schema: {},
        schemaId: n,
      });
      t = M_schema_compiler_maybe.resolveSchema.call(this, r, e);
      if (!t) return;
      this.refs[e] = t;
    }
    return t.validate || this._compileSchemaEnv(t);
  }
  removeSchema(e) {
    if (e instanceof RegExp) {
      this._removeAllSchemas(this.schemas, e);
      this._removeAllSchemas(this.refs, e);
      return this;
    }
    switch (typeof e) {
      case "undefined":
        this._removeAllSchemas(this.schemas);
        this._removeAllSchemas(this.refs);
        this._cache.clear();
        return this;
      case "string": {
        const t = w.call(this, e);
        if ("object" == typeof t) {
          this._cache.delete(t.schema);
        }
        delete this.schemas[e];
        delete this.refs[e];
        return this;
      }
      case "object": {
        const t = e;
        this._cache.delete(t);
        let n = e[this.opts.schemaId];
        if (n) {
          n = M_schema_ref_utils_maybe.normalizeId(n);
          delete this.schemas[n];
          delete this.refs[n];
        }
        return this;
      }
      default:
        throw new Error("ajv.removeSchema: invalid parameter");
    }
  }
  addVocabulary(e) {
    for (const t of e) this.addKeyword(t);
    return this;
  }
  addKeyword(e, t) {
    let n;
    if ("string" == typeof e) {
      n = e;
      if ("object" == typeof t) {
        this.logger.warn(
          "these parameters are deprecated, see docs for addKeyword"
        );
        t.keyword = n;
      }
    } else {
      if ("object" != typeof e || undefined !== t)
        throw new Error("invalid addKeywords parameters");
      n = (t = e).keyword;
      if (Array.isArray(n) && !n.length)
        throw new Error(
          "addKeywords: keyword must be string or non-empty array"
        );
    }
    I.call(this, n, t);
    if (!t)
      return (0, M_ajv_utils_maybe.eachItem)(n, (e) => P.call(this, e)), this;
    O.call(this, t);
    const r = {
      ...t,
      type: M_data_type_checker_maybe.getJSONTypes(t.type),
      schemaType: M_data_type_checker_maybe.getJSONTypes(t.schemaType),
    };
    M_ajv_utils_maybe.eachItem(
      n,
      0 === r.type.length
        ? (e) => P.call(this, e, r)
        : (e) => r.type.forEach((t) => P.call(this, e, r, t))
    );
    return this;
  }
  getKeyword(e) {
    const t = this.RULES.all[e];
    return "object" == typeof t ? t.definition : !!t;
  }
  removeKeyword(e) {
    const { RULES: t } = this;
    delete t.keywords[e];
    delete t.all[e];
    for (const n of t.rules) {
      const t = n.rules.findIndex((t) => t.keyword === e);
      if (t >= 0) {
        n.rules.splice(t, 1);
      }
    }
    return this;
  }
  addFormat(e, t) {
    if ("string" == typeof t) {
      t = new RegExp(t);
    }
    this.formats[e] = t;
    return this;
  }
  errorsText(
    e = this.errors,
    { separator: t = ", ", dataVar: n = "data" } = {}
  ) {
    return e && 0 !== e.length
      ? e
          .map((e) => `${n}${e.instancePath} ${e.message}`)
          .reduce((e, n) => e + t + n)
      : "No errors";
  }
  $dataMetaSchema(e, t) {
    const n = this.RULES.all;
    e = JSON.parse(JSON.stringify(e));
    for (const r of t) {
      const t = r.split("/").slice(1);
      let o = e;
      for (const e of t) o = o[e];
      for (const e in n) {
        const t = n[e];
        if ("object" != typeof t) continue;
        const { $data: r } = t.definition;
        const i = o[e];
        if (r && i) {
          o[e] = R(i);
        }
      }
    }
    return e;
  }
  _removeAllSchemas(e, t) {
    for (const n in e) {
      const r = e[n];
      if (t && !t.test(n)) {
        if ("string" == typeof r) {
          delete e[n];
        } else {
          if (r && !r.meta) {
            this._cache.delete(r.schema);
            delete e[n];
          }
        }
      }
    }
  }
  _addSchema(
    e,
    t,
    n,
    r = this.opts.validateSchema,
    o = this.opts.addUsedSchema
  ) {
    let i;
    const { schemaId: s } = this.opts;
    if ("object" == typeof e) i = e[s];
    else {
      if (this.opts.jtd) throw new Error("schema must be object");
      if ("boolean" != typeof e)
        throw new Error("schema must be object or boolean");
    }
    let a = this._cache.get(e);
    if (undefined !== a) return a;
    n = M_schema_ref_utils_maybe.normalizeId(i || n);
    const l = M_schema_ref_utils_maybe.getSchemaRefs.call(this, e, n);
    a = new M_schema_compiler_maybe.SchemaEnv({
      schema: e,
      schemaId: s,
      meta: t,
      baseId: n,
      localRefs: l,
    });
    this._cache.set(a.schema, a);
    if (o && !n.startsWith("#")) {
      if (n) {
        this._checkUnique(n);
      }
      this.refs[n] = a;
    }
    if (r) {
      this.validateSchema(e, !0);
    }
    return a;
  }
  _checkUnique(e) {
    if (this.schemas[e] || this.refs[e])
      throw new Error(`schema with key or id "${e}" already exists`);
  }
  _compileSchemaEnv(e) {
    if (e.meta) {
      this._compileMetaSchema(e);
    } else {
      M_schema_compiler_maybe.compileSchema.call(this, e);
    }
    if (!e.validate) throw new Error("ajv implementation error");
    return e.validate;
  }
  _compileMetaSchema(e) {
    const t = this.opts;
    this.opts = this._metaOpts;
    try {
      M_schema_compiler_maybe.compileSchema.call(this, e);
    } finally {
      this.opts = t;
    }
  }
}
function b(e, t, n, r = "error") {
  for (const o in e) {
    const i = o;
    if (i in t) {
      this.logger[r](`${n}: option ${o}. ${e[i]}`);
    }
  }
}
function w(e) {
  e = M_schema_ref_utils_maybe.normalizeId(e);
  return this.schemas[e] || this.refs[e];
}
function x() {
  const e = this.opts.schemas;
  if (e)
    if (Array.isArray(e)) this.addSchema(e);
    else for (const t in e) this.addSchema(e[t], t);
}
function E() {
  for (const e in this.opts.formats) {
    const t = this.opts.formats[e];
    if (t) {
      this.addFormat(e, t);
    }
  }
}
function C(e) {
  if (Array.isArray(e)) this.addVocabulary(e);
  else {
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const t in e) {
      const n = e[t];
      if (n.keyword) {
        n.keyword = t;
      }
      this.addKeyword(n);
    }
  }
}
function S() {
  const e = {
    ...this.opts,
  };
  for (const t of f) delete e[t];
  return e;
}
exports.default = v;
v.ValidationError = M_ajv_validation_error_maybe.default;
v.MissingRefError = M_missing_reference_error_maybe.default;
const T = {
  log() {},
  warn() {},
  error() {},
};
const k = /^[a-z_$][a-z0-9_$:-]*$/i;
function I(e, t) {
  const { RULES: n } = this;
  M_ajv_utils_maybe.eachItem(e, (e) => {
    if (n.keywords[e]) throw new Error(`Keyword ${e} is already defined`);
    if (!k.test(e)) throw new Error(`Keyword ${e} has invalid name`);
  });
  if (t && t.$data && !("code" in t) && !("validate" in t))
    throw new Error('$data keyword must have "code" or "validate" function');
}
function P(e, t, n) {
  var r;
  const o = null == t ? undefined : t.post;
  if (n && o) throw new Error('keyword with "post" flag cannot have "type"');
  const { RULES: i } = this;
  let s = o ? i.post : i.rules.find(({ type: e }) => e === n);
  if (s) {
    s = {
      type: n,
      rules: [],
    };
    i.rules.push(s);
  }
  i.keywords[e] = !0;
  if (!t) return;
  const a = {
    keyword: e,
    definition: {
      ...t,
      type: M_data_type_checker_maybe.getJSONTypes(t.type),
      schemaType: M_data_type_checker_maybe.getJSONTypes(t.schemaType),
    },
  };
  if (t.before) {
    A.call(this, s, a, t.before);
  } else {
    s.rules.push(a);
  }
  i.all[e] = a;
  if (null === (r = t.implements) || undefined === r) {
    r.forEach((e) => this.addKeyword(e));
  }
}
function A(e, t, n) {
  const r = e.rules.findIndex((e) => e.keyword === n);
  if (r >= 0) {
    e.rules.splice(r, 0, t);
  } else {
    e.rules.push(t);
    this.logger.warn(`rule ${n} is not defined`);
  }
}
function O(e) {
  let { metaSchema: t } = e;
  if (undefined !== t) {
    if (e.$data && this.opts.$data) {
      t = R(t);
    }
    e.validateSchema = this.compile(t, !0);
  }
}
const N = {
  $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
};
function R(e) {
  return {
    anyOf: [e, N],
  };
}
