Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.reportTypeError =
  exports.checkDataTypes =
  exports.checkDataType =
  exports.coerceAndCheckDataType =
  exports.getJSONTypes =
  exports.getSchemaTypes =
  exports.DataType =
    undefined;
const M_json_schema_rules_NOTSURE = require("json-schema-rules"),
  M_schema_rule_filter_NOTSURE = require("schema-rule-filter"),
  M_ajv_error_stuff_NOTSURE = require("ajv-error-stuff"),
  M_codegen_NOTSURE = require("codegen"),
  M_ajv_utils_NOTSURE = require("ajv-utils");
var c;
function getJSONTypes(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(M_json_schema_rules_NOTSURE.isJSONType)) return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
!(function (e) {
  e[(e.Correct = 0)] = "Correct";
  e[(e.Wrong = 1)] = "Wrong";
})((c = exports.DataType || (exports.DataType = {})));
exports.getSchemaTypes = function (e) {
  const t = getJSONTypes(e.type);
  if (t.includes("null")) {
    if (!1 === e.nullable)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && undefined !== e.nullable)
      throw new Error('"nullable" cannot be used without "type"');
    if (!0 === e.nullable) {
      t.push("null");
    }
  }
  return t;
};
exports.getJSONTypes = getJSONTypes;
exports.coerceAndCheckDataType = function (e, t) {
  const { gen: n, data: r, opts: i } = e,
    a = (function (e, t) {
      return t
        ? e.filter((e) => u.has(e) || ("array" === t && "array" === e))
        : [];
    })(t, i.coerceTypes),
    l =
      t.length > 0 &&
      !(
        0 === a.length &&
        1 === t.length &&
        M_schema_rule_filter_NOTSURE.schemaHasRulesForType(e, t[0])
      );
  if (l) {
    const o = checkDataTypes(t, r, i.strictNumbers, c.Wrong);
    n.if(o, () => {
      if (a.length) {
        (function (e, t, n) {
          const { gen: r, data: o, opts: i } = e,
            a = r.let("dataType", M_codegen_NOTSURE._`typeof ${o}`),
            c = r.let("coerced", M_codegen_NOTSURE._`undefined`);
          if ("array" === i.coerceTypes) {
            r.if(
              M_codegen_NOTSURE._`${a} == 'object' && Array.isArray(${o}) && ${o}.length == 1`,
              () =>
                r
                  .assign(o, M_codegen_NOTSURE._`${o}[0]`)
                  .assign(a, M_codegen_NOTSURE._`typeof ${o}`)
                  .if(checkDataTypes(t, o, i.strictNumbers), () =>
                    r.assign(c, o)
                  )
            );
          }
          r.if(M_codegen_NOTSURE._`${c} !== undefined`);
          for (const e of n)
            if (u.has(e) || ("array" === e && "array" === i.coerceTypes)) {
              l(e);
            }
          function l(e) {
            switch (e) {
              case "string":
                return void r
                  .elseIf(
                    M_codegen_NOTSURE._`${a} == "number" || ${a} == "boolean"`
                  )
                  .assign(c, M_codegen_NOTSURE._`"" + ${o}`)
                  .elseIf(M_codegen_NOTSURE._`${o} === null`)
                  .assign(c, M_codegen_NOTSURE._`""`);
              case "number":
                return void r
                  .elseIf(
                    M_codegen_NOTSURE._`${a} == "boolean" || ${o} === null
              || (${a} == "string" && ${o} && ${o} == +${o})`
                  )
                  .assign(c, M_codegen_NOTSURE._`+${o}`);
              case "integer":
                return void r
                  .elseIf(
                    M_codegen_NOTSURE._`${a} === "boolean" || ${o} === null
              || (${a} === "string" && ${o} && ${o} == +${o} && !(${o} % 1))`
                  )
                  .assign(c, M_codegen_NOTSURE._`+${o}`);
              case "boolean":
                return void r
                  .elseIf(
                    M_codegen_NOTSURE._`${o} === "false" || ${o} === 0 || ${o} === null`
                  )
                  .assign(c, !1)
                  .elseIf(M_codegen_NOTSURE._`${o} === "true" || ${o} === 1`)
                  .assign(c, !0);
              case "null":
                r.elseIf(
                  M_codegen_NOTSURE._`${o} === "" || ${o} === 0 || ${o} === false`
                );
                return void r.assign(c, null);
              case "array":
                r.elseIf(
                  M_codegen_NOTSURE._`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${o} === null`
                ).assign(c, M_codegen_NOTSURE._`[${o}]`);
            }
          }
          r.else();
          reportTypeError(e);
          r.endIf();
          r.if(M_codegen_NOTSURE._`${c} !== undefined`, () => {
            r.assign(o, c);
            (function ({ gen: e, parentData: t, parentDataProperty: n }, r) {
              e.if(M_codegen_NOTSURE._`${t} !== undefined`, () =>
                e.assign(M_codegen_NOTSURE._`${t}[${n}]`, r)
              );
            })(e, c);
          });
        })(e, t, a);
      } else {
        reportTypeError(e);
      }
    });
  }
  return l;
};
const u = new Set(["string", "number", "integer", "boolean", "null"]);
function checkDataType(e, t, n, r = c.Correct) {
  const o =
    r === c.Correct
      ? M_codegen_NOTSURE.operators.EQ
      : M_codegen_NOTSURE.operators.NEQ;
  let i;
  switch (e) {
    case "null":
      return M_codegen_NOTSURE._`${t} ${o} null`;
    case "array":
      i = M_codegen_NOTSURE._`Array.isArray(${t})`;
      break;
    case "object":
      i = M_codegen_NOTSURE._`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      i = a(M_codegen_NOTSURE._`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      i = a();
      break;
    default:
      return M_codegen_NOTSURE._`typeof ${t} ${o} ${e}`;
  }
  return r === c.Correct ? i : M_codegen_NOTSURE.not(i);
  function a(e = M_codegen_NOTSURE.nil) {
    return M_codegen_NOTSURE.and(
      M_codegen_NOTSURE._`typeof ${t} == "number"`,
      e,
      n ? M_codegen_NOTSURE._`isFinite(${t})` : M_codegen_NOTSURE.nil
    );
  }
}
function checkDataTypes(e, t, n, r) {
  if (1 === e.length) return checkDataType(e[0], t, n, r);
  let o;
  const i = M_ajv_utils_NOTSURE.toHash(e);
  if (i.array && i.object) {
    const e = M_codegen_NOTSURE._`typeof ${t} != "object"`;
    o = i.null ? e : M_codegen_NOTSURE._`!${t} || ${e}`;
    delete i.null;
    delete i.array;
    delete i.object;
  } else o = M_codegen_NOTSURE.nil;
  if (i.number) {
    delete i.integer;
  }
  for (const e in i) o = M_codegen_NOTSURE.and(o, checkDataType(e, t, n, r));
  return o;
}
exports.checkDataType = checkDataType;
exports.checkDataTypes = checkDataTypes;
const h = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) =>
    "string" == typeof e
      ? M_codegen_NOTSURE._`{type: ${e}}`
      : M_codegen_NOTSURE._`{type: ${t}}`,
};
function reportTypeError(e) {
  const t = (function (e) {
    const { gen: t, data: n, schema: r } = e,
      o = M_ajv_utils_NOTSURE.schemaRefOrVal(e, r, "type");
    return {
      gen: t,
      keyword: "type",
      data: n,
      schema: r.type,
      schemaCode: o,
      schemaValue: o,
      parentSchema: r,
      params: {},
      it: e,
    };
  })(e);
  M_ajv_error_stuff_NOTSURE.reportError(t, h);
}
exports.reportTypeError = reportTypeError;
