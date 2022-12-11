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
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_channel_maybe = require("channel");
exports.AzureMonitorSymbol = "Azure_Monitor_Tracer";
var i = (function () {
  function e() {}
  e.prototype.onStart = function (e) {};
  e.prototype.onEnd = function (e) {
    M_channel_maybe.channel.publish("azure-coretracing", e);
  };
  e.prototype.shutdown = function () {};
  return e;
})();
exports.azureCoreTracing = {
  versionSpecifier: ">= 1.0.0 < 2.0.0",
  patch: function (e) {
    try {
      var s = new (0, require("@opentelemetry/tracing").BasicTracer)(
        M_channel_maybe.channel.spanContextPropagator
          ? {
              scopeManager: M_channel_maybe.channel.spanContextPropagator,
            }
          : undefined
      );
      var a = s.startSpan;
      s.startSpan = function (e, t) {
        if (!t || !t.parent) {
          var n = s.getCurrentSpan();
          if (n && n.operation && n.operation.traceparent) {
            t = r({}, t, {
              parent: {
                traceId: n.operation.traceparent.traceId,
                spanId: n.operation.traceparent.spanId,
              },
            });
          }
        }
        var o = a.call(this, e, t);
        o.addEvent("Application Insights Integration enabled");
        return o;
      };
      s.addSpanProcessor(new i());
      s[exports.AzureMonitorSymbol] = !0;
      e.setTracer(s);
    } catch (e) {}
    return e;
  },
};
exports.enable = function () {
  M_channel_maybe.channel.registerMonkeyPatch(
    "@azure/core-tracing",
    exports.azureCoreTracing
  );
};
