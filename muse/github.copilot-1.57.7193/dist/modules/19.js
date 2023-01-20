Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: true,
  code: require(412).validateUnion,
  error: {
    message: "must match a schema in anyOf",
  },
};
exports.default = r;