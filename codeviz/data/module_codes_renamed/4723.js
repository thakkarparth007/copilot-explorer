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
      });
var o =
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
const M_path = require("path");
const M_worker_threads = require("worker_threads");
o(require("get-prompt-parsing-utils"), exports);
o(require("block-parser"), exports);
o(require("prompt-parsing-utils"), exports);
o(require("tokenizer"), exports);
var M_language_marker_constants_maybe = require("language-marker-constants");
exports.languageCommentMarkers =
  M_language_marker_constants_maybe.languageCommentMarkers;
exports.comment = M_language_marker_constants_maybe.comment;
var M_filesystem_maybe = require("filesystem");
exports.FileSystem = M_filesystem_maybe.FileSystem;
exports.createWorker = function () {
  return new M_worker_threads.Worker(
    M_path.resolve(__dirname, "..", "dist", "worker.js")
  );
};
