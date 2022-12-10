var r = require("http"),
  o = require("https"),
  M_logging_NOTSURE = require("logging"),
  M_http_util_NOTSURE = require("http-util"),
  M_request_context_NOTSURE = require("request_context"),
  M_http_request_tracker_NOTSURE = require("http-request-tracker"),
  M_correlation_context_manager = require("correlation-context-manager"),
  M_app_id_lookup_NOTSURE = require("app-id-lookup"),
  M_trace_id_NOTSURE = require("trace-id"),
  M_diagnostic_channel_NOTSURE = require("diagnostic-channel"),
  h = (function () {
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
      if (M_diagnostic_channel_NOTSURE.IsInitialized) {
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
      r.get;
      var n = r.request,
        i = o.request,
        s = function (n, r) {
          var o =
            !r[e.disableCollectionRequestOption] &&
            !n[e.alreadyAutoCollectedFlag];
          n[e.alreadyAutoCollectedFlag] = !0;
          if (n && r && o) {
            M_correlation_context_manager.CorrelationContextManager.wrapEmitter(
              n
            );
            e.trackRequest(t._client, {
              options: r,
              request: n,
            });
          }
        };
      r.request = function (e) {
        for (var t = [], o = 1; o < arguments.length; o++)
          t[o - 1] = arguments[o];
        var i = n.call.apply(n, [r, e].concat(t));
        s(i, e);
        return i;
      };
      o.request = function (e) {
        for (var t = [], n = 1; n < arguments.length; n++)
          t[n - 1] = arguments[n];
        var r = i.call.apply(i, [o, e].concat(t));
        s(r, e);
        return r;
      };
      r.get = function (e) {
        for (var t = [], n = 1; n < arguments.length; n++)
          t[n - 1] = arguments[n];
        var o,
          i = (o = r.request).call.apply(o, [r, e].concat(t));
        i.end();
        return i;
      };
      o.get = function (e) {
        for (var t = [], n = 1; n < arguments.length; n++)
          t[n - 1] = arguments[n];
        var r,
          i = (r = o.request).call.apply(r, [o, e].concat(t));
        i.end();
        return i;
      };
    };
    e.trackRequest = function (t, n) {
      if (n.options && n.request && t) {
        var r,
          o,
          p = new M_http_request_tracker_NOTSURE(n.options, n.request),
          h =
            M_correlation_context_manager.CorrelationContextManager.getCurrentContext();
        if (
          h &&
          h.operation &&
          h.operation.traceparent &&
          M_trace_id_NOTSURE.isValidTraceId(h.operation.traceparent.traceId)
        ) {
          h.operation.traceparent.updateSpanId();
          r = h.operation.traceparent.getBackCompatRequestId();
        } else {
          if (M_app_id_lookup_NOTSURE.w3cEnabled) {
            o = (m = new M_trace_id_NOTSURE()).toString();
            r = m.getBackCompatRequestId();
          } else {
            r =
              h &&
              h.operation &&
              h.operation.parentId + e.requestNumber++ + ".";
          }
        }
        if (
          M_http_util_NOTSURE.canIncludeCorrelationHeader(t, p.getUrl()) &&
          n.request.getHeader &&
          n.request.setHeader &&
          t.config &&
          t.config.correlationId
        ) {
          var f = n.request.getHeader(
            M_request_context_NOTSURE.requestContextHeader
          );
          try {
            M_http_util_NOTSURE.safeIncludeCorrelationHeader(t, n.request, f);
          } catch (e) {
            M_logging_NOTSURE.warn(
              "Request-Context header could not be set. Correlation of requests may be lost",
              e
            );
          }
          if (h && h.operation)
            try {
              if (
                (n.request.setHeader(
                  M_request_context_NOTSURE.requestIdHeader,
                  r
                ),
                n.request.setHeader(
                  M_request_context_NOTSURE.parentIdHeader,
                  h.operation.id
                ),
                n.request.setHeader(M_request_context_NOTSURE.rootIdHeader, r),
                o || h.operation.traceparent)
              )
                n.request.setHeader(
                  M_request_context_NOTSURE.traceparentHeader,
                  o || h.operation.traceparent.toString()
                );
              else if (M_app_id_lookup_NOTSURE.w3cEnabled) {
                var m = new M_trace_id_NOTSURE().toString();
                n.request.setHeader(
                  M_request_context_NOTSURE.traceparentHeader,
                  m
                );
              }
              if (h.operation.tracestate) {
                var g = h.operation.tracestate.toString();
                g &&
                  n.request.setHeader(
                    M_request_context_NOTSURE.traceStateHeader,
                    g
                  );
              }
              var _ = h.customProperties.serializeToHeader();
              _ &&
                n.request.setHeader(
                  M_request_context_NOTSURE.correlationContextHeader,
                  _
                );
            } catch (e) {
              M_logging_NOTSURE.warn(
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
        M_logging_NOTSURE.info(
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
