var r =
  (this && this.__assign) ||
  Object.assign ||
  function (e) {
    for (n = 1, r = arguments.length, undefined; n < r; n++) {
      var t;
      var n;
      var r;
      for (var o in (t = arguments[n]))
        if (Object.prototype.hasOwnProperty.call(t, o)) {
          e[o] = t[o];
        }
    }
    return e;
  };
var M_os = require("os");
var M_copilot_utils_maybe = require("copilot-utils");
var M_quickpulse_constants_maybe = require("quickpulse-constants");
var M_http_util_maybe = require("http-util");
var M_logging_maybe = require("logging");
var l = M_http_util_maybe.w3cTraceId();
var u = (function () {
  function e() {}
  e.createQuickPulseEnvelope = function (e, t, n, r) {
    var i =
      (M_os && "function" == typeof M_os.hostname && M_os.hostname()) ||
      "Unknown";
    var s =
      (r.tags &&
        r.keys &&
        r.keys.cloudRoleInstance &&
        r.tags[r.keys.cloudRoleInstance]) ||
      i;
    return {
      Documents: t.length > 0 ? t : null,
      InstrumentationKey: n.instrumentationKey || "",
      Metrics: e.length > 0 ? e : null,
      InvariantVersion: 1,
      Timestamp: "/Date(" + Date.now() + ")/",
      Version: r.tags[r.keys.internalSdkVersion],
      StreamId: l,
      MachineName: i,
      Instance: s,
    };
  };
  e.createQuickPulseMetric = function (e) {
    return {
      Name: e.name,
      Value: e.value,
      Weight: e.count || 1,
    };
  };
  e.telemetryEnvelopeToQuickPulseDocument = function (t) {
    switch (t.data.baseType) {
      case M_copilot_utils_maybe.TelemetryTypeString.Event:
        return e.createQuickPulseEventDocument(t);
      case M_copilot_utils_maybe.TelemetryTypeString.Exception:
        return e.createQuickPulseExceptionDocument(t);
      case M_copilot_utils_maybe.TelemetryTypeString.Trace:
        return e.createQuickPulseTraceDocument(t);
      case M_copilot_utils_maybe.TelemetryTypeString.Dependency:
        return e.createQuickPulseDependencyDocument(t);
      case M_copilot_utils_maybe.TelemetryTypeString.Request:
        return e.createQuickPulseRequestDocument(t);
    }
    return null;
  };
  e.createQuickPulseEventDocument = function (t) {
    var n = e.createQuickPulseDocument(t);
    var o = t.data.baseData.name;
    return r({}, n, {
      Name: o,
    });
  };
  e.createQuickPulseTraceDocument = function (t) {
    var n = e.createQuickPulseDocument(t);
    var o = t.data.baseData.severityLevel || 0;
    return r({}, n, {
      Message: t.data.baseData.message,
      SeverityLevel: M_copilot_utils_maybe.SeverityLevel[o],
    });
  };
  e.createQuickPulseExceptionDocument = function (t) {
    var n = e.createQuickPulseDocument(t);
    var o = t.data.baseData.exceptions;
    var i = "";
    var s = "";
    var a = "";
    if (o && o.length > 0) {
      if (o[0].parsedStack && o[0].parsedStack.length > 0) {
        o[0].parsedStack.forEach(function (e) {
          i += e.assembly + "\n";
        });
      } else {
        if (o[0].stack && o[0].stack.length > 0) {
          i = o[0].stack;
        }
      }
      s = o[0].message;
      a = o[0].typeName;
    }
    return r({}, n, {
      Exception: i,
      ExceptionMessage: s,
      ExceptionType: a,
    });
  };
  e.createQuickPulseRequestDocument = function (t) {
    var n = e.createQuickPulseDocument(t);
    var o = t.data.baseData;
    return r({}, n, {
      Name: o.name,
      Success: o.success,
      Duration: o.duration,
      ResponseCode: o.responseCode,
      OperationName: o.name,
    });
  };
  e.createQuickPulseDependencyDocument = function (t) {
    var n = e.createQuickPulseDocument(t);
    var o = t.data.baseData;
    return r({}, n, {
      Name: o.name,
      Target: o.target,
      Success: o.success,
      Duration: o.duration,
      ResultCode: o.resultCode,
      CommandName: o.data,
      OperationName: n.OperationId,
      DependencyTypeName: o.type,
    });
  };
  e.createQuickPulseDocument = function (t) {
    var n;
    var r;
    if (t.data.baseType) {
      r =
        M_quickpulse_constants_maybe.TelemetryTypeStringToQuickPulseType[
          t.data.baseType
        ];
      n =
        M_quickpulse_constants_maybe
          .TelemetryTypeStringToQuickPulseDocumentType[t.data.baseType];
    } else {
      M_logging_maybe.warn(
        "Document type invalid; not sending live metric document",
        t.data.baseType
      );
    }
    return {
      DocumentType: n,
      __type: r,
      OperationId: t.tags[e.keys.operationId],
      Version: "1.0",
      Properties: e.aggregateProperties(t),
    };
  };
  e.aggregateProperties = function (e) {
    var t = [];
    var n = e.data.baseData.measurements || {};
    for (var r in n)
      if (n.hasOwnProperty(r)) {
        var o = {
          key: r,
          value: n[r],
        };
        t.push(o);
      }
    var i = e.data.baseData.properties || {};
    for (var r in i)
      if (i.hasOwnProperty(r)) {
        o = {
          key: r,
          value: i[r],
        };
        t.push(o);
      }
    return t;
  };
  e.keys = new M_copilot_utils_maybe.ContextTagKeys();
  return e;
})();
module.exports = u;
