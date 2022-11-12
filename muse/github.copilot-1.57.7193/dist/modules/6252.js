module = require.nmd(module);
var r,
  o = require(9125).SourceMapConsumer,
  i = require(1017);
try {
  (r = require(7147)).existsSync && r.readFileSync || (r = null);
} catch (e) {}
var s = require(5420);
function a(e, t) {
  return e.require(t);
}
var c = !1,
  l = !1,
  u = !1,
  d = "auto",
  p = {},
  h = {},
  f = /^data:application\/json[^,]+base64,/,
  m = [],
  g = [];
function _() {
  return "browser" === d || "node" !== d && "undefined" != typeof window && "function" == typeof XMLHttpRequest && !(window.require && window.module && window.process && "renderer" === window.process.type);
}
function y(e) {
  return function (t) {
    for (var n = 0; n < e.length; n++) {
      var r = e[n](t);
      if (r) return r;
    }
    return null;
  };
}
var v = y(m);
function b(e, t) {
  if (!e) return t;
  var n = i.dirname(e),
    r = /^\w+:\/\/[^\/]*/.exec(n),
    o = r ? r[0] : "",
    s = n.slice(o.length);
  return o && /^\/\w\:/.test(s) ? (o += "/") + i.resolve(n.slice(o.length), t).replace(/\\/g, "/") : o + i.resolve(n.slice(o.length), t);
}
m.push(function (e) {
  e = e.trim();
  /^file:/.test(e) && (e = e.replace(/file:\/\/\/(\w:)?/, function (e, t) {
    return t ? "" : "/";
  }));
  if (e in p) return p[e];
  var t = "";
  try {
    if (r) r.existsSync(e) && (t = r.readFileSync(e, "utf8"));else {
      var n = new XMLHttpRequest();
      n.open("GET", e, !1);
      n.send(null);
      4 === n.readyState && 200 === n.status && (t = n.responseText);
    }
  } catch (e) {}
  return p[e] = t;
});
var w = y(g);
function x(e) {
  var t = h[e.source];
  if (!t) {
    var n = w(e.source);
    n ? (t = h[e.source] = {
      url: n.url,
      map: new o(n.map)
    }).map.sourcesContent && t.map.sources.forEach(function (e, n) {
      var r = t.map.sourcesContent[n];
      if (r) {
        var o = b(t.url, e);
        p[o] = r;
      }
    }) : t = h[e.source] = {
      url: null,
      map: null
    };
  }
  if (t && t.map && "function" == typeof t.map.originalPositionFor) {
    var r = t.map.originalPositionFor(e);
    if (null !== r.source) {
      r.source = b(t.url, r.source);
      return r;
    }
  }
  return e;
}
function E(e) {
  var t = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(e);
  if (t) {
    var n = x({
      source: t[2],
      line: +t[3],
      column: t[4] - 1
    });
    return "eval at " + t[1] + " (" + n.source + ":" + n.line + ":" + (n.column + 1) + ")";
  }
  return (t = /^eval at ([^(]+) \((.+)\)$/.exec(e)) ? "eval at " + t[1] + " (" + E(t[2]) + ")" : e;
}
function C() {
  var e,
    t = "";
  if (this.isNative()) t = "native";else {
    !(e = this.getScriptNameOrSourceURL()) && this.isEval() && (t = this.getEvalOrigin(), t += ", ");
    t += e || "<anonymous>";
    var n = this.getLineNumber();
    if (null != n) {
      t += ":" + n;
      var r = this.getColumnNumber();
      r && (t += ":" + r);
    }
  }
  var o = "",
    i = this.getFunctionName(),
    s = !0,
    a = this.isConstructor();
  if (this.isToplevel() || a) a ? o += "new " + (i || "<anonymous>") : i ? o += i : (o += t, s = !1);else {
    var c = this.getTypeName();
    "[object Object]" === c && (c = "null");
    var l = this.getMethodName();
    i ? (c && 0 != i.indexOf(c) && (o += c + "."), o += i, l && i.indexOf("." + l) != i.length - l.length - 1 && (o += " [as " + l + "]")) : o += c + "." + (l || "<anonymous>");
  }
  s && (o += " (" + t + ")");
  return o;
}
function S(e) {
  var t = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(e)).forEach(function (n) {
    t[n] = /^(?:is|get)/.test(n) ? function () {
      return e[n].call(e);
    } : e[n];
  });
  t.toString = C;
  return t;
}
function T(e, t) {
  undefined === t && (t = {
    nextPosition: null,
    curPosition: null
  });
  if (e.isNative()) return t.curPosition = null, e;
  var n = e.getFileName() || e.getScriptNameOrSourceURL();
  if (n) {
    var r = e.getLineNumber(),
      o = e.getColumnNumber() - 1,
      i = /^v(10\.1[6-9]|10\.[2-9][0-9]|10\.[0-9]{3,}|1[2-9]\d*|[2-9]\d|\d{3,}|11\.11)/.test("object" == typeof process && null !== process ? process.version : "") ? 0 : 62;
    1 === r && o > i && !_() && !e.isEval() && (o -= i);
    var s = x({
      source: n,
      line: r,
      column: o
    });
    t.curPosition = s;
    var a = (e = S(e)).getFunctionName;
    e.getFunctionName = function () {
      return null == t.nextPosition ? a() : t.nextPosition.name || a();
    };
    e.getFileName = function () {
      return s.source;
    };
    e.getLineNumber = function () {
      return s.line;
    };
    e.getColumnNumber = function () {
      return s.column + 1;
    };
    e.getScriptNameOrSourceURL = function () {
      return s.source;
    };
    return e;
  }
  var c = e.isEval() && e.getEvalOrigin();
  return c ? (c = E(c), (e = S(e)).getEvalOrigin = function () {
    return c;
  }, e) : e;
}
function k(e, t) {
  u && (p = {}, h = {});
  for (var n = (e.name || "Error") + ": " + (e.message || ""), r = {
      nextPosition: null,
      curPosition: null
    }, o = [], i = t.length - 1; i >= 0; i--) {
    o.push("\n    at " + T(t[i], r));
    r.nextPosition = r.curPosition;
  }
  r.curPosition = r.nextPosition = null;
  return n + o.reverse().join("");
}
function I(e) {
  var t = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(e.stack);
  if (t) {
    var n = t[1],
      o = +t[2],
      i = +t[3],
      s = p[n];
    if (!s && r && r.existsSync(n)) try {
      s = r.readFileSync(n, "utf8");
    } catch (e) {
      s = "";
    }
    if (s) {
      var a = s.split(/(?:\r\n|\r|\n)/)[o - 1];
      if (a) return n + ":" + o + "\n" + a + "\n" + new Array(i).join(" ") + "^";
    }
  }
  return null;
}
function P(e) {
  var t = I(e),
    n = function () {
      if ("object" == typeof process && null !== process) return process.stderr;
    }();
  n && n._handle && n._handle.setBlocking && n._handle.setBlocking(!0);
  t && (console.error(), console.error(t));
  console.error(e.stack);
  "object" == typeof process && null !== process && "function" == typeof process.exit && process.exit(1);
}
g.push(function (e) {
  var t,
    n = function (e) {
      var t;
      if (_()) try {
        var n = new XMLHttpRequest();
        n.open("GET", e, !1);
        n.send(null);
        t = 4 === n.readyState ? n.responseText : null;
        var r = n.getResponseHeader("SourceMap") || n.getResponseHeader("X-SourceMap");
        if (r) return r;
      } catch (e) {}
      t = v(e);
      for (var o, i, s = /(?:\/\/[@#][\s]*sourceMappingURL=([^\s'"]+)[\s]*$)|(?:\/\*[@#][\s]*sourceMappingURL=([^\s*'"]+)[\s]*(?:\*\/)[\s]*$)/gm; i = s.exec(t);) o = i;
      return o ? o[1] : null;
    }(e);
  if (!n) return null;
  if (f.test(n)) {
    var r = n.slice(n.indexOf(",") + 1);
    t = s(r, "base64").toString();
    n = e;
  } else {
    n = b(e, n);
    t = v(n);
  }
  return t ? {
    url: n,
    map: t
  } : null;
});
var A = m.slice(0),
  O = g.slice(0);
exports.wrapCallSite = T;
exports.getErrorSource = I;
exports.mapSourcePosition = x;
exports.retrieveSourceMap = w;
exports.install = function (t) {
  if ((t = t || {}).environment && (d = t.environment, -1 === ["node", "browser", "auto"].indexOf(d))) throw new Error("environment " + d + " was unknown. Available options are {auto, browser, node}");
  t.retrieveFile && (t.overrideRetrieveFile && (m.length = 0), m.unshift(t.retrieveFile));
  t.retrieveSourceMap && (t.overrideRetrieveSourceMap && (g.length = 0), g.unshift(t.retrieveSourceMap));
  if (t.hookRequire && !_()) {
    var n = a(module, "module"),
      r = n.prototype._compile;
    r.__sourceMapSupport || (n.prototype._compile = function (e, t) {
      return p[t] = e, h[t] = void 0, r.call(this, e, t);
    }, n.prototype._compile.__sourceMapSupport = !0);
  }
  u || (u = "emptyCacheBetweenOperations" in t && t.emptyCacheBetweenOperations);
  c || (c = !0, Error.prepareStackTrace = k);
  if (!l) {
    var o = !("handleUncaughtExceptions" in t) || t.handleUncaughtExceptions;
    try {
      !1 === a(module, "worker_threads").isMainThread && (o = !1);
    } catch (e) {}
    o && "object" == typeof process && null !== process && "function" == typeof process.on && (l = !0, i = process.emit, process.emit = function (e) {
      if ("uncaughtException" === e) {
        var t = arguments[1] && arguments[1].stack,
          n = this.listeners(e).length > 0;
        if (t && !n) return P(arguments[1]);
      }
      return i.apply(this, arguments);
    });
  }
  var i;
};
exports.resetRetrieveHandlers = function () {
  m.length = 0;
  g.length = 0;
  m = A.slice(0);
  g = O.slice(0);
  w = y(g);
  v = y(m);
};