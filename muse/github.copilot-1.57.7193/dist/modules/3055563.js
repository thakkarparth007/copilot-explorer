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
const i = require(3055_622),
  s = require(3055_13);
o(require(3055_306), exports);
o(require(3055_610), exports);
o(require(3055_312), exports);
o(require(3055_94), exports);
var a = require(3055_417);
exports.languageCommentMarkers = a.languageCommentMarkers;
exports.comment = a.comment;
var c = require(3055_271);
exports.FileSystem = c.FileSystem;
exports.createWorker = function () {
  return new s.Worker(i.resolve(__dirname, "..", "dist", "worker.js"));
};
