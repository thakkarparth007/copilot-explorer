Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_channel_NOTSURE = require("channel"),
  o = require("path");
exports.mysql = {
  versionSpecifier: ">= 2.0.0 < 3.0.0",
  patch: function (e, t) {
    var i = function (e, t) {
        return function (t, n) {
          var o = e[t];
          if (o) {
            e[t] = function () {
              for (
                var e = arguments.length - 1, t = arguments.length - 1;
                t >= 0;
                --t
              ) {
                if ("function" == typeof arguments[t]) {
                  e = t;
                  break;
                }
                if (undefined !== arguments[t]) break;
              }
              var i = arguments[e],
                s = {
                  result: null,
                  startTime: null,
                  startDate: null,
                };
              if ("function" == typeof i) {
                if (n) {
                  s.startTime = process.hrtime();
                  s.startDate = new Date();
                  arguments[e] = M_channel_NOTSURE.channel.bindToContext(
                    n(s, i)
                  );
                } else {
                  arguments[e] = M_channel_NOTSURE.channel.bindToContext(i);
                }
              }
              var a = o.apply(this, arguments);
              s.result = a;
              return a;
            };
          }
        };
      },
      s = function (e, t) {
        return i(e.prototype);
      },
      a = require("vscode-languageserver-protocol")(
        o.dirname(t) + "/lib/Connection"
      );
    ["connect", "changeUser", "ping", "statistics", "end"].forEach(function (
      e
    ) {
      return s(a)(e);
    });
    i(a)("createQuery", function (e, t) {
      return function (n) {
        var o = process.hrtime(e.startTime),
          i = (1e3 * o[0] + o[1] / 1e6) | 0;
        M_channel_NOTSURE.channel.publish("mysql", {
          query: e.result,
          callbackArgs: arguments,
          err: n,
          duration: i,
          time: e.startDate,
        });
        t.apply(this, arguments);
      };
    });
    var c = require("module-not-found")(o.dirname(t) + "/lib/Pool");
    ["_enqueueCallback"].forEach(function (e) {
      return s(c)(e);
    });
    return e;
  },
};
exports.enable = function () {
  M_channel_NOTSURE.channel.registerMonkeyPatch("mysql", exports.mysql);
};
