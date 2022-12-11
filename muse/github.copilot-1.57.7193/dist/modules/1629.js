var r =
  (this && this.__assign) ||
  Object.assign ||
  function (e) {
    for (n = 1, r = arguments.length, undefined; n < r; n++) {
      var t;
      var n;
      var r;
      for (var o in (t = arguments[n]))
        if (Object.prototype.hasOwnProperty.call(t, o)) {
          e[o] = t[o];
        }
    }
    return e;
  };
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var o = require(9253);
var i = require(4470);
var s = require(5282);
var AutoCollectNativePerformance = (function () {
  function e(t) {
    this._disabledMetrics = {};
    if (e.INSTANCE) {
      e.INSTANCE.dispose();
    }
    e.INSTANCE = this;
    this._client = t;
  }
  e.isNodeVersionCompatible = function () {
    var e = process.versions.node.split(".");
    return parseInt(e[0]) >= 6;
  };
  e.prototype.enable = function (t, r, o) {
    var i = this;
    if (undefined === r) {
      r = {};
    }
    if (undefined === o) {
      o = 6e4;
    }
    if (e.isNodeVersionCompatible()) {
      if (null == e._metricsAvailable && t && !this._isInitialized)
        try {
          var a = require("applicationinsights-native-metrics");
          (e._emitter = new a()),
            (e._metricsAvailable = !0),
            s.info("Native metrics module successfully loaded!");
        } catch (t) {
          return void (e._metricsAvailable = !1);
        }
      (this._isEnabled = t),
        (this._disabledMetrics = r),
        this._isEnabled && !this._isInitialized && (this._isInitialized = !0),
        this._isEnabled && e._emitter
          ? (e._emitter.enable(!0, o),
            (this._handle = setInterval(function () {
              return i._trackNativeMetrics();
            }, o)),
            this._handle.unref())
          : e._emitter &&
            (e._emitter.enable(!1),
            this._handle &&
              (clearInterval(this._handle), (this._handle = void 0)));
    }
  };
  e.prototype.dispose = function () {
    this.enable(!1);
  };
  e.parseEnabled = function (e) {
    var t = process.env[o.ENV_nativeMetricsDisableAll];
    var n = process.env[o.ENV_nativeMetricsDisablers];
    if (t)
      return {
        isEnabled: !1,
        disabledMetrics: {},
      };
    if (n) {
      var i = n.split(",");
      var s = {};
      if (i.length > 0)
        for (a = 0, c = i, undefined; a < c.length; a++) {
          var a;
          var c;
          s[c[a]] = !0;
        }
      return "object" == typeof e
        ? {
            isEnabled: !0,
            disabledMetrics: r({}, e, s),
          }
        : {
            isEnabled: e,
            disabledMetrics: s,
          };
    }
    return "boolean" == typeof e
      ? {
          isEnabled: e,
          disabledMetrics: {},
        }
      : {
          isEnabled: !0,
          disabledMetrics: e,
        };
  };
  e.prototype._trackNativeMetrics = function () {
    var e = !0;
    if ("object" != typeof this._isEnabled) {
      e = this._isEnabled;
    }
    if (e) {
      this._trackGarbageCollection();
      this._trackEventLoop();
      this._trackHeapUsage();
    }
  };
  e.prototype._trackGarbageCollection = function () {
    if (!this._disabledMetrics.gc) {
      var t;
      var n = e._emitter.getGCData();
      for (var r in n) {
        var o = n[r].metrics;
        var s = r + " Garbage Collection Duration";
        var a =
          Math.sqrt(o.sumSquares / o.count - Math.pow(o.total / o.count, 2)) ||
          0;
        this._client.trackMetric({
          name: s,
          value: o.total,
          count: o.count,
          max: o.max,
          min: o.min,
          stdDev: a,
          tagOverrides:
            ((t = {}),
            (t[this._client.context.keys.internalSdkVersion] =
              "node-nativeperf:" + i.sdkVersion),
            t),
        });
      }
    }
  };
  e.prototype._trackEventLoop = function () {
    if (!this._disabledMetrics.loop) {
      var t = e._emitter.getLoopData().loopUsage;
      if (0 != t.count) {
        var n;
        var r =
          Math.sqrt(t.sumSquares / t.count - Math.pow(t.total / t.count, 2)) ||
          0;
        this._client.trackMetric({
          name: "Event Loop CPU Time",
          value: t.total,
          count: t.count,
          min: t.min,
          max: t.max,
          stdDev: r,
          tagOverrides:
            ((n = {}),
            (n[this._client.context.keys.internalSdkVersion] =
              "node-nativeperf:" + i.sdkVersion),
            n),
        });
      }
    }
  };
  e.prototype._trackHeapUsage = function () {
    if (!this._disabledMetrics.heap) {
      var e;
      var t;
      var n;
      var r = process.memoryUsage();
      var o = r.heapUsed;
      var s = r.heapTotal;
      var a = r.rss;
      this._client.trackMetric({
        name: "Memory Usage (Heap)",
        value: o,
        count: 1,
        tagOverrides:
          ((e = {}),
          (e[this._client.context.keys.internalSdkVersion] =
            "node-nativeperf:" + i.sdkVersion),
          e),
      });
      this._client.trackMetric({
        name: "Memory Total (Heap)",
        value: s,
        count: 1,
        tagOverrides:
          ((t = {}),
          (t[this._client.context.keys.internalSdkVersion] =
            "node-nativeperf:" + i.sdkVersion),
          t),
      });
      this._client.trackMetric({
        name: "Memory Usage (Non-Heap)",
        value: a - s,
        count: 1,
        tagOverrides:
          ((n = {}),
          (n[this._client.context.keys.internalSdkVersion] =
            "node-nativeperf:" + i.sdkVersion),
          n),
      });
    }
  };
  return e;
})();
exports.AutoCollectNativePerformance = AutoCollectNativePerformance;