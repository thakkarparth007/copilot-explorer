var r;
var o =
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
  });
var M_url = require("url");
var M_copilot_utils_maybe = require("copilot-utils");
var M_http_util_maybe = require("http-util");
var M_request_context_maybe = require("request_context");
var M_request_parser_maybe = require("request-parser");
var M_app_id_lookup_maybe = require("app-id-lookup");
var d = (function (e) {
  function t(n, r) {
    var o = e.call(this) || this;
    if (r && r.method && n) {
      o.method = r.method;
      o.url = t._getUrlFromRequestOptions(n, r);
      o.startTime = +new Date();
    }
    return o;
  }
  o(t, e);
  t.prototype.onError = function (e) {
    this._setStatus(undefined, e);
  };
  t.prototype.onResponse = function (e) {
    this._setStatus(e.statusCode, undefined);
    this.correlationId = M_http_util_maybe.getCorrelationContextTarget(
      e,
      M_request_context_maybe.requestContextTargetKey
    );
  };
  t.prototype.getDependencyTelemetry = function (e, t) {
    var n = M_url.parse(this.url);
    n.search = undefined;
    n.hash = undefined;
    var r = this.method.toUpperCase() + " " + n.pathname;
    var o = M_copilot_utils_maybe.RemoteDependencyDataConstants.TYPE_HTTP;
    var a = n.hostname;
    if (this.correlationId) {
      o = M_copilot_utils_maybe.RemoteDependencyDataConstants.TYPE_AI;
      if (this.correlationId !== M_app_id_lookup_maybe.correlationIdPrefix) {
        a = n.hostname + " | " + this.correlationId;
      }
    } else {
      o = M_copilot_utils_maybe.RemoteDependencyDataConstants.TYPE_HTTP;
    }
    if (n.port) {
      a += ":" + n.port;
    }
    var c = {
      id: t,
      name: r,
      data: this.url,
      duration: this.duration,
      success: this._isSuccess(),
      resultCode: this.statusCode ? this.statusCode.toString() : null,
      properties: this.properties || {},
      dependencyTypeName: o,
      target: a,
    };
    if (e) {
      for (var l in e)
        if (c[l]) {
          c[l] = e[l];
        }
      if (e.properties)
        for (var l in e.properties) c.properties[l] = e.properties[l];
    }
    return c;
  };
  t._getUrlFromRequestOptions = function (e, t) {
    if ("string" == typeof e) e = M_url.parse(e);
    else {
      var n = e;
      e = {};
      if (n) {
        Object.keys(n).forEach(function (t) {
          e[t] = n[t];
        });
      }
    }
    if (e.path) {
      var r = M_url.parse(e.path);
      e.pathname = r.pathname;
      e.search = r.search;
    }
    if (e.host && e.port && !M_url.parse("http://" + e.host).port && e.port) {
      e.hostname = e.host;
      delete e.host;
    }
    e.protocol = e.protocol || (t.agent && t.agent.protocol) || undefined;
    e.hostname = e.hostname || "localhost";
    return M_url.format(e);
  };
  return t;
})(M_request_parser_maybe);
module.exports = d;
