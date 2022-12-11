var r;
require.r(exports);
require.d(exports, {
  URI: () => o,
  Utils: () => i,
});
r = (() => {
  var e = {
    470: (e) => {
      function t(e) {
        if ("string" != typeof e)
          throw new TypeError(
            "Path must be a string. Received " + JSON.stringify(e)
          );
      }
      function n(e, t) {
        for (
          r = "", o = 0, i = -1, s = 0, a = 0, undefined;
          a <= e.length;
          ++a
        ) {
          var n;
          var r;
          var o;
          var i;
          var s;
          var a;
          if (a < e.length) n = e.charCodeAt(a);
          else {
            if (47 === n) break;
            n = 47;
          }
          if (47 === n) {
            if (i === a - 1 || 1 === s);
            else if (i !== a - 1 && 2 === s) {
              if (
                r.length < 2 ||
                2 !== o ||
                46 !== r.charCodeAt(r.length - 1) ||
                46 !== r.charCodeAt(r.length - 2)
              )
                if (r.length > 2) {
                  var c = r.lastIndexOf("/");
                  if (c !== r.length - 1) {
                    if (-1 === c) {
                      r = "";
                      o = 0;
                    } else {
                      o = (r = r.slice(0, c)).length - 1 - r.lastIndexOf("/");
                    }
                    i = a;
                    s = 0;
                    continue;
                  }
                } else if (2 === r.length || 1 === r.length) {
                  r = "";
                  o = 0;
                  i = a;
                  s = 0;
                  continue;
                }
              if (t) {
                if (r.length > 0) {
                  r += "/..";
                } else {
                  r = "..";
                }
                o = 2;
              }
            } else {
              if (r.length > 0) {
                r += "/" + e.slice(i + 1, a);
              } else {
                r = e.slice(i + 1, a);
              }
              o = a - i - 1;
            }
            i = a;
            s = 0;
          } else if (46 === n && -1 !== s) {
            ++s;
          } else {
            s = -1;
          }
        }
        return r;
      }
      var r = {
        resolve: function () {
          for (
            r = "", o = !1, i = arguments.length - 1, undefined;
            i >= -1 && !o;
            i--
          ) {
            var e;
            var r;
            var o;
            var i;
            var s;
            if (i >= 0) {
              s = arguments[i];
            } else {
              if (undefined === e) {
                e = process.cwd();
              }
              s = e;
            }
            t(s);
            if (0 !== s.length) {
              r = s + "/" + r;
              o = 47 === s.charCodeAt(0);
            }
          }
          r = n(r, !o);
          return o ? (r.length > 0 ? "/" + r : "/") : r.length > 0 ? r : ".";
        },
        normalize: function (e) {
          t(e);
          if (0 === e.length) return ".";
          var r = 47 === e.charCodeAt(0);
          var o = 47 === e.charCodeAt(e.length - 1);
          if (0 !== (e = n(e, !r)).length || r) {
            e = ".";
          }
          if (e.length > 0 && o) {
            e += "/";
          }
          return r ? "/" + e : e;
        },
        isAbsolute: function (e) {
          t(e);
          return e.length > 0 && 47 === e.charCodeAt(0);
        },
        join: function () {
          if (0 === arguments.length) return ".";
          for (n = 0, undefined; n < arguments.length; ++n) {
            var e;
            var n;
            var o = arguments[n];
            t(o);
            if (o.length > 0) {
              if (undefined === e) {
                e = o;
              } else {
                e += "/" + o;
              }
            }
          }
          return undefined === e ? "." : r.normalize(e);
        },
        relative: function (e, n) {
          t(e);
          t(n);
          if (e === n) return "";
          if ((e = r.resolve(e)) === (n = r.resolve(n))) return "";
          for (var o = 1; o < e.length && 47 === e.charCodeAt(o); ++o);
          for (
            i = e.length, s = i - o, a = 1, undefined;
            a < n.length && 47 === n.charCodeAt(a);
            ++a
          ) {
            var i;
            var s;
            var a;
          }
          for (
            c = n.length - a, l = s < c ? s : c, u = -1, d = 0, undefined;
            d <= l;
            ++d
          ) {
            var c;
            var l;
            var u;
            var d;
            if (d === l) {
              if (c > l) {
                if (47 === n.charCodeAt(a + d)) return n.slice(a + d + 1);
                if (0 === d) return n.slice(a + d);
              } else if (s > l) {
                if (47 === e.charCodeAt(o + d)) {
                  u = d;
                } else {
                  if (0 === d) {
                    u = 0;
                  }
                }
              }
              break;
            }
            var p = e.charCodeAt(o + d);
            if (p !== n.charCodeAt(a + d)) break;
            if (47 === p) {
              u = d;
            }
          }
          var h = "";
          for (d = o + u + 1; d <= i; ++d)
            if (d !== i && 47 !== e.charCodeAt(d)) {
              if (0 === h.length) {
                h += "..";
              } else {
                h += "/..";
              }
            }
          return h.length > 0
            ? h + n.slice(a + u)
            : ((a += u), 47 === n.charCodeAt(a) && ++a, n.slice(a));
        },
        _makeLong: function (e) {
          return e;
        },
        dirname: function (e) {
          t(e);
          if (0 === e.length) return ".";
          for (
            n = e.charCodeAt(0),
              r = 47 === n,
              o = -1,
              i = !0,
              s = e.length - 1,
              undefined;
            s >= 1;
            --s
          ) {
            var n;
            var r;
            var o;
            var i;
            var s;
            if (47 === (n = e.charCodeAt(s))) {
              if (!i) {
                o = s;
                break;
              }
            } else i = !1;
          }
          return -1 === o
            ? r
              ? "/"
              : "."
            : r && 1 === o
            ? "//"
            : e.slice(0, o);
        },
        basename: function (e, n) {
          if (undefined !== n && "string" != typeof n)
            throw new TypeError('"ext" argument must be a string');
          t(e);
          var r;
          var o = 0;
          var i = -1;
          var s = !0;
          if (undefined !== n && n.length > 0 && n.length <= e.length) {
            if (n.length === e.length && n === e) return "";
            var a = n.length - 1;
            var c = -1;
            for (r = e.length - 1; r >= 0; --r) {
              var l = e.charCodeAt(r);
              if (47 === l) {
                if (!s) {
                  o = r + 1;
                  break;
                }
              } else {
                if (-1 === c) {
                  s = !1;
                  c = r + 1;
                }
                if (a >= 0) {
                  if (l === n.charCodeAt(a)) {
                    if (-1 == --a) {
                      i = r;
                    }
                  } else {
                    a = -1;
                    i = c;
                  }
                }
              }
            }
            if (o === i) {
              i = c;
            } else {
              if (-1 === i) {
                i = e.length;
              }
            }
            return e.slice(o, i);
          }
          for (r = e.length - 1; r >= 0; --r)
            if (47 === e.charCodeAt(r)) {
              if (!s) {
                o = r + 1;
                break;
              }
            } else if (-1 === i) {
              s = !1;
              i = r + 1;
            }
          return -1 === i ? "" : e.slice(o, i);
        },
        extname: function (e) {
          t(e);
          for (
            n = -1, r = 0, o = -1, i = !0, s = 0, a = e.length - 1, undefined;
            a >= 0;
            --a
          ) {
            var n;
            var r;
            var o;
            var i;
            var s;
            var a;
            var c = e.charCodeAt(a);
            if (47 !== c) {
              if (-1 === o) {
                i = !1;
                o = a + 1;
              }
              if (46 === c) {
                if (-1 === n) {
                  n = a;
                } else {
                  if (1 !== s) {
                    s = 1;
                  }
                }
              } else {
                if (-1 !== n) {
                  s = -1;
                }
              }
            } else if (!i) {
              r = a + 1;
              break;
            }
          }
          return -1 === n ||
            -1 === o ||
            0 === s ||
            (1 === s && n === o - 1 && n === r + 1)
            ? ""
            : e.slice(n, o);
        },
        format: function (e) {
          if (null === e || "object" != typeof e)
            throw new TypeError(
              'The "pathObject" argument must be of type Object. Received type ' +
                typeof e
            );
          return (function (e, t) {
            var n = t.dir || t.root;
            var r = t.base || (t.name || "") + (t.ext || "");
            return n ? (n === t.root ? n + r : n + "/" + r) : r;
          })(0, e);
        },
        parse: function (e) {
          t(e);
          var n = {
            root: "",
            dir: "",
            base: "",
            ext: "",
            name: "",
          };
          if (0 === e.length) return n;
          var r;
          var o = e.charCodeAt(0);
          var i = 47 === o;
          if (i) {
            n.root = "/";
            r = 1;
          } else {
            r = 0;
          }
          for (
            s = -1, a = 0, c = -1, l = !0, u = e.length - 1, d = 0, undefined;
            u >= r;
            --u
          ) {
            var s;
            var a;
            var c;
            var l;
            var u;
            var d;
            if (47 !== (o = e.charCodeAt(u))) {
              if (-1 === c) {
                l = !1;
                c = u + 1;
              }
              if (46 === o) {
                if (-1 === s) {
                  s = u;
                } else {
                  if (1 !== d) {
                    d = 1;
                  }
                }
              } else {
                if (-1 !== s) {
                  d = -1;
                }
              }
            } else if (!l) {
              a = u + 1;
              break;
            }
          }
          if (
            -1 === s ||
            -1 === c ||
            0 === d ||
            (1 === d && s === c - 1 && s === a + 1)
          ) {
            if (-1 !== c) {
              n.base = n.name = 0 === a && i ? e.slice(1, c) : e.slice(a, c);
            }
          } else {
            if (0 === a && i) {
              n.name = e.slice(1, s);
              n.base = e.slice(1, c);
            } else {
              n.name = e.slice(a, s);
              n.base = e.slice(a, c);
            }
            n.ext = e.slice(s, c);
          }
          if (a > 0) {
            n.dir = e.slice(0, a - 1);
          } else {
            if (i) {
              n.dir = "/";
            }
          }
          return n;
        },
        sep: "/",
        delimiter: ":",
        win32: null,
        posix: null,
      };
      r.posix = r;
      e.exports = r;
    },
    447: (e, t, n) => {
      var r;
      n.r(t);
      n.d(t, {
        URI: () => f,
        Utils: () => S,
      });
      if ("object" == typeof process) r = "win32" === process.platform;
      else if ("object" == typeof navigator) {
        var o = navigator.userAgent;
        r = o.indexOf("Windows") >= 0;
      }
      var i;
      var s;
      var a =
        ((i = function (e, t) {
          return (i =
            Object.setPrototypeOf ||
            ({
              __proto__: [],
            } instanceof Array &&
              function (e, t) {
                e.__proto__ = t;
              }) ||
            function (e, t) {
              for (var n in t)
                if (Object.prototype.hasOwnProperty.call(t, n)) {
                  e[n] = t[n];
                }
            })(e, t);
        }),
        function (e, t) {
          function n() {
            this.constructor = e;
          }
          i(e, t);
          e.prototype =
            null === t
              ? Object.create(t)
              : ((n.prototype = t.prototype), new n());
        });
      var c = /^\w[\w\d+.-]*$/;
      var l = /^\//;
      var u = /^\/\//;
      var d = "";
      var p = "/";
      var h = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
      var f = (function () {
        function e(e, t, n, r, o, i) {
          if (undefined === i) {
            i = !1;
          }
          if ("object" == typeof e) {
            this.scheme = e.scheme || d;
            this.authority = e.authority || d;
            this.path = e.path || d;
            this.query = e.query || d;
            this.fragment = e.fragment || d;
          } else {
            this.scheme = (function (e, t) {
              return e || t ? e : "file";
            })(e, i);
            this.authority = t || d;
            this.path = (function (e, t) {
              switch (e) {
                case "https":
                case "http":
                case "file":
                  if (t) {
                    if (t[0] !== p) {
                      t = p + t;
                    }
                  } else {
                    t = p;
                  }
              }
              return t;
            })(this.scheme, n || d);
            this.query = r || d;
            this.fragment = o || d;
            (function (e, t) {
              if (!e.scheme && t)
                throw new Error(
                  '[UriError]: Scheme is missing: {scheme: "", authority: "' +
                    e.authority +
                    '", path: "' +
                    e.path +
                    '", query: "' +
                    e.query +
                    '", fragment: "' +
                    e.fragment +
                    '"}'
                );
              if (e.scheme && !c.test(e.scheme))
                throw new Error(
                  "[UriError]: Scheme contains illegal characters."
                );
              if (e.path)
                if (e.authority) {
                  if (!l.test(e.path))
                    throw new Error(
                      '[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character'
                    );
                } else if (u.test(e.path))
                  throw new Error(
                    '[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")'
                  );
            })(this, i);
          }
        }
        e.isUri = function (t) {
          return (
            t instanceof e ||
            (!!t &&
              "string" == typeof t.authority &&
              "string" == typeof t.fragment &&
              "string" == typeof t.path &&
              "string" == typeof t.query &&
              "string" == typeof t.scheme &&
              "function" == typeof t.fsPath &&
              "function" == typeof t.with &&
              "function" == typeof t.toString)
          );
        };
        Object.defineProperty(e.prototype, "fsPath", {
          get: function () {
            return b(this, !1);
          },
          enumerable: !1,
          configurable: !0,
        });
        e.prototype.with = function (e) {
          if (!e) return this;
          var t = e.scheme;
          var n = e.authority;
          var r = e.path;
          var o = e.query;
          var i = e.fragment;
          if (undefined === t) {
            t = this.scheme;
          } else {
            if (null === t) {
              t = d;
            }
          }
          if (undefined === n) {
            n = this.authority;
          } else {
            if (null === n) {
              n = d;
            }
          }
          if (undefined === r) {
            r = this.path;
          } else {
            if (null === r) {
              r = d;
            }
          }
          if (undefined === o) {
            o = this.query;
          } else {
            if (null === o) {
              o = d;
            }
          }
          if (undefined === i) {
            i = this.fragment;
          } else {
            if (null === i) {
              i = d;
            }
          }
          return t === this.scheme &&
            n === this.authority &&
            r === this.path &&
            o === this.query &&
            i === this.fragment
            ? this
            : new g(t, n, r, o, i);
        };
        e.parse = function (e, t) {
          if (undefined === t) {
            t = !1;
          }
          var n = h.exec(e);
          return n
            ? new g(
                n[2] || d,
                C(n[4] || d),
                C(n[5] || d),
                C(n[7] || d),
                C(n[9] || d),
                t
              )
            : new g(d, d, d, d, d);
        };
        e.file = function (e) {
          var t = d;
          if (r) {
            e = e.replace(/\\/g, p);
          }
          if (e[0] === p && e[1] === p) {
            var n = e.indexOf(p, 2);
            -1 === n
              ? ((t = e.substring(2)), (e = p))
              : ((t = e.substring(2, n)), (e = e.substring(n) || p));
          }
          return new g("file", t, e, d, d);
        };
        e.from = function (e) {
          return new g(e.scheme, e.authority, e.path, e.query, e.fragment);
        };
        e.prototype.toString = function (e) {
          if (undefined === e) {
            e = !1;
          }
          return w(this, e);
        };
        e.prototype.toJSON = function () {
          return this;
        };
        e.revive = function (t) {
          if (t) {
            if (t instanceof e) return t;
            var n = new g(t);
            n._formatted = t.external;
            n._fsPath = t._sep === m ? t.fsPath : null;
            return n;
          }
          return t;
        };
        return e;
      })();
      var m = r ? 1 : undefined;
      var g = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          t._formatted = null;
          t._fsPath = null;
          return t;
        }
        a(t, e);
        Object.defineProperty(t.prototype, "fsPath", {
          get: function () {
            if (this._fsPath) {
              this._fsPath = b(this, !1);
            }
            return this._fsPath;
          },
          enumerable: !1,
          configurable: !0,
        });
        t.prototype.toString = function (e) {
          if (undefined === e) {
            e = !1;
          }
          return e
            ? w(this, !0)
            : (this._formatted || (this._formatted = w(this, !1)),
              this._formatted);
        };
        t.prototype.toJSON = function () {
          var e = {
            $mid: 1,
          };
          if (this._fsPath) {
            e.fsPath = this._fsPath;
            e._sep = m;
          }
          if (this._formatted) {
            e.external = this._formatted;
          }
          if (this.path) {
            e.path = this.path;
          }
          if (this.scheme) {
            e.scheme = this.scheme;
          }
          if (this.authority) {
            e.authority = this.authority;
          }
          if (this.query) {
            e.query = this.query;
          }
          if (this.fragment) {
            e.fragment = this.fragment;
          }
          return e;
        };
        return t;
      })(f);
      var _ =
        (((s = {})[58] = "%3A"),
        (s[47] = "%2F"),
        (s[63] = "%3F"),
        (s[35] = "%23"),
        (s[91] = "%5B"),
        (s[93] = "%5D"),
        (s[64] = "%40"),
        (s[33] = "%21"),
        (s[36] = "%24"),
        (s[38] = "%26"),
        (s[39] = "%27"),
        (s[40] = "%28"),
        (s[41] = "%29"),
        (s[42] = "%2A"),
        (s[43] = "%2B"),
        (s[44] = "%2C"),
        (s[59] = "%3B"),
        (s[61] = "%3D"),
        (s[32] = "%20"),
        s);
      function y(e, t) {
        for (n = undefined, r = -1, o = 0, undefined; o < e.length; o++) {
          var n;
          var r;
          var o;
          var i = e.charCodeAt(o);
          if (
            (i >= 97 && i <= 122) ||
            (i >= 65 && i <= 90) ||
            (i >= 48 && i <= 57) ||
            45 === i ||
            46 === i ||
            95 === i ||
            126 === i ||
            (t && 47 === i)
          ) {
            if (-1 !== r) {
              n += encodeURIComponent(e.substring(r, o));
              r = -1;
            }
            if (undefined !== n) {
              n += e.charAt(o);
            }
          } else {
            if (undefined === n) {
              n = e.substr(0, o);
            }
            var s = _[i];
            if (undefined !== s) {
              if (-1 !== r) {
                n += encodeURIComponent(e.substring(r, o));
                r = -1;
              }
              n += s;
            } else {
              if (-1 === r) {
                r = o;
              }
            }
          }
        }
        if (-1 !== r) {
          n += encodeURIComponent(e.substring(r));
        }
        return undefined !== n ? n : e;
      }
      function v(e) {
        for (t = undefined, n = 0, undefined; n < e.length; n++) {
          var t;
          var n;
          var r = e.charCodeAt(n);
          if (35 === r || 63 === r) {
            if (undefined === t) {
              t = e.substr(0, n);
            }
            t += _[r];
          } else {
            if (undefined !== t) {
              t += e[n];
            }
          }
        }
        return undefined !== t ? t : e;
      }
      function b(e, t) {
        var n;
        n =
          e.authority && e.path.length > 1 && "file" === e.scheme
            ? "//" + e.authority + e.path
            : 47 === e.path.charCodeAt(0) &&
              ((e.path.charCodeAt(1) >= 65 && e.path.charCodeAt(1) <= 90) ||
                (e.path.charCodeAt(1) >= 97 && e.path.charCodeAt(1) <= 122)) &&
              58 === e.path.charCodeAt(2)
            ? t
              ? e.path.substr(1)
              : e.path[1].toLowerCase() + e.path.substr(2)
            : e.path;
        if (r) {
          n = n.replace(/\//g, "\\");
        }
        return n;
      }
      function w(e, t) {
        var n = t ? v : y;
        var r = "";
        var o = e.scheme;
        var i = e.authority;
        var s = e.path;
        var a = e.query;
        var c = e.fragment;
        if (o) {
          r += o;
          r += ":";
        }
        if (i || "file" === o) {
          r += p;
          r += p;
        }
        if (i) {
          var l = i.indexOf("@");
          if (-1 !== l) {
            var u = i.substr(0, l);
            (i = i.substr(l + 1)),
              -1 === (l = u.indexOf(":"))
                ? (r += n(u, !1))
                : ((r += n(u.substr(0, l), !1)),
                  (r += ":"),
                  (r += n(u.substr(l + 1), !1))),
              (r += "@");
          }
          -1 === (l = (i = i.toLowerCase()).indexOf(":"))
            ? (r += n(i, !1))
            : ((r += n(i.substr(0, l), !1)), (r += i.substr(l)));
        }
        if (s) {
          if (
            s.length >= 3 &&
            47 === s.charCodeAt(0) &&
            58 === s.charCodeAt(2)
          ) {
            if ((d = s.charCodeAt(1)) >= 65 && d <= 90) {
              s = "/" + String.fromCharCode(d + 32) + ":" + s.substr(3);
            }
          } else if (s.length >= 2 && 58 === s.charCodeAt(1)) {
            var d;
            if ((d = s.charCodeAt(0)) >= 65 && d <= 90) {
              s = String.fromCharCode(d + 32) + ":" + s.substr(2);
            }
          }
          r += n(s, !0);
        }
        if (a) {
          r += "?";
          r += n(a, !1);
        }
        if (c) {
          r += "#";
          r += t ? c : y(c, !1);
        }
        return r;
      }
      function x(e) {
        try {
          return decodeURIComponent(e);
        } catch (t) {
          return e.length > 3 ? e.substr(0, 3) + x(e.substr(3)) : e;
        }
      }
      var E = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
      function C(e) {
        return e.match(E)
          ? e.replace(E, function (e) {
              return x(e);
            })
          : e;
      }
      var S;
      var T = n(470);
      var k = function () {
        for (e = 0, t = 0, n = arguments.length, undefined; t < n; t++) {
          var e;
          var t;
          var n;
          e += arguments[t].length;
        }
        var r = Array(e);
        var o = 0;
        for (t = 0; t < n; t++)
          for (
            i = arguments[t], s = 0, a = i.length, undefined;
            s < a;
            s++, o++
          ) {
            var i;
            var s;
            var a;
            r[o] = i[s];
          }
        return r;
      };
      var I = T.posix || T;
      !(function (e) {
        e.joinPath = function (e) {
          for (t = [], n = 1, undefined; n < arguments.length; n++) {
            var t;
            var n;
            t[n - 1] = arguments[n];
          }
          return e.with({
            path: I.join.apply(I, k([e.path], t)),
          });
        };
        e.resolvePath = function (e) {
          for (t = [], n = 1, undefined; n < arguments.length; n++) {
            var t;
            var n;
            t[n - 1] = arguments[n];
          }
          var r = e.path || "/";
          return e.with({
            path: I.resolve.apply(I, k([r], t)),
          });
        };
        e.dirname = function (e) {
          var t = I.dirname(e.path);
          return 1 === t.length && 46 === t.charCodeAt(0)
            ? e
            : e.with({
                path: t,
              });
        };
        e.basename = function (e) {
          return I.basename(e.path);
        };
        e.extname = function (e) {
          return I.extname(e.path);
        };
      })(S || (S = {}));
    },
  };
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var o = (t[r] = {
      exports: {},
    });
    e[r](o, o.exports, n);
    return o.exports;
  }
  n.d = (e, t) => {
    for (var r in t)
      if (n.o(t, r) && !n.o(e, r)) {
        Object.defineProperty(e, r, {
          enumerable: !0,
          get: t[r],
        });
      }
  };
  n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t);
  n.r = (e) => {
    if ("undefined" != typeof Symbol && Symbol.toStringTag) {
      Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module",
      });
    }
    Object.defineProperty(e, "__esModule", {
      value: !0,
    });
  };
  return n(447);
})();
const { URI: o, Utils: i } = r;
