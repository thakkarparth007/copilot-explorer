var r =
    (this && this.__assign) ||
    Object.assign ||
    function (e) {
      for (var t, n = 1, r = arguments.length; n < r; n++)
        for (var o in (t = arguments[n]))
          if (Object.prototype.hasOwnProperty.call(t, o)) {
            e[o] = t[o];
          }
      return e;
    },
  o = require("os"),
  i = require(5290),
  s = require(3580),
  a = require(5740),
  c = require(5282),
  l = a.w3cTraceId(),
  u = (function () {
    function e() {}
    e.createQuickPulseEnvelope = function (e, t, n, r) {
      var i =
          (o && "function" == typeof o.hostname && o.hostname()) || "Unknown",
        s =
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
        case i.TelemetryTypeString.Event:
          return e.createQuickPulseEventDocument(t);
        case i.TelemetryTypeString.Exception:
          return e.createQuickPulseExceptionDocument(t);
        case i.TelemetryTypeString.Trace:
          return e.createQuickPulseTraceDocument(t);
        case i.TelemetryTypeString.Dependency:
          return e.createQuickPulseDependencyDocument(t);
        case i.TelemetryTypeString.Request:
          return e.createQuickPulseRequestDocument(t);
      }
      return null;
    };
    e.createQuickPulseEventDocument = function (t) {
      var n = e.createQuickPulseDocument(t),
        o = t.data.baseData.name;
      return r({}, n, {
        Name: o,
      });
    };
    e.createQuickPulseTraceDocument = function (t) {
      var n = e.createQuickPulseDocument(t),
        o = t.data.baseData.severityLevel || 0;
      return r({}, n, {
        Message: t.data.baseData.message,
        SeverityLevel: i.SeverityLevel[o],
      });
    };
    e.createQuickPulseExceptionDocument = function (t) {
      var n = e.createQuickPulseDocument(t),
        o = t.data.baseData.exceptions,
        i = "",
        s = "",
        a = "";
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
      var n = e.createQuickPulseDocument(t),
        o = t.data.baseData;
      return r({}, n, {
        Name: o.name,
        Success: o.success,
        Duration: o.duration,
        ResponseCode: o.responseCode,
        OperationName: o.name,
      });
    };
    e.createQuickPulseDependencyDocument = function (t) {
      var n = e.createQuickPulseDocument(t),
        o = t.data.baseData;
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
      var n, r;
      if (t.data.baseType) {
        r = s.TelemetryTypeStringToQuickPulseType[t.data.baseType];
        n = s.TelemetryTypeStringToQuickPulseDocumentType[t.data.baseType];
      } else {
        c.warn(
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
      var t = [],
        n = e.data.baseData.measurements || {};
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
    e.keys = new i.ContextTagKeys();
    return e;
  })();
module.exports = u;