Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_channel_maybe = require("channel");
exports.postgresPool1 = {
  versionSpecifier: ">= 1.0.0 < 3.0.0",
  patch: function (e) {
    var t = e.prototype.connect;
    e.prototype.connect = function (e) {
      if (e) {
        arguments[0] = M_channel_maybe.channel.bindToContext(e);
      }
      return t.apply(this, arguments);
    };
    return e;
  },
};
exports.enable = function () {
  M_channel_maybe.channel.registerMonkeyPatch("pg-pool", exports.postgresPool1);
};
