var r = this && this.__createBinding || (Object.create ? function (e, t, n, r) {
    undefined === r && (r = n);
    Object.defineProperty(e, r, {
      enumerable: !0,
      get: function () {
        return t[n];
      }
    });
  } : function (e, t, n, r) {
    undefined === r && (r = n);
    e[r] = t[n];
  }),
  o = this && this.__exportStar || function (e, t) {
    for (var n in e) "default" === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
  };
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.createWorker = exports.FileSystem = exports.comment = exports.languageCommentMarkers = undefined;
const i = require(1017),
  s = require(1267);
o(require(464), exports);
o(require(9940), exports);
o(require(1747), exports);
o(require(9852), exports);
var a = require(1788);
Object.defineProperty(exports, "languageCommentMarkers", {
  enumerable: !0,
  get: function () {
    return a.languageCommentMarkers;
  }
});
Object.defineProperty(exports, "comment", {
  enumerable: !0,
  get: function () {
    return a.comment;
  }
});
var c = require(5012);
Object.defineProperty(exports, "FileSystem", {
  enumerable: !0,
  get: function () {
    return c.FileSystem;
  }
});
exports.createWorker = function () {
  return new s.Worker(i.resolve(__dirname, "..", "dist", "worker.js"));
};