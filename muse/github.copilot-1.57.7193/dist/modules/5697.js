Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(6776);
const o = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: true,
  code(e) {
    const { gen: t, schema: n, it: o } = e;
    if (r.alwaysValidSchema(o, n)) return void e.fail();
    const i = t.name("valid");
    e.subschema(
      {
        keyword: "not",
        compositeRule: true,
        createErrors: false,
        allErrors: false,
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