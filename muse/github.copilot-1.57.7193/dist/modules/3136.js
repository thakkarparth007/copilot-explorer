Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.TextDocumentManager = exports.getRelativePath = undefined;
const r = require(1017);
exports.getRelativePath = function (e, t) {
  for (const n of e) {
    const e = n.fsPath;
    if (t.startsWith(e + r.sep)) return r.relative(e, t);
  }
};
exports.TextDocumentManager = class {};