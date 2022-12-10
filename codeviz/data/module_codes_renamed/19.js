Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: require("validate-properties").validateUnion,
  error: {
    message: "must match a schema in anyOf",
  },
};
exports.default = r;
