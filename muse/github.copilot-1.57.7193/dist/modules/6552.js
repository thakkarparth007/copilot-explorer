Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(6776),
  o = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({
      keyword: e,
      parentSchema: t,
      it: n
    }) {
      undefined === t.if && r.checkStrictMode(n, `"${e}" without "if" is ignored`);
    }
  };
exports.default = o;