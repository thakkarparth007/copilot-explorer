Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = undefined;
const M_ajv_error_stuff_maybe = require("ajv-error-stuff");
const M_codegen_maybe = require("codegen");
const M_json_schema_default_names_maybe = require("json-schema-default-names");
const s = {
  message: "boolean schema is false",
};
function a(e, t) {
  const { gen: n, data: o } = e;
  const i = {
    gen: n,
    keyword: "false schema",
    data: o,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e,
  };
  M_ajv_error_stuff_maybe.reportError(i, s, undefined, t);
}
exports.topBoolOrEmptySchema = function (e) {
  const { gen: t, schema: n, validateName: r } = e;
  if (!1 === n) {
    a(e, !1);
  } else {
    if ("object" == typeof n && !0 === n.$async) {
      t.return(M_json_schema_default_names_maybe.default.data);
    } else {
      t.assign(M_codegen_maybe._`${r}.errors`, null);
      t.return(!0);
    }
  }
};
exports.boolOrEmptySchema = function (e, t) {
  const { gen: n, schema: r } = e;
  if (!1 === r) {
    n.var(t, !1);
    a(e);
  } else {
    n.var(t, !0);
  }
};
