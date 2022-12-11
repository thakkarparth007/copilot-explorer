var r = require(5290);
var o = require(5740);
var i = require(894);
var s = (function () {
  function e() {}
  e.createEnvelope = function (t, n, i, s, a) {
    var c = null;
    switch (n) {
      case r.TelemetryType.Trace:
        c = e.createTraceData(t);
        break;
      case r.TelemetryType.Dependency:
        c = e.createDependencyData(t);
        break;
      case r.TelemetryType.Event:
        c = e.createEventData(t);
        break;
      case r.TelemetryType.Exception:
        c = e.createExceptionData(t);
        break;
      case r.TelemetryType.Request:
        c = e.createRequestData(t);
        break;
      case r.TelemetryType.Metric:
        c = e.createMetricData(t);
        break;
      case r.TelemetryType.Availability:
        c = e.createAvailabilityData(t);
    }
    if (i && r.domainSupportsProperties(c.baseData)) {
      if (c && c.baseData)
        if (c.baseData.properties) {
          for (var l in i)
            if (c.baseData.properties[l]) {
              c.baseData.properties[l] = i[l];
            }
        } else c.baseData.properties = i;
      c.baseData.properties = o.validateStringMap(c.baseData.properties);
    }
    var u = (a && a.instrumentationKey) || "";
    var d = new r.Envelope();
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
    if (n === r.TelemetryType.Metric) {
      d.sampleRate = 100;
    }
    return d;
  };
  e.createTraceData = function (e) {
    var t = new r.MessageData();
    t.message = e.message;
    t.properties = e.properties;
    if (isNaN(e.severity)) {
      t.severityLevel = r.SeverityLevel.Information;
    } else {
      t.severityLevel = e.severity;
    }
    var n = new r.Data();
    n.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Trace);
    n.baseData = t;
    return n;
  };
  e.createDependencyData = function (e) {
    var t = new r.RemoteDependencyData();
    if ("string" == typeof e.name) {
      t.name = e.name.length > 1024 ? e.name.slice(0, 1021) + "..." : e.name;
    }
    t.data = e.data;
    t.target = e.target;
    t.duration = o.msToTimeSpan(e.duration);
    t.success = e.success;
    t.type = e.dependencyTypeName;
    t.properties = e.properties;
    t.resultCode = e.resultCode ? e.resultCode + "" : "";
    if (e.id) {
      t.id = e.id;
    } else {
      t.id = o.w3cTraceId();
    }
    var n = new r.Data();
    n.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Dependency);
    n.baseData = t;
    return n;
  };
  e.createEventData = function (e) {
    var t = new r.EventData();
    t.name = e.name;
    t.properties = e.properties;
    t.measurements = e.measurements;
    var n = new r.Data();
    n.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Event);
    n.baseData = t;
    return n;
  };
  e.createExceptionData = function (e) {
    var t = new r.ExceptionData();
    t.properties = e.properties;
    if (isNaN(e.severity)) {
      t.severityLevel = r.SeverityLevel.Error;
    } else {
      t.severityLevel = e.severity;
    }
    t.measurements = e.measurements;
    t.exceptions = [];
    var n = e.exception.stack;
    var i = new r.ExceptionDetails();
    i.message = e.exception.message;
    i.typeName = e.exception.name;
    i.parsedStack = this.parseStack(n);
    i.hasFullStack = o.isArray(i.parsedStack) && i.parsedStack.length > 0;
    t.exceptions.push(i);
    var s = new r.Data();
    s.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Exception);
    s.baseData = t;
    return s;
  };
  e.createRequestData = function (e) {
    var t = new r.RequestData();
    if (e.id) {
      t.id = e.id;
    } else {
      t.id = o.w3cTraceId();
    }
    t.name = e.name;
    t.url = e.url;
    t.source = e.source;
    t.duration = o.msToTimeSpan(e.duration);
    t.responseCode = e.resultCode ? e.resultCode + "" : "";
    t.success = e.success;
    t.properties = e.properties;
    var n = new r.Data();
    n.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Request);
    n.baseData = t;
    return n;
  };
  e.createMetricData = function (e) {
    var t = new r.MetricData();
    t.metrics = [];
    var n = new r.DataPoint();
    n.count = isNaN(e.count) ? 1 : e.count;
    n.kind = r.DataPointType.Aggregation;
    n.max = isNaN(e.max) ? e.value : e.max;
    n.min = isNaN(e.min) ? e.value : e.min;
    n.name = e.name;
    n.stdDev = isNaN(e.stdDev) ? 0 : e.stdDev;
    n.value = e.value;
    t.metrics.push(n);
    t.properties = e.properties;
    var o = new r.Data();
    o.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Metric);
    o.baseData = t;
    return o;
  };
  e.createAvailabilityData = function (e) {
    var t = new r.AvailabilityData();
    if (e.id) {
      t.id = e.id;
    } else {
      t.id = o.w3cTraceId();
    }
    t.name = e.name;
    t.duration = o.msToTimeSpan(e.duration);
    t.success = e.success;
    t.runLocation = e.runLocation;
    t.message = e.message;
    t.measurements = e.measurements;
    t.properties = e.properties;
    var n = new r.Data();
    n.baseType = r.telemetryTypeToBaseType(r.TelemetryType.Availability);
    n.baseData = t;
    return n;
  };
  e.getTags = function (e, t) {
    var n = i.CorrelationContextManager.getCurrentContext();
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
    this.assembly = o.trim(t);
    var r = t.match(e.regex);
    if (r && r.length >= 5) {
      this.method = o.trim(r[2]) || this.method;
      this.fileName = o.trim(r[4]) || "<no_filename>";
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