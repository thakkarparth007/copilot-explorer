var M_http = require("http");
var M_https = require("https");
var M_logging_maybe = require("logging");
var M_http_util_maybe = require("http-util");
var M_request_context_maybe = require("request_context");
var M_http_request_tracker_maybe = require("http-request-tracker");
var M_correlation_context_manager = require("correlation-context-manager");
var M_app_id_lookup_maybe = require("app-id-lookup");
var M_trace_id_maybe = require("trace-id");
var M_diagnostic_channel_maybe = require("diagnostic-channel");
var h = (function () {
  function e(t) {
    if (e.INSTANCE)
      throw new Error(
        "Client request tracking should be configured from the applicationInsights object"
      );
    e.INSTANCE = this;
    this._client = t;
  }
  e.prototype.enable = function (e) {
    this._isEnabled = e;
    if (this._isEnabled && !this._isInitialized) {
      this._initialize();
    }
    if (M_diagnostic_channel_maybe.IsInitialized) {
      require("mongodb-telemetry-stuff").wp(e, this._client);
      require("mysql-telemetry-stuff").wp(e, this._client);
      require("redis-telemetry-stuff").wp(e, this._client);
      require("appinsights-postgres-telemetry").wp(e, this._client);
    }
  };
  e.prototype.isInitialized = function () {
    return this._isInitialized;
  };
  e.prototype._initialize = function () {
    var t = this;
    this._isInitialized = !0;
    M_http.get;
    var n = M_http.request;
    var i = M_https.request;
    var s = function (n, r) {
      var o =
        !r[e.disableCollectionRequestOption] && !n[e.alreadyAutoCollectedFlag];
      n[e.alreadyAutoCollectedFlag] = !0;
      if (n && r && o) {
        M_correlation_context_manager.CorrelationContextManager.wrapEmitter(n);
        e.trackRequest(t._client, {
          options: r,
          request: n,
        });
      }
    };
    M_http.request = function (e) {
      for (t = [], o = 1, undefined; o < arguments.length; o++) {
        var t;
        var o;
        t[o - 1] = arguments[o];
      }
      var i = n.call.apply(n, [M_http, e].concat(t));
      s(i, e);
      return i;
    };
    M_https.request = function (e) {
      for (t = [], n = 1, undefined; n < arguments.length; n++) {
        var t;
        var n;
        t[n - 1] = arguments[n];
      }
      var r = i.call.apply(i, [M_https, e].concat(t));
      s(r, e);
      return r;
    };
    M_http.get = function (e) {
      for (t = [], n = 1, undefined; n < arguments.length; n++) {
        var t;
        var n;
        t[n - 1] = arguments[n];
      }
      var o;
      var i = (o = M_http.request).call.apply(o, [M_http, e].concat(t));
      i.end();
      return i;
    };
    M_https.get = function (e) {
      for (t = [], n = 1, undefined; n < arguments.length; n++) {
        var t;
        var n;
        t[n - 1] = arguments[n];
      }
      var r;
      var i = (r = M_https.request).call.apply(r, [M_https, e].concat(t));
      i.end();
      return i;
    };
  };
  e.trackRequest = function (t, n) {
    if (n.options && n.request && t) {
      var r;
      var o;
      var p = new M_http_request_tracker_maybe(n.options, n.request);
      var h =
        M_correlation_context_manager.CorrelationContextManager.getCurrentContext();
      if (
        h &&
        h.operation &&
        h.operation.traceparent &&
        M_trace_id_maybe.isValidTraceId(h.operation.traceparent.traceId)
      ) {
        h.operation.traceparent.updateSpanId();
        r = h.operation.traceparent.getBackCompatRequestId();
      } else {
        if (M_app_id_lookup_maybe.w3cEnabled) {
          o = (m = new M_trace_id_maybe()).toString();
          r = m.getBackCompatRequestId();
        } else {
          r =
            h && h.operation && h.operation.parentId + e.requestNumber++ + ".";
        }
      }
      if (
        M_http_util_maybe.canIncludeCorrelationHeader(t, p.getUrl()) &&
        n.request.getHeader &&
        n.request.setHeader &&
        t.config &&
        t.config.correlationId
      ) {
        var f = n.request.getHeader(
          M_request_context_maybe.requestContextHeader
        );
        try {
          M_http_util_maybe.safeIncludeCorrelationHeader(t, n.request, f);
        } catch (e) {
          M_logging_maybe.warn(
            "Request-Context header could not be set. Correlation of requests may be lost",
            e
          );
        }
        if (h && h.operation)
          try {
            if (
              (n.request.setHeader(M_request_context_maybe.requestIdHeader, r),
              n.request.setHeader(
                M_request_context_maybe.parentIdHeader,
                h.operation.id
              ),
              n.request.setHeader(M_request_context_maybe.rootIdHeader, r),
              o || h.operation.traceparent)
            )
              n.request.setHeader(
                M_request_context_maybe.traceparentHeader,
                o || h.operation.traceparent.toString()
              );
            else if (M_app_id_lookup_maybe.w3cEnabled) {
              var m = new M_trace_id_maybe().toString();
              n.request.setHeader(M_request_context_maybe.traceparentHeader, m);
            }
            if (h.operation.tracestate) {
              var g = h.operation.tracestate.toString();
              g &&
                n.request.setHeader(
                  M_request_context_maybe.traceStateHeader,
                  g
                );
            }
            var _ = h.customProperties.serializeToHeader();
            _ &&
              n.request.setHeader(
                M_request_context_maybe.correlationContextHeader,
                _
              );
          } catch (e) {
            M_logging_maybe.warn(
              "Correlation headers could not be set. Correlation of requests may be lost.",
              e
            );
          }
      }
      if (n.request.on) {
        n.request.on("response", function (e) {
          p.onResponse(e);
          var o = p.getDependencyTelemetry(n, r);
          o.contextObjects = o.contextObjects || {};
          o.contextObjects["http.RequestOptions"] = n.options;
          o.contextObjects["http.ClientRequest"] = n.request;
          o.contextObjects["http.ClientResponse"] = e;
          t.trackDependency(o);
        });
        n.request.on("error", function (e) {
          p.onError(e);
          var o = p.getDependencyTelemetry(n, r);
          o.contextObjects = o.contextObjects || {};
          o.contextObjects["http.RequestOptions"] = n.options;
          o.contextObjects["http.ClientRequest"] = n.request;
          o.contextObjects.Error = e;
          t.trackDependency(o);
        });
      }
    } else
      M_logging_maybe.info(
        "AutoCollectHttpDependencies.trackRequest was called with invalid parameters: ",
        !n.options,
        !n.request,
        !t
      );
  };
  e.prototype.dispose = function () {
    e.INSTANCE = null;
    this.enable(!1);
    this._isInitialized = !1;
  };
  e.disableCollectionRequestOption = "disableAppInsightsAutoCollection";
  e.requestNumber = 1;
  e.alreadyAutoCollectedFlag = "_appInsightsAutoCollected";
  return e;
})();
module.exports = h;
