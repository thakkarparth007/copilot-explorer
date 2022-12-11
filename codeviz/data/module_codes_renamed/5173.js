Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.resolveSchema =
  exports.getCompilingSchema =
  exports.resolveRef =
  exports.compileSchema =
  exports.SchemaEnv =
    undefined;
const M_codegen_maybe = require("codegen");
const M_ajv_validation_error_maybe = require("ajv-validation-error");
const M_json_schema_default_names_maybe = require("json-schema-default-names");
const M_schema_ref_utils_maybe = require("schema-ref-utils");
const M_ajv_utils_maybe = require("ajv-utils");
const M_compiler_utils_maybe = require("compiler-utils");
const M_regexp_lib_maybe = require("regexp-lib");
class SchemaEnv {
  constructor(e) {
    var t;
    let n;
    this.refs = {};
    this.dynamicAnchors = {};
    if ("object" == typeof e.schema) {
      n = e.schema;
    }
    this.schema = e.schema;
    this.schemaId = e.schemaId;
    this.root = e.root || this;
    this.baseId =
      null !== (t = e.baseId) && undefined !== t
        ? t
        : M_schema_ref_utils_maybe.normalizeId(
            null == n ? undefined : n[e.schemaId || "$id"]
          );
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
  const n = M_schema_ref_utils_maybe.getFullPath(e.root.baseId);
  const { es5: a, lines: l } = this.opts.code;
  const { ownProperties: u } = this.opts;
  const d = new M_codegen_maybe.CodeGen(this.scope, {
    es5: a,
    lines: l,
    ownProperties: u,
  });
  let p;
  if (e.$async) {
    p = d.scopeValue("Error", {
      ref: M_ajv_validation_error_maybe.default,
      code: M_codegen_maybe._`require("ajv/dist/runtime/validation_error").default`,
    });
  }
  const f = d.scopeName("validate");
  e.validateName = f;
  const m = {
    gen: d,
    allErrors: this.opts.allErrors,
    data: M_json_schema_default_names_maybe.default.data,
    parentData: M_json_schema_default_names_maybe.default.parentData,
    parentDataProperty:
      M_json_schema_default_names_maybe.default.parentDataProperty,
    dataNames: [M_json_schema_default_names_maybe.default.data],
    dataPathArr: [M_codegen_maybe.nil],
    dataLevel: 0,
    dataTypes: [],
    definedProperties: new Set(),
    topSchemaRef: d.scopeValue(
      "schema",
      !0 === this.opts.code.source
        ? {
            ref: e.schema,
            code: M_codegen_maybe.stringify(e.schema),
          }
        : {
            ref: e.schema,
          }
    ),
    validateName: f,
    ValidationError: p,
    schema: e.schema,
    schemaEnv: e,
    rootId: n,
    baseId: e.baseId || n,
    schemaPath: M_codegen_maybe.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: M_codegen_maybe._`""`,
    opts: this.opts,
    self: this,
  };
  let g;
  try {
    this._compilations.add(e);
    M_compiler_utils_maybe.validateFunctionCode(m);
    d.optimize(this.opts.code.optimize);
    const t = d.toString();
    g = `${d.scopeRefs(
      M_json_schema_default_names_maybe.default.scope
    )}return ${t}`;
    if (this.opts.code.process) {
      g = this.opts.code.process(g, e);
    }
    const n = new Function(
      `${M_json_schema_default_names_maybe.default.self}`,
      `${M_json_schema_default_names_maybe.default.scope}`,
      g
    )(this, this.scope.get());
    this.scope.value(f, {
      ref: n,
    });
    n.errors = null;
    n.schema = e.schema;
    n.schemaEnv = e;
    if (e.$async) {
      n.$async = !0;
    }
    if (!0 === this.opts.code.source) {
      n.source = {
        validateName: f,
        validateCode: t,
        scopeValues: d._values,
      };
    }
    if (this.opts.unevaluated) {
      const { props: e, items: t } = m;
      (n.evaluated = {
        props: e instanceof M_codegen_maybe.Name ? void 0 : e,
        items: t instanceof M_codegen_maybe.Name ? void 0 : t,
        dynamicProps: e instanceof M_codegen_maybe.Name,
        dynamicItems: t instanceof M_codegen_maybe.Name,
      }),
        n.source &&
          (n.source.evaluated = (0, M_codegen_maybe.stringify)(n.evaluated));
    }
    e.validate = n;
    return e;
  } catch (t) {
    throw (
      (delete e.validate,
      delete e.validateName,
      g && this.logger.error("Error compiling schema, function code:", g),
      t)
    );
  } finally {
    this._compilations.delete(e);
  }
}
function p(e) {
  return M_schema_ref_utils_maybe.inlineRef(e.schema, this.opts.inlineRefs)
    ? e.schema
    : e.validate
    ? e
    : compileSchema.call(this, e);
}
function getCompilingSchema(e) {
  for (const r of this._compilations) {
    n = e;
    if (
      (t = r).schema === n.schema &&
      t.root === n.root &&
      t.baseId === n.baseId
    )
      return r;
  }
  var t;
  var n;
}
function f(e, t) {
  let n;
  for (; "string" == typeof (n = this.refs[t]); ) t = n;
  return n || this.schemas[t] || resolveSchema.call(this, e, t);
}
function resolveSchema(e, t) {
  const n = M_regexp_lib_maybe.parse(t);
  const r = M_schema_ref_utils_maybe._getFullPath(n);
  let o = M_schema_ref_utils_maybe.getFullPath(e.baseId);
  if (Object.keys(e.schema).length > 0 && r === o) return _.call(this, n, e);
  const i = M_schema_ref_utils_maybe.normalizeId(r);
  const a = this.refs[i] || this.schemas[i];
  if ("string" == typeof a) {
    const t = resolveSchema.call(this, e, a);
    if ("object" != typeof (null == t ? undefined : t.schema)) return;
    return _.call(this, n, t);
  }
  if ("object" == typeof (null == a ? undefined : a.schema)) {
    if (a.validate) {
      compileSchema.call(this, a);
    }
    if (i === (0, M_schema_ref_utils_maybe.normalizeId)(t)) {
      const { schema: t } = a,
        { schemaId: n } = this.opts,
        r = t[n];
      return (
        r && (o = (0, M_schema_ref_utils_maybe.resolveUrl)(o, r)),
        new SchemaEnv({
          schema: t,
          schemaId: n,
          root: e,
          baseId: o,
        })
      );
    }
    return _.call(this, n, a);
  }
}
exports.SchemaEnv = SchemaEnv;
exports.compileSchema = compileSchema;
exports.resolveRef = function (e, t, n) {
  var r;
  n = M_schema_ref_utils_maybe.resolveUrl(t, n);
  const o = e.refs[n];
  if (o) return o;
  let i = f.call(this, e, n);
  if (undefined === i) {
    const o = null === (r = e.localRefs) || undefined === r ? undefined : r[n];
    const { schemaId: s } = this.opts;
    if (o) {
      i = new SchemaEnv({
        schema: o,
        schemaId: s,
        root: e,
        baseId: t,
      });
    }
  }
  return undefined !== i ? (e.refs[n] = p.call(this, i)) : undefined;
};
exports.getCompilingSchema = getCompilingSchema;
exports.resolveSchema = resolveSchema;
const g = new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions",
]);
function _(e, { baseId: t, schema: n, root: r }) {
  var o;
  if ("/" !== (null === (o = e.fragment) || undefined === o ? undefined : o[0]))
    return;
  for (const r of e.fragment.slice(1).split("/")) {
    if ("boolean" == typeof n) return;
    const e = n[M_ajv_utils_maybe.unescapeFragment(r)];
    if (undefined === e) return;
    const o = "object" == typeof (n = e) && n[this.opts.schemaId];
    if (!g.has(r) && o) {
      t = M_schema_ref_utils_maybe.resolveUrl(t, o);
    }
  }
  let i;
  if (
    "boolean" != typeof n &&
    n.$ref &&
    !M_ajv_utils_maybe.schemaHasRulesButRef(n, this.RULES)
  ) {
    const e = M_schema_ref_utils_maybe.resolveUrl(t, n.$ref);
    i = resolveSchema.call(this, r, e);
  }
  const { schemaId: c } = this.opts;
  i =
    i ||
    new SchemaEnv({
      schema: n,
      schemaId: c,
      root: r,
      baseId: t,
    });
  return i.schema !== i.root.schema ? i : undefined;
}
