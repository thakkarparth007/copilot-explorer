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
var o = require(4953);
exports.tedious = {
  versionSpecifier: ">= 6.0.0 < 9.0.0",
  patch: function (e) {
    var t = e.Connection.prototype.makeRequest;
    e.Connection.prototype.makeRequest = function () {
      function e(e) {
        var t = process.hrtime();
        var n = {
          query: {},
          database: {
            host: null,
            port: null,
          },
          result: null,
          error: null,
          duration: 0,
        };
        return o.channel.bindToContext(function (i, s, a) {
          var c = process.hrtime(t);
          n = r({}, n, {
            database: {
              host: this.connection.config.server,
              port: this.connection.config.options.port,
            },
            result: !i && {
              rowCount: s,
              rows: a,
            },
            query: {
              text: this.parametersByName.statement.value,
            },
            error: i,
            duration: Math.ceil(1e3 * c[0] + c[1] / 1e6),
          });
          o.channel.publish("tedious", n);
          e.call(this, i, s, a);
        });
      }
      var n = arguments[0];
      arguments[0].callback = e(n.callback);
      t.apply(this, arguments);
    };
    return e;
  },
};
exports.enable = function () {
  o.channel.registerMonkeyPatch("tedious", exports.tedious);
};