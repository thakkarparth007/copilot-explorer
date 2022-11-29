var r = require(3685),
  o = require(5687),
  i = require(5282),
  s = require(5740),
  a = require(9036),
  c = require(8339),
  l = require(894),
  u = require(9962),
  d = require(8090),
  p = require(7396),
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
      if (p.IsInitialized) {
        require(7886).wp(e, this._client);
        require(4777).wp(e, this._client);
        require(5071).wp(e, this._client);
        require(1227).wp(e, this._client);
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
            l.CorrelationContextManager.wrapEmitter(n);
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
          p = new c(n.options, n.request),
          h = l.CorrelationContextManager.getCurrentContext();
        if (
          h &&
          h.operation &&
          h.operation.traceparent &&
          d.isValidTraceId(h.operation.traceparent.traceId)
        ) {
          h.operation.traceparent.updateSpanId();
          r = h.operation.traceparent.getBackCompatRequestId();
        } else {
          if (u.w3cEnabled) {
            o = (m = new d()).toString();
            r = m.getBackCompatRequestId();
          } else {
            r =
              h &&
              h.operation &&
              h.operation.parentId + e.requestNumber++ + ".";
          }
        }
        if (
          s.canIncludeCorrelationHeader(t, p.getUrl()) &&
          n.request.getHeader &&
          n.request.setHeader &&
          t.config &&
          t.config.correlationId
        ) {
          var f = n.request.getHeader(a.requestContextHeader);
          try {
            s.safeIncludeCorrelationHeader(t, n.request, f);
          } catch (e) {
            i.warn(
              "Request-Context header could not be set. Correlation of requests may be lost",
              e
            );
          }
          if (h && h.operation)
            try {
              if (
                (n.request.setHeader(a.requestIdHeader, r),
                n.request.setHeader(a.parentIdHeader, h.operation.id),
                n.request.setHeader(a.rootIdHeader, r),
                o || h.operation.traceparent)
              )
                n.request.setHeader(
                  a.traceparentHeader,
                  o || h.operation.traceparent.toString()
                );
              else if (u.w3cEnabled) {
                var m = new d().toString();
                n.request.setHeader(a.traceparentHeader, m);
              }
              if (h.operation.tracestate) {
                var g = h.operation.tracestate.toString();
                g && n.request.setHeader(a.traceStateHeader, g);
              }
              var _ = h.customProperties.serializeToHeader();
              _ && n.request.setHeader(a.correlationContextHeader, _);
            } catch (e) {
              i.warn(
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
        i.info(
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
