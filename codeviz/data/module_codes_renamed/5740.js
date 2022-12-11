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
var M_http = require("http");
var M_https = require("https");
var M_url = require("url");
var M_constants = require("constants");
var M_logging_maybe = require("logging");
var M_request_context_maybe = require("request_context");
var u = (function () {
  function e() {}
  e.getCookie = function (t, n) {
    var r = "";
    if (t && t.length && "string" == typeof n)
      for (o = t + "=", i = n.split(";"), s = 0, undefined; s < i.length; s++) {
        var o;
        var i;
        var s;
        n = i[s];
        if ((n = e.trim(n)) && 0 === n.indexOf(o)) {
          r = n.substring(o.length, i[s].length);
          break;
        }
      }
    return r;
  };
  e.trim = function (e) {
    return "string" == typeof e ? e.replace(/^\s+|\s+$/g, "") : "";
  };
  e.int32ArrayToBase64 = function (e) {
    var t = function (e, t) {
      return String.fromCharCode((e >> t) & 255);
    };
    var n = e
      .map(function (e) {
        return t(e, 24) + t(e, 16) + t(e, 8) + t(e, 0);
      })
      .join("");
    var r = (
      Buffer.from ? Buffer.from(n, "binary") : new Buffer(n, "binary")
    ).toString("base64");
    return r.substr(0, r.indexOf("="));
  };
  e.random32 = function () {
    return (4294967296 * Math.random()) | 0;
  };
  e.randomu32 = function () {
    return e.random32() + 2147483648;
  };
  e.w3cTraceId = function () {
    for (
      n = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
      ],
        r = "",
        o = 0,
        undefined;
      o < 4;
      o++
    ) {
      var t;
      var n;
      var r;
      var o;
      r +=
        n[15 & (t = e.random32())] +
        n[(t >> 4) & 15] +
        n[(t >> 8) & 15] +
        n[(t >> 12) & 15] +
        n[(t >> 16) & 15] +
        n[(t >> 20) & 15] +
        n[(t >> 24) & 15] +
        n[(t >> 28) & 15];
    }
    var i = n[(8 + 4 * Math.random()) | 0];
    return (
      r.substr(0, 8) +
      r.substr(9, 4) +
      "4" +
      r.substr(13, 3) +
      i +
      r.substr(16, 3) +
      r.substr(19, 12)
    );
  };
  e.isValidW3CId = function (e) {
    return 32 === e.length && "00000000000000000000000000000000" !== e;
  };
  e.isArray = function (e) {
    return "[object Array]" === Object.prototype.toString.call(e);
  };
  e.isError = function (e) {
    return e instanceof Error;
  };
  e.isPrimitive = function (e) {
    var t = typeof e;
    return "string" === t || "number" === t || "boolean" === t;
  };
  e.isDate = function (e) {
    return "[object Date]" === Object.prototype.toString.call(e);
  };
  e.msToTimeSpan = function (e) {
    if (isNaN(e) || e < 0) {
      e = 0;
    }
    var t = ((e / 1e3) % 60).toFixed(7).replace(/0{0,4}$/, "");
    var n = "" + (Math.floor(e / 6e4) % 60);
    var r = "" + (Math.floor(e / 36e5) % 24);
    var o = Math.floor(e / 864e5);
    t = t.indexOf(".") < 2 ? "0" + t : t;
    n = n.length < 2 ? "0" + n : n;
    return (
      (o > 0 ? o + "." : "") +
      (r = r.length < 2 ? "0" + r : r) +
      ":" +
      n +
      ":" +
      t
    );
  };
  e.extractError = function (e) {
    var t = e;
    return {
      message: e.message,
      code: t.code || t.id || "",
    };
  };
  e.extractObject = function (t) {
    return t instanceof Error
      ? e.extractError(t)
      : "function" == typeof t.toJSON
      ? t.toJSON()
      : t;
  };
  e.validateStringMap = function (t) {
    if ("object" == typeof t) {
      var n = {};
      for (var r in t) {
        var o = "";
        var i = t[r];
        var s = typeof i;
        if (e.isPrimitive(i)) o = i.toString();
        else if (null === i || "undefined" === s) o = "";
        else {
          if ("function" === s) {
            M_logging_maybe.info(
              "key: " + r + " was function; will not serialize"
            );
            continue;
          }
          var a = e.isArray(i) ? i : e.extractObject(i);
          try {
            o = e.isPrimitive(a) ? a : JSON.stringify(a);
          } catch (e) {
            o = i.constructor.name.toString() + " (Error: " + e.message + ")";
            M_logging_maybe.info("key: " + r + ", could not be serialized");
          }
        }
        n[r] = o.substring(0, e.MAX_PROPERTY_LENGTH);
      }
      return n;
    }
    M_logging_maybe.info("Invalid properties dropped from payload");
  };
  e.canIncludeCorrelationHeader = function (e, t) {
    var n = e && e.config && e.config.correlationHeaderExcludedDomains;
    if (!n || 0 == n.length || !t) return !0;
    for (var r = 0; r < n.length; r++)
      if (
        new RegExp(n[r].replace(/\./g, ".").replace(/\*/g, ".*")).test(
          M_url.parse(t).hostname
        )
      )
        return !1;
    return !0;
  };
  e.getCorrelationContextTarget = function (e, t) {
    var n =
      e.headers && e.headers[M_request_context_maybe.requestContextHeader];
    if (n)
      for (r = n.split(","), o = 0, undefined; o < r.length; ++o) {
        var r;
        var o;
        var i = r[o].split("=");
        if (2 == i.length && i[0] == t) return i[1];
      }
  };
  e.makeRequest = function (t, n, a, l) {
    if (n && 0 === n.indexOf("//")) {
      n = "https:" + n;
    }
    var u = M_url.parse(n);
    var d = r({}, a, {
      host: u.hostname,
      port: u.port,
      path: u.pathname,
    });
    var p = undefined;
    if ("https:" === u.protocol) {
      p = t.proxyHttpsUrl || undefined;
    }
    if ("http:" === u.protocol) {
      p = t.proxyHttpUrl || undefined;
    }
    if (p) {
      0 === p.indexOf("//") && (p = "http:" + p);
      var h = M_url.parse(p);
      "https:" === h.protocol
        ? (M_logging_maybe.info("Proxies that use HTTPS are not supported"),
          (p = void 0))
        : (d = r({}, d, {
            host: h.hostname,
            port: h.port || "80",
            path: n,
            headers: r({}, d.headers, {
              Host: u.hostname,
            }),
          }));
    }
    var f = "https:" === u.protocol && !p;
    if (f && undefined !== t.httpsAgent) {
      d.agent = t.httpsAgent;
    } else {
      if (f || undefined === t.httpAgent) {
        if (f) {
          d.agent = e.tlsRestrictedAgent;
        }
      } else {
        d.agent = t.httpAgent;
      }
    }
    return f ? M_https.request(d, l) : M_http.request(d, l);
  };
  e.safeIncludeCorrelationHeader = function (t, n, r) {
    var o;
    if ("string" == typeof r) o = r;
    else if (r instanceof Array) o = r.join(",");
    else if (r && "function" == typeof r.toString)
      try {
        o = r.toString();
      } catch (e) {
        M_logging_maybe.warn(
          "Outgoing request-context header could not be read. Correlation of requests may be lost.",
          e,
          r
        );
      }
    if (o) {
      e.addCorrelationIdHeaderFromString(t, n, o);
    } else {
      n.setHeader(
        M_request_context_maybe.requestContextHeader,
        M_request_context_maybe.requestContextSourceKey +
          "=" +
          t.config.correlationId
      );
    }
  };
  e.addCorrelationIdHeaderFromString = function (e, t, n) {
    var r = n.split(",");
    var o = M_request_context_maybe.requestContextSourceKey + "=";
    if (
      r.some(function (e) {
        return e.substring(0, o.length) === o;
      })
    ) {
      t.setHeader(
        M_request_context_maybe.requestContextHeader,
        n +
          "," +
          M_request_context_maybe.requestContextSourceKey +
          "=" +
          e.config.correlationId
      );
    }
  };
  e.MAX_PROPERTY_LENGTH = 8192;
  e.tlsRestrictedAgent = new M_https.Agent({
    secureOptions:
      M_constants.SSL_OP_NO_SSLv2 |
      M_constants.SSL_OP_NO_SSLv3 |
      M_constants.SSL_OP_NO_TLSv1 |
      M_constants.SSL_OP_NO_TLSv1_1,
  });
  return e;
})();
module.exports = u;
