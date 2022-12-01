Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(3487),
  o = require(6776),
  i = require(412),
  s = require(4783),
  a = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: e } }) =>
        r.str`must NOT have more than ${e} items`,
      params: ({ params: { len: e } }) => r._`{limit: ${e}}`,
    },
    code(e) {
      const { schema: t, parentSchema: n, it: r } = e,
        { prefixItems: a } = n;
      r.items = !0;
      if (o.alwaysValidSchema(r, t)) {
        if (a) {
          s.validateAdditionalItems(e, a);
        } else {
          e.ok(i.validateArray(e));
        }
      }
    },
  };
exports.default = a;