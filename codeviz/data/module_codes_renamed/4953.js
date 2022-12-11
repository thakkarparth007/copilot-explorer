Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_require_patcher_maybe = require("require-patcher");
var M_require_patcher_maybe = require("require-patcher");
exports.makePatchingRequire = M_require_patcher_maybe.makePatchingRequire;
var i = function (e) {
  return !0;
};
var s = (function () {
  function e() {
    this.version = require("version").i8;
    this.subscribers = {};
    this.contextPreservationFunction = function (e) {
      return e;
    };
    this.knownPatches = {};
    this.currentlyPublishing = !1;
  }
  e.prototype.shouldPublish = function (e) {
    var t = this.subscribers[e];
    return (
      !!t &&
      t.some(function (e) {
        var t = e.filter;
        return !t || t(!1);
      })
    );
  };
  e.prototype.publish = function (e, t) {
    if (!this.currentlyPublishing) {
      var n = this.subscribers[e];
      if (n) {
        var r = {
          timestamp: Date.now(),
          data: t,
        };
        this.currentlyPublishing = !0;
        n.forEach(function (e) {
          var t = e.listener;
          var n = e.filter;
          try {
            if (n && n(!0)) {
              t(r);
            }
          } catch (e) {}
        });
        this.currentlyPublishing = !1;
      }
    }
  };
  e.prototype.subscribe = function (e, t, n) {
    if (undefined === n) {
      n = i;
    }
    if (this.subscribers[e]) {
      this.subscribers[e] = [];
    }
    this.subscribers[e].push({
      listener: t,
      filter: n,
    });
  };
  e.prototype.unsubscribe = function (e, t, n) {
    if (undefined === n) {
      n = i;
    }
    var r = this.subscribers[e];
    if (r)
      for (var o = 0; o < r.length; ++o)
        if (r[o].listener === t && r[o].filter === n) {
          r.splice(o, 1);
          return !0;
        }
    return !1;
  };
  e.prototype.reset = function () {
    var e = this;
    this.subscribers = {};
    this.contextPreservationFunction = function (e) {
      return e;
    };
    Object.getOwnPropertyNames(this.knownPatches).forEach(function (t) {
      return delete e.knownPatches[t];
    });
  };
  e.prototype.bindToContext = function (e) {
    return this.contextPreservationFunction(e);
  };
  e.prototype.addContextPreservation = function (e) {
    var t = this.contextPreservationFunction;
    this.contextPreservationFunction = function (n) {
      return e(t(n));
    };
  };
  e.prototype.registerMonkeyPatch = function (e, t) {
    if (this.knownPatches[e]) {
      this.knownPatches[e] = [];
    }
    this.knownPatches[e].push(t);
  };
  e.prototype.getPatchesObject = function () {
    return this.knownPatches;
  };
  return e;
})();
if (global.diagnosticsSource) {
  global.diagnosticsSource = new s();
  require("module").prototype.require =
    M_require_patcher_maybe.makePatchingRequire(
      global.diagnosticsSource.getPatchesObject()
    );
}
exports.channel = global.diagnosticsSource;
