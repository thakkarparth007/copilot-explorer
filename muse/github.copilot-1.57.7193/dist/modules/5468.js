require(1808);
var debug,
  o = require(4404),
  i = require(3685),
  s = require(5687),
  a = require(2361),
  c = (require(9491), require(3837));
function l(e) {
  var t = this;
  t.options = e || {};
  t.proxyOptions = t.options.proxy || {};
  t.maxSockets = t.options.maxSockets || i.Agent.defaultMaxSockets;
  t.requests = [];
  t.sockets = [];
  t.on("free", function (e, n, r, o) {
    for (var i = d(n, r, o), s = 0, a = t.requests.length; s < a; ++s) {
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
    var i = e.request.getHeader("host"),
      s = p({}, n.options, {
        socket: r,
        servername: i ? i.replace(/:.*$/, "") : e.host
      }),
      a = o.connect(0, s);
    n.sockets[n.sockets.indexOf(r)] = a;
    t(a);
  });
}
function d(e, t, n) {
  return "string" == typeof e ? {
    host: e,
    port: t,
    localAddress: n
  } : e;
}
function p(e) {
  for (var t = 1, n = arguments.length; t < n; ++t) {
    var r = arguments[t];
    if ("object" == typeof r) for (var o = Object.keys(r), i = 0, s = o.length; i < s; ++i) {
      var a = o[i];
      undefined !== r[a] && (e[a] = r[a]);
    }
  }
  return e;
}
exports.httpOverHttp = function (e) {
  var t = new l(e);
  t.request = i.request;
  return t;
};
exports.httpsOverHttp = function (e) {
  var t = new l(e);
  t.request = i.request;
  t.createSocket = u;
  t.defaultPort = 443;
  return t;
};
exports.httpOverHttps = function (e) {
  var t = new l(e);
  t.request = s.request;
  return t;
};
exports.httpsOverHttps = function (e) {
  var t = new l(e);
  t.request = s.request;
  t.createSocket = u;
  t.defaultPort = 443;
  return t;
};
c.inherits(l, a.EventEmitter);
l.prototype.addRequest = function (e, t, n, r) {
  var o = this,
    i = p({
      request: e
    }, o.options, d(t, n, r));
  o.sockets.length >= this.maxSockets ? o.requests.push(i) : o.createSocket(i, function (t) {
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
};
l.prototype.createSocket = function (e, t) {
  var n = this,
    o = {};
  n.sockets.push(o);
  var i = p({}, n.proxyOptions, {
    method: "CONNECT",
    path: e.host + ":" + e.port,
    agent: !1,
    headers: {
      host: e.host + ":" + e.port
    }
  });
  e.localAddress && (i.localAddress = e.localAddress);
  i.proxyAuth && (i.headers = i.headers || {}, i.headers["Proxy-Authorization"] = "Basic " + new Buffer(i.proxyAuth).toString("base64"));
  debug("making CONNECT request");
  var s = n.request(i);
  function a(i, a, c) {
    var l;
    s.removeAllListeners();
    a.removeAllListeners();
    return 200 !== i.statusCode ? (debug("tunneling socket could not be established, statusCode=%d", i.statusCode), a.destroy(), (l = new Error("tunneling socket could not be established, statusCode=" + i.statusCode)).code = "ECONNRESET", e.request.emit("error", l), void n.removeSocket(o)) : c.length > 0 ? (debug("got illegal response body from proxy"), a.destroy(), (l = new Error("got illegal response body from proxy")).code = "ECONNRESET", e.request.emit("error", l), void n.removeSocket(o)) : (debug("tunneling connection has established"), n.sockets[n.sockets.indexOf(o)] = a, t(a));
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
    debug("tunneling socket could not be established, cause=%s\n", t.message, t.stack);
    var i = new Error("tunneling socket could not be established, cause=" + t.message);
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
    n && this.createSocket(n, function (e) {
      n.request.onSocket(e);
    });
  }
};
debug = process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG) ? function () {
  var e = Array.prototype.slice.call(arguments);
  "string" == typeof e[0] ? e[0] = "TUNNEL: " + e[0] : e.unshift("TUNNEL:");
  console.error.apply(console, e);
} : function () {};
exports.debug = debug;