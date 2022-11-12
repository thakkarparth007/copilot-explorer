var r = require(3685),
  o = require(5687),
  i = require(5282),
  s = require(5740),
  a = require(9036),
  c = require(6694),
  l = require(894),
  u = require(4350),
  d = function () {
    function e(t) {
      if (e.INSTANCE) throw new Error("Server request tracking should be configured from the applicationInsights object");
      e.INSTANCE = this;
      this._client = t;
    }
    e.prototype.enable = function (e) {
      this._isEnabled = e;
      (this._isAutoCorrelating || this._isEnabled || u.isEnabled()) && !this._isInitialized && (this.useAutoCorrelation(this._isAutoCorrelating), this._initialize());
    };
    e.prototype.useAutoCorrelation = function (e, t) {
      e && !this._isAutoCorrelating ? l.CorrelationContextManager.enable(t) : !e && this._isAutoCorrelating && l.CorrelationContextManager.disable();
      this._isAutoCorrelating = e;
    };
    e.prototype.isInitialized = function () {
      return this._isInitialized;
    };
    e.prototype.isAutoCorrelating = function () {
      return this._isAutoCorrelating;
    };
    e.prototype._generateCorrelationContext = function (e) {
      if (this._isAutoCorrelating) return l.CorrelationContextManager.generateContextObject(e.getOperationId(this._client.context.tags), e.getRequestId(), e.getOperationName(this._client.context.tags), e.getCorrelationContextHeader(), e.getTraceparent(), e.getTracestate());
    };
    e.prototype._initialize = function () {
      var t = this;
      this._isInitialized = !0;
      var n = function (n) {
          if (n) {
            if ("function" != typeof n) throw new Error("onRequest handler must be a function");
            return function (r, o) {
              l.CorrelationContextManager.wrapEmitter(r);
              l.CorrelationContextManager.wrapEmitter(o);
              var i = r && !r[e.alreadyAutoCollectedFlag];
              if (r && i) {
                var s = new c(r),
                  a = t._generateCorrelationContext(s);
                l.CorrelationContextManager.runWithContext(a, function () {
                  t._isEnabled && (r[e.alreadyAutoCollectedFlag] = !0, e.trackRequest(t._client, {
                    request: r,
                    response: o
                  }, s));
                  "function" == typeof n && n(r, o);
                });
              } else "function" == typeof n && n(r, o);
            };
          }
        },
        i = function (e) {
          var t = e.addListener.bind(e);
          e.addListener = function (e, r) {
            switch (e) {
              case "request":
              case "checkContinue":
                return t(e, n(r));
              default:
                return t(e, r);
            }
          };
          e.on = e.addListener;
        },
        s = r.createServer;
      r.createServer = function (e) {
        var t = s(n(e));
        i(t);
        return t;
      };
      var a = o.createServer;
      o.createServer = function (e, t) {
        var r = a(e, n(t));
        i(r);
        return r;
      };
    };
    e.trackRequestSync = function (t, n) {
      if (n.request && n.response && t) {
        e.addResponseCorrelationIdHeader(t, n.response);
        var r = l.CorrelationContextManager.getCurrentContext(),
          o = new c(n.request, r && r.operation.parentId);
        r && (r.operation.id = o.getOperationId(t.context.tags) || r.operation.id, r.operation.name = o.getOperationName(t.context.tags) || r.operation.name, r.operation.parentId = o.getRequestId() || r.operation.parentId, r.customProperties.addHeaderData(o.getCorrelationContextHeader()));
        e.endRequest(t, o, n, n.duration, n.error);
      } else i.info("AutoCollectHttpRequests.trackRequestSync was called with invalid parameters: ", !n.request, !n.response, !t);
    };
    e.trackRequest = function (t, n, r) {
      if (n.request && n.response && t) {
        var o = l.CorrelationContextManager.getCurrentContext(),
          a = r || new c(n.request, o && o.operation.parentId);
        s.canIncludeCorrelationHeader(t, a.getUrl()) && e.addResponseCorrelationIdHeader(t, n.response);
        o && !r && (o.operation.id = a.getOperationId(t.context.tags) || o.operation.id, o.operation.name = a.getOperationName(t.context.tags) || o.operation.name, o.operation.parentId = a.getOperationParentId(t.context.tags) || o.operation.parentId, o.customProperties.addHeaderData(a.getCorrelationContextHeader()));
        n.response.once && n.response.once("finish", function () {
          e.endRequest(t, a, n, null, null);
        });
        n.request.on && n.request.on("error", function (r) {
          e.endRequest(t, a, n, null, r);
        });
      } else i.info("AutoCollectHttpRequests.trackRequest was called with invalid parameters: ", !n.request, !n.response, !t);
    };
    e.addResponseCorrelationIdHeader = function (e, t) {
      if (e.config && e.config.correlationId && t.getHeader && t.setHeader && !t.headersSent) {
        var n = t.getHeader(a.requestContextHeader);
        s.safeIncludeCorrelationHeader(e, t, n);
      }
    };
    e.endRequest = function (e, t, n, r, o) {
      o ? t.onError(o, r) : t.onResponse(n.response, r);
      var i = t.getRequestTelemetry(n);
      i.tagOverrides = t.getRequestTags(e.context.tags);
      if (n.tagOverrides) for (var s in n.tagOverrides) i.tagOverrides[s] = n.tagOverrides[s];
      var a = t.getLegacyRootId();
      a && (i.properties.ai_legacyRootId = a);
      i.contextObjects = i.contextObjects || {};
      i.contextObjects["http.ServerRequest"] = n.request;
      i.contextObjects["http.ServerResponse"] = n.response;
      e.trackRequest(i);
    };
    e.prototype.dispose = function () {
      e.INSTANCE = null;
      this.enable(!1);
      this._isInitialized = !1;
      l.CorrelationContextManager.disable();
      this._isAutoCorrelating = !1;
    };
    e.alreadyAutoCollectedFlag = "_appInsightsAutoCollected";
    return e;
  }();
module.exports = d;