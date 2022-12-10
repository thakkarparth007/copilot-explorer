Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var r,
  M_correlation_context_manager = require("correlation-context-manager"),
  M_console_logging_adapter_tracking_NOTSURE = require("console-logging-adapter-tracking"),
  M_exception_tracking_NOTSURE = require("exception-tracking"),
  M_performance_monitor_NOTSURE = require("performance-monitor"),
  M_request_tracker_NOTSURE = require("request-tracker"),
  M_server_request_tracker_NOTSURE = require("server-request-tracker"),
  M_app_id_lookup_NOTSURE = require("app-id-lookup"),
  M_logging_NOTSURE = require("logging"),
  M_quickpulse_NOTSURE = require("quickpulse"),
  M_native_perf_collector_NOTSURE = require("native-perf-collector");
exports.TelemetryClient = require("telemetry-client");
exports.Contracts = require("copilot-utils");
(function (e) {
  e[(e.AI = 0)] = "AI";
  e[(e.AI_AND_W3C = 1)] = "AI_AND_W3C";
})(
  (r =
    exports.DistributedTracingModes || (exports.DistributedTracingModes = {}))
);
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
    M_logging_NOTSURE.warn("Start cannot be called before setup");
  }
  return Configuration;
}
exports.setup = function (e) {
  if (exports.defaultClient) {
    M_logging_NOTSURE.info("The default client is already setup");
  } else {
    exports.defaultClient = new exports.TelemetryClient(e);
    g = new M_console_logging_adapter_tracking_NOTSURE(exports.defaultClient);
    _ = new M_exception_tracking_NOTSURE(exports.defaultClient);
    y = new M_performance_monitor_NOTSURE(exports.defaultClient);
    b = new M_server_request_tracker_NOTSURE(exports.defaultClient);
    w = new M_request_tracker_NOTSURE(exports.defaultClient);
    if (v) {
      v = new M_native_perf_collector_NOTSURE.AutoCollectNativePerformance(
        exports.defaultClient
      );
    }
  }
  if (exports.defaultClient && exports.defaultClient.channel) {
    exports.defaultClient.channel.setUseDiskRetryCaching(P, R, M);
  }
  return Configuration;
};
exports.start = start;
exports.getCorrelationContext = function () {
  return A
    ? M_correlation_context_manager.CorrelationContextManager.getCurrentContext()
    : null;
};
exports.wrapWithCorrelationContext = function (e) {
  return M_correlation_context_manager.CorrelationContextManager.wrapCallback(
    e
  );
};
var Configuration = (function () {
  function e() {}
  e.setDistributedTracingMode = function (t) {
    M_app_id_lookup_NOTSURE.w3cEnabled = t === r.AI_AND_W3C;
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
    var r =
      M_native_perf_collector_NOTSURE.AutoCollectNativePerformance.parseEnabled(
        n
      );
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
    M_logging_NOTSURE.enableDebug = t;
    M_logging_NOTSURE.disableWarnings = !n;
    return e;
  };
  e.setSendLiveMetrics = function (n) {
    if (undefined === n) {
      n = !1;
    }
    return exports.defaultClient
      ? (!exports.liveMetricsClient && n
          ? ((exports.liveMetricsClient = new M_quickpulse_NOTSURE(
              exports.defaultClient.config.instrumentationKey
            )),
            (x = new M_performance_monitor_NOTSURE(
              exports.liveMetricsClient,
              1e3,
              !0
            )),
            exports.liveMetricsClient.addCollector(x),
            (exports.defaultClient.quickPulseClient =
              exports.liveMetricsClient))
          : exports.liveMetricsClient && exports.liveMetricsClient.enable(n),
        (O = n),
        e)
      : (M_logging_NOTSURE.warn(
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
