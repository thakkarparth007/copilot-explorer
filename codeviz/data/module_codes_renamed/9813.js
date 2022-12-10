var M_copilot_utils_NOTSURE = require("copilot-utils"),
  M_http_util_NOTSURE = require("http-util"),
  M_correlation_context_manager = require("correlation-context-manager"),
  s = (function () {
    function e() {}
    e.createEnvelope = function (t, n, i, s, a) {
      var c = null;
      switch (n) {
        case M_copilot_utils_NOTSURE.TelemetryType.Trace:
          c = e.createTraceData(t);
          break;
        case M_copilot_utils_NOTSURE.TelemetryType.Dependency:
          c = e.createDependencyData(t);
          break;
        case M_copilot_utils_NOTSURE.TelemetryType.Event:
          c = e.createEventData(t);
          break;
        case M_copilot_utils_NOTSURE.TelemetryType.Exception:
          c = e.createExceptionData(t);
          break;
        case M_copilot_utils_NOTSURE.TelemetryType.Request:
          c = e.createRequestData(t);
          break;
        case M_copilot_utils_NOTSURE.TelemetryType.Metric:
          c = e.createMetricData(t);
          break;
        case M_copilot_utils_NOTSURE.TelemetryType.Availability:
          c = e.createAvailabilityData(t);
      }
      if (i && M_copilot_utils_NOTSURE.domainSupportsProperties(c.baseData)) {
        if (c && c.baseData)
          if (c.baseData.properties) {
            for (var l in i)
              if (c.baseData.properties[l]) {
                c.baseData.properties[l] = i[l];
              }
          } else c.baseData.properties = i;
        c.baseData.properties = M_http_util_NOTSURE.validateStringMap(
          c.baseData.properties
        );
      }
      var u = (a && a.instrumentationKey) || "",
        d = new M_copilot_utils_NOTSURE.Envelope();
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
      if (n === M_copilot_utils_NOTSURE.TelemetryType.Metric) {
        d.sampleRate = 100;
      }
      return d;
    };
    e.createTraceData = function (e) {
      var t = new M_copilot_utils_NOTSURE.MessageData();
      t.message = e.message;
      t.properties = e.properties;
      if (isNaN(e.severity)) {
        t.severityLevel = M_copilot_utils_NOTSURE.SeverityLevel.Information;
      } else {
        t.severityLevel = e.severity;
      }
      var n = new M_copilot_utils_NOTSURE.Data();
      n.baseType = M_copilot_utils_NOTSURE.telemetryTypeToBaseType(
        M_copilot_utils_NOTSURE.TelemetryType.Trace
      );
      n.baseData = t;
      return n;
    };
    e.createDependencyData = function (e) {
      var t = new M_copilot_utils_NOTSURE.RemoteDependencyData();
      if ("string" == typeof e.name) {
        t.name = e.name.length > 1024 ? e.name.slice(0, 1021) + "..." : e.name;
      }
      t.data = e.data;
      t.target = e.target;
      t.duration = M_http_util_NOTSURE.msToTimeSpan(e.duration);
      t.success = e.success;
      t.type = e.dependencyTypeName;
      t.properties = e.properties;
      t.resultCode = e.resultCode ? e.resultCode + "" : "";
      if (e.id) {
        t.id = e.id;
      } else {
        t.id = M_http_util_NOTSURE.w3cTraceId();
      }
      var n = new M_copilot_utils_NOTSURE.Data();
      n.baseType = M_copilot_utils_NOTSURE.telemetryTypeToBaseType(
        M_copilot_utils_NOTSURE.TelemetryType.Dependency
      );
      n.baseData = t;
      return n;
    };
    e.createEventData = function (e) {
      var t = new M_copilot_utils_NOTSURE.EventData();
      t.name = e.name;
      t.properties = e.properties;
      t.measurements = e.measurements;
      var n = new M_copilot_utils_NOTSURE.Data();
      n.baseType = M_copilot_utils_NOTSURE.telemetryTypeToBaseType(
        M_copilot_utils_NOTSURE.TelemetryType.Event
      );
      n.baseData = t;
      return n;
    };
    e.createExceptionData = function (e) {
      var t = new M_copilot_utils_NOTSURE.ExceptionData();
      t.properties = e.properties;
      if (isNaN(e.severity)) {
        t.severityLevel = M_copilot_utils_NOTSURE.SeverityLevel.Error;
      } else {
        t.severityLevel = e.severity;
      }
      t.measurements = e.measurements;
      t.exceptions = [];
      var n = e.exception.stack,
        i = new M_copilot_utils_NOTSURE.ExceptionDetails();
      i.message = e.exception.message;
      i.typeName = e.exception.name;
      i.parsedStack = this.parseStack(n);
      i.hasFullStack =
        M_http_util_NOTSURE.isArray(i.parsedStack) && i.parsedStack.length > 0;
      t.exceptions.push(i);
      var s = new M_copilot_utils_NOTSURE.Data();
      s.baseType = M_copilot_utils_NOTSURE.telemetryTypeToBaseType(
        M_copilot_utils_NOTSURE.TelemetryType.Exception
      );
      s.baseData = t;
      return s;
    };
    e.createRequestData = function (e) {
      var t = new M_copilot_utils_NOTSURE.RequestData();
      if (e.id) {
        t.id = e.id;
      } else {
        t.id = M_http_util_NOTSURE.w3cTraceId();
      }
      t.name = e.name;
      t.url = e.url;
      t.source = e.source;
      t.duration = M_http_util_NOTSURE.msToTimeSpan(e.duration);
      t.responseCode = e.resultCode ? e.resultCode + "" : "";
      t.success = e.success;
      t.properties = e.properties;
      var n = new M_copilot_utils_NOTSURE.Data();
      n.baseType = M_copilot_utils_NOTSURE.telemetryTypeToBaseType(
        M_copilot_utils_NOTSURE.TelemetryType.Request
      );
      n.baseData = t;
      return n;
    };
    e.createMetricData = function (e) {
      var t = new M_copilot_utils_NOTSURE.MetricData();
      t.metrics = [];
      var n = new M_copilot_utils_NOTSURE.DataPoint();
      n.count = isNaN(e.count) ? 1 : e.count;
      n.kind = M_copilot_utils_NOTSURE.DataPointType.Aggregation;
      n.max = isNaN(e.max) ? e.value : e.max;
      n.min = isNaN(e.min) ? e.value : e.min;
      n.name = e.name;
      n.stdDev = isNaN(e.stdDev) ? 0 : e.stdDev;
      n.value = e.value;
      t.metrics.push(n);
      t.properties = e.properties;
      var o = new M_copilot_utils_NOTSURE.Data();
      o.baseType = M_copilot_utils_NOTSURE.telemetryTypeToBaseType(
        M_copilot_utils_NOTSURE.TelemetryType.Metric
      );
      o.baseData = t;
      return o;
    };
    e.createAvailabilityData = function (e) {
      var t = new M_copilot_utils_NOTSURE.AvailabilityData();
      if (e.id) {
        t.id = e.id;
      } else {
        t.id = M_http_util_NOTSURE.w3cTraceId();
      }
      t.name = e.name;
      t.duration = M_http_util_NOTSURE.msToTimeSpan(e.duration);
      t.success = e.success;
      t.runLocation = e.runLocation;
      t.message = e.message;
      t.measurements = e.measurements;
      t.properties = e.properties;
      var n = new M_copilot_utils_NOTSURE.Data();
      n.baseType = M_copilot_utils_NOTSURE.telemetryTypeToBaseType(
        M_copilot_utils_NOTSURE.TelemetryType.Availability
      );
      n.baseData = t;
      return n;
    };
    e.getTags = function (e, t) {
      var n =
          M_correlation_context_manager.CorrelationContextManager.getCurrentContext(),
        r = {};
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
        for (var r = 0, o = 0, i = 0; i <= n.length; i++) {
          var s = n[i];
          if (a.regex.test(s)) {
            var c = new a(n[i], r++);
            o += c.sizeInBytes;
            t.push(c);
          }
        }
        if (o > 32768)
          for (var l = 0, u = t.length - 1, d = 0, p = l, h = u; l < u; ) {
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
  })(),
  a = (function () {
    function e(t, n) {
      this.sizeInBytes = 0;
      this.level = n;
      this.method = "<no_method>";
      this.assembly = M_http_util_NOTSURE.trim(t);
      var r = t.match(e.regex);
      if (r && r.length >= 5) {
        this.method = M_http_util_NOTSURE.trim(r[2]) || this.method;
        this.fileName = M_http_util_NOTSURE.trim(r[4]) || "<no_filename>";
        this.line = parseInt(r[5]) || 0;
      }
      this.sizeInBytes += this.method.length;
      this.sizeInBytes += this.fileName.length;
      this.sizeInBytes += this.assembly.length;
      this.sizeInBytes += e.baseSize;
      this.sizeInBytes += this.level.toString().length;
      this.sizeInBytes += this.line.toString().length;
    }
    e.regex =
      /^([\s]+at)?(.*?)(\@|\s\(|\s)([^\(\@\n]+):([0-9]+):([0-9]+)(\)?)$/;
    e.baseSize = 58;
    return e;
  })();
module.exports = s;
