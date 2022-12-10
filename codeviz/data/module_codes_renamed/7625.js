var r = require("url"),
  M_appinsights_config_NOTSURE = require("appinsights-config"),
  M_default_context_NOTSURE = require("default-context"),
  M_copilot_utils_NOTSURE = require("copilot-utils"),
  M_telemetry_batcher_NOTSURE = require("telemetry-batcher"),
  M_vscode_languageclient_types_NOTSURE = require("vscode-languageclient-types"),
  M_correlation_context_manager = require("correlation-context-manager"),
  M_telemetry_uploader_NOTSURE = require("telemetry-uploader"),
  M_http_util_NOTSURE = require("http-util"),
  M_logging_NOTSURE = require("logging"),
  M_telemetry_envelope_NOTSURE = require("telemetry-envelope"),
  f = (function () {
    function e(e) {
      this._telemetryProcessors = [];
      var t = new M_appinsights_config_NOTSURE(e);
      this.config = t;
      this.context = new M_default_context_NOTSURE();
      this.commonProperties = {};
      var n = new M_telemetry_uploader_NOTSURE(this.config);
      this.channel = new M_telemetry_batcher_NOTSURE(
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
      this.track(e, M_copilot_utils_NOTSURE.TelemetryType.Availability);
    };
    e.prototype.trackTrace = function (e) {
      this.track(e, M_copilot_utils_NOTSURE.TelemetryType.Trace);
    };
    e.prototype.trackMetric = function (e) {
      this.track(e, M_copilot_utils_NOTSURE.TelemetryType.Metric);
    };
    e.prototype.trackException = function (e) {
      if (e && e.exception && !M_http_util_NOTSURE.isError(e.exception)) {
        e.exception = new Error(e.exception.toString());
      }
      this.track(e, M_copilot_utils_NOTSURE.TelemetryType.Exception);
    };
    e.prototype.trackEvent = function (e) {
      this.track(e, M_copilot_utils_NOTSURE.TelemetryType.Event);
    };
    e.prototype.trackRequest = function (e) {
      this.track(e, M_copilot_utils_NOTSURE.TelemetryType.Request);
    };
    e.prototype.trackDependency = function (e) {
      if (e && !e.target && e.data) {
        e.target = r.parse(e.data).host;
      }
      this.track(e, M_copilot_utils_NOTSURE.TelemetryType.Dependency);
    };
    e.prototype.flush = function (e) {
      this.channel.triggerSend(
        !!e && !!e.isAppCrashing,
        e ? e.callback : undefined
      );
    };
    e.prototype.track = function (e, t) {
      if (e && M_copilot_utils_NOTSURE.telemetryTypeToBaseType(t)) {
        var n = M_telemetry_envelope_NOTSURE.createEnvelope(
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
          M_vscode_languageclient_types_NOTSURE.samplingTelemetryProcessor(n, {
            correlationContext:
              M_correlation_context_manager.CorrelationContextManager.getCurrentContext(),
          });
        M_vscode_languageclient_types_NOTSURE.performanceMetricsTelemetryProcessor(
          n,
          this.quickPulseClient
        );
        if (r) {
          this.channel.send(n);
        }
      } else
        M_logging_NOTSURE.warn(
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
      var n = !0,
        r = this._telemetryProcessors.length;
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
          M_logging_NOTSURE.warn(
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
