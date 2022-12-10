Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.validateUnion =
  exports.validateArray =
  exports.usePattern =
  exports.callValidateCode =
  exports.schemaProperties =
  exports.allSchemaProperties =
  exports.noPropertyInData =
  exports.propertyInData =
  exports.isOwnProperty =
  exports.hasPropFunc =
  exports.reportMissingProp =
  exports.checkMissingProp =
  exports.checkReportMissingProp =
    undefined;
const M_codegen_NOTSURE = require("codegen"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  M_json_schema_default_names_NOTSURE = require("json-schema-default-names");
function hasPropFunc(e) {
  return e.scopeValue("func", {
    ref: Object.prototype.hasOwnProperty,
    code: M_codegen_NOTSURE._`Object.prototype.hasOwnProperty`,
  });
}
function isOwnProperty(e, t, n) {
  return M_codegen_NOTSURE._`${hasPropFunc(e)}.call(${t}, ${n})`;
}
function noPropertyInData(e, t, n, o) {
  const i = M_codegen_NOTSURE._`${t}${M_codegen_NOTSURE.getProperty(
    n
  )} === undefined`;
  return o
    ? M_codegen_NOTSURE.or(i, M_codegen_NOTSURE.not(isOwnProperty(e, t, n)))
    : i;
}
function allSchemaProperties(e) {
  return e ? Object.keys(e).filter((e) => "__proto__" !== e) : [];
}
exports.checkReportMissingProp = function (e, t) {
  const { gen: n, data: o, it: i } = e;
  n.if(noPropertyInData(n, o, t, i.opts.ownProperties), () => {
    e.setParams(
      {
        missingProperty: M_codegen_NOTSURE._`${t}`,
      },
      !0
    );
    e.error();
  });
};
exports.checkMissingProp = function (
  { gen: e, data: t, it: { opts: n } },
  o,
  i
) {
  return M_codegen_NOTSURE.or(
    ...o.map((o) =>
      M_codegen_NOTSURE.and(
        noPropertyInData(e, t, o, n.ownProperties),
        M_codegen_NOTSURE._`${i} = ${o}`
      )
    )
  );
};
exports.reportMissingProp = function (e, t) {
  e.setParams(
    {
      missingProperty: t,
    },
    !0
  );
  e.error();
};
exports.hasPropFunc = hasPropFunc;
exports.isOwnProperty = isOwnProperty;
exports.propertyInData = function (e, t, n, o) {
  const i = M_codegen_NOTSURE._`${t}${M_codegen_NOTSURE.getProperty(
    n
  )} !== undefined`;
  return o ? M_codegen_NOTSURE._`${i} && ${isOwnProperty(e, t, n)}` : i;
};
exports.noPropertyInData = noPropertyInData;
exports.allSchemaProperties = allSchemaProperties;
exports.schemaProperties = function (e, t) {
  return allSchemaProperties(t).filter(
    (n) => !M_ajv_utils_NOTSURE.alwaysValidSchema(e, t[n])
  );
};
exports.callValidateCode = function (
  {
    schemaCode: e,
    data: t,
    it: { gen: n, topSchemaRef: o, schemaPath: s, errorPath: a },
    it: c,
  },
  l,
  u,
  d
) {
  const p = d ? M_codegen_NOTSURE._`${e}, ${t}, ${o}${s}` : t,
    h = [
      [
        M_json_schema_default_names_NOTSURE.default.instancePath,
        M_codegen_NOTSURE.strConcat(
          M_json_schema_default_names_NOTSURE.default.instancePath,
          a
        ),
      ],
      [M_json_schema_default_names_NOTSURE.default.parentData, c.parentData],
      [
        M_json_schema_default_names_NOTSURE.default.parentDataProperty,
        c.parentDataProperty,
      ],
      [
        M_json_schema_default_names_NOTSURE.default.rootData,
        M_json_schema_default_names_NOTSURE.default.rootData,
      ],
    ];
  if (c.opts.dynamicRef) {
    h.push([
      M_json_schema_default_names_NOTSURE.default.dynamicAnchors,
      M_json_schema_default_names_NOTSURE.default.dynamicAnchors,
    ]);
  }
  const f = M_codegen_NOTSURE._`${p}, ${n.object(...h)}`;
  return u !== M_codegen_NOTSURE.nil
    ? M_codegen_NOTSURE._`${l}.call(${u}, ${f})`
    : M_codegen_NOTSURE._`${l}(${f})`;
};
exports.usePattern = function ({ gen: e, it: { opts: t } }, n) {
  const o = t.unicodeRegExp ? "u" : "";
  return e.scopeValue("pattern", {
    key: n,
    ref: new RegExp(n, o),
    code: M_codegen_NOTSURE._`new RegExp(${n}, ${o})`,
  });
};
exports.validateArray = function (e) {
  const { gen: t, data: n, keyword: i, it: s } = e,
    a = t.name("valid");
  if (s.allErrors) {
    const e = t.let("valid", !0);
    c(() => t.assign(e, !1));
    return e;
  }
  t.var(a, !0);
  c(() => t.break());
  return a;
  function c(s) {
    const c = t.const("len", M_codegen_NOTSURE._`${n}.length`);
    t.forRange("i", 0, c, (n) => {
      e.subschema(
        {
          keyword: i,
          dataProp: n,
          dataPropType: M_ajv_utils_NOTSURE.Type.Num,
        },
        a
      );
      t.if(M_codegen_NOTSURE.not(a), s);
    });
  }
};
exports.validateUnion = function (e) {
  const { gen: t, schema: n, keyword: i, it: s } = e;
  if (!Array.isArray(n)) throw new Error("ajv implementation error");
  if (
    n.some((e) => M_ajv_utils_NOTSURE.alwaysValidSchema(s, e)) &&
    !s.opts.unevaluated
  )
    return;
  const a = t.let("valid", !1),
    c = t.name("_valid");
  t.block(() =>
    n.forEach((n, o) => {
      const s = e.subschema(
        {
          keyword: i,
          schemaProp: o,
          compositeRule: !0,
        },
        c
      );
      t.assign(a, M_codegen_NOTSURE._`${a} || ${c}`);
      if (e.mergeValidEvaluated(s, c)) {
        t.if(M_codegen_NOTSURE.not(a));
      }
    })
  );
  e.result(
    a,
    () => e.reset(),
    () => e.error(!0)
  );
};
