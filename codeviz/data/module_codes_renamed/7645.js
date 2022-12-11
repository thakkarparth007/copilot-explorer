if (process.addAsyncListener)
  throw new Error("Don't require polyfill unless needed");
var M_wrap_logger_maybe = require("wrap-logger");
var M_semver_maybe = require("semver");
var i = M_wrap_logger_maybe.wrap;
var s = M_wrap_logger_maybe.massWrap;
var M_error_handler_maybe = require("error-handler");
var M_util = require("util");
var l = M_semver_maybe.gte(process.version, "6.0.0");
var u = M_semver_maybe.gte(process.version, "7.0.0");
var d = M_semver_maybe.gte(process.version, "8.0.0");
var p = M_semver_maybe.gte(process.version, "11.0.0");
var M_net = require("net");
function f(e) {
  return function () {
    this.on("connection", function (e) {
      if (e._handle) {
        e._handle.onread = M_error_handler_maybe(e._handle.onread);
      }
    });
    try {
      return e.apply(this, arguments);
    } finally {
      if (this._handle && this._handle.onconnection) {
        this._handle.onconnection = M_error_handler_maybe(
          this._handle.onconnection
        );
      }
    }
  };
}
function m(e) {
  if (e && e._handle) {
    var t = e._handle;
    if (t._originalOnread) {
      t._originalOnread = t.onread;
    }
    t.onread = M_error_handler_maybe(t._originalOnread);
  }
}
if (u && !M_net._normalizeArgs) {
  M_net._normalizeArgs = function (e) {
    if (0 === e.length) return [{}, null];
    var t;
    var n;
    var r = e[0];
    var o = {};
    if ("object" == typeof r && null !== r) {
      o = r;
    } else {
      if (
        "string" == typeof (t = r) &&
        !1 === ((n = t), (n = Number(n)) >= 0 && n)
      ) {
        o.path = r;
      } else {
        o.port = r;
        if (e.length > 1 && "string" == typeof e[1]) {
          o.host = e[1];
        }
      }
    }
    var i = e[e.length - 1];
    return "function" != typeof i ? [o, null] : [o, i];
  };
} else {
  if (u || M_net._normalizeConnectArgs) {
    M_net._normalizeConnectArgs = function (e) {
      var t;
      var n = {};
      if ("object" == typeof e[0] && null !== e[0]) {
        n = e[0];
      } else {
        if (
          "string" == typeof e[0] &&
          !1 === ((t = e[0]), (t = Number(t)) >= 0 && t)
        ) {
          n.path = e[0];
        } else {
          n.port = e[0];
          if ("string" == typeof e[1]) {
            n.host = e[1];
          }
        }
      }
      var r = e[e.length - 1];
      return "function" == typeof r ? [n, r] : [n];
    };
  }
}
if ("_setUpListenHandle" in M_net.Server.prototype) {
  i(M_net.Server.prototype, "_setUpListenHandle", f);
} else {
  i(M_net.Server.prototype, "_listen2", f);
}
i(M_net.Socket.prototype, "connect", function (e) {
  return function () {
    var t;
    if (
      (t =
        d &&
        Array.isArray(arguments[0]) &&
        Object.getOwnPropertySymbols(arguments[0]).length > 0
          ? arguments[0]
          : u
          ? M_net._normalizeArgs(arguments)
          : M_net._normalizeConnectArgs(arguments))[1]
    ) {
      t[1] = M_error_handler_maybe(t[1]);
    }
    var n = e.apply(this, t);
    m(this);
    return n;
  };
});
var M_http = require("http");
i(M_http.Agent.prototype, "addRequest", function (e) {
  return function (t) {
    var n = t.onSocket;
    t.onSocket = M_error_handler_maybe(function (e) {
      m(e);
      return n.apply(this, arguments);
    });
    return e.apply(this, arguments);
  };
});
var M_child_process = require("child_process");
function y(e) {
  if (Array.isArray(e.stdio)) {
    e.stdio.forEach(function (e) {
      if (e && e._handle) {
        e._handle.onread = M_error_handler_maybe(e._handle.onread);
        i(e._handle, "close", N);
      }
    });
  }
  if (e._handle) {
    e._handle.onexit = M_error_handler_maybe(e._handle.onexit);
  }
}
if (M_child_process.ChildProcess) {
  i(M_child_process.ChildProcess.prototype, "spawn", function (e) {
    return function () {
      var t = e.apply(this, arguments);
      y(this);
      return t;
    };
  });
} else {
  s(M_child_process, ["execFile", "fork", "spawn"], function (e) {
    return function () {
      var t = e.apply(this, arguments);
      y(t);
      return t;
    };
  });
}
if (process._fatalException) {
  process._originalNextTick = process.nextTick;
}
var v = [];
if (process._nextDomainTick) {
  v.push("_nextDomainTick");
}
if (process._tickDomainCallback) {
  v.push("_tickDomainCallback");
}
s(process, v, O);
i(process, "nextTick", N);
var b = ["setTimeout", "setInterval"];
if (global.setImmediate) {
  b.push("setImmediate");
}
var M_timers = require("timers");
var x = global.setTimeout === M_timers.setTimeout;
s(M_timers, b, N);
if (x) {
  s(global, b, N);
}
var M_dns = require("dns");
s(
  M_dns,
  [
    "lookup",
    "resolve",
    "resolve4",
    "resolve6",
    "resolveCname",
    "resolveMx",
    "resolveNs",
    "resolveTxt",
    "resolveSrv",
    "reverse",
  ],
  O
);
if (M_dns.resolveNaptr) {
  i(M_dns, "resolveNaptr", O);
}
var M_zlib;
var M_crypto;
var M_fs = require("fs");
s(
  M_fs,
  [
    "watch",
    "rename",
    "truncate",
    "chown",
    "fchown",
    "chmod",
    "fchmod",
    "stat",
    "lstat",
    "fstat",
    "link",
    "symlink",
    "readlink",
    "realpath",
    "unlink",
    "rmdir",
    "mkdir",
    "readdir",
    "close",
    "open",
    "utimes",
    "futimes",
    "fsync",
    "write",
    "read",
    "readFile",
    "writeFile",
    "appendFile",
    "watchFile",
    "unwatchFile",
    "exists",
  ],
  O
);
if (M_fs.lchown) {
  i(M_fs, "lchown", O);
}
if (M_fs.lchmod) {
  i(M_fs, "lchmod", O);
}
if (M_fs.ftruncate) {
  i(M_fs, "ftruncate", O);
}
try {
  M_zlib = require("zlib");
} catch (e) {}
if (M_zlib && M_zlib.Deflate && M_zlib.Deflate.prototype) {
  var k = Object.getPrototypeOf(M_zlib.Deflate.prototype);
  if (k._transform) {
    i(k, "_transform", O);
  } else {
    if (k.write && k.flush && k.end) {
      s(k, ["write", "flush", "end"], O);
    }
  }
}
try {
  M_crypto = require("crypto");
} catch (e) {}
if (M_crypto) {
  var I = ["pbkdf2", "randomBytes"];
  if (p) {
    I.push("pseudoRandomBytes");
  }
  s(M_crypto, I, O);
}
var P =
  !!global.Promise &&
  "function Promise() { [native code] }" === Promise.toString() &&
  "function toString() { [native code] }" === Promise.toString.toString();
if (P) {
  var A = process.addAsyncListener({
    create: function () {
      P = !1;
    },
  });
  global.Promise.resolve(!0).then(function () {
    P = !1;
  });
  process.removeAsyncListener(A);
}
function O(e) {
  var t = function () {
    var t;
    var n = arguments.length - 1;
    if ("function" == typeof arguments[n]) {
      t = Array(arguments.length);
      for (var r = 0; r < arguments.length - 1; r++) t[r] = arguments[r];
      t[n] = M_error_handler_maybe(arguments[n]);
    }
    return e.apply(this, t || arguments);
  };
  switch (e.length) {
    case 1:
      return function (n) {
        return 1 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof n && (n = M_error_handler_maybe(n)),
            e.call(this, n));
      };
    case 2:
      return function (n, r) {
        return 2 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof r && (r = M_error_handler_maybe(r)),
            e.call(this, n, r));
      };
    case 3:
      return function (n, r, o) {
        return 3 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof o && (o = M_error_handler_maybe(o)),
            e.call(this, n, r, o));
      };
    case 4:
      return function (n, r, o, i) {
        return 4 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof i && (i = M_error_handler_maybe(i)),
            e.call(this, n, r, o, i));
      };
    case 5:
      return function (n, r, o, i, s) {
        return 5 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof s && (s = M_error_handler_maybe(s)),
            e.call(this, n, r, o, i, s));
      };
    case 6:
      return function (n, r, o, i, s, c) {
        return 6 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof c && (c = M_error_handler_maybe(c)),
            e.call(this, n, r, o, i, s, c));
      };
    default:
      return t;
  }
}
function N(e) {
  var t = function () {
    var t;
    if ("function" == typeof arguments[0]) {
      (t = Array(arguments.length))[0] = M_error_handler_maybe(arguments[0]);
      for (var n = 1; n < arguments.length; n++) t[n] = arguments[n];
    }
    return e.apply(this, t || arguments);
  };
  switch (e.length) {
    case 1:
      return function (n) {
        return 1 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof n && (n = M_error_handler_maybe(n)),
            e.call(this, n));
      };
    case 2:
      return function (n, r) {
        return 2 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof n && (n = M_error_handler_maybe(n)),
            e.call(this, n, r));
      };
    case 3:
      return function (n, r, o) {
        return 3 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof n && (n = M_error_handler_maybe(n)),
            e.call(this, n, r, o));
      };
    case 4:
      return function (n, r, o, i) {
        return 4 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof n && (n = M_error_handler_maybe(n)),
            e.call(this, n, r, o, i));
      };
    case 5:
      return function (n, r, o, i, s) {
        return 5 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof n && (n = M_error_handler_maybe(n)),
            e.call(this, n, r, o, i, s));
      };
    case 6:
      return function (n, r, o, i, s, c) {
        return 6 !== arguments.length
          ? t.apply(this, arguments)
          : ("function" == typeof n && (n = M_error_handler_maybe(n)),
            e.call(this, n, r, o, i, s, c));
      };
    default:
      return t;
  }
}
if (P) {
  (function () {
    var e = global.Promise;
    function t(n) {
      if (!(this instanceof t)) return e(n);
      if ("function" != typeof n) return new e(n);
      var o;
      var i;
      var s = new e(function (e, t) {
        o = this;
        i = [
          function (t) {
            r(s, !1);
            return e(t);
          },
          function (e) {
            r(s, !1);
            return t(e);
          },
        ];
      });
      s.__proto__ = t.prototype;
      try {
        n.apply(o, i);
      } catch (e) {
        i[1](e);
      }
      return s;
    }
    function r(e, t) {
      if (e.__asl_wrapper && !t) {
        e.__asl_wrapper = M_error_handler_maybe(o);
      }
    }
    function o(t, n, i, s) {
      var a;
      try {
        return {
          returnVal: (a = n.call(t, i)),
          error: !1,
        };
      } catch (e) {
        return {
          errorVal: e,
          error: !0,
        };
      } finally {
        if (a instanceof e) {
          s.__asl_wrapper = function () {
            return (a.__asl_wrapper || o).apply(this, arguments);
          };
        } else {
          r(s, !0);
        }
      }
    }
    function s(e) {
      return function () {
        var t = this;
        var n = e.apply(t, Array.prototype.map.call(arguments, r));
        n.__asl_wrapper = function (e, r, i, s) {
          return t.__asl_wrapper
            ? (t.__asl_wrapper(e, function () {}, null, n),
              n.__asl_wrapper(e, r, i, s))
            : o(e, r, i, s);
        };
        return n;
        function r(e) {
          return "function" != typeof e
            ? e
            : M_error_handler_maybe(function (r) {
                var i = (t.__asl_wrapper || o)(this, e, r, n);
                if (i.error) throw i.errorVal;
                return i.returnVal;
              });
        }
      };
    }
    M_util.inherits(t, e);
    i(e.prototype, "then", s);
    if (e.prototype.chain) {
      i(e.prototype, "chain", s);
    }
    if (l) {
      global.Promise = require("promise-tracker")(e, r);
    } else {
      ["all", "race", "reject", "resolve", "accept", "defer"].forEach(function (
        n
      ) {
        if ("function" == typeof e[n]) {
          t[n] = e[n];
        }
      });
      global.Promise = t;
    }
  })();
}
