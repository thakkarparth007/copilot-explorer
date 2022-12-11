Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.extendSubschemaMode =
  exports.extendSubschemaData =
  exports.getSubschema =
    undefined;
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
exports.getSubschema = function (
  e,
  {
    keyword: t,
    schemaProp: n,
    schema: i,
    schemaPath: s,
    errSchemaPath: a,
    topSchemaRef: c,
  }
) {
  if (undefined !== t && undefined !== i)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (undefined !== t) {
    const i = e.schema[t];
    return undefined === n
      ? {
          schema: i,
          schemaPath: M_codegen_maybe._`${
            e.schemaPath
          }${M_codegen_maybe.getProperty(t)}`,
          errSchemaPath: `${e.errSchemaPath}/${t}`,
        }
      : {
          schema: i[n],
          schemaPath: M_codegen_maybe._`${
            e.schemaPath
          }${M_codegen_maybe.getProperty(t)}${M_codegen_maybe.getProperty(n)}`,
          errSchemaPath: `${
            e.errSchemaPath
          }/${t}/${M_ajv_utils_maybe.escapeFragment(n)}`,
        };
  }
  if (undefined !== i) {
    if (undefined === s || undefined === a || undefined === c)
      throw new Error(
        '"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"'
      );
    return {
      schema: i,
      schemaPath: s,
      topSchemaRef: c,
      errSchemaPath: a,
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
};
exports.extendSubschemaData = function (
  e,
  t,
  { dataProp: n, dataPropType: i, data: s, dataTypes: a, propertyName: c }
) {
  if (undefined !== s && undefined !== n)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (undefined !== n) {
    const { errorPath: s, dataPathArr: a, opts: c } = t;
    u(
      l.let(
        "data",
        M_codegen_maybe._`${t.data}${M_codegen_maybe.getProperty(n)}`,
        !0
      )
    );
    e.errorPath = M_codegen_maybe.str`${s}${M_ajv_utils_maybe.getErrorPath(
      n,
      i,
      c.jsPropertySyntax
    )}`;
    e.parentDataProperty = M_codegen_maybe._`${n}`;
    e.dataPathArr = [...a, e.parentDataProperty];
  }
  function u(n) {
    e.data = n;
    e.dataLevel = t.dataLevel + 1;
    e.dataTypes = [];
    t.definedProperties = new Set();
    e.parentData = t.data;
    e.dataNames = [...t.dataNames, n];
  }
  if (undefined !== s) {
    u(s instanceof M_codegen_maybe.Name ? s : l.let("data", s, !0));
    if (undefined !== c) {
      e.propertyName = c;
    }
  }
  if (a) {
    e.dataTypes = a;
  }
};
exports.extendSubschemaMode = function (
  e,
  {
    jtdDiscriminator: t,
    jtdMetadata: n,
    compositeRule: r,
    createErrors: o,
    allErrors: i,
  }
) {
  if (undefined !== r) {
    e.compositeRule = r;
  }
  if (undefined !== o) {
    e.createErrors = o;
  }
  if (undefined !== i) {
    e.allErrors = i;
  }
  e.jtdDiscriminator = t;
  e.jtdMetadata = n;
};
