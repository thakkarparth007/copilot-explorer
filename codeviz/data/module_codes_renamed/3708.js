Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
const i = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: {
    message: "property name must be valid",
    params: ({ params: e }) =>
      M_codegen_maybe._`{propertyName: ${e.propertyName}}`,
  },
  code(e) {
    const { gen: t, schema: n, data: i, it: s } = e;
    if (M_ajv_utils_maybe.alwaysValidSchema(s, n)) return;
    const a = t.name("valid");
    t.forIn("key", i, (n) => {
      e.setParams({
        propertyName: n,
      });
      e.subschema(
        {
          keyword: "propertyNames",
          data: n,
          dataTypes: ["string"],
          propertyName: n,
          compositeRule: !0,
        },
        a
      );
      t.if(M_codegen_maybe.not(a), () => {
        e.error(!0);
        if (s.allErrors) {
          t.break();
        }
      });
    });
    e.ok(a);
  },
};
exports.default = i;
