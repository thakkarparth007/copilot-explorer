Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var r;
var o = require(894);
var i = require(6281);
var s = require(6639);
var a = require(4350);
var c = require(8723);
var l = require(731);
var u = require(9962);
var d = require(5282);
var p = require(3668);
var h = require(1629);
exports.TelemetryClient = require(1259);
exports.Contracts = require(5290);
(function (e) {
  e[(e.AI = 0)] = "AI";
  e[(e.AI_AND_W3C = 1)] = "AI_AND_W3C";
})(
  (r =
    exports.DistributedTracingModes || (exports.DistributedTracingModes = {}))
);
var f;
var m;
var g;
var _;
var y;
var v;
var b;
var w;
var x;
var E = !0;
var C = !1;
var S = !0;
var T = !0;
var k = !0;
var I = !0;
var P = !0;
var A = !0;
var O = !1;
var N = !0;
var R = undefined;
var M = undefined;
var L = !1;
function start() {
  if (exports.defaultClient) {
    L = !0;
    g.enable(E, C);
    _.enable(S);
    y.enable(T);
    v.enable(N, m);
    b.useAutoCorrelation(A, f);
    b.enable(k);
    w.enable(I);
    if (exports.liveMetricsClient && O) {
      exports.liveMetricsClient.enable(O);
    }
  } else {
    d.warn("Start cannot be called before setup");
  }
  return Configuration;
}
exports.setup = function (e) {
  if (exports.defaultClient) {
    d.info("The default client is already setup");
  } else {
    exports.defaultClient = new exports.TelemetryClient(e);
    g = new i(exports.defaultClient);
    _ = new s(exports.defaultClient);
    y = new a(exports.defaultClient);
    b = new l(exports.defaultClient);
    w = new c(exports.defaultClient);
    if (v) {
      v = new h.AutoCollectNativePerformance(exports.defaultClient);
    }
  }
  if (exports.defaultClient && exports.defaultClient.channel) {
    exports.defaultClient.channel.setUseDiskRetryCaching(P, R, M);
  }
  return Configuration;
};
exports.start = start;
exports.getCorrelationContext = function () {
  return A ? o.CorrelationContextManager.getCurrentContext() : null;
};
exports.wrapWithCorrelationContext = function (e) {
  return o.CorrelationContextManager.wrapCallback(e);
};
var Configuration = (function () {
  function e() {}
  e.setDistributedTracingMode = function (t) {
    u.w3cEnabled = t === r.AI_AND_W3C;
    return e;
  };
  e.setAutoCollectConsole = function (t, n) {
    if (undefined === n) {
      n = !1;
    }
    E = t;
    C = n;
    if (L) {
      g.enable(t, n);
    }
    return e;
  };
  e.setAutoCollectExceptions = function (t) {
    S = t;
    if (L) {
      _.enable(t);
    }
    return e;
  };
  e.setAutoCollectPerformance = function (t, n) {
    if (undefined === n) {
      n = !0;
    }
    T = t;
    var r = h.AutoCollectNativePerformance.parseEnabled(n);
    N = r.isEnabled;
    m = r.disabledMetrics;
    if (L) {
      y.enable(t);
      v.enable(r.isEnabled, r.disabledMetrics);
    }
    return e;
  };
  e.setAutoCollectRequests = function (t) {
    k = t;
    if (L) {
      b.enable(t);
    }
    return e;
  };
  e.setAutoCollectDependencies = function (t) {
    I = t;
    if (L) {
      w.enable(t);
    }
    return e;
  };
  e.setAutoDependencyCorrelation = function (t, n) {
    A = t;
    f = n;
    if (L) {
      b.useAutoCorrelation(t, n);
    }
    return e;
  };
  e.setUseDiskRetryCaching = function (n, r, o) {
    P = n;
    R = r;
    M = o;
    if (exports.defaultClient && exports.defaultClient.channel) {
      exports.defaultClient.channel.setUseDiskRetryCaching(n, r, o);
    }
    return e;
  };
  e.setInternalLogging = function (t, n) {
    if (undefined === t) {
      t = !1;
    }
    if (undefined === n) {
      n = !0;
    }
    d.enableDebug = t;
    d.disableWarnings = !n;
    return e;
  };
  e.setSendLiveMetrics = function (n) {
    if (undefined === n) {
      n = !1;
    }
    return exports.defaultClient
      ? (!exports.liveMetricsClient && n
          ? ((exports.liveMetricsClient = new p(
              exports.defaultClient.config.instrumentationKey
            )),
            (x = new a(exports.liveMetricsClient, 1e3, !0)),
            exports.liveMetricsClient.addCollector(x),
            (exports.defaultClient.quickPulseClient =
              exports.liveMetricsClient))
          : exports.liveMetricsClient && exports.liveMetricsClient.enable(n),
        (O = n),
        e)
      : (d.warn(
          "Live metrics client cannot be setup without the default client"
        ),
        e);
  };
  e.start = start;
  return e;
})();
exports.Configuration = Configuration;
exports.dispose = function () {
  exports.defaultClient = null;
  L = !1;
  if (g) {
    g.dispose();
  }
  if (_) {
    _.dispose();
  }
  if (y) {
    y.dispose();
  }
  if (v) {
    v.dispose();
  }
  if (b) {
    b.dispose();
  }
  if (w) {
    w.dispose();
  }
  if (exports.liveMetricsClient) {
    exports.liveMetricsClient.enable(!1);
    O = !1;
    exports.liveMetricsClient = undefined;
  }
};