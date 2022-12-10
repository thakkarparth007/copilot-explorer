Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.callRef = exports.getValidate = undefined;
const M_missing_reference_error_NOTSURE = require("missing-reference-error"),
  M_validate_properties_NOTSURE = require("validate-properties"),
  M_codegen_NOTSURE = require("codegen"),
  M_json_schema_default_names_NOTSURE = require("json-schema-default-names"),
  M_schema_compiler_NOTSURE = require("schema-compiler"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  l = {
    keyword: "$ref",
    schemaType: "string",
    code(e) {
      const { gen: t, schema: n, it: o } = e,
        { baseId: s, schemaEnv: c, validateName: l, opts: p, self: h } = o,
        { root: f } = c;
      if (("#" === n || "#/" === n) && s === f.baseId)
        return (function () {
          if (c === f) return callRef(e, l, c, c.$async);
          const n = t.scopeValue("root", {
            ref: f,
          });
          return callRef(e, M_codegen_NOTSURE._`${n}.validate`, f, f.$async);
        })();
      const m = M_schema_compiler_NOTSURE.resolveRef.call(h, f, s, n);
      if (undefined === m)
        throw new M_missing_reference_error_NOTSURE.default(s, n);
      return m instanceof M_schema_compiler_NOTSURE.SchemaEnv
        ? (function (t) {
            const n = getValidate(e, t);
            callRef(e, n, t, t.$async);
          })(m)
        : (function (r) {
            const o = t.scopeValue(
                "schema",
                !0 === p.code.source
                  ? {
                      ref: r,
                      code: M_codegen_NOTSURE.stringify(r),
                    }
                  : {
                      ref: r,
                    }
              ),
              s = t.name("valid"),
              a = e.subschema(
                {
                  schema: r,
                  dataTypes: [],
                  schemaPath: M_codegen_NOTSURE.nil,
                  topSchemaRef: o,
                  errSchemaPath: n,
                },
                s
              );
            e.mergeEvaluated(a);
            e.ok(s);
          })(m);
    },
  };
function getValidate(e, t) {
  const { gen: n } = e;
  return t.validate
    ? n.scopeValue("validate", {
        ref: t.validate,
      })
    : M_codegen_NOTSURE._`${n.scopeValue("wrapper", {
        ref: t,
      })}.validate`;
}
function callRef(e, t, n, r) {
  const { gen: a, it: l } = e,
    { allErrors: u, schemaEnv: d, opts: p } = l,
    h = p.passContext
      ? M_json_schema_default_names_NOTSURE.default.this
      : M_codegen_NOTSURE.nil;
  function f(e) {
    const t = M_codegen_NOTSURE._`${e}.errors`;
    a.assign(
      M_json_schema_default_names_NOTSURE.default.vErrors,
      M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.vErrors} === null ? ${t} : ${M_json_schema_default_names_NOTSURE.default.vErrors}.concat(${t})`
    );
    a.assign(
      M_json_schema_default_names_NOTSURE.default.errors,
      M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.vErrors}.length`
    );
  }
  function m(e) {
    var t;
    if (!l.opts.unevaluated) return;
    const r =
      null === (t = null == n ? undefined : n.validate) || undefined === t
        ? undefined
        : t.evaluated;
    if (!0 !== l.props)
      if (r && !r.dynamicProps) {
        if (undefined !== r.props) {
          l.props = M_ajv_utils_NOTSURE.mergeEvaluated.props(
            a,
            r.props,
            l.props
          );
        }
      } else {
        const t = a.var("props", M_codegen_NOTSURE._`${e}.evaluated.props`);
        l.props = M_ajv_utils_NOTSURE.mergeEvaluated.props(
          a,
          t,
          l.props,
          M_codegen_NOTSURE.Name
        );
      }
    if (!0 !== l.items)
      if (r && !r.dynamicItems) {
        if (undefined !== r.items) {
          l.items = M_ajv_utils_NOTSURE.mergeEvaluated.items(
            a,
            r.items,
            l.items
          );
        }
      } else {
        const t = a.var("items", M_codegen_NOTSURE._`${e}.evaluated.items`);
        l.items = M_ajv_utils_NOTSURE.mergeEvaluated.items(
          a,
          t,
          l.items,
          M_codegen_NOTSURE.Name
        );
      }
  }
  if (r) {
    (function () {
      if (!d.$async) throw new Error("async schema referenced by sync schema");
      const n = a.let("valid");
      a.try(
        () => {
          a.code(
            M_codegen_NOTSURE._`await ${M_validate_properties_NOTSURE.callValidateCode(
              e,
              t,
              h
            )}`
          );
          m(t);
          if (u) {
            a.assign(n, !0);
          }
        },
        (e) => {
          a.if(
            M_codegen_NOTSURE._`!(${e} instanceof ${l.ValidationError})`,
            () => a.throw(e)
          );
          f(e);
          if (u) {
            a.assign(n, !1);
          }
        }
      );
      e.ok(n);
    })();
  } else {
    e.result(
      M_validate_properties_NOTSURE.callValidateCode(e, t, h),
      () => m(t),
      () => f(t)
    );
  }
}
exports.getValidate = getValidate;
exports.callRef = callRef;
exports.default = l;
