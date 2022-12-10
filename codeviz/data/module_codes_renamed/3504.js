var M_logging_NOTSURE = require("logging"),
  o = (function () {
    function e(e, t, n, r) {
      this._buffer = [];
      this._lastSend = 0;
      this._isDisabled = e;
      this._getBatchSize = t;
      this._getBatchIntervalMs = n;
      this._sender = r;
    }
    e.prototype.setUseDiskRetryCaching = function (e, t, n) {
      this._sender.setDiskRetryMode(e, t, n);
    };
    e.prototype.send = function (e) {
      var t = this;
      if (!this._isDisabled())
        if (e) {
          var n = this._stringify(e);
          if ("string" == typeof n) {
            this._buffer.push(n);
            if (this._buffer.length >= this._getBatchSize()) {
              this.triggerSend(!1);
            } else {
              if (!this._timeoutHandle && this._buffer.length > 0) {
                this._timeoutHandle = setTimeout(function () {
                  t._timeoutHandle = null;
                  t.triggerSend(!1);
                }, this._getBatchIntervalMs());
              }
            }
          }
        } else M_logging_NOTSURE.warn("Cannot send null/undefined telemetry");
    };
    e.prototype.triggerSend = function (e, t) {
      var n = this._buffer.length < 1;
      if (!n) {
        var r = this._buffer.join("\n");
        if (e) {
          this._sender.saveOnCrash(r);
          if ("function" == typeof t) {
            t("data saved on crash");
          }
        } else {
          this._sender.send(Buffer.from ? Buffer.from(r) : new Buffer(r), t);
        }
      }
      this._lastSend = +new Date();
      this._buffer.length = 0;
      clearTimeout(this._timeoutHandle);
      this._timeoutHandle = null;
      if (n && "function" == typeof t) {
        t("no data to send");
      }
    };
    e.prototype._stringify = function (e) {
      try {
        return JSON.stringify(e);
      } catch (t) {
        M_logging_NOTSURE.warn("Failed to serialize payload", t, e);
      }
    };
    return e;
  })();
module.exports = o;
