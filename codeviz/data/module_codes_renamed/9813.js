var M_copilot_utils_maybe = require("copilot-utils");
var M_http_util_maybe = require("http-util");
var M_correlation_context_manager = require("correlation-context-manager");
var s = (function () {
  function e() {}
  e.createEnvelope = function (t, n, i, s, a) {
    var c = null;
    switch (n) {
      case M_copilot_utils_maybe.TelemetryType.Trace:
        c = e.createTraceData(t);
        break;
      case M_copilot_utils_maybe.TelemetryType.Dependency:
        c = e.createDependencyData(t);
        break;
      case M_copilot_utils_maybe.TelemetryType.Event:
        c = e.createEventData(t);
        break;
      case M_copilot_utils_maybe.TelemetryType.Exception:
        c = e.createExceptionData(t);
        break;
      case M_copilot_utils_maybe.TelemetryType.Request:
        c = e.createRequestData(t);
        break;
      case M_copilot_utils_maybe.TelemetryType.Metric:
        c = e.createMetricData(t);
        break;
      case M_copilot_utils_maybe.TelemetryType.Availability:
        c = e.createAvailabilityData(t);
    }
    if (i && M_copilot_utils_maybe.domainSupportsProperties(c.baseData)) {
      if (c && c.baseData)
        if (c.baseData.properties) {
          for (var l in i)
            if (c.baseData.properties[l]) {
              c.baseData.properties[l] = i[l];
            }
        } else c.baseData.properties = i;
      c.baseData.properties = M_http_util_maybe.validateStringMap(
        c.baseData.properties
      );
    }
    var u = (a && a.instrumentationKey) || "";
    var d = new M_copilot_utils_maybe.Envelope();
    d.data = c;
    d.iKey = u;
    d.name =
      "Microsoft.ApplicationInsights." +
      u.replace(/-/g, "") +
      "." +
      c.baseType.substr(0, c.baseType.length - 4);
    d.tags = this.getTags(s, t.tagOverrides);
    d.time = new Date().toISOString();
    d.ver = 1;
    d.sampleRate = a ? a.samplingPercentage : 100;
    if (n === M_copilot_utils_maybe.TelemetryType.Metric) {
      d.sampleRate = 100;
    }
    return d;
  };
  e.createTraceData = function (e) {
    var t = new M_copilot_utils_maybe.MessageData();
    t.message = e.message;
    t.properties = e.properties;
    if (isNaN(e.severity)) {
      t.severityLevel = M_copilot_utils_maybe.SeverityLevel.Information;
    } else {
      t.severityLevel = e.severity;
    }
    var n = new M_copilot_utils_maybe.Data();
    n.baseType = M_copilot_utils_maybe.telemetryTypeToBaseType(
      M_copilot_utils_maybe.TelemetryType.Trace
    );
    n.baseData = t;
    return n;
  };
  e.createDependencyData = function (e) {
    var t = new M_copilot_utils_maybe.RemoteDependencyData();
    if ("string" == typeof e.name) {
      t.name = e.name.length > 1024 ? e.name.slice(0, 1021) + "..." : e.name;
    }
    t.data = e.data;
    t.target = e.target;
    t.duration = M_http_util_maybe.msToTimeSpan(e.duration);
    t.success = e.success;
    t.type = e.dependencyTypeName;
    t.properties = e.properties;
    t.resultCode = e.resultCode ? e.resultCode + "" : "";
    if (e.id) {
      t.id = e.id;
    } else {
      t.id = M_http_util_maybe.w3cTraceId();
    }
    var n = new M_copilot_utils_maybe.Data();
    n.baseType = M_copilot_utils_maybe.telemetryTypeToBaseType(
      M_copilot_utils_maybe.TelemetryType.Dependency
    );
    n.baseData = t;
    return n;
  };
  e.createEventData = function (e) {
    var t = new M_copilot_utils_maybe.EventData();
    t.name = e.name;
    t.properties = e.properties;
    t.measurements = e.measurements;
    var n = new M_copilot_utils_maybe.Data();
    n.baseType = M_copilot_utils_maybe.telemetryTypeToBaseType(
      M_copilot_utils_maybe.TelemetryType.Event
    );
    n.baseData = t;
    return n;
  };
  e.createExceptionData = function (e) {
    var t = new M_copilot_utils_maybe.ExceptionData();
    t.properties = e.properties;
    if (isNaN(e.severity)) {
      t.severityLevel = M_copilot_utils_maybe.SeverityLevel.Error;
    } else {
      t.severityLevel = e.severity;
    }
    t.measurements = e.measurements;
    t.exceptions = [];
    var n = e.exception.stack;
    var i = new M_copilot_utils_maybe.ExceptionDetails();
    i.message = e.exception.message;
    i.typeName = e.exception.name;
    i.parsedStack = this.parseStack(n);
    i.hasFullStack =
      M_http_util_maybe.isArray(i.parsedStack) && i.parsedStack.length > 0;
    t.exceptions.push(i);
    var s = new M_copilot_utils_maybe.Data();
    s.baseType = M_copilot_utils_maybe.telemetryTypeToBaseType(
      M_copilot_utils_maybe.TelemetryType.Exception
    );
    s.baseData = t;
    return s;
  };
  e.createRequestData = function (e) {
    var t = new M_copilot_utils_maybe.RequestData();
    if (e.id) {
      t.id = e.id;
    } else {
      t.id = M_http_util_maybe.w3cTraceId();
    }
    t.name = e.name;
    t.url = e.url;
    t.source = e.source;
    t.duration = M_http_util_maybe.msToTimeSpan(e.duration);
    t.responseCode = e.resultCode ? e.resultCode + "" : "";
    t.success = e.success;
    t.properties = e.properties;
    var n = new M_copilot_utils_maybe.Data();
    n.baseType = M_copilot_utils_maybe.telemetryTypeToBaseType(
      M_copilot_utils_maybe.TelemetryType.Request
    );
    n.baseData = t;
    return n;
  };
  e.createMetricData = function (e) {
    var t = new M_copilot_utils_maybe.MetricData();
    t.metrics = [];
    var n = new M_copilot_utils_maybe.DataPoint();
    n.count = isNaN(e.count) ? 1 : e.count;
    n.kind = M_copilot_utils_maybe.DataPointType.Aggregation;
    n.max = isNaN(e.max) ? e.value : e.max;
    n.min = isNaN(e.min) ? e.value : e.min;
    n.name = e.name;
    n.stdDev = isNaN(e.stdDev) ? 0 : e.stdDev;
    n.value = e.value;
    t.metrics.push(n);
    t.properties = e.properties;
    var o = new M_copilot_utils_maybe.Data();
    o.baseType = M_copilot_utils_maybe.telemetryTypeToBaseType(
      M_copilot_utils_maybe.TelemetryType.Metric
    );
    o.baseData = t;
    return o;
  };
  e.createAvailabilityData = function (e) {
    var t = new M_copilot_utils_maybe.AvailabilityData();
    if (e.id) {
      t.id = e.id;
    } else {
      t.id = M_http_util_maybe.w3cTraceId();
    }
    t.name = e.name;
    t.duration = M_http_util_maybe.msToTimeSpan(e.duration);
    t.success = e.success;
    t.runLocation = e.runLocation;
    t.message = e.message;
    t.measurements = e.measurements;
    t.properties = e.properties;
    var n = new M_copilot_utils_maybe.Data();
    n.baseType = M_copilot_utils_maybe.telemetryTypeToBaseType(
      M_copilot_utils_maybe.TelemetryType.Availability
    );
    n.baseData = t;
    return n;
  };
  e.getTags = function (e, t) {
    var n =
      M_correlation_context_manager.CorrelationContextManager.getCurrentContext();
    var r = {};
    if (e && e.tags) for (var o in e.tags) r[o] = e.tags[o];
    if (t) for (var o in t) r[o] = t[o];
    if (n) {
      r[e.keys.operationId] = r[e.keys.operationId] || n.operation.id;
      r[e.keys.operationName] = r[e.keys.operationName] || n.operation.name;
      r[e.keys.operationParentId] =
        r[e.keys.operationParentId] || n.operation.parentId;
    }
    return r;
  };
  e.parseStack = function (e) {
    var t = undefined;
    if ("string" == typeof e) {
      var n = e.split("\n");
      t = [];
      for (r = 0, o = 0, i = 0, undefined; i <= n.length; i++) {
        var r;
        var o;
        var i;
        var s = n[i];
        if (a.regex.test(s)) {
          var c = new a(n[i], r++);
          o += c.sizeInBytes;
          t.push(c);
        }
      }
      if (o > 32768)
        for (l = 0, u = t.length - 1, d = 0, p = l, h = u, undefined; l < u; ) {
          var l;
          var u;
          var d;
          var p;
          var h;
          if ((d += t[l].sizeInBytes + t[u].sizeInBytes) > 32768) {
            var f = h - p + 1;
            t.splice(p, f);
            break;
          }
          p = l;
          h = u;
          l++;
          u--;
        }
    }
    return t;
  };
  return e;
})();
var a = (function () {
  function e(t, n) {
    this.sizeInBytes = 0;
    this.level = n;
    this.method = "<no_method>";
    this.assembly = M_http_util_maybe.trim(t);
    var r = t.match(e.regex);
    if (r && r.length >= 5) {
      this.method = M_http_util_maybe.trim(r[2]) || this.method;
      this.fileName = M_http_util_maybe.trim(r[4]) || "<no_filename>";
      this.line = parseInt(r[5]) || 0;
    }
    this.sizeInBytes += this.method.length;
    this.sizeInBytes += this.fileName.length;
    this.sizeInBytes += this.assembly.length;
    this.sizeInBytes += e.baseSize;
    this.sizeInBytes += this.level.toString().length;
    this.sizeInBytes += this.line.toString().length;
  }
  e.regex = /^([\s]+at)?(.*?)(\@|\s\(|\s)([^\(\@\n]+):([0-9]+):([0-9]+)(\)?)$/;
  e.baseSize = 58;
  return e;
})();
module.exports = s;
