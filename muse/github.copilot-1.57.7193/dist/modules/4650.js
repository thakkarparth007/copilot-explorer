var r;
var o =
  (this && this.__extends) ||
  ((r =
    Object.setPrototypeOf ||
    ({
      __proto__: [],
    } instanceof Array &&
      function (e, t) {
        e.__proto__ = t;
      }) ||
    function (e, t) {
      for (var n in t)
        if (t.hasOwnProperty(n)) {
          e[n] = t[n];
        }
    }),
  function (e, t) {
    function n() {
      this.constructor = e;
    }
    r(e, t);
    e.prototype =
      null === t ? Object.create(t) : ((n.prototype = t.prototype), new n());
  });
var i =
  (this && this.__rest) ||
  function (e, t) {
    var n = {};
    for (var r in e)
      if (Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0) {
        n[r] = e[r];
      }
    if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
      var o = 0;
      for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
        if (t.indexOf(r[o]) < 0) {
          n[r[o]] = e[r[o]];
        }
    }
    return n;
  };
Object.defineProperty(exports, "__esModule", {
  value: true,
});
var s = require(4953);
exports.winston3 = {
  versionSpecifier: "3.x",
  patch: function (e) {
    var t = (function (e) {
      function t(t, n) {
        var r = e.call(this, n) || this;
        r.winston = t;
        return r;
      }
      o(t, e);
      t.prototype.log = function (e, t) {
        var n = e.message;
        var r = e.level;
        var o = e.meta;
        var a = i(e, ["message", "level", "meta"]);
        r = "function" == typeof Symbol.for ? e[Symbol.for("level")] : r;
        n = e instanceof Error ? e : n;
        var c = (function (e, t) {
          return null != e.config.npm.levels[t]
            ? "npm"
            : null != e.config.syslog.levels[t]
            ? "syslog"
            : "unknown";
        })(this.winston, r);
        for (var l in ((o = o || {}), a))
          if (a.hasOwnProperty(l)) {
            o[l] = a[l];
          }
        s.channel.publish("winston", {
          message: n,
          level: r,
          levelKind: c,
          meta: o,
        });
        t();
      };
      return t;
    })(e.Transport);
    function n() {
      var n;
      var r = arguments[0].levels || e.config.npm.levels;
      for (var o in r)
        if (r.hasOwnProperty(o)) {
          n = undefined === n || r[o] > r[n] ? o : n;
        }
      this.add(
        new t(e, {
          level: n,
        })
      );
    }
    var r = e.createLogger;
    e.createLogger = function () {
      var o;
      var i = arguments[0].levels || e.config.npm.levels;
      for (var s in i)
        if (i.hasOwnProperty(s)) {
          o = undefined === o || i[s] > i[o] ? s : o;
        }
      var a = r.apply(this, arguments);
      a.add(
        new t(e, {
          level: o,
        })
      );
      var c = a.configure;
      a.configure = function () {
        c.apply(this, arguments);
        n.apply(this, arguments);
      };
      return a;
    };
    var a = e.createLogger;
    e.configure = function () {
      a.apply(this, arguments);
      n.apply(this, arguments);
    };
    e.add(new t(e));
    return e;
  },
};
exports.winston2 = {
  versionSpecifier: "2.x",
  patch: function (e) {
    var t;
    var n = e.Logger.prototype.log;
    var r = function (n, r, o) {
      var i;
      i =
        t === e.config.npm.levels
          ? "npm"
          : t === e.config.syslog.levels
          ? "syslog"
          : "unknown";
      s.channel.publish("winston", {
        level: n,
        message: r,
        meta: o,
        levelKind: i,
      });
      return r;
    };
    e.Logger.prototype.log = function () {
      t = this.levels;
      if (this.filters && 0 !== this.filters.length) {
        if (this.filters[this.filters.length - 1] !== r) {
          this.filters = this.filters.filter(function (e) {
            return e !== r;
          });
          this.filters.push(r);
        }
      } else {
        this.filters = [r];
      }
      return n.apply(this, arguments);
    };
    return e;
  },
};
exports.enable = function () {
  s.channel.registerMonkeyPatch("winston", exports.winston2);
  s.channel.registerMonkeyPatch("winston", exports.winston3);
};