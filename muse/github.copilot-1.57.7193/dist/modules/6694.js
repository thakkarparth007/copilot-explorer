var r,
  o =
    (this && this.__extends) ||
    ((r =
      Object.setPrototypeOf ||
      ({
        __proto__: [],
      } instanceof Array &&
        function (e, t) {
          e.__proto__ = t;
        }) ||
      function (e, t) {
        for (var n in t)
          if (t.hasOwnProperty(n)) {
            e[n] = t[n];
          }
      }),
    function (e, t) {
      function n() {
        this.constructor = e;
      }
      r(e, t);
      e.prototype =
        null === t ? Object.create(t) : ((n.prototype = t.prototype), new n());
    }),
  i = require("url"),
  s = require(5290),
  a = require(5740),
  c = require(9036),
  l = require(3054),
  u = require(9962),
  d = require(1974),
  p = require(8090),
  h = (function (e) {
    function t(t, n) {
      var r = e.call(this) || this;
      if (t) {
        r.method = t.method;
        r.url = r._getAbsoluteUrl(t);
        r.startTime = +new Date();
        r.socketRemoteAddress = t.socket && t.socket.remoteAddress;
        r.parseHeaders(t, n);
        if (t.connection) {
          r.connectionRemoteAddress = t.connection.remoteAddress;
          r.legacySocketRemoteAddress =
            t.connection.socket && t.connection.socket.remoteAddress;
        }
      }
      return r;
    }
    o(t, e);
    t.prototype.onError = function (e, t) {
      this._setStatus(undefined, e);
      if (t) {
        this.duration = t;
      }
    };
    t.prototype.onResponse = function (e, t) {
      this._setStatus(e.statusCode, undefined);
      if (t) {
        this.duration = t;
      }
    };
    t.prototype.getRequestTelemetry = function (e) {
      var t = {
        id: this.requestId,
        name: this.method + " " + i.parse(this.url).pathname,
        url: this.url,
        source: this.sourceCorrelationId,
        duration: this.duration,
        resultCode: this.statusCode ? this.statusCode.toString() : null,
        success: this._isSuccess(),
        properties: this.properties,
      };
      if (e) {
        for (var n in e)
          if (t[n]) {
            t[n] = e[n];
          }
        if (e.properties)
          for (var n in e.properties) t.properties[n] = e.properties[n];
      }
      return t;
    };
    t.prototype.getRequestTags = function (e) {
      var n = {};
      for (var r in e) n[r] = e[r];
      n[t.keys.locationIp] = e[t.keys.locationIp] || this._getIp();
      n[t.keys.sessionId] = e[t.keys.sessionId] || this._getId("ai_session");
      n[t.keys.userId] = e[t.keys.userId] || this._getId("ai_user");
      n[t.keys.userAuthUserId] =
        e[t.keys.userAuthUserId] || this._getId("ai_authUser");
      n[t.keys.operationName] = this.getOperationName(e);
      n[t.keys.operationParentId] = this.getOperationParentId(e);
      n[t.keys.operationId] = this.getOperationId(e);
      return n;
    };
    t.prototype.getOperationId = function (e) {
      return e[t.keys.operationId] || this.operationId;
    };
    t.prototype.getOperationParentId = function (e) {
      return (
        e[t.keys.operationParentId] || this.parentId || this.getOperationId(e)
      );
    };
    t.prototype.getOperationName = function (e) {
      return (
        e[t.keys.operationName] ||
        this.method + " " + i.parse(this.url).pathname
      );
    };
    t.prototype.getRequestId = function () {
      return this.requestId;
    };
    t.prototype.getCorrelationContextHeader = function () {
      return this.correlationContextHeader;
    };
    t.prototype.getTraceparent = function () {
      return this.traceparent;
    };
    t.prototype.getTracestate = function () {
      return this.tracestate;
    };
    t.prototype.getLegacyRootId = function () {
      return this.legacyRootId;
    };
    t.prototype._getAbsoluteUrl = function (e) {
      if (!e.headers) return e.url;
      var t = e.connection ? e.connection.encrypted : null,
        n = i.parse(e.url),
        r = n.pathname,
        o = n.search;
      return i.format({
        protocol: t ? "https" : "http",
        host: e.headers.host,
        pathname: r,
        search: o,
      });
    };
    t.prototype._getIp = function () {
      var e = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/,
        t = function (t) {
          var n = e.exec(t);
          if (n) return n[0];
        },
        n =
          t(this.rawHeaders["x-forwarded-for"]) ||
          t(this.rawHeaders["x-client-ip"]) ||
          t(this.rawHeaders["x-real-ip"]) ||
          t(this.connectionRemoteAddress) ||
          t(this.socketRemoteAddress) ||
          t(this.legacySocketRemoteAddress);
      if (
        !n &&
        this.connectionRemoteAddress &&
        this.connectionRemoteAddress.substr &&
        "::" === this.connectionRemoteAddress.substr(0, 2)
      ) {
        n = "127.0.0.1";
      }
      return n;
    };
    t.prototype._getId = function (e) {
      var n =
        (this.rawHeaders &&
          this.rawHeaders.cookie &&
          "string" == typeof this.rawHeaders.cookie &&
          this.rawHeaders.cookie) ||
        "";
      return t.parseId(a.getCookie(e, n));
    };
    t.prototype.setBackCompatFromThisTraceContext = function () {
      this.operationId = this.traceparent.traceId;
      if (this.traceparent.legacyRootId) {
        this.legacyRootId = this.traceparent.legacyRootId;
      }
      this.parentId = this.traceparent.parentId;
      this.traceparent.updateSpanId();
      this.requestId = this.traceparent.getBackCompatRequestId();
    };
    t.prototype.parseHeaders = function (e, t) {
      this.rawHeaders = e.headers || e.rawHeaders;
      this.userAgent = e.headers && e.headers["user-agent"];
      this.sourceCorrelationId = a.getCorrelationContextTarget(
        e,
        c.requestContextSourceKey
      );
      if (e.headers) {
        var n = e.headers[c.traceStateHeader],
          r = e.headers[c.traceparentHeader],
          o = e.headers[c.requestIdHeader],
          i = e.headers[c.parentIdHeader],
          s = e.headers[c.rootIdHeader];
        (this.correlationContextHeader = e.headers[c.correlationContextHeader]),
          u.w3cEnabled && (r || n)
            ? ((this.traceparent = new p(r)),
              (this.tracestate = r && n && new d(n)),
              this.setBackCompatFromThisTraceContext())
            : o
            ? u.w3cEnabled
              ? ((this.traceparent = new p(null, o)),
                this.setBackCompatFromThisTraceContext())
              : ((this.parentId = o),
                (this.requestId = u.generateRequestId(this.parentId)),
                (this.operationId = u.getRootId(this.requestId)))
            : u.w3cEnabled
            ? ((this.traceparent = new p()),
              (this.traceparent.parentId = i),
              (this.traceparent.legacyRootId = s || i),
              this.setBackCompatFromThisTraceContext())
            : ((this.parentId = i),
              (this.requestId = u.generateRequestId(s || this.parentId)),
              (this.correlationContextHeader = null),
              (this.operationId = u.getRootId(this.requestId))),
          t &&
            ((this.requestId = t),
            (this.operationId = u.getRootId(this.requestId)));
      }
    };
    t.parseId = function (e) {
      var t = e.split("|");
      return t.length > 0 ? t[0] : "";
    };
    t.keys = new s.ContextTagKeys();
    return t;
  })(l);
module.exports = h;