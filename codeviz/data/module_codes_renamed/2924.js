Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_validate_tuple_maybe = require("validate-tuple");
const o = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => M_validate_tuple_maybe.validateTuple(e, "items"),
};
exports.default = o;
