Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = undefined;
const r = require(3487),
  o = require(7426),
  i = require(2141),
  s = require(2531),
  a = require(6776),
  c = require(4815),
  l = require(540);
class SchemaEnv {
  constructor(e) {
    var t;
    let n;
    this.refs = {};
    this.dynamicAnchors = {};
    "object" == typeof e.schema && (n = e.schema);
    this.schema = e.schema;
    this.schemaId = e.schemaId;
    this.root = e.root || this;
    this.baseId = null !== (t = e.baseId) && undefined !== t ? t : s.normalizeId(null == n ? undefined : n[e.schemaId || "$id"]);
    this.schemaPath = e.schemaPath;
    this.localRefs = e.localRefs;
    this.meta = e.meta;
    this.$async = null == n ? undefined : n.$async;
    this.refs = {};
  }
}
function compileSchema(e) {
  const t = getCompilingSchema.call(this, e);
  if (t) return t;
  const n = s.getFullPath(e.root.baseId),
    {
      es5: a,
      lines: l
    } = this.opts.code,
    {
      ownProperties: u
    } = this.opts,
    d = new r.CodeGen(this.scope, {
      es5: a,
      lines: l,
      ownProperties: u
    });
  let p;
  e.$async && (p = d.scopeValue("Error", {
    ref: o.default,
    code: r._`require("ajv/dist/runtime/validation_error").default`
  }));
  const f = d.scopeName("validate");
  e.validateName = f;
  const m = {
    gen: d,
    allErrors: this.opts.allErrors,
    data: i.default.data,
    parentData: i.default.parentData,
    parentDataProperty: i.default.parentDataProperty,
    dataNames: [i.default.data],
    dataPathArr: [r.nil],
    dataLevel: 0,
    dataTypes: [],
    definedProperties: new Set(),
    topSchemaRef: d.scopeValue("schema", !0 === this.opts.code.source ? {
      ref: e.schema,
      code: r.stringify(e.schema)
    } : {
      ref: e.schema
    }),
    validateName: f,
    ValidationError: p,
    schema: e.schema,
    schemaEnv: e,
    rootId: n,
    baseId: e.baseId || n,
    schemaPath: r.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: r._`""`,
    opts: this.opts,
    self: this
  };
  let g;
  try {
    this._compilations.add(e);
    c.validateFunctionCode(m);
    d.optimize(this.opts.code.optimize);
    const t = d.toString();
    g = `${d.scopeRefs(i.default.scope)}return ${t}`;
    this.opts.code.process && (g = this.opts.code.process(g, e));
    const n = new Function(`${i.default.self}`, `${i.default.scope}`, g)(this, this.scope.get());
    this.scope.value(f, {
      ref: n
    });
    n.errors = null;
    n.schema = e.schema;
    n.schemaEnv = e;
    e.$async && (n.$async = !0);
    !0 === this.opts.code.source && (n.source = {
      validateName: f,
      validateCode: t,
      scopeValues: d._values
    });
    if (this.opts.unevaluated) {
      const {
        props: e,
        items: t
      } = m;
      n.evaluated = {
        props: e instanceof r.Name ? void 0 : e,
        items: t instanceof r.Name ? void 0 : t,
        dynamicProps: e instanceof r.Name,
        dynamicItems: t instanceof r.Name
      }, n.source && (n.source.evaluated = (0, r.stringify)(n.evaluated));
    }
    e.validate = n;
    return e;
  } catch (t) {
    throw delete e.validate, delete e.validateName, g && this.logger.error("Error compiling schema, function code:", g), t;
  } finally {
    this._compilations.delete(e);
  }
}
function p(e) {
  return s.inlineRef(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : compileSchema.call(this, e);
}
function getCompilingSchema(e) {
  for (const r of this._compilations) {
    n = e;
    if ((t = r).schema === n.schema && t.root === n.root && t.baseId === n.baseId) return r;
  }
  var t, n;
}
function f(e, t) {
  let n;
  for (; "string" == typeof (n = this.refs[t]);) t = n;
  return n || this.schemas[t] || resolveSchema.call(this, e, t);
}
function resolveSchema(e, t) {
  const n = l.parse(t),
    r = s._getFullPath(n);
  let o = s.getFullPath(e.baseId);
  if (Object.keys(e.schema).length > 0 && r === o) return _.call(this, n, e);
  const i = s.normalizeId(r),
    a = this.refs[i] || this.schemas[i];
  if ("string" == typeof a) {
    const t = resolveSchema.call(this, e, a);
    if ("object" != typeof (null == t ? undefined : t.schema)) return;
    return _.call(this, n, t);
  }
  if ("object" == typeof (null == a ? undefined : a.schema)) {
    a.validate || compileSchema.call(this, a);
    if (i === (0, s.normalizeId)(t)) {
      const {
          schema: t
        } = a,
        {
          schemaId: n
        } = this.opts,
        r = t[n];
      return r && (o = (0, s.resolveUrl)(o, r)), new SchemaEnv({
        schema: t,
        schemaId: n,
        root: e,
        baseId: o
      });
    }
    return _.call(this, n, a);
  }
}
exports.SchemaEnv = SchemaEnv;
exports.compileSchema = compileSchema;
exports.resolveRef = function (e, t, n) {
  var r;
  n = s.resolveUrl(t, n);
  const o = e.refs[n];
  if (o) return o;
  let i = f.call(this, e, n);
  if (undefined === i) {
    const o = null === (r = e.localRefs) || undefined === r ? undefined : r[n],
      {
        schemaId: s
      } = this.opts;
    o && (i = new SchemaEnv({
      schema: o,
      schemaId: s,
      root: e,
      baseId: t
    }));
  }
  return undefined !== i ? e.refs[n] = p.call(this, i) : undefined;
};
exports.getCompilingSchema = getCompilingSchema;
exports.resolveSchema = resolveSchema;
const g = new Set(["properties", "patternProperties", "enum", "dependencies", "definitions"]);
function _(e, {
  baseId: t,
  schema: n,
  root: r
}) {
  var o;
  if ("/" !== (null === (o = e.fragment) || undefined === o ? undefined : o[0])) return;
  for (const r of e.fragment.slice(1).split("/")) {
    if ("boolean" == typeof n) return;
    const e = n[a.unescapeFragment(r)];
    if (undefined === e) return;
    const o = "object" == typeof (n = e) && n[this.opts.schemaId];
    !g.has(r) && o && (t = s.resolveUrl(t, o));
  }
  let i;
  if ("boolean" != typeof n && n.$ref && !a.schemaHasRulesButRef(n, this.RULES)) {
    const e = s.resolveUrl(t, n.$ref);
    i = resolveSchema.call(this, r, e);
  }
  const {
    schemaId: c
  } = this.opts;
  i = i || new SchemaEnv({
    schema: n,
    schemaId: c,
    root: r,
    baseId: t
  });
  return i.schema !== i.root.schema ? i : undefined;
}