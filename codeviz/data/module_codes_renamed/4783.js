Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.validateAdditionalItems = undefined;
const M_codegen_NOTSURE = require("codegen"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  i = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: e } }) =>
        M_codegen_NOTSURE.str`must NOT have more than ${e} items`,
      params: ({ params: { len: e } }) => M_codegen_NOTSURE._`{limit: ${e}}`,
    },
    code(e) {
      const { parentSchema: t, it: n } = e,
        { items: r } = t;
      if (Array.isArray(r)) {
        validateAdditionalItems(e, r);
      } else {
        M_ajv_utils_NOTSURE.checkStrictMode(
          n,
          '"additionalItems" is ignored when "items" is not an array of schemas'
        );
      }
    },
  };
function validateAdditionalItems(e, t) {
  const { gen: n, schema: i, data: s, keyword: a, it: c } = e;
  c.items = !0;
  const l = n.const("len", M_codegen_NOTSURE._`${s}.length`);
  if (!1 === i) {
    e.setParams({
      len: t.length,
    });
    e.pass(M_codegen_NOTSURE._`${l} <= ${t.length}`);
  } else if (
    "object" == typeof i &&
    !M_ajv_utils_NOTSURE.alwaysValidSchema(c, i)
  ) {
    const i = n.var("valid", M_codegen_NOTSURE._`${l} <= ${t.length}`);
    n.if(M_codegen_NOTSURE.not(i), () =>
      (function (i) {
        n.forRange("i", t.length, l, (t) => {
          e.subschema(
            {
              keyword: a,
              dataProp: t,
              dataPropType: M_ajv_utils_NOTSURE.Type.Num,
            },
            i
          );
          if (c.allErrors) {
            n.if(M_codegen_NOTSURE.not(i), () => n.break());
          }
        });
      })(i)
    );
    e.ok(i);
  }
}
exports.validateAdditionalItems = validateAdditionalItems;
exports.default = i;
