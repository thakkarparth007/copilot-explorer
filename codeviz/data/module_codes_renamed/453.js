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
const M_json_schema_rules_maybe = require("json-schema-rules");
const M_schema_rule_filter_maybe = require("schema-rule-filter");
const M_ajv_error_stuff_maybe = require("ajv-error-stuff");
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
var c;
function getJSONTypes(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(M_json_schema_rules_maybe.isJSONType)) return t;
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
  const { gen: n, data: r, opts: i } = e;
  const a = (function (e, t) {
    return t
      ? e.filter((e) => u.has(e) || ("array" === t && "array" === e))
      : [];
  })(t, i.coerceTypes);
  const l =
    t.length > 0 &&
    !(
      0 === a.length &&
      1 === t.length &&
      M_schema_rule_filter_maybe.schemaHasRulesForType(e, t[0])
    );
  if (l) {
    const o = checkDataTypes(t, r, i.strictNumbers, c.Wrong);
    n.if(o, () => {
      if (a.length) {
        (function (e, t, n) {
          const { gen: r, data: o, opts: i } = e;
          const a = r.let("dataType", M_codegen_maybe._`typeof ${o}`);
          const c = r.let("coerced", M_codegen_maybe._`undefined`);
          if ("array" === i.coerceTypes) {
            r.if(
              M_codegen_maybe._`${a} == 'object' && Array.isArray(${o}) && ${o}.length == 1`,
              () =>
                r
                  .assign(o, M_codegen_maybe._`${o}[0]`)
                  .assign(a, M_codegen_maybe._`typeof ${o}`)
                  .if(checkDataTypes(t, o, i.strictNumbers), () =>
                    r.assign(c, o)
                  )
            );
          }
          r.if(M_codegen_maybe._`${c} !== undefined`);
          for (const e of n)
            if (u.has(e) || ("array" === e && "array" === i.coerceTypes)) {
              l(e);
            }
          function l(e) {
            switch (e) {
              case "string":
                return void r
                  .elseIf(
                    M_codegen_maybe._`${a} == "number" || ${a} == "boolean"`
                  )
                  .assign(c, M_codegen_maybe._`"" + ${o}`)
                  .elseIf(M_codegen_maybe._`${o} === null`)
                  .assign(c, M_codegen_maybe._`""`);
              case "number":
                return void r
                  .elseIf(
                    M_codegen_maybe._`${a} == "boolean" || ${o} === null
              || (${a} == "string" && ${o} && ${o} == +${o})`
                  )
                  .assign(c, M_codegen_maybe._`+${o}`);
              case "integer":
                return void r
                  .elseIf(
                    M_codegen_maybe._`${a} === "boolean" || ${o} === null
              || (${a} === "string" && ${o} && ${o} == +${o} && !(${o} % 1))`
                  )
                  .assign(c, M_codegen_maybe._`+${o}`);
              case "boolean":
                return void r
                  .elseIf(
                    M_codegen_maybe._`${o} === "false" || ${o} === 0 || ${o} === null`
                  )
                  .assign(c, !1)
                  .elseIf(M_codegen_maybe._`${o} === "true" || ${o} === 1`)
                  .assign(c, !0);
              case "null":
                r.elseIf(
                  M_codegen_maybe._`${o} === "" || ${o} === 0 || ${o} === false`
                );
                return void r.assign(c, null);
              case "array":
                r.elseIf(
                  M_codegen_maybe._`${a} === "string" || ${a} === "number"
              || ${a} === "boolean" || ${o} === null`
                ).assign(c, M_codegen_maybe._`[${o}]`);
            }
          }
          r.else();
          reportTypeError(e);
          r.endIf();
          r.if(M_codegen_maybe._`${c} !== undefined`, () => {
            r.assign(o, c);
            (function ({ gen: e, parentData: t, parentDataProperty: n }, r) {
              e.if(M_codegen_maybe._`${t} !== undefined`, () =>
                e.assign(M_codegen_maybe._`${t}[${n}]`, r)
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
      ? M_codegen_maybe.operators.EQ
      : M_codegen_maybe.operators.NEQ;
  let i;
  switch (e) {
    case "null":
      return M_codegen_maybe._`${t} ${o} null`;
    case "array":
      i = M_codegen_maybe._`Array.isArray(${t})`;
      break;
    case "object":
      i = M_codegen_maybe._`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      i = a(M_codegen_maybe._`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      i = a();
      break;
    default:
      return M_codegen_maybe._`typeof ${t} ${o} ${e}`;
  }
  return r === c.Correct ? i : M_codegen_maybe.not(i);
  function a(e = M_codegen_maybe.nil) {
    return M_codegen_maybe.and(
      M_codegen_maybe._`typeof ${t} == "number"`,
      e,
      n ? M_codegen_maybe._`isFinite(${t})` : M_codegen_maybe.nil
    );
  }
}
function checkDataTypes(e, t, n, r) {
  if (1 === e.length) return checkDataType(e[0], t, n, r);
  let o;
  const i = M_ajv_utils_maybe.toHash(e);
  if (i.array && i.object) {
    const e = M_codegen_maybe._`typeof ${t} != "object"`;
    o = i.null ? e : M_codegen_maybe._`!${t} || ${e}`;
    delete i.null;
    delete i.array;
    delete i.object;
  } else o = M_codegen_maybe.nil;
  if (i.number) {
    delete i.integer;
  }
  for (const e in i) o = M_codegen_maybe.and(o, checkDataType(e, t, n, r));
  return o;
}
exports.checkDataType = checkDataType;
exports.checkDataTypes = checkDataTypes;
const h = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) =>
    "string" == typeof e
      ? M_codegen_maybe._`{type: ${e}}`
      : M_codegen_maybe._`{type: ${t}}`,
};
function reportTypeError(e) {
  const t = (function (e) {
    const { gen: t, data: n, schema: r } = e;
    const o = M_ajv_utils_maybe.schemaRefOrVal(e, r, "type");
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
  M_ajv_error_stuff_maybe.reportError(t, h);
}
exports.reportTypeError = reportTypeError;
