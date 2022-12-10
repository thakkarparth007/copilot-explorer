Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_channel_NOTSURE = require("channel");
exports.mongoCore = {
  versionSpecifier: ">= 2.0.0 < 4.0.0",
  patch: function (e) {
    var t = e.Server.prototype.connect;
    e.Server.prototype.connect = function () {
      var e = t.apply(this, arguments),
        n = this.s.pool.write;
      this.s.pool.write = function () {
        var e = "function" == typeof arguments[1] ? 1 : 2;
        if ("function" == typeof arguments[e]) {
          arguments[e] = M_channel_NOTSURE.channel.bindToContext(arguments[e]);
        }
        return n.apply(this, arguments);
      };
      var o = this.s.pool.logout;
      this.s.pool.logout = function () {
        if ("function" == typeof arguments[1]) {
          arguments[1] = M_channel_NOTSURE.channel.bindToContext(arguments[1]);
        }
        return o.apply(this, arguments);
      };
      return e;
    };
    return e;
  },
};
exports.enable = function () {
  M_channel_NOTSURE.channel.registerMonkeyPatch(
    "mongodb-core",
    exports.mongoCore
  );
};
