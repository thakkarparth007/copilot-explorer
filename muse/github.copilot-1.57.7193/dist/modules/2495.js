Object.defineProperty(exports, "__esModule", {
  value: true,
});
var r = require(4953);
var o = require("stream");
exports.console = {
  versionSpecifier: ">= 4.0.0",
  patch: function (e) {
    var t = new o.Writable();
    var n = new o.Writable();
    t.write = function (e) {
      if (!e) return true;
      var t = e.toString();
      r.channel.publish("console", {
        message: t,
      });
      return true;
    };
    n.write = function (e) {
      if (!e) return true;
      var t = e.toString();
      r.channel.publish("console", {
        message: t,
        stderr: true,
      });
      return true;
    };
    for (
      i = new e.Console(t, n),
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
        ],
        undefined;
      a < c.length;
      a++
    ) {
      var i;
      var s;
      var a;
      var c;
      s(c[a]);
    }
    return e;
  },
};
exports.enable = function () {
  r.channel.registerMonkeyPatch("console", exports.console);
  require("console");
};