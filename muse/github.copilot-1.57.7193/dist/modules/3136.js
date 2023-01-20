Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.TextDocumentManager = exports.getRelativePath = undefined;
const r = require("path");
exports.getRelativePath = function (e, t) {
  for (const n of e) {
    const e = n.fsPath;
    if (t.startsWith(e + r.sep)) return r.relative(e, t);
  }
};
exports.TextDocumentManager = class {};