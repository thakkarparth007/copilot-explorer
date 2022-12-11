Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.logger =
  exports.toPlainText =
  exports.Logger =
  exports.MultiLog =
  exports.OutputChannelLog =
  exports.ConsoleLog =
  exports.LogTarget =
  exports.verboseLogging =
  exports.LogVerbose =
  exports.LogLevel =
    undefined;
const M_clock = require("clock");
const M_config_stuff = require("config-stuff");
const M_telemetry_stuff = require("telemetry-stuff");
var s;
!(function (e) {
  e[(e.DEBUG = 0)] = "DEBUG";
  e[(e.INFO = 1)] = "INFO";
  e[(e.WARN = 2)] = "WARN";
  e[(e.ERROR = 3)] = "ERROR";
})((s = exports.LogLevel || (exports.LogLevel = {})));
class LogVerbose {
  constructor(e) {
    this.logVerbose = e;
  }
}
function verboseLogging(e) {
  return e.get(LogVerbose).logVerbose;
}
exports.LogVerbose = LogVerbose;
exports.verboseLogging = verboseLogging;
class LogTarget {
  shouldLog(e, t) {}
}
exports.LogTarget = LogTarget;
exports.ConsoleLog = class extends LogTarget {
  constructor(e) {
    super();
    this.console = e;
  }
  logIt(e, t, n, ...r) {
    if (verboseLogging(e) || t == s.ERROR) {
      this.console.error(n, ...r);
    } else {
      if (t == s.WARN) {
        this.console.warn(n, ...r);
      }
    }
  }
};
exports.OutputChannelLog = class extends LogTarget {
  constructor(e) {
    super();
    this.output = e;
  }
  logIt(e, t, n, ...r) {
    this.output.appendLine(`${n} ${r.map(toPlainText)}`);
  }
};
exports.MultiLog = class extends LogTarget {
  constructor(e) {
    super();
    this.targets = e;
  }
  logIt(e, t, n, ...r) {
    this.targets.forEach((o) => o.logIt(e, t, n, ...r));
  }
};
class Logger {
  constructor(e, t) {
    this.minLoggedLevel = e;
    this.context = t;
  }
  setLevel(e) {
    this.minLoggedLevel = e;
  }
  stringToLevel(e) {
    return s[e];
  }
  log(e, t, n, ...o) {
    const a = s[t];
    if (t == s.ERROR) {
      M_telemetry_stuff.telemetryError(
        e,
        "log",
        M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
          context: this.context,
          level: a,
          message: o.length > 0 ? JSON.stringify(o) : "no msg",
        }),
        n
      );
    }
    const c = e.get(LogTarget);
    const u = c.shouldLog(e, t);
    if (!1 === u) return;
    if (undefined === u && !this.shouldLog(e, t, this.context)) return;
    const d = e.get(M_clock.Clock).now().toISOString();
    const p = `[${a}] [${this.context}] [${d}]`;
    c.logIt(e, t, p, ...o);
  }
  shouldLog(e, t, n) {
    var r;
    var i;
    if (verboseLogging(e)) return !0;
    const s = M_config_stuff.getConfig(
      e,
      M_config_stuff.ConfigKey.DebugFilterLogCategories
    );
    if (s.length > 0 && !s.includes(n)) return !1;
    if (M_config_stuff.isProduction(e)) return t >= this.minLoggedLevel;
    const a = M_config_stuff.getConfig(
      e,
      M_config_stuff.ConfigKey.DebugOverrideLogLevels
    );
    return (
      t >=
      (null !==
        (i =
          null !== (r = this.stringToLevel(a["*"])) && undefined !== r
            ? r
            : this.stringToLevel(a[this.context])) && undefined !== i
        ? i
        : this.minLoggedLevel)
    );
  }
  debug(e, ...t) {
    this.log(e, s.DEBUG, !1, ...t);
  }
  info(e, ...t) {
    this.log(e, s.INFO, !1, ...t);
  }
  warn(e, ...t) {
    this.log(e, s.WARN, !1, ...t);
  }
  error(e, ...t) {
    this.log(e, s.ERROR, !1, ...t);
  }
  secureError(e, t, ...n) {
    this.log(e, s.ERROR, !1, t);
    this.log(e, s.ERROR, !0, t, ...n);
  }
}
function toPlainText(e) {
  return "object" == typeof e ? JSON.stringify(e) : String(e);
}
exports.Logger = Logger;
exports.toPlainText = toPlainText;
exports.logger = new Logger(s.INFO, "default");
