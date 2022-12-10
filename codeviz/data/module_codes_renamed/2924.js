Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_validate_tuple_NOTSURE = require("validate-tuple"),
  o = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (e) => M_validate_tuple_NOTSURE.validateTuple(e, "items"),
  };
exports.default = o;
