Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_channel_NOTSURE = require("channel"),
  o = require("events");
exports.postgres6 = {
  versionSpecifier: "6.*",
  patch: function (e, t) {
    var n = e.Client.prototype.query,
      i = "__diagnosticOriginalFunc";
    e.Client.prototype.query = function (e, t, s) {
      var a,
        c = {
          query: {},
          database: {
            host: this.connectionParameters.host,
            port: this.connectionParameters.port,
          },
          result: null,
          error: null,
          duration: 0,
          time: new Date(),
        },
        l = process.hrtime();
      function u(e) {
        if (e && e[i]) {
          e = e[i];
        }
        var t = M_channel_NOTSURE.channel.bindToContext(function (t, n) {
          var i = process.hrtime(l);
          c.result = n && {
            rowCount: n.rowCount,
            command: n.command,
          };
          c.error = t;
          c.duration = Math.ceil(1e3 * i[0] + i[1] / 1e6);
          M_channel_NOTSURE.channel.publish("postgres", c);
          if (t) {
            if (e) return e.apply(this, arguments);
            a && a instanceof o.EventEmitter && a.emit("error", t);
          } else e && e.apply(this, arguments);
        });
        try {
          Object.defineProperty(t, i, {
            value: e,
          });
          return t;
        } catch (t) {
          return e;
        }
      }
      try {
        if ("string" == typeof e) {
          if (t instanceof Array) {
            c.query.preparable = {
              text: e,
              args: t,
            };
            s = u(s);
          } else {
            c.query.text = e;
            if (s) {
              s = u(s);
            } else {
              t = u(t);
            }
          }
        } else {
          if ("string" == typeof e.name) {
            c.query.plan = e.name;
          } else {
            if (e.values instanceof Array) {
              c.query.preparable = {
                text: e.text,
                args: e.values,
              };
            } else {
              c.query.text = e.text;
            }
          }
          if (s) {
            s = u(s);
          } else {
            if (t) {
              t = u(t);
            } else {
              e.callback = u(e.callback);
            }
          }
        }
      } catch (e) {
        return n.apply(this, arguments);
      }
      arguments[0] = e;
      arguments[1] = t;
      arguments[2] = s;
      arguments.length = arguments.length > 3 ? arguments.length : 3;
      return (a = n.apply(this, arguments));
    };
    return e;
  },
};
exports.postgres7 = {
  versionSpecifier: ">=7.* <=8.*",
  patch: function (e, t) {
    var n = e.Client.prototype.query,
      i = "__diagnosticOriginalFunc";
    e.Client.prototype.query = function (e, t, s) {
      var a,
        c = this,
        l = !!s,
        u = {
          query: {},
          database: {
            host: this.connectionParameters.host,
            port: this.connectionParameters.port,
          },
          result: null,
          error: null,
          duration: 0,
          time: new Date(),
        },
        d = process.hrtime();
      function p(e) {
        if (e && e[i]) {
          e = e[i];
        }
        var t = M_channel_NOTSURE.channel.bindToContext(function (t, n) {
          var i = process.hrtime(d);
          u.result = n && {
            rowCount: n.rowCount,
            command: n.command,
          };
          u.error = t;
          u.duration = Math.ceil(1e3 * i[0] + i[1] / 1e6);
          M_channel_NOTSURE.channel.publish("postgres", u);
          if (t) {
            if (e) return e.apply(this, arguments);
            a && a instanceof o.EventEmitter && a.emit("error", t);
          } else e && e.apply(this, arguments);
        });
        try {
          Object.defineProperty(t, i, {
            value: e,
          });
          return t;
        } catch (t) {
          return e;
        }
      }
      try {
        if ("string" == typeof e) {
          if (t instanceof Array) {
            u.query.preparable = {
              text: e,
              args: t,
            };
            s = (l = "function" == typeof s) ? p(s) : s;
          } else {
            u.query.text = e;
            if (s) {
              s = (l = "function" == typeof s) ? p(s) : s;
            } else {
              t = (l = "function" == typeof t) ? p(t) : t;
            }
          }
        } else {
          if ("string" == typeof e.name) {
            u.query.plan = e.name;
          } else {
            if (e.values instanceof Array) {
              u.query.preparable = {
                text: e.text,
                args: e.values,
              };
            } else {
              u.query.text = e.text;
            }
          }
          if (s) {
            l = "function" == typeof s;
            s = p(s);
          } else {
            if (t) {
              t = (l = "function" == typeof t) ? p(t) : t;
            } else {
              l = "function" == typeof e.callback;
              e.callback = l ? p(e.callback) : e.callback;
            }
          }
        }
      } catch (e) {
        return n.apply(this, arguments);
      }
      arguments[0] = e;
      arguments[1] = t;
      arguments[2] = s;
      arguments.length = arguments.length > 3 ? arguments.length : 3;
      a = n.apply(this, arguments);
      return l
        ? a
        : a
            .then(function (e) {
              p()(undefined, e);
              return new c._Promise(function (t, n) {
                t(e);
              });
            })
            .catch(function (e) {
              p()(e, undefined);
              return new c._Promise(function (t, n) {
                n(e);
              });
            });
    };
    return e;
  },
};
exports.enable = function () {
  M_channel_NOTSURE.channel.registerMonkeyPatch("pg", exports.postgres6);
  M_channel_NOTSURE.channel.registerMonkeyPatch("pg", exports.postgres7);
};
