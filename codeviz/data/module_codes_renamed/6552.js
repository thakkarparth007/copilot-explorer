Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_ajv_utils_maybe = require("ajv-utils");
const o = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: n }) {
    if (undefined === t.if) {
      M_ajv_utils_maybe.checkStrictMode(n, `"${e}" without "if" is ignored`);
    }
  },
};
exports.default = o;
