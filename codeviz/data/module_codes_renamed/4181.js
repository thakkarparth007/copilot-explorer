Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.extendErrors =
  exports.resetErrorsCount =
  exports.reportExtraError =
  exports.reportError =
  exports.keyword$DataError =
  exports.keywordError =
    undefined;
const M_codegen_NOTSURE = require("codegen"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  M_json_schema_default_names_NOTSURE = require("json-schema-default-names");
function s(e, t) {
  const n = e.const("err", t);
  e.if(
    M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.vErrors} === null`,
    () =>
      e.assign(
        M_json_schema_default_names_NOTSURE.default.vErrors,
        M_codegen_NOTSURE._`[${n}]`
      ),
    M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.vErrors}.push(${n})`
  );
  e.code(
    M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.errors}++`
  );
}
function a(e, t) {
  const { gen: n, validateName: o, schemaEnv: i } = e;
  if (i.$async) {
    n.throw(M_codegen_NOTSURE._`new ${e.ValidationError}(${t})`);
  } else {
    n.assign(M_codegen_NOTSURE._`${o}.errors`, t);
    n.return(!1);
  }
}
exports.keywordError = {
  message: ({ keyword: e }) =>
    M_codegen_NOTSURE.str`must pass "${e}" keyword validation`,
};
exports.keyword$DataError = {
  message: ({ keyword: e, schemaType: t }) =>
    t
      ? M_codegen_NOTSURE.str`"${e}" keyword must be ${t} ($data)`
      : M_codegen_NOTSURE.str`"${e}" keyword is invalid ($data)`,
};
exports.reportError = function (e, n = exports.keywordError, o, i) {
  const { it: c } = e,
    { gen: u, compositeRule: d, allErrors: p } = c,
    h = l(e, n, o);
  if (null != i ? i : d || p) {
    s(u, h);
  } else {
    a(c, M_codegen_NOTSURE._`[${h}]`);
  }
};
exports.reportExtraError = function (e, n = exports.keywordError, r) {
  const { it: o } = e,
    { gen: c, compositeRule: u, allErrors: d } = o;
  s(c, l(e, n, r));
  if (u || d) {
    a(o, M_json_schema_default_names_NOTSURE.default.vErrors);
  }
};
exports.resetErrorsCount = function (e, t) {
  e.assign(M_json_schema_default_names_NOTSURE.default.errors, t);
  e.if(
    M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.vErrors} !== null`,
    () =>
      e.if(
        t,
        () =>
          e.assign(
            M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.vErrors}.length`,
            t
          ),
        () =>
          e.assign(M_json_schema_default_names_NOTSURE.default.vErrors, null)
      )
  );
};
exports.extendErrors = function ({
  gen: e,
  keyword: t,
  schemaValue: n,
  data: o,
  errsCount: s,
  it: a,
}) {
  if (undefined === s) throw new Error("ajv implementation error");
  const c = e.name("err");
  e.forRange(
    "i",
    s,
    M_json_schema_default_names_NOTSURE.default.errors,
    (s) => {
      e.const(
        c,
        M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.vErrors}[${s}]`
      );
      e.if(M_codegen_NOTSURE._`${c}.instancePath === undefined`, () =>
        e.assign(
          M_codegen_NOTSURE._`${c}.instancePath`,
          M_codegen_NOTSURE.strConcat(
            M_json_schema_default_names_NOTSURE.default.instancePath,
            a.errorPath
          )
        )
      );
      e.assign(
        M_codegen_NOTSURE._`${c}.schemaPath`,
        M_codegen_NOTSURE.str`${a.errSchemaPath}/${t}`
      );
      if (a.opts.verbose) {
        e.assign(M_codegen_NOTSURE._`${c}.schema`, n);
        e.assign(M_codegen_NOTSURE._`${c}.data`, o);
      }
    }
  );
};
const c = {
  keyword: new M_codegen_NOTSURE.Name("keyword"),
  schemaPath: new M_codegen_NOTSURE.Name("schemaPath"),
  params: new M_codegen_NOTSURE.Name("params"),
  propertyName: new M_codegen_NOTSURE.Name("propertyName"),
  message: new M_codegen_NOTSURE.Name("message"),
  schema: new M_codegen_NOTSURE.Name("schema"),
  parentSchema: new M_codegen_NOTSURE.Name("parentSchema"),
};
function l(e, t, n) {
  const { createErrors: o } = e.it;
  return !1 === o
    ? M_codegen_NOTSURE._`{}`
    : (function (e, t, n = {}) {
        const { gen: o, it: s } = e,
          a = [u(s, n), d(e, n)];
        (function (e, { params: t, message: n }, o) {
          const { keyword: s, data: a, schemaValue: l, it: u } = e,
            { opts: d, propertyName: p, topSchemaRef: h, schemaPath: f } = u;
          o.push(
            [c.keyword, s],
            [
              c.params,
              "function" == typeof t ? t(e) : t || M_codegen_NOTSURE._`{}`,
            ]
          );
          if (d.messages) {
            o.push([c.message, "function" == typeof n ? n(e) : n]);
          }
          if (d.verbose) {
            o.push(
              [c.schema, l],
              [c.parentSchema, M_codegen_NOTSURE._`${h}${f}`],
              [M_json_schema_default_names_NOTSURE.default.data, a]
            );
          }
          if (p) {
            o.push([c.propertyName, p]);
          }
        })(e, t, a);
        return o.object(...a);
      })(e, t, n);
}
function u({ errorPath: e }, { instancePath: t }) {
  const n = t
    ? M_codegen_NOTSURE.str`${e}${M_ajv_utils_NOTSURE.getErrorPath(
        t,
        M_ajv_utils_NOTSURE.Type.Str
      )}`
    : e;
  return [
    M_json_schema_default_names_NOTSURE.default.instancePath,
    M_codegen_NOTSURE.strConcat(
      M_json_schema_default_names_NOTSURE.default.instancePath,
      n
    ),
  ];
}
function d(
  { keyword: e, it: { errSchemaPath: t } },
  { schemaPath: n, parentSchema: i }
) {
  let s = i ? t : M_codegen_NOTSURE.str`${t}/${e}`;
  if (n) {
    s = M_codegen_NOTSURE.str`${s}${M_ajv_utils_NOTSURE.getErrorPath(
      n,
      M_ajv_utils_NOTSURE.Type.Str
    )}`;
  }
  return [c.schemaPath, s];
}
