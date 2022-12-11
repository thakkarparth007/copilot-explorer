Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.registerDocumentTracker = exports.sortByAccessTimes = undefined;
const r = require(3136);
const o = new Map();
exports.sortByAccessTimes = function (e) {
  return [...e].sort((e, t) => {
    var n;
    var r;
    const i = null !== (n = o.get(e.uri.toString())) && undefined !== n ? n : 0;
    return (
      (null !== (r = o.get(t.uri.toString())) && undefined !== r ? r : 0) - i
    );
  });
};
exports.registerDocumentTracker = (e) =>
  e.get(r.TextDocumentManager).onDidFocusTextDocument((e) => {
    if (e) {
      o.set(e.document.uri.toString(), Date.now());
    }
  });