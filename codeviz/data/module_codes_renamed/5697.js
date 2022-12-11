Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_ajv_utils_maybe = require("ajv-utils");
const o = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: n, it: o } = e;
    if (M_ajv_utils_maybe.alwaysValidSchema(o, n)) return void e.fail();
    const i = t.name("valid");
    e.subschema(
      {
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1,
      },
      i
    );
    e.failResult(
      i,
      () => e.reset(),
      () => e.error()
    );
  },
  error: {
    message: "must NOT be valid",
  },
};
exports.default = o;
