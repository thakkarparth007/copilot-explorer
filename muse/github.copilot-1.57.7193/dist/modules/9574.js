Object.defineProperty(exports, "__esModule", {
  value: !0
});
var r,
  o = require(894),
  i = require(6281),
  s = require(6639),
  a = require(4350),
  c = require(8723),
  l = require(731),
  u = require(9962),
  d = require(5282),
  p = require(3668),
  h = require(1629);
exports.TelemetryClient = require(1259);
exports.Contracts = require(5290);
(function (e) {
  e[e.AI = 0] = "AI";
  e[e.AI_AND_W3C = 1] = "AI_AND_W3C";
})(r = exports.DistributedTracingModes || (exports.DistributedTracingModes = {}));
var f,
  m,
  g,
  _,
  y,
  v,
  b,
  w,
  x,
  E = !0,
  C = !1,
  S = !0,
  T = !0,
  k = !0,
  I = !0,
  P = !0,
  A = !0,
  O = !1,
  N = !0,
  R = undefined,
  M = undefined,
  L = !1;
function start() {
  exports.defaultClient ? (L = !0, g.enable(E, C), _.enable(S), y.enable(T), v.enable(N, m), b.useAutoCorrelation(A, f), b.enable(k), w.enable(I), exports.liveMetricsClient && O && exports.liveMetricsClient.enable(O)) : d.warn("Start cannot be called before setup");
  return Configuration;
}
exports.setup = function (e) {
  exports.defaultClient ? d.info("The default client is already setup") : (exports.defaultClient = new exports.TelemetryClient(e), g = new i(exports.defaultClient), _ = new s(exports.defaultClient), y = new a(exports.defaultClient), b = new l(exports.defaultClient), w = new c(exports.defaultClient), v || (v = new h.AutoCollectNativePerformance(exports.defaultClient)));
  exports.defaultClient && exports.defaultClient.channel && exports.defaultClient.channel.setUseDiskRetryCaching(P, R, M);
  return Configuration;
};
exports.start = start;
exports.getCorrelationContext = function () {
  return A ? o.CorrelationContextManager.getCurrentContext() : null;
};
exports.wrapWithCorrelationContext = function (e) {
  return o.CorrelationContextManager.wrapCallback(e);
};
var Configuration = function () {
  function e() {}
  e.setDistributedTracingMode = function (t) {
    u.w3cEnabled = t === r.AI_AND_W3C;
    return e;
  };
  e.setAutoCollectConsole = function (t, n) {
    undefined === n && (n = !1);
    E = t;
    C = n;
    L && g.enable(t, n);
    return e;
  };
  e.setAutoCollectExceptions = function (t) {
    S = t;
    L && _.enable(t);
    return e;
  };
  e.setAutoCollectPerformance = function (t, n) {
    undefined === n && (n = !0);
    T = t;
    var r = h.AutoCollectNativePerformance.parseEnabled(n);
    N = r.isEnabled;
    m = r.disabledMetrics;
    L && (y.enable(t), v.enable(r.isEnabled, r.disabledMetrics));
    return e;
  };
  e.setAutoCollectRequests = function (t) {
    k = t;
    L && b.enable(t);
    return e;
  };
  e.setAutoCollectDependencies = function (t) {
    I = t;
    L && w.enable(t);
    return e;
  };
  e.setAutoDependencyCorrelation = function (t, n) {
    A = t;
    f = n;
    L && b.useAutoCorrelation(t, n);
    return e;
  };
  e.setUseDiskRetryCaching = function (n, r, o) {
    P = n;
    R = r;
    M = o;
    exports.defaultClient && exports.defaultClient.channel && exports.defaultClient.channel.setUseDiskRetryCaching(n, r, o);
    return e;
  };
  e.setInternalLogging = function (t, n) {
    undefined === t && (t = !1);
    undefined === n && (n = !0);
    d.enableDebug = t;
    d.disableWarnings = !n;
    return e;
  };
  e.setSendLiveMetrics = function (n) {
    undefined === n && (n = !1);
    return exports.defaultClient ? (!exports.liveMetricsClient && n ? (exports.liveMetricsClient = new p(exports.defaultClient.config.instrumentationKey), x = new a(exports.liveMetricsClient, 1e3, !0), exports.liveMetricsClient.addCollector(x), exports.defaultClient.quickPulseClient = exports.liveMetricsClient) : exports.liveMetricsClient && exports.liveMetricsClient.enable(n), O = n, e) : (d.warn("Live metrics client cannot be setup without the default client"), e);
  };
  e.start = start;
  return e;
}();
exports.Configuration = Configuration;
exports.dispose = function () {
  exports.defaultClient = null;
  L = !1;
  g && g.dispose();
  _ && _.dispose();
  y && y.dispose();
  v && v.dispose();
  b && b.dispose();
  w && w.dispose();
  exports.liveMetricsClient && (exports.liveMetricsClient.enable(!1), O = !1, exports.liveMetricsClient = undefined);
};