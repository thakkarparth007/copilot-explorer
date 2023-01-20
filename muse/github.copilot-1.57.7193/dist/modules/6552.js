Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(6776);
const o = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: n }) {
    if (undefined === t.if) {
      r.checkStrictMode(n, `"${e}" without "if" is ignored`);
    }
  },
};
exports.default = o;