var r =
    (this && this.__createBinding) ||
    (Object.create
      ? function (e, t, n, r) {
          if (undefined === r) {
            r = n;
          }
          Object.defineProperty(e, r, {
            enumerable: !0,
            get: function () {
              return t[n];
            },
          });
        }
      : function (e, t, n, r) {
          if (undefined === r) {
            r = n;
          }
          e[r] = t[n];
        }),
  o =
    (this && this.__exportStar) ||
    function (e, t) {
      for (var n in e)
        if ("default" === n || Object.prototype.hasOwnProperty.call(t, n)) {
          r(t, e, n);
        }
    };
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.createWorker =
  exports.FileSystem =
  exports.comment =
  exports.languageCommentMarkers =
    undefined;
const i = require("path"),
  s = require("worker_threads");
o(require("get-prompt-parsing-utils"), exports);
o(require("block-parser"), exports);
o(require("prompt-parsing-utils"), exports);
o(require("tokenizer"), exports);
var M_language_marker_constants_NOTSURE = require("language-marker-constants");
exports.languageCommentMarkers =
  M_language_marker_constants_NOTSURE.languageCommentMarkers;
exports.comment = M_language_marker_constants_NOTSURE.comment;
var M_filesystem_NOTSURE = require("filesystem");
exports.FileSystem = M_filesystem_NOTSURE.FileSystem;
exports.createWorker = function () {
  return new s.Worker(i.resolve(__dirname, "..", "dist", "worker.js"));
};
