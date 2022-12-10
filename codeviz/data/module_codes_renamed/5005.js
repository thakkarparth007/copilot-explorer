Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.validateKeywordUsage =
  exports.validSchemaType =
  exports.funcKeywordCode =
  exports.macroKeywordCode =
    undefined;
const M_codegen_NOTSURE = require("codegen"),
  M_json_schema_default_names_NOTSURE = require("json-schema-default-names"),
  M_validate_properties_NOTSURE = require("validate-properties"),
  M_ajv_error_stuff_NOTSURE = require("ajv-error-stuff");
function a(e) {
  const { gen: t, data: n, it: o } = e;
  t.if(o.parentData, () =>
    t.assign(n, M_codegen_NOTSURE._`${o.parentData}[${o.parentDataProperty}]`)
  );
}
function c(e, t, n) {
  if (undefined === n) throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue(
    "keyword",
    "function" == typeof n
      ? {
          ref: n,
        }
      : {
          ref: n,
          code: M_codegen_NOTSURE.stringify(n),
        }
  );
}
exports.macroKeywordCode = function (e, t) {
  const { gen: n, keyword: o, schema: i, parentSchema: s, it: a } = e,
    l = t.macro.call(a.self, i, s, a),
    u = c(n, o, l);
  if (!1 !== a.opts.validateSchema) {
    a.self.validateSchema(l, !0);
  }
  const d = n.name("valid");
  e.subschema(
    {
      schema: l,
      schemaPath: M_codegen_NOTSURE.nil,
      errSchemaPath: `${a.errSchemaPath}/${o}`,
      topSchemaRef: u,
      compositeRule: !0,
    },
    d
  );
  e.pass(d, () => e.error(!0));
};
exports.funcKeywordCode = function (e, t) {
  var n;
  const { gen: l, keyword: u, schema: d, parentSchema: p, $data: h, it: f } = e;
  !(function ({ schemaEnv: e }, t) {
    if (t.async && !e.$async) throw new Error("async keyword in sync schema");
  })(f, t);
  const m = !h && t.compile ? t.compile.call(f.self, d, p, f) : t.validate,
    g = c(l, u, m),
    _ = l.let("valid");
  function y(
    n = t.async ? M_codegen_NOTSURE._`await ` : M_codegen_NOTSURE.nil
  ) {
    const s = f.opts.passContext
        ? M_json_schema_default_names_NOTSURE.default.this
        : M_json_schema_default_names_NOTSURE.default.self,
      a = !(("compile" in t && !h) || !1 === t.schema);
    l.assign(
      _,
      M_codegen_NOTSURE._`${n}${M_validate_properties_NOTSURE.callValidateCode(
        e,
        g,
        s,
        a
      )}`,
      t.modifying
    );
  }
  function v(e) {
    var n;
    l.if(
      M_codegen_NOTSURE.not(null !== (n = t.valid) && undefined !== n ? n : _),
      e
    );
  }
  e.block$data(_, function () {
    if (!1 === t.errors) {
      y();
      if (t.modifying) {
        a(e);
      }
      v(() => e.error());
    } else {
      const n = t.async
        ? (function () {
            const e = l.let("ruleErrs", null);
            l.try(
              () => y(M_codegen_NOTSURE._`await `),
              (t) =>
                l.assign(_, !1).if(
                  M_codegen_NOTSURE._`${t} instanceof ${f.ValidationError}`,
                  () => l.assign(e, M_codegen_NOTSURE._`${t}.errors`),
                  () => l.throw(t)
                )
            );
            return e;
          })()
        : (function () {
            const e = M_codegen_NOTSURE._`${g}.errors`;
            l.assign(e, null);
            y(M_codegen_NOTSURE.nil);
            return e;
          })();
      if (t.modifying) {
        a(e);
      }
      v(() =>
        (function (e, t) {
          const { gen: n } = e;
          n.if(
            M_codegen_NOTSURE._`Array.isArray(${t})`,
            () => {
              n.assign(
                M_json_schema_default_names_NOTSURE.default.vErrors,
                M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.vErrors} === null ? ${t} : ${M_json_schema_default_names_NOTSURE.default.vErrors}.concat(${t})`
              ).assign(
                M_json_schema_default_names_NOTSURE.default.errors,
                M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.vErrors}.length`
              );
              M_ajv_error_stuff_NOTSURE.extendErrors(e);
            },
            () => e.error()
          );
        })(e, n)
      );
    }
  });
  e.ok(null !== (n = t.valid) && undefined !== n ? n : _);
};
exports.validSchemaType = function (e, t, n = !1) {
  return (
    !t.length ||
    t.some((t) =>
      "array" === t
        ? Array.isArray(e)
        : "object" === t
        ? e && "object" == typeof e && !Array.isArray(e)
        : typeof e == t || (n && undefined === e)
    )
  );
};
exports.validateKeywordUsage = function (
  { schema: e, opts: t, self: n, errSchemaPath: r },
  o,
  i
) {
  if (Array.isArray(o.keyword) ? !o.keyword.includes(i) : o.keyword !== i)
    throw new Error("ajv implementation error");
  const s = o.dependencies;
  if (
    null == s
      ? undefined
      : s.some((t) => !Object.prototype.hasOwnProperty.call(e, t))
  )
    throw new Error(
      `parent schema must have dependencies of ${i}: ${s.join(",")}`
    );
  if (o.validateSchema && !o.validateSchema(e[i])) {
    const e =
      `keyword "${i}" value is invalid at path "${r}": ` +
      n.errorsText(o.validateSchema.errors);
    if ("log" !== t.validateSchema) throw new Error(e);
    n.logger.error(e);
  }
};
