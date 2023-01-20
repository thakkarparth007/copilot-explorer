Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(3487);
const o = require(6776);
const i = require(412);
const s = require(4783);
const a = {
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
    const { schema: t, parentSchema: n, it: r } = e;
    const { prefixItems: a } = n;
    r.items = true;
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