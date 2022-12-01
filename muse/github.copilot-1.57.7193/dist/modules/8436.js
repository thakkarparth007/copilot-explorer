var r =
  (this && this.__assign) ||
  Object.assign ||
  function (e) {
    for (var t, n = 1, r = arguments.length; n < r; n++)
      for (var o in (t = arguments[n]))
        if (Object.prototype.hasOwnProperty.call(t, o)) {
          e[o] = t[o];
        }
    return e;
  };
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var o = require(4953);
exports.mongo2 = {
  versionSpecifier: ">= 2.0.0 <= 3.0.5",
  patch: function (e) {
    var t = e.instrument({
        operationIdGenerator: {
          next: function () {
            return o.channel.bindToContext(function (e) {
              return e();
            });
          },
        },
      }),
      n = {};
    t.on("started", function (e) {
      if (n[e.requestId]) {
        n[e.requestId] = r({}, e, {
          time: new Date(),
        });
      }
    });
    t.on("succeeded", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("function" == typeof e.operationId) {
        e.operationId(function () {
          return o.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !0,
          });
        });
      } else {
        o.channel.publish("mongodb", {
          startedData: t,
          event: e,
          succeeded: !0,
        });
      }
    });
    t.on("failed", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("function" == typeof e.operationId) {
        e.operationId(function () {
          return o.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !1,
          });
        });
      } else {
        o.channel.publish("mongodb", {
          startedData: t,
          event: e,
          succeeded: !1,
        });
      }
    });
    return e;
  },
};
exports.mongo3 = {
  versionSpecifier: "> 3.0.5 < 3.3.0",
  patch: function (e) {
    var t = e.instrument(),
      n = {},
      i = {};
    t.on("started", function (e) {
      if (n[e.requestId]) {
        i[e.requestId] = o.channel.bindToContext(function (e) {
          return e();
        });
        n[e.requestId] = r({}, e, {
          time: new Date(),
        });
      }
    });
    t.on("succeeded", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("object" == typeof e && "function" == typeof i[e.requestId]) {
        i[e.requestId](function () {
          return o.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !0,
          });
        });
        delete i[e.requestId];
      }
    });
    t.on("failed", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("object" == typeof e && "function" == typeof i[e.requestId]) {
        i[e.requestId](function () {
          return o.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !1,
          });
        });
        delete i[e.requestId];
      }
    });
    return e;
  },
};
exports.mongo330 = {
  versionSpecifier: ">= 3.3.0 < 4.0.0",
  patch: function (e) {
    !(function (e) {
      var t = e.Server.prototype.connect;
      e.Server.prototype.connect = function () {
        var e = t.apply(this, arguments),
          n = this.s.coreTopology.s.pool.write;
        this.s.coreTopology.s.pool.write = function () {
          var e = "function" == typeof arguments[1] ? 1 : 2;
          if ("function" == typeof arguments[e]) {
            arguments[e] = o.channel.bindToContext(arguments[e]);
          }
          return n.apply(this, arguments);
        };
        var r = this.s.coreTopology.s.pool.logout;
        this.s.coreTopology.s.pool.logout = function () {
          if ("function" == typeof arguments[1]) {
            arguments[1] = o.channel.bindToContext(arguments[1]);
          }
          return r.apply(this, arguments);
        };
        return e;
      };
    })(e);
    var t = e.instrument(),
      n = {},
      r = {};
    t.on("started", function (e) {
      if (n[e.requestId]) {
        r[e.requestId] = o.channel.bindToContext(function (e) {
          return e();
        });
        n[e.requestId] = e;
      }
    });
    t.on("succeeded", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("object" == typeof e && "function" == typeof r[e.requestId]) {
        r[e.requestId](function () {
          return o.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !0,
          });
        });
        delete r[e.requestId];
      }
    });
    t.on("failed", function (e) {
      var t = n[e.requestId];
      if (t) {
        delete n[e.requestId];
      }
      if ("object" == typeof e && "function" == typeof r[e.requestId]) {
        r[e.requestId](function () {
          return o.channel.publish("mongodb", {
            startedData: t,
            event: e,
            succeeded: !1,
          });
        });
        delete r[e.requestId];
      }
    });
    return e;
  },
};
exports.enable = function () {
  o.channel.registerMonkeyPatch("mongodb", exports.mongo2);
  o.channel.registerMonkeyPatch("mongodb", exports.mongo3);
  o.channel.registerMonkeyPatch("mongodb", exports.mongo330);
};