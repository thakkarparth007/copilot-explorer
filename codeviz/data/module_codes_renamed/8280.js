Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.callRef = exports.getValidate = undefined;
const M_missing_reference_error_maybe = require("missing-reference-error");
const M_validate_properties_maybe = require("validate-properties");
const M_codegen_maybe = require("codegen");
const M_json_schema_default_names_maybe = require("json-schema-default-names");
const M_schema_compiler_maybe = require("schema-compiler");
const M_ajv_utils_maybe = require("ajv-utils");
const l = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: n, it: o } = e;
    const { baseId: s, schemaEnv: c, validateName: l, opts: p, self: h } = o;
    const { root: f } = c;
    if (("#" === n || "#/" === n) && s === f.baseId)
      return (function () {
        if (c === f) return callRef(e, l, c, c.$async);
        const n = t.scopeValue("root", {
          ref: f,
        });
        return callRef(e, M_codegen_maybe._`${n}.validate`, f, f.$async);
      })();
    const m = M_schema_compiler_maybe.resolveRef.call(h, f, s, n);
    if (undefined === m)
      throw new M_missing_reference_error_maybe.default(s, n);
    return m instanceof M_schema_compiler_maybe.SchemaEnv
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
                  code: M_codegen_maybe.stringify(r),
                }
              : {
                  ref: r,
                }
          );
          const s = t.name("valid");
          const a = e.subschema(
            {
              schema: r,
              dataTypes: [],
              schemaPath: M_codegen_maybe.nil,
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
    : M_codegen_maybe._`${n.scopeValue("wrapper", {
        ref: t,
      })}.validate`;
}
function callRef(e, t, n, r) {
  const { gen: a, it: l } = e;
  const { allErrors: u, schemaEnv: d, opts: p } = l;
  const h = p.passContext
    ? M_json_schema_default_names_maybe.default.this
    : M_codegen_maybe.nil;
  function f(e) {
    const t = M_codegen_maybe._`${e}.errors`;
    a.assign(
      M_json_schema_default_names_maybe.default.vErrors,
      M_codegen_maybe._`${M_json_schema_default_names_maybe.default.vErrors} === null ? ${t} : ${M_json_schema_default_names_maybe.default.vErrors}.concat(${t})`
    );
    a.assign(
      M_json_schema_default_names_maybe.default.errors,
      M_codegen_maybe._`${M_json_schema_default_names_maybe.default.vErrors}.length`
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
          l.props = M_ajv_utils_maybe.mergeEvaluated.props(a, r.props, l.props);
        }
      } else {
        const t = a.var("props", M_codegen_maybe._`${e}.evaluated.props`);
        l.props = M_ajv_utils_maybe.mergeEvaluated.props(
          a,
          t,
          l.props,
          M_codegen_maybe.Name
        );
      }
    if (!0 !== l.items)
      if (r && !r.dynamicItems) {
        if (undefined !== r.items) {
          l.items = M_ajv_utils_maybe.mergeEvaluated.items(a, r.items, l.items);
        }
      } else {
        const t = a.var("items", M_codegen_maybe._`${e}.evaluated.items`);
        l.items = M_ajv_utils_maybe.mergeEvaluated.items(
          a,
          t,
          l.items,
          M_codegen_maybe.Name
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
            M_codegen_maybe._`await ${M_validate_properties_maybe.callValidateCode(
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
          a.if(M_codegen_maybe._`!(${e} instanceof ${l.ValidationError})`, () =>
            a.throw(e)
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
      M_validate_properties_maybe.callValidateCode(e, t, h),
      () => m(t),
      () => f(t)
    );
  }
}
exports.getValidate = getValidate;
exports.callRef = callRef;
exports.default = l;
