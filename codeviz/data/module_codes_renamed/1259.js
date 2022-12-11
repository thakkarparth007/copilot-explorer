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
var M_telemetry_maybe = require("telemetry");
var M_server_request_tracker_maybe = require("server-request-tracker");
var M_request_tracker_maybe = require("request-tracker");
var M_logging_maybe = require("logging");
var l = (function (e) {
  function t() {
    return (null !== e && e.apply(this, arguments)) || this;
  }
  o(t, e);
  t.prototype.trackNodeHttpRequestSync = function (e) {
    if (e && e.request && e.response && e.duration) {
      M_server_request_tracker_maybe.trackRequestSync(this, e);
    } else {
      M_logging_maybe.warn(
        "trackNodeHttpRequestSync requires NodeHttpRequestTelemetry object with request, response and duration specified."
      );
    }
  };
  t.prototype.trackNodeHttpRequest = function (e) {
    if (e.duration || e.error) {
      M_logging_maybe.warn(
        "trackNodeHttpRequest will ignore supplied duration and error parameters. These values are collected from the request and response objects."
      );
    }
    if (e && e.request && e.response) {
      M_server_request_tracker_maybe.trackRequest(this, e);
    } else {
      M_logging_maybe.warn(
        "trackNodeHttpRequest requires NodeHttpRequestTelemetry object with request and response specified."
      );
    }
  };
  t.prototype.trackNodeHttpDependency = function (e) {
    if (e && e.request) {
      M_request_tracker_maybe.trackRequest(this, e);
    } else {
      M_logging_maybe.warn(
        "trackNodeHttpDependency requires NodeHttpDependencyTelemetry object with request specified."
      );
    }
  };
  return t;
})(M_telemetry_maybe);
module.exports = l;
