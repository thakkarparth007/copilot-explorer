var r = require(7396),
  o = (function () {
    function e(t) {
      if (e.INSTANCE)
        throw new Error(
          "Console logging adapter tracking should be configured from the applicationInsights object"
        );
      this._client = t;
      e.INSTANCE = this;
    }
    e.prototype.enable = function (e, t) {
      if (r.IsInitialized) {
        require(4309).wp(e && t, this._client);
        require(5823).wp(e, this._client);
        require(454).wp(e, this._client);
      }
    };
    e.prototype.isInitialized = function () {
      return this._isInitialized;
    };
    e.prototype.dispose = function () {
      e.INSTANCE = null;
      this.enable(!1, !1);
    };
    e._methodNames = ["debug", "info", "log", "warn", "error"];
    return e;
  })();
module.exports = o;
