Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var r = require(5282),
  o = require(7396),
  CorrelationContextManager = (function () {
    function e() {}
    e.getCurrentContext = function () {
      if (!e.enabled) return null;
      var t = e.session.get(e.CONTEXT_NAME);
      return undefined === t ? null : t;
    };
    e.generateContextObject = function (e, t, n, r, o, i) {
      t = t || e;
      return this.enabled
        ? {
            operation: {
              name: n,
              id: e,
              parentId: t,
              traceparent: o,
              tracestate: i,
            },
            customProperties: new s(r),
          }
        : null;
    };
    e.runWithContext = function (t, n) {
      return e.enabled
        ? e.session.bind(n, (((r = {})[e.CONTEXT_NAME] = t), r))()
        : n();
      var r;
    };
    e.wrapEmitter = function (t) {
      if (e.enabled) {
        e.session.bindEmitter(t);
      }
    };
    e.wrapCallback = function (t) {
      return e.enabled ? e.session.bind(t) : t;
    };
    e.enable = function (t) {
      if (this.enabled) {
        if (this.isNodeVersionCompatible()) {
          if (e.hasEverEnabled) {
            this.forceClsHooked = t;
            this.hasEverEnabled = !0;
            if (undefined === this.cls) {
              if (
                !0 === e.forceClsHooked ||
                (undefined === e.forceClsHooked && e.shouldUseClsHooked())
              ) {
                this.cls = require(9562);
              } else {
                this.cls = require(3057);
              }
            }
            e.session = this.cls.createNamespace("AI-CLS-Session");
            o.registerContextPreservation(function (t) {
              return e.session.bind(t);
            });
          }
          this.enabled = !0;
        } else {
          this.enabled = !1;
        }
      }
    };
    e.disable = function () {
      this.enabled = !1;
    };
    e.reset = function () {
      if (e.hasEverEnabled) {
        e.session = null;
        e.session = this.cls.createNamespace("AI-CLS-Session");
      }
    };
    e.isNodeVersionCompatible = function () {
      var e = process.versions.node.split(".");
      return parseInt(e[0]) > 3 || (parseInt(e[0]) > 2 && parseInt(e[1]) > 2);
    };
    e.shouldUseClsHooked = function () {
      var e = process.versions.node.split(".");
      return parseInt(e[0]) > 8 || (parseInt(e[0]) >= 8 && parseInt(e[1]) >= 2);
    };
    e.canUseClsHooked = function () {
      var e = process.versions.node.split("."),
        t = parseInt(e[0]) > 8 || (parseInt(e[0]) >= 8 && parseInt(e[1]) >= 0),
        n = parseInt(e[0]) < 8 || (parseInt(e[0]) <= 8 && parseInt(e[1]) < 2),
        r = parseInt(e[0]) > 4 || (parseInt(e[0]) >= 4 && parseInt(e[1]) >= 7);
      return !(t && n) && r;
    };
    e.enabled = !1;
    e.hasEverEnabled = !1;
    e.forceClsHooked = undefined;
    e.CONTEXT_NAME = "ApplicationInsights-Context";
    return e;
  })();
exports.CorrelationContextManager = CorrelationContextManager;
var s = (function () {
  function e(e) {
    this.props = [];
    this.addHeaderData(e);
  }
  e.prototype.addHeaderData = function (e) {
    var t = e ? e.split(", ") : [];
    this.props = t
      .map(function (e) {
        var t = e.split("=");
        return {
          key: t[0],
          value: t[1],
        };
      })
      .concat(this.props);
  };
  e.prototype.serializeToHeader = function () {
    return this.props
      .map(function (e) {
        return e.key + "=" + e.value;
      })
      .join(", ");
  };
  e.prototype.getProperty = function (e) {
    for (var t = 0; t < this.props.length; ++t) {
      var n = this.props[t];
      if (n.key === e) return n.value;
    }
  };
  e.prototype.setProperty = function (t, n) {
    if (e.bannedCharacters.test(t) || e.bannedCharacters.test(n))
      r.warn(
        "Correlation context property keys and values must not contain ',' or '='. setProperty was called with key: " +
          t +
          " and value: " +
          n
      );
    else {
      for (var o = 0; o < this.props.length; ++o) {
        var i = this.props[o];
        if (i.key === t) return void (i.value = n);
      }
      this.props.push({
        key: t,
        value: n,
      });
    }
  };
  e.bannedCharacters = /[,=]/;
  return e;
})();
