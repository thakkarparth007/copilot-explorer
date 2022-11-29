Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ignoreDocument = undefined;
const r = require(1133),
  o = require(4197);
exports.ignoreDocument = function (e, t) {
  const n = t.languageId;
  return (
    !r.getEnabledConfig(e, n) ||
    !![o.CopilotScheme, "output", "search-editor"].includes(t.uri.scheme)
  );
};
