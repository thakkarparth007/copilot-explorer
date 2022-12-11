var M_logging_maybe = require("logging");
var M_appinsights_config_maybe = require("appinsights-config");
var M_quickpulse_maybe = require("quickpulse");
var M_quick_pulse_client_maybe = require("quick-pulse-client");
var M_quickpulse_constants_maybe = require("quickpulse-constants");
var M_default_context_maybe = require("default-context");
var l = (function () {
  function e(e, t) {
    this._isCollectingData = !1;
    this._lastSuccessTime = Date.now();
    this._lastSendSucceeded = !0;
    this._metrics = {};
    this._documents = [];
    this._collectors = [];
    this.config = new M_appinsights_config_maybe(e);
    this.context = t || new M_default_context_maybe();
    this._sender = new M_quick_pulse_client_maybe(this.config);
    this._isEnabled = !1;
  }
  e.prototype.addCollector = function (e) {
    this._collectors.push(e);
  };
  e.prototype.trackMetric = function (e) {
    this._addMetric(e);
  };
  e.prototype.addDocument = function (e) {
    var t = M_quickpulse_maybe.telemetryEnvelopeToQuickPulseDocument(e);
    if (t) {
      this._documents.push(t);
    }
  };
  e.prototype.enable = function (e) {
    if (e && !this._isEnabled) {
      this._isEnabled = !0;
      this._goQuickPulse();
    } else {
      if (!e && this._isEnabled) {
        this._isEnabled = !1;
        clearTimeout(this._handle);
        this._handle = undefined;
      }
    }
  };
  e.prototype.enableCollectors = function (e) {
    this._collectors.forEach(function (t) {
      t.enable(e);
    });
  };
  e.prototype._addMetric = function (e) {
    var t = e.value;
    var n = e.count || 1;
    var r = M_quickpulse_constants_maybe.PerformanceToQuickPulseCounter[e.name];
    if (r) {
      if (this._metrics[r]) {
        this._metrics[r].Value =
          (this._metrics[r].Value * this._metrics[r].Weight + t * n) /
          (this._metrics[r].Weight + n);
        this._metrics[r].Weight += n;
      } else {
        this._metrics[r] = M_quickpulse_maybe.createQuickPulseMetric(e);
        this._metrics[r].Name = r;
        this._metrics[r].Weight = 1;
      }
    }
  };
  e.prototype._resetQuickPulseBuffer = function () {
    delete this._metrics;
    this._metrics = {};
    this._documents.length = 0;
  };
  e.prototype._goQuickPulse = function () {
    var t = this;
    var n = Object.keys(this._metrics).map(function (e) {
      return t._metrics[e];
    });
    var r = M_quickpulse_maybe.createQuickPulseEnvelope(
      n,
      this._documents.slice(),
      this.config,
      this.context
    );
    this._resetQuickPulseBuffer();
    if (this._isCollectingData) {
      this._post(r);
    } else {
      this._ping(r);
    }
    var o = this._isCollectingData ? e.POST_INTERVAL : e.PING_INTERVAL;
    if (
      this._isCollectingData &&
      Date.now() - this._lastSuccessTime >= e.MAX_POST_WAIT_TIME &&
      !this._lastSendSucceeded
    ) {
      this._isCollectingData = !1;
      o = e.FALLBACK_INTERVAL;
    } else {
      if (
        !this._isCollectingData &&
        Date.now() - this._lastSuccessTime >= e.MAX_PING_WAIT_TIME &&
        !this._lastSendSucceeded
      ) {
        o = e.FALLBACK_INTERVAL;
      }
    }
    this._lastSendSucceeded = null;
    this._handle = setTimeout(this._goQuickPulse.bind(this), o);
    this._handle.unref();
  };
  e.prototype._ping = function (e) {
    this._sender.ping(e, this._quickPulseDone.bind(this));
  };
  e.prototype._post = function (e) {
    this._sender.post(e, this._quickPulseDone.bind(this));
  };
  e.prototype._quickPulseDone = function (e, t) {
    if (null != e) {
      if (this._isCollectingData !== e) {
        M_logging_maybe.info("Live Metrics sending data", e);
        this.enableCollectors(e);
      }
      this._isCollectingData = e;
      if (t && t.statusCode < 300 && t.statusCode >= 200) {
        this._lastSuccessTime = Date.now();
        this._lastSendSucceeded = !0;
      } else {
        this._lastSendSucceeded = !1;
      }
    } else {
      this._lastSendSucceeded = !1;
    }
  };
  e.MAX_POST_WAIT_TIME = 2e4;
  e.MAX_PING_WAIT_TIME = 6e4;
  e.FALLBACK_INTERVAL = 6e4;
  e.PING_INTERVAL = 5e3;
  e.POST_INTERVAL = 1e3;
  return e;
})();
module.exports = l;
