Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_ajv_utils_maybe = require("ajv-utils");
const o = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: n, it: o } = e;
    if (!Array.isArray(n)) throw new Error("ajv implementation error");
    const i = t.name("valid");
    n.forEach((t, n) => {
      if (M_ajv_utils_maybe.alwaysValidSchema(o, t)) return;
      const s = e.subschema(
        {
          keyword: "allOf",
          schemaProp: n,
        },
        i
      );
      e.ok(i);
      e.mergeEvaluated(s);
    });
  },
};
exports.default = o;
