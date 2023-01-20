Object.defineProperty(exports, "__esModule", {
  value: true,
});
var r = require(4953);
exports.bunyan = {
  versionSpecifier: ">= 1.0.0 < 2.0.0",
  patch: function (e) {
    var t = e.prototype._emit;
    e.prototype._emit = function (e, n) {
      var o = t.apply(this, arguments);
      if (!n) {
        var i = o;
        if (i) {
          i = t.call(this, e, true);
        }
        r.channel.publish("bunyan", {
          level: e.level,
          result: i,
        });
      }
      return o;
    };
    return e;
  },
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("bunyan", exports.bunyan);
};