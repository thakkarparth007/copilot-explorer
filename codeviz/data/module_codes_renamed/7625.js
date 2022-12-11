var M_url = require("url");
var M_appinsights_config_maybe = require("appinsights-config");
var M_default_context_maybe = require("default-context");
var M_copilot_utils_maybe = require("copilot-utils");
var M_telemetry_batcher_maybe = require("telemetry-batcher");
var M_vscode_languageclient_types_maybe = require("vscode-languageclient-types");
var M_correlation_context_manager = require("correlation-context-manager");
var M_telemetry_uploader_maybe = require("telemetry-uploader");
var M_http_util_maybe = require("http-util");
var M_logging_maybe = require("logging");
var M_telemetry_envelope_maybe = require("telemetry-envelope");
var f = (function () {
  function e(e) {
    this._telemetryProcessors = [];
    var t = new M_appinsights_config_maybe(e);
    this.config = t;
    this.context = new M_default_context_maybe();
    this.commonProperties = {};
    var n = new M_telemetry_uploader_maybe(this.config);
    this.channel = new M_telemetry_batcher_maybe(
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
    this.track(e, M_copilot_utils_maybe.TelemetryType.Availability);
  };
  e.prototype.trackTrace = function (e) {
    this.track(e, M_copilot_utils_maybe.TelemetryType.Trace);
  };
  e.prototype.trackMetric = function (e) {
    this.track(e, M_copilot_utils_maybe.TelemetryType.Metric);
  };
  e.prototype.trackException = function (e) {
    if (e && e.exception && !M_http_util_maybe.isError(e.exception)) {
      e.exception = new Error(e.exception.toString());
    }
    this.track(e, M_copilot_utils_maybe.TelemetryType.Exception);
  };
  e.prototype.trackEvent = function (e) {
    this.track(e, M_copilot_utils_maybe.TelemetryType.Event);
  };
  e.prototype.trackRequest = function (e) {
    this.track(e, M_copilot_utils_maybe.TelemetryType.Request);
  };
  e.prototype.trackDependency = function (e) {
    if (e && !e.target && e.data) {
      e.target = M_url.parse(e.data).host;
    }
    this.track(e, M_copilot_utils_maybe.TelemetryType.Dependency);
  };
  e.prototype.flush = function (e) {
    this.channel.triggerSend(
      !!e && !!e.isAppCrashing,
      e ? e.callback : undefined
    );
  };
  e.prototype.track = function (e, t) {
    if (e && M_copilot_utils_maybe.telemetryTypeToBaseType(t)) {
      var n = M_telemetry_envelope_maybe.createEnvelope(
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
        M_vscode_languageclient_types_maybe.samplingTelemetryProcessor(n, {
          correlationContext:
            M_correlation_context_manager.CorrelationContextManager.getCurrentContext(),
        });
      M_vscode_languageclient_types_maybe.performanceMetricsTelemetryProcessor(
        n,
        this.quickPulseClient
      );
      if (r) {
        this.channel.send(n);
      }
    } else
      M_logging_maybe.warn(
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
      M_correlation_context_manager.CorrelationContextManager.getCurrentContext();
    for (var o = 0; o < r; ++o)
      try {
        var i = this._telemetryProcessors[o];
        if (i && !1 === i.apply(null, [e, t])) {
          n = !1;
          break;
        }
      } catch (t) {
        n = !0;
        M_logging_maybe.warn(
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
