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
o(require("ast-utils"), exports);
o(require("get-prompt-actual"), exports);
o(require("tokenizer"), exports);
var M_language_marker_constants = require("language-marker-constants");
exports.languageCommentMarkers =
  M_language_marker_constants.languageCommentMarkers;
exports.comment = M_language_marker_constants.comment;
var M_fs_wrapper = require("fs-wrapper");
exports.FileSystem = M_fs_wrapper.FileSystem;
exports.createWorker = function () {
  return new s.Worker(i.resolve(__dirname, "..", "dist", "worker.js"));
};
