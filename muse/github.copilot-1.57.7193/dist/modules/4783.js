Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.validateAdditionalItems = undefined;
const r = require(3487),
  o = require(6776),
  i = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({
        params: {
          len: e
        }
      }) => r.str`must NOT have more than ${e} items`,
      params: ({
        params: {
          len: e
        }
      }) => r._`{limit: ${e}}`
    },
    code(e) {
      const {
          parentSchema: t,
          it: n
        } = e,
        {
          items: r
        } = t;
      Array.isArray(r) ? s(e, r) : o.checkStrictMode(n, '"additionalItems" is ignored when "items" is not an array of schemas');
    }
  };
function s(e, t) {
  const {
    gen: n,
    schema: i,
    data: s,
    keyword: a,
    it: c
  } = e;
  c.items = !0;
  const l = n.const("len", r._`${s}.length`);
  if (!1 === i) {
    e.setParams({
      len: t.length
    });
    e.pass(r._`${l} <= ${t.length}`);
  } else if ("object" == typeof i && !o.alwaysValidSchema(c, i)) {
    const i = n.var("valid", r._`${l} <= ${t.length}`);
    n.if(r.not(i), () => function (i) {
      n.forRange("i", t.length, l, t => {
        e.subschema({
          keyword: a,
          dataProp: t,
          dataPropType: o.Type.Num
        }, i);
        c.allErrors || n.if(r.not(i), () => n.break());
      });
    }(i));
    e.ok(i);
  }
}
exports.validateAdditionalItems = s;
exports.default = i;