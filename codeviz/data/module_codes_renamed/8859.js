Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_channel_maybe = require("channel");
exports.bunyan = {
  versionSpecifier: ">= 1.0.0 < 2.0.0",
  patch: function (e) {
    var t = e.prototype._emit;
    e.prototype._emit = function (e, n) {
      var o = t.apply(this, arguments);
      if (!n) {
        var i = o;
        if (i) {
          i = t.call(this, e, !0);
        }
        M_channel_maybe.channel.publish("bunyan", {
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
  M_channel_maybe.channel.registerMonkeyPatch("bunyan", exports.bunyan);
};
