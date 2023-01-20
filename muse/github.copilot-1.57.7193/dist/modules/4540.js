Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.ignoreDocument = undefined;
const r = require(1133);
const o = require(4197);
exports.ignoreDocument = function (e, t) {
  const n = t.languageId;
  return (
    !r.getEnabledConfig(e, n) ||
    !![o.CopilotScheme, "output", "search-editor"].includes(t.uri.scheme)
  );
};