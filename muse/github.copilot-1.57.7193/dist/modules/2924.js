Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(4665),
  o = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (e) => r.validateTuple(e, "items"),
  };
exports.default = o;