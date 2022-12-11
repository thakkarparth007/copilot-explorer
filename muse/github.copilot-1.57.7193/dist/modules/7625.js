var r = require("url");
var o = require(9253);
var i = require(4470);
var s = require(5290);
var a = require(3504);
var c = require(9428);
var l = require(894);
var u = require(2588);
var d = require(5740);
var p = require(5282);
var h = require(9813);
var f = (function () {
  function e(e) {
    this._telemetryProcessors = [];
    var t = new o(e);
    this.config = t;
    this.context = new i();
    this.commonProperties = {};
    var n = new u(this.config);
    this.channel = new a(
      function () {
        return t.disableAppInsights;
      },
      function () {
        return t.maxBatchSize;
      },
      function () {
        return t.maxBatchIntervalMs;
      },
      n
    );
  }
  e.prototype.trackAvailability = function (e) {
    this.track(e, s.TelemetryType.Availability);
  };
  e.prototype.trackTrace = function (e) {
    this.track(e, s.TelemetryType.Trace);
  };
  e.prototype.trackMetric = function (e) {
    this.track(e, s.TelemetryType.Metric);
  };
  e.prototype.trackException = function (e) {
    if (e && e.exception && !d.isError(e.exception)) {
      e.exception = new Error(e.exception.toString());
    }
    this.track(e, s.TelemetryType.Exception);
  };
  e.prototype.trackEvent = function (e) {
    this.track(e, s.TelemetryType.Event);
  };
  e.prototype.trackRequest = function (e) {
    this.track(e, s.TelemetryType.Request);
  };
  e.prototype.trackDependency = function (e) {
    if (e && !e.target && e.data) {
      e.target = r.parse(e.data).host;
    }
    this.track(e, s.TelemetryType.Dependency);
  };
  e.prototype.flush = function (e) {
    this.channel.triggerSend(
      !!e && !!e.isAppCrashing,
      e ? e.callback : undefined
    );
  };
  e.prototype.track = function (e, t) {
    if (e && s.telemetryTypeToBaseType(t)) {
      var n = h.createEnvelope(
        e,
        t,
        this.commonProperties,
        this.context,
        this.config
      );
      if (e.time) {
        n.time = e.time.toISOString();
      }
      var r = this.runTelemetryProcessors(n, e.contextObjects);
      r =
        r &&
        c.samplingTelemetryProcessor(n, {
          correlationContext: l.CorrelationContextManager.getCurrentContext(),
        });
      c.performanceMetricsTelemetryProcessor(n, this.quickPulseClient);
      if (r) {
        this.channel.send(n);
      }
    } else
      p.warn(
        "track() requires telemetry object and telemetryType to be specified."
      );
  };
  e.prototype.addTelemetryProcessor = function (e) {
    this._telemetryProcessors.push(e);
  };
  e.prototype.clearTelemetryProcessors = function () {
    this._telemetryProcessors = [];
  };
  e.prototype.runTelemetryProcessors = function (e, t) {
    var n = !0;
    var r = this._telemetryProcessors.length;
    if (0 === r) return n;
    (t = t || {}).correlationContext =
      l.CorrelationContextManager.getCurrentContext();
    for (var o = 0; o < r; ++o)
      try {
        var i = this._telemetryProcessors[o];
        if (i && !1 === i.apply(null, [e, t])) {
          n = !1;
          break;
        }
      } catch (t) {
        n = !0;
        p.warn(
          "One of telemetry processors failed, telemetry item will be sent.",
          t,
          e
        );
      }
    return n;
  };
  return e;
})();
module.exports = f;