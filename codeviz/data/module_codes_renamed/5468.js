require("net");
var debug;
var M_tls = require("tls");
var M_http = require("http");
var M_https = require("https");
var M_events = require("events");
var c = (require("assert"), require("util"));
function l(e) {
  var t = this;
  t.options = e || {};
  t.proxyOptions = t.options.proxy || {};
  t.maxSockets = t.options.maxSockets || M_http.Agent.defaultMaxSockets;
  t.requests = [];
  t.sockets = [];
  t.on("free", function (e, n, r, o) {
    for (i = d(n, r, o), s = 0, a = t.requests.length, undefined; s < a; ++s) {
      var i;
      var s;
      var a;
      var c = t.requests[s];
      if (c.host === i.host && c.port === i.port) {
        t.requests.splice(s, 1);
        return void c.request.onSocket(e);
      }
    }
    e.destroy();
    t.removeSocket(e);
  });
}
function u(e, t) {
  var n = this;
  l.prototype.createSocket.call(n, e, function (r) {
    var i = e.request.getHeader("host");
    var s = p({}, n.options, {
      socket: r,
      servername: i ? i.replace(/:.*$/, "") : e.host,
    });
    var a = M_tls.connect(0, s);
    n.sockets[n.sockets.indexOf(r)] = a;
    t(a);
  });
}
function d(e, t, n) {
  return "string" == typeof e
    ? {
        host: e,
        port: t,
        localAddress: n,
      }
    : e;
}
function p(e) {
  for (t = 1, n = arguments.length, undefined; t < n; ++t) {
    var t;
    var n;
    var r = arguments[t];
    if ("object" == typeof r)
      for (o = Object.keys(r), i = 0, s = o.length, undefined; i < s; ++i) {
        var o;
        var i;
        var s;
        var a = o[i];
        if (undefined !== r[a]) {
          e[a] = r[a];
        }
      }
  }
  return e;
}
exports.httpOverHttp = function (e) {
  var t = new l(e);
  t.request = M_http.request;
  return t;
};
exports.httpsOverHttp = function (e) {
  var t = new l(e);
  t.request = M_http.request;
  t.createSocket = u;
  t.defaultPort = 443;
  return t;
};
exports.httpOverHttps = function (e) {
  var t = new l(e);
  t.request = M_https.request;
  return t;
};
exports.httpsOverHttps = function (e) {
  var t = new l(e);
  t.request = M_https.request;
  t.createSocket = u;
  t.defaultPort = 443;
  return t;
};
c.inherits(l, M_events.EventEmitter);
l.prototype.addRequest = function (e, t, n, r) {
  var o = this;
  var i = p(
    {
      request: e,
    },
    o.options,
    d(t, n, r)
  );
  if (o.sockets.length >= this.maxSockets) {
    o.requests.push(i);
  } else {
    o.createSocket(i, function (t) {
      function n() {
        o.emit("free", t, i);
      }
      function r(e) {
        o.removeSocket(t);
        t.removeListener("free", n);
        t.removeListener("close", r);
        t.removeListener("agentRemove", r);
      }
      t.on("free", n);
      t.on("close", r);
      t.on("agentRemove", r);
      e.onSocket(t);
    });
  }
};
l.prototype.createSocket = function (e, t) {
  var n = this;
  var o = {};
  n.sockets.push(o);
  var i = p({}, n.proxyOptions, {
    method: "CONNECT",
    path: e.host + ":" + e.port,
    agent: !1,
    headers: {
      host: e.host + ":" + e.port,
    },
  });
  if (e.localAddress) {
    i.localAddress = e.localAddress;
  }
  if (i.proxyAuth) {
    i.headers = i.headers || {};
    i.headers["Proxy-Authorization"] =
      "Basic " + new Buffer(i.proxyAuth).toString("base64");
  }
  debug("making CONNECT request");
  var s = n.request(i);
  function a(i, a, c) {
    var l;
    s.removeAllListeners();
    a.removeAllListeners();
    return 200 !== i.statusCode
      ? (debug(
          "tunneling socket could not be established, statusCode=%d",
          i.statusCode
        ),
        a.destroy(),
        ((l = new Error(
          "tunneling socket could not be established, statusCode=" +
            i.statusCode
        )).code = "ECONNRESET"),
        e.request.emit("error", l),
        void n.removeSocket(o))
      : c.length > 0
      ? (debug("got illegal response body from proxy"),
        a.destroy(),
        ((l = new Error("got illegal response body from proxy")).code =
          "ECONNRESET"),
        e.request.emit("error", l),
        void n.removeSocket(o))
      : (debug("tunneling connection has established"),
        (n.sockets[n.sockets.indexOf(o)] = a),
        t(a));
  }
  s.useChunkedEncodingByDefault = !1;
  s.once("response", function (e) {
    e.upgrade = !0;
  });
  s.once("upgrade", function (e, t, n) {
    process.nextTick(function () {
      a(e, t, n);
    });
  });
  s.once("connect", a);
  s.once("error", function (t) {
    s.removeAllListeners();
    debug(
      "tunneling socket could not be established, cause=%s\n",
      t.message,
      t.stack
    );
    var i = new Error(
      "tunneling socket could not be established, cause=" + t.message
    );
    i.code = "ECONNRESET";
    e.request.emit("error", i);
    n.removeSocket(o);
  });
  s.end();
};
l.prototype.removeSocket = function (e) {
  var t = this.sockets.indexOf(e);
  if (-1 !== t) {
    this.sockets.splice(t, 1);
    var n = this.requests.shift();
    if (n) {
      this.createSocket(n, function (e) {
        n.request.onSocket(e);
      });
    }
  }
};
debug =
  process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)
    ? function () {
        var e = Array.prototype.slice.call(arguments);
        if ("string" == typeof e[0]) {
          e[0] = "TUNNEL: " + e[0];
        } else {
          e.unshift("TUNNEL:");
        }
        console.error.apply(console, e);
      }
    : function () {};
exports.debug = debug;
