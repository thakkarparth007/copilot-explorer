Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var r = require(4953),
  o = require("stream");
exports.console = {
  versionSpecifier: ">= 4.0.0",
  patch: function (e) {
    var t = new o.Writable(),
      n = new o.Writable();
    t.write = function (e) {
      if (!e) return !0;
      var t = e.toString();
      r.channel.publish("console", {
        message: t,
      });
      return !0;
    };
    n.write = function (e) {
      if (!e) return !0;
      var t = e.toString();
      r.channel.publish("console", {
        message: t,
        stderr: !0,
      });
      return !0;
    };
    for (
      var i = new e.Console(t, n),
        s = function (t) {
          var n = e[t];
          if (n) {
            e[t] = function () {
              if (i[t])
                try {
                  i[t].apply(i, arguments);
                } catch (e) {}
              return n.apply(e, arguments);
            };
          }
        },
        a = 0,
        c = [
          "log",
          "info",
          "warn",
          "error",
          "dir",
          "time",
          "timeEnd",
          "trace",
          "assert",
        ];
      a < c.length;
      a++
    )
      s(c[a]);
    return e;
  },
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("console", exports.console);
  require("console");
};