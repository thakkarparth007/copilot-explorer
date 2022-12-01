var r = require(5740),
  o = require(5282),
  i = (function () {
    function e() {}
    e.queryCorrelationId = function (t, n) {
      var i =
        t.profileQueryEndpoint +
        "/api/profiles/" +
        t.instrumentationKey +
        "/appId";
      if (e.completedLookups.hasOwnProperty(i)) n(e.completedLookups[i]);
      else if (e.pendingLookups[i]) e.pendingLookups[i].push(n);
      else {
        e.pendingLookups[i] = [n];
        var s = function () {
          if (e.pendingLookups[i]) {
            var n = {
              method: "GET",
              disableAppInsightsAutoCollection: !0,
            };
            o.info(e.TAG, n);
            var a = r.makeRequest(t, i, n, function (n) {
              if (200 === n.statusCode) {
                var r = "";
                n.setEncoding("utf-8");
                n.on("data", function (e) {
                  r += e;
                });
                n.on("end", function () {
                  o.info(e.TAG, r);
                  var t = e.correlationIdPrefix + r;
                  e.completedLookups[i] = t;
                  if (e.pendingLookups[i]) {
                    e.pendingLookups[i].forEach(function (e) {
                      return e(t);
                    });
                  }
                  delete e.pendingLookups[i];
                });
              } else if (n.statusCode >= 400 && n.statusCode < 500) {
                e.completedLookups[i] = undefined;
                delete e.pendingLookups[i];
              } else {
                setTimeout(s, t.correlationIdRetryIntervalMs);
              }
            });
            if (a) {
              a.on("error", function (t) {
                o.warn(e.TAG, t);
              });
              a.end();
            }
          }
        };
        setTimeout(s, 0);
      }
    };
    e.cancelCorrelationIdQuery = function (t, n) {
      var r =
          t.profileQueryEndpoint +
          "/api/profiles/" +
          t.instrumentationKey +
          "/appId",
        o = e.pendingLookups[r];
      if (o) {
        e.pendingLookups[r] = o.filter(function (e) {
          return e != n;
        });
        if (0 == e.pendingLookups[r].length) {
          delete e.pendingLookups[r];
        }
      }
    };
    e.generateRequestId = function (t) {
      if (t) {
        if ("." !== (t = "|" == t[0] ? t : "|" + t)[t.length - 1]) {
          t += ".";
        }
        var n = (e.currentRootId++).toString(16);
        return e.appendSuffix(t, n, "_");
      }
      return e.generateRootId();
    };
    e.getRootId = function (e) {
      var t = e.indexOf(".");
      if (t < 0) {
        t = e.length;
      }
      var n = "|" === e[0] ? 1 : 0;
      return e.substring(n, t);
    };
    e.generateRootId = function () {
      return "|" + r.w3cTraceId() + ".";
    };
    e.appendSuffix = function (t, n, o) {
      if (t.length + n.length < e.requestIdMaxLength) return t + n + o;
      var i = e.requestIdMaxLength - 9;
      if (t.length > i)
        for (; i > 1; --i) {
          var s = t[i - 1];
          if ("." === s || "_" === s) break;
        }
      if (i <= 1) return e.generateRootId();
      for (n = r.randomu32().toString(16); n.length < 8; ) n = "0" + n;
      return t.substring(0, i) + n + "#";
    };
    e.TAG = "CorrelationIdManager";
    e.correlationIdPrefix = "cid-v1:";
    e.w3cEnabled = !1;
    e.pendingLookups = {};
    e.completedLookups = {};
    e.requestIdMaxLength = 1024;
    e.currentRootId = r.randomu32();
    return e;
  })();
module.exports = i;