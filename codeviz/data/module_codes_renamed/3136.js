Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.TextDocumentManager = exports.getRelativePath = undefined;
const M_path = require("path");
exports.getRelativePath = function (e, t) {
  for (const n of e) {
    const e = n.fsPath;
    if (t.startsWith(e + M_path.sep)) return M_path.relative(e, t);
  }
};
exports.TextDocumentManager = class {};
