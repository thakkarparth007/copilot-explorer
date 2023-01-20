var r = require(5282);
var o = require(9253);
var i = require(7148);
var s = require(9184);
var a = require(3580);
var c = require(4470);
var l = (function () {
  function e(e, t) {
    this._isCollectingData = false;
    this._lastSuccessTime = Date.now();
    this._lastSendSucceeded = true;
    this._metrics = {};
    this._documents = [];
    this._collectors = [];
    this.config = new o(e);
    this.context = t || new c();
    this._sender = new s(this.config);
    this._isEnabled = false;
  }
  e.prototype.addCollector = function (e) {
    this._collectors.push(e);
  };
  e.prototype.trackMetric = function (e) {
    this._addMetric(e);
  };
  e.prototype.addDocument = function (e) {
    var t = i.telemetryEnvelopeToQuickPulseDocument(e);
    if (t) {
      this._documents.push(t);
    }
  };
  e.prototype.enable = function (e) {
    if (e && !this._isEnabled) {
      this._isEnabled = true;
      this._goQuickPulse();
    } else {
      if (!e && this._isEnabled) {
        this._isEnabled = false;
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
    var r = a.PerformanceToQuickPulseCounter[e.name];
    if (r) {
      if (this._metrics[r]) {
        this._metrics[r].Value =
          (this._metrics[r].Value * this._metrics[r].Weight + t * n) /
          (this._metrics[r].Weight + n);
        this._metrics[r].Weight += n;
      } else {
        this._metrics[r] = i.createQuickPulseMetric(e);
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
    var r = i.createQuickPulseEnvelope(
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
      this._isCollectingData = false;
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
        r.info("Live Metrics sending data", e);
        this.enableCollectors(e);
      }
      this._isCollectingData = e;
      if (t && t.statusCode < 300 && t.statusCode >= 200) {
        this._lastSuccessTime = Date.now();
        this._lastSendSucceeded = true;
      } else {
        this._lastSendSucceeded = false;
      }
    } else {
      this._lastSendSucceeded = false;
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