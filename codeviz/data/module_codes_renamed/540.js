!(function (e) {
  "use strict";

  function t() {
    for (e = arguments.length, t = Array(e), n = 0, undefined; n < e; n++) {
      var e;
      var t;
      var n;
      t[n] = arguments[n];
    }
    if (t.length > 1) {
      t[0] = t[0].slice(0, -1);
      for (r = t.length - 1, o = 1, undefined; o < r; ++o) {
        var r;
        var o;
        t[o] = t[o].slice(1, -1);
      }
      t[r] = t[r].slice(1);
      return t.join("");
    }
    return t[0];
  }
  function n(e) {
    return "(?:" + e + ")";
  }
  function r(e) {
    return undefined === e
      ? "undefined"
      : null === e
      ? "null"
      : Object.prototype.toString
          .call(e)
          .split(" ")
          .pop()
          .split("]")
          .shift()
          .toLowerCase();
  }
  function o(e) {
    return e.toUpperCase();
  }
  function i(e) {
    var r = "[A-Za-z]";
    var o = "[0-9]";
    var i = t(o, "[A-Fa-f]");
    var s = n(
      n("%[EFef]" + i + "%" + i + i + "%" + i + i) +
        "|" +
        n("%[89A-Fa-f]" + i + "%" + i + i) +
        "|" +
        n("%" + i + i)
    );
    var a = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]";
    var c = t("[\\:\\/\\?\\#\\[\\]\\@]", a);
    var l = e ? "[\\uE000-\\uF8FF]" : "[]";
    var u = t(
      r,
      o,
      "[\\-\\.\\_\\~]",
      e
        ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]"
        : "[]"
    );
    var d = n(r + t(r, o, "[\\+\\-\\.]") + "*");
    var p = n(n(s + "|" + t(u, a, "[\\:]")) + "*");
    var h =
      (n(
        n("25[0-5]") +
          "|" +
          n("2[0-4][0-9]") +
          "|" +
          n("1[0-9][0-9]") +
          "|" +
          n("[1-9][0-9]") +
          "|" +
          o
      ),
      n(
        n("25[0-5]") +
          "|" +
          n("2[0-4][0-9]") +
          "|" +
          n("1[0-9][0-9]") +
          "|" +
          n("0?[1-9][0-9]") +
          "|0?0?" +
          o
      ));
    var f = n(h + "\\." + h + "\\." + h + "\\." + h);
    var m = n(i + "{1,4}");
    var g = n(n(m + "\\:" + m) + "|" + f);
    var _ = n(n(m + "\\:") + "{6}" + g);
    var y = n("\\:\\:" + n(m + "\\:") + "{5}" + g);
    var v = n(n(m) + "?\\:\\:" + n(m + "\\:") + "{4}" + g);
    var b = n(
      n(n(m + "\\:") + "{0,1}" + m) + "?\\:\\:" + n(m + "\\:") + "{3}" + g
    );
    var w = n(
      n(n(m + "\\:") + "{0,2}" + m) + "?\\:\\:" + n(m + "\\:") + "{2}" + g
    );
    var x = n(n(n(m + "\\:") + "{0,3}" + m) + "?\\:\\:" + m + "\\:" + g);
    var E = n(n(n(m + "\\:") + "{0,4}" + m) + "?\\:\\:" + g);
    var C = n(n(n(m + "\\:") + "{0,5}" + m) + "?\\:\\:" + m);
    var S = n(n(n(m + "\\:") + "{0,6}" + m) + "?\\:\\:");
    var T = n([_, y, v, b, w, x, E, C, S].join("|"));
    var k = n(n(u + "|" + s) + "+");
    var I = (n(T + "\\%25" + k), n(T + n("\\%25|\\%(?!" + i + "{2})") + k));
    var P = n("[vV]" + i + "+\\." + t(u, a, "[\\:]") + "+");
    var A = n("\\[" + n(I + "|" + T + "|" + P) + "\\]");
    var O = n(n(s + "|" + t(u, a)) + "*");
    var N = n(A + "|" + f + "(?!" + O + ")|" + O);
    var R = n("[0-9]*");
    var M = n(n(p + "@") + "?" + N + n("\\:" + R) + "?");
    var L = n(s + "|" + t(u, a, "[\\:\\@]"));
    var $ = n(L + "*");
    var D = n(L + "+");
    var F = n(n(s + "|" + t(u, a, "[\\@]")) + "+");
    var j = n(n("\\/" + $) + "*");
    var q = n("\\/" + n(D + j) + "?");
    var B = n(F + j);
    var U = n(D + j);
    var H = "(?!" + L + ")";
    var z =
      (n(j + "|" + q + "|" + B + "|" + U + "|" + H),
      n(n(L + "|" + t("[\\/\\?]", l)) + "*"));
    var G = n(n(L + "|[\\/\\?]") + "*");
    var V = n(n("\\/\\/" + M + j) + "|" + q + "|" + U + "|" + H);
    var W = n(d + "\\:" + V + n("\\?" + z) + "?" + n("\\#" + G) + "?");
    var K = n(n("\\/\\/" + M + j) + "|" + q + "|" + B + "|" + H);
    var J = n(K + n("\\?" + z) + "?" + n("\\#" + G) + "?");
    n(W + "|" + J);
    n(d + "\\:" + V + n("\\?" + z) + "?");
    n(
      n(
        "\\/\\/(" +
          n("(" + p + ")@") +
          "?(" +
          N +
          ")" +
          n("\\:(" + R + ")") +
          "?)"
      ) +
        "?(" +
        j +
        "|" +
        q +
        "|" +
        U +
        "|" +
        H +
        ")"
    );
    n("\\?(" + z + ")");
    n("\\#(" + G + ")");
    n(
      n(
        "\\/\\/(" +
          n("(" + p + ")@") +
          "?(" +
          N +
          ")" +
          n("\\:(" + R + ")") +
          "?)"
      ) +
        "?(" +
        j +
        "|" +
        q +
        "|" +
        B +
        "|" +
        H +
        ")"
    );
    n("\\?(" + z + ")");
    n("\\#(" + G + ")");
    n(
      n(
        "\\/\\/(" +
          n("(" + p + ")@") +
          "?(" +
          N +
          ")" +
          n("\\:(" + R + ")") +
          "?)"
      ) +
        "?(" +
        j +
        "|" +
        q +
        "|" +
        U +
        "|" +
        H +
        ")"
    );
    n("\\?(" + z + ")");
    n("\\#(" + G + ")");
    n("(" + p + ")@");
    n("\\:(" + R + ")");
    return {
      NOT_SCHEME: new RegExp(t("[^]", r, o, "[\\+\\-\\.]"), "g"),
      NOT_USERINFO: new RegExp(t("[^\\%\\:]", u, a), "g"),
      NOT_HOST: new RegExp(t("[^\\%\\[\\]\\:]", u, a), "g"),
      NOT_PATH: new RegExp(t("[^\\%\\/\\:\\@]", u, a), "g"),
      NOT_PATH_NOSCHEME: new RegExp(t("[^\\%\\/\\@]", u, a), "g"),
      NOT_QUERY: new RegExp(t("[^\\%]", u, a, "[\\:\\@\\/\\?]", l), "g"),
      NOT_FRAGMENT: new RegExp(t("[^\\%]", u, a, "[\\:\\@\\/\\?]"), "g"),
      ESCAPE: new RegExp(t("[^]", u, a), "g"),
      UNRESERVED: new RegExp(u, "g"),
      OTHER_CHARS: new RegExp(t("[^\\%]", u, c), "g"),
      PCT_ENCODED: new RegExp(s, "g"),
      IPV4ADDRESS: new RegExp("^(" + f + ")$"),
      IPV6ADDRESS: new RegExp(
        "^\\[?(" +
          T +
          ")" +
          n(n("\\%25|\\%(?!" + i + "{2})") + "(" + k + ")") +
          "?\\]?$"
      ),
    };
  }
  var s = i(!1);
  var a = i(!0);
  var c = function (e, t) {
    if (Array.isArray(e)) return e;
    if (Symbol.iterator in Object(e))
      return (function (e, t) {
        var n = [];
        var r = !0;
        var o = !1;
        var i = undefined;
        try {
          for (
            a = e[Symbol.iterator](), undefined;
            !(r = (s = a.next()).done) &&
            (n.push(s.value), !t || n.length !== t);
            r = !0
          ) {
            var s;
            var a;
          }
        } catch (e) {
          o = !0;
          i = e;
        } finally {
          try {
            if (!r && a.return) {
              a.return();
            }
          } finally {
            if (o) throw i;
          }
        }
        return n;
      })(e, t);
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  };
  var l = 2147483647;
  var u = 36;
  var d = /^xn--/;
  var p = /[^\0-\x7E]/;
  var h = /[\x2E\u3002\uFF0E\uFF61]/g;
  var f = {
    overflow: "Overflow: input needs wider integers to process",
    "not-basic": "Illegal input >= 0x80 (not a basic code point)",
    "invalid-input": "Invalid input",
  };
  var m = Math.floor;
  var g = String.fromCharCode;
  function _(e) {
    throw new RangeError(f[e]);
  }
  function y(e, t) {
    var n = e.split("@");
    var r = "";
    if (n.length > 1) {
      r = n[0] + "@";
      e = n[1];
    }
    return (
      r +
      (function (e, t) {
        for (n = [], r = e.length, undefined; r--; ) {
          var n;
          var r;
          n[r] = t(e[r]);
        }
        return n;
      })((e = e.replace(h, ".")).split("."), t).join(".")
    );
  }
  function v(e) {
    for (t = [], n = 0, r = e.length, undefined; n < r; ) {
      var t;
      var n;
      var r;
      var o = e.charCodeAt(n++);
      if (o >= 55296 && o <= 56319 && n < r) {
        var i = e.charCodeAt(n++);
        if (56320 == (64512 & i)) {
          t.push(((1023 & o) << 10) + (1023 & i) + 65536);
        } else {
          t.push(o);
          n--;
        }
      } else t.push(o);
    }
    return t;
  }
  var b = function (e, t) {
    return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
  };
  var w = function (e, t, n) {
    var r = 0;
    for (e = n ? m(e / 700) : e >> 1, e += m(e / t); e > 455; r += u)
      e = m(e / 35);
    return m(r + (36 * e) / (e + 38));
  };
  var x = function (e) {
    var t;
    var n = [];
    var r = e.length;
    var o = 0;
    var i = 128;
    var s = 72;
    var a = e.lastIndexOf("-");
    if (a < 0) {
      a = 0;
    }
    for (var c = 0; c < a; ++c) {
      if (e.charCodeAt(c) >= 128) {
        _("not-basic");
      }
      n.push(e.charCodeAt(c));
    }
    for (var d = a > 0 ? a + 1 : 0; d < r; ) {
      for (p = o, h = 1, f = u, undefined; ; f += u) {
        var p;
        var h;
        var f;
        if (d >= r) {
          _("invalid-input");
        }
        var g =
          (t = e.charCodeAt(d++)) - 48 < 10
            ? t - 22
            : t - 65 < 26
            ? t - 65
            : t - 97 < 26
            ? t - 97
            : u;
        if (g >= u || g > m((l - o) / h)) {
          _("overflow");
        }
        o += g * h;
        var y = f <= s ? 1 : f >= s + 26 ? 26 : f - s;
        if (g < y) break;
        var v = u - y;
        if (h > m(l / v)) {
          _("overflow");
        }
        h *= v;
      }
      var b = n.length + 1;
      s = w(o - p, b, 0 == p);
      if (m(o / b) > l - i) {
        _("overflow");
      }
      i += m(o / b);
      o %= b;
      n.splice(o++, 0, i);
    }
    return String.fromCodePoint.apply(String, n);
  };
  var E = function (e) {
    var t = [];
    var n = (e = v(e)).length;
    var r = 128;
    var o = 0;
    var i = 72;
    var s = !0;
    var a = !1;
    var c = undefined;
    try {
      for (
        p = e[Symbol.iterator](), undefined;
        !(s = (d = p.next()).done);
        s = !0
      ) {
        var d;
        var p;
        var h = d.value;
        if (h < 128) {
          t.push(g(h));
        }
      }
    } catch (e) {
      a = !0;
      c = e;
    } finally {
      try {
        if (!s && p.return) {
          p.return();
        }
      } finally {
        if (a) throw c;
      }
    }
    var f = t.length;
    var y = f;
    for (f && t.push("-"); y < n; ) {
      var x = l;
      var E = !0;
      var C = !1;
      var S = undefined;
      try {
        for (
          k = e[Symbol.iterator](), undefined;
          !(E = (T = k.next()).done);
          E = !0
        ) {
          var T;
          var k;
          var I = T.value;
          if (I >= r && I < x) {
            x = I;
          }
        }
      } catch (e) {
        C = !0;
        S = e;
      } finally {
        try {
          if (!E && k.return) {
            k.return();
          }
        } finally {
          if (C) throw S;
        }
      }
      var P = y + 1;
      if (x - r > m((l - o) / P)) {
        _("overflow");
      }
      o += (x - r) * P;
      r = x;
      var A = !0;
      var O = !1;
      var N = undefined;
      try {
        for (
          M = e[Symbol.iterator](), undefined;
          !(A = (R = M.next()).done);
          A = !0
        ) {
          var R;
          var M;
          var L = R.value;
          if (L < r && ++o > l) {
            _("overflow");
          }
          if (L == r) {
            for (var $ = o, D = u; ; D += u) {
              var F = D <= i ? 1 : D >= i + 26 ? 26 : D - i;
              if ($ < F) break;
              var j = $ - F,
                q = u - F;
              t.push(g(b(F + (j % q), 0))), ($ = m(j / q));
            }
            t.push(g(b($, 0))), (i = w(o, P, y == f)), (o = 0), ++y;
          }
        }
      } catch (e) {
        O = !0;
        N = e;
      } finally {
        try {
          if (!A && M.return) {
            M.return();
          }
        } finally {
          if (O) throw N;
        }
      }
      ++o;
      ++r;
    }
    return t.join("");
  };
  var C = function (e) {
    return y(e, function (e) {
      return p.test(e) ? "xn--" + E(e) : e;
    });
  };
  var S = function (e) {
    return y(e, function (e) {
      return d.test(e) ? x(e.slice(4).toLowerCase()) : e;
    });
  };
  var T = {};
  function k(e) {
    var t = e.charCodeAt(0);
    return t < 16
      ? "%0" + t.toString(16).toUpperCase()
      : t < 128
      ? "%" + t.toString(16).toUpperCase()
      : t < 2048
      ? "%" +
        ((t >> 6) | 192).toString(16).toUpperCase() +
        "%" +
        ((63 & t) | 128).toString(16).toUpperCase()
      : "%" +
        ((t >> 12) | 224).toString(16).toUpperCase() +
        "%" +
        (((t >> 6) & 63) | 128).toString(16).toUpperCase() +
        "%" +
        ((63 & t) | 128).toString(16).toUpperCase();
  }
  function I(e) {
    for (t = "", n = 0, r = e.length, undefined; n < r; ) {
      var t;
      var n;
      var r;
      var o = parseInt(e.substr(n + 1, 2), 16);
      if (o < 128) {
        t += String.fromCharCode(o);
        n += 3;
      } else if (o >= 194 && o < 224) {
        if (r - n >= 6) {
          var i = parseInt(e.substr(n + 4, 2), 16);
          t += String.fromCharCode(((31 & o) << 6) | (63 & i));
        } else t += e.substr(n, 6);
        n += 6;
      } else if (o >= 224) {
        if (r - n >= 9) {
          var s = parseInt(e.substr(n + 4, 2), 16);
          var a = parseInt(e.substr(n + 7, 2), 16);
          t += String.fromCharCode(
            ((15 & o) << 12) | ((63 & s) << 6) | (63 & a)
          );
        } else t += e.substr(n, 9);
        n += 9;
      } else {
        t += e.substr(n, 3);
        n += 3;
      }
    }
    return t;
  }
  function P(e, t) {
    function n(e) {
      var n = I(e);
      return n.match(t.UNRESERVED) ? n : e;
    }
    if (e.scheme) {
      e.scheme = String(e.scheme)
        .replace(t.PCT_ENCODED, n)
        .toLowerCase()
        .replace(t.NOT_SCHEME, "");
    }
    if (undefined !== e.userinfo) {
      e.userinfo = String(e.userinfo)
        .replace(t.PCT_ENCODED, n)
        .replace(t.NOT_USERINFO, k)
        .replace(t.PCT_ENCODED, o);
    }
    if (undefined !== e.host) {
      e.host = String(e.host)
        .replace(t.PCT_ENCODED, n)
        .toLowerCase()
        .replace(t.NOT_HOST, k)
        .replace(t.PCT_ENCODED, o);
    }
    if (undefined !== e.path) {
      e.path = String(e.path)
        .replace(t.PCT_ENCODED, n)
        .replace(e.scheme ? t.NOT_PATH : t.NOT_PATH_NOSCHEME, k)
        .replace(t.PCT_ENCODED, o);
    }
    if (undefined !== e.query) {
      e.query = String(e.query)
        .replace(t.PCT_ENCODED, n)
        .replace(t.NOT_QUERY, k)
        .replace(t.PCT_ENCODED, o);
    }
    if (undefined !== e.fragment) {
      e.fragment = String(e.fragment)
        .replace(t.PCT_ENCODED, n)
        .replace(t.NOT_FRAGMENT, k)
        .replace(t.PCT_ENCODED, o);
    }
    return e;
  }
  function A(e) {
    return e.replace(/^0*(.*)/, "$1") || "0";
  }
  function O(e, t) {
    var n = e.match(t.IPV4ADDRESS) || [];
    var r = c(n, 2)[1];
    return r ? r.split(".").map(A).join(".") : e;
  }
  function N(e, t) {
    var n = e.match(t.IPV6ADDRESS) || [];
    var r = c(n, 3);
    var o = r[1];
    var i = r[2];
    if (o) {
      for (
        s = o.toLowerCase().split("::").reverse(),
          a = c(s, 2),
          l = a[0],
          u = a[1],
          d = u ? u.split(":").map(A) : [],
          p = l.split(":").map(A),
          h = t.IPV4ADDRESS.test(p[p.length - 1]),
          f = h ? 7 : 8,
          m = p.length - f,
          g = Array(f),
          _ = 0,
          undefined;
        _ < f;
        ++_
      ) {
        var s;
        var a;
        var l;
        var u;
        var d;
        var p;
        var h;
        var f;
        var m;
        var g;
        var _;
        g[_] = d[_] || p[m + _] || "";
      }
      if (h) {
        g[f - 1] = O(g[f - 1], t);
      }
      var y = g
        .reduce(function (e, t, n) {
          if (!t || "0" === t) {
            var r = e[e.length - 1];
            if (r && r.index + r.length === n) {
              r.length++;
            } else {
              e.push({
                index: n,
                length: 1,
              });
            }
          }
          return e;
        }, [])
        .sort(function (e, t) {
          return t.length - e.length;
        })[0];
      var v = undefined;
      if (y && y.length > 1) {
        var b = g.slice(0, y.index);
        var w = g.slice(y.index + y.length);
        v = b.join(":") + "::" + w.join(":");
      } else v = g.join(":");
      if (i) {
        v += "%" + i;
      }
      return v;
    }
    return e;
  }
  var R =
    /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i;
  var M = undefined === "".match(/(){0}/)[1];
  function L(e) {
    var t =
      arguments.length > 1 && undefined !== arguments[1] ? arguments[1] : {};
    var n = {};
    var r = !1 !== t.iri ? a : s;
    if ("suffix" === t.reference) {
      e = (t.scheme ? t.scheme + ":" : "") + "//" + e;
    }
    var o = e.match(R);
    if (o) {
      if (M) {
        n.scheme = o[1];
        n.userinfo = o[3];
        n.host = o[4];
        n.port = parseInt(o[5], 10);
        n.path = o[6] || "";
        n.query = o[7];
        n.fragment = o[8];
        if (isNaN(n.port)) {
          n.port = o[5];
        }
      } else {
        n.scheme = o[1] || undefined;
        n.userinfo = -1 !== e.indexOf("@") ? o[3] : undefined;
        n.host = -1 !== e.indexOf("//") ? o[4] : undefined;
        n.port = parseInt(o[5], 10);
        n.path = o[6] || "";
        n.query = -1 !== e.indexOf("?") ? o[7] : undefined;
        n.fragment = -1 !== e.indexOf("#") ? o[8] : undefined;
        if (isNaN(n.port)) {
          n.port = e.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? o[4] : undefined;
        }
      }
      if (n.host) {
        n.host = N(O(n.host, r), r);
      }
      if (
        undefined !== n.scheme ||
        undefined !== n.userinfo ||
        undefined !== n.host ||
        undefined !== n.port ||
        n.path ||
        undefined !== n.query
      ) {
        if (undefined === n.scheme) {
          n.reference = "relative";
        } else {
          if (undefined === n.fragment) {
            n.reference = "absolute";
          } else {
            n.reference = "uri";
          }
        }
      } else {
        n.reference = "same-document";
      }
      if (
        t.reference &&
        "suffix" !== t.reference &&
        t.reference !== n.reference
      ) {
        n.error = n.error || "URI is not a " + t.reference + " reference.";
      }
      var i = T[(t.scheme || n.scheme || "").toLowerCase()];
      if (t.unicodeSupport || (i && i.unicodeSupport)) P(n, r);
      else {
        if (n.host && (t.domainHost || (i && i.domainHost)))
          try {
            n.host = C(n.host.replace(r.PCT_ENCODED, I).toLowerCase());
          } catch (e) {
            n.error =
              n.error ||
              "Host's domain name can not be converted to ASCII via punycode: " +
                e;
          }
        P(n, s);
      }
      if (i && i.parse) {
        i.parse(n, t);
      }
    } else n.error = n.error || "URI can not be parsed.";
    return n;
  }
  function $(e, t) {
    var n = !1 !== t.iri ? a : s;
    var r = [];
    if (undefined !== e.userinfo) {
      r.push(e.userinfo);
      r.push("@");
    }
    if (undefined !== e.host) {
      r.push(
        N(O(String(e.host), n), n).replace(n.IPV6ADDRESS, function (e, t, n) {
          return "[" + t + (n ? "%25" + n : "") + "]";
        })
      );
    }
    if ("number" != typeof e.port && "string" != typeof e.port) {
      r.push(":");
      r.push(String(e.port));
    }
    return r.length ? r.join("") : undefined;
  }
  var D = /^\.\.?\//;
  var F = /^\/\.(\/|$)/;
  var j = /^\/\.\.(\/|$)/;
  var q = /^\/?(?:.|\n)*?(?=\/|$)/;
  function B(e) {
    for (var t = []; e.length; )
      if (e.match(D)) e = e.replace(D, "");
      else if (e.match(F)) e = e.replace(F, "/");
      else if (e.match(j)) {
        e = e.replace(j, "/");
        t.pop();
      } else if ("." === e || ".." === e) e = "";
      else {
        var n = e.match(q);
        if (!n) throw new Error("Unexpected dot segment condition");
        var r = n[0];
        e = e.slice(r.length);
        t.push(r);
      }
    return t.join("");
  }
  function U(e) {
    var t =
      arguments.length > 1 && undefined !== arguments[1] ? arguments[1] : {};
    var n = t.iri ? a : s;
    var r = [];
    var o = T[(t.scheme || e.scheme || "").toLowerCase()];
    if (o && o.serialize) {
      o.serialize(e, t);
    }
    if (e.host)
      if (n.IPV6ADDRESS.test(e.host));
      else if (t.domainHost || (o && o.domainHost))
        try {
          e.host = t.iri
            ? S(e.host)
            : C(e.host.replace(n.PCT_ENCODED, I).toLowerCase());
        } catch (n) {
          e.error =
            e.error ||
            "Host's domain name can not be converted to " +
              (t.iri ? "Unicode" : "ASCII") +
              " via punycode: " +
              n;
        }
    P(e, n);
    if ("suffix" !== t.reference && e.scheme) {
      r.push(e.scheme);
      r.push(":");
    }
    var i = $(e, t);
    if (undefined !== i) {
      if ("suffix" !== t.reference) {
        r.push("//");
      }
      r.push(i);
      if (e.path && "/" !== e.path.charAt(0)) {
        r.push("/");
      }
    }
    if (void 0 !== e.path) {
      var c = e.path;
      t.absolutePath || (o && o.absolutePath) || (c = B(c)),
        void 0 === i && (c = c.replace(/^\/\//, "/%2F")),
        r.push(c);
    }
    if (undefined !== e.query) {
      r.push("?");
      r.push(e.query);
    }
    if (undefined !== e.fragment) {
      r.push("#");
      r.push(e.fragment);
    }
    return r.join("");
  }
  function H(e, t) {
    var n =
      arguments.length > 2 && undefined !== arguments[2] ? arguments[2] : {};
    var r = {};
    if (arguments[3]) {
      e = L(U(e, n), n);
      t = L(U(t, n), n);
    }
    if (!(n = n || {}).tolerant && t.scheme) {
      r.scheme = t.scheme;
      r.userinfo = t.userinfo;
      r.host = t.host;
      r.port = t.port;
      r.path = B(t.path || "");
      r.query = t.query;
    } else {
      if (
        undefined !== t.userinfo ||
        undefined !== t.host ||
        undefined !== t.port
      ) {
        r.userinfo = t.userinfo;
        r.host = t.host;
        r.port = t.port;
        r.path = B(t.path || "");
        r.query = t.query;
      } else {
        if (t.path) {
          if ("/" === t.path.charAt(0)) {
            r.path = B(t.path);
          } else {
            if (
              (undefined === e.userinfo &&
                undefined === e.host &&
                undefined === e.port) ||
              e.path
            ) {
              if (e.path) {
                r.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path;
              } else {
                r.path = t.path;
              }
            } else {
              r.path = "/" + t.path;
            }
            r.path = B(r.path);
          }
          r.query = t.query;
        } else {
          r.path = e.path;
          if (undefined !== t.query) {
            r.query = t.query;
          } else {
            r.query = e.query;
          }
        }
        r.userinfo = e.userinfo;
        r.host = e.host;
        r.port = e.port;
      }
      r.scheme = e.scheme;
    }
    r.fragment = t.fragment;
    return r;
  }
  function z(e, t) {
    return (
      e && e.toString().replace(t && t.iri ? a.PCT_ENCODED : s.PCT_ENCODED, I)
    );
  }
  var G = {
    scheme: "http",
    domainHost: !0,
    parse: function (e, t) {
      if (e.host) {
        e.error = e.error || "HTTP URIs must have a host.";
      }
      return e;
    },
    serialize: function (e, t) {
      var n = "https" === String(e.scheme).toLowerCase();
      if (e.port !== (n ? 443 : 80) && "" !== e.port) {
        e.port = undefined;
      }
      if (e.path) {
        e.path = "/";
      }
      return e;
    },
  };
  var V = {
    scheme: "https",
    domainHost: G.domainHost,
    parse: G.parse,
    serialize: G.serialize,
  };
  function W(e) {
    return "boolean" == typeof e.secure
      ? e.secure
      : "wss" === String(e.scheme).toLowerCase();
  }
  var K = {
    scheme: "ws",
    domainHost: !0,
    parse: function (e, t) {
      var n = e;
      n.secure = W(n);
      n.resourceName = (n.path || "/") + (n.query ? "?" + n.query : "");
      n.path = undefined;
      n.query = undefined;
      return n;
    },
    serialize: function (e, t) {
      if (e.port !== (W(e) ? 443 : 80) && "" !== e.port) {
        e.port = undefined;
      }
      if ("boolean" == typeof e.secure) {
        e.scheme = e.secure ? "wss" : "ws";
        e.secure = undefined;
      }
      if (e.resourceName) {
        var n = e.resourceName.split("?"),
          r = c(n, 2),
          o = r[0],
          i = r[1];
        (e.path = o && "/" !== o ? o : void 0),
          (e.query = i),
          (e.resourceName = void 0);
      }
      e.fragment = undefined;
      return e;
    },
  };
  var J = {
    scheme: "wss",
    domainHost: K.domainHost,
    parse: K.parse,
    serialize: K.serialize,
  };
  var X = {};
  var Q =
    "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]";
  var Y = "[0-9A-Fa-f]";
  var Z = n(
    n("%[EFef][0-9A-Fa-f]%" + Y + Y + "%" + Y + Y) +
      "|" +
      n("%[89A-Fa-f][0-9A-Fa-f]%" + Y + Y) +
      "|" +
      n("%" + Y + Y)
  );
  var ee = t(
    "[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]",
    '[\\"\\\\]'
  );
  var te = new RegExp(Q, "g");
  var ne = new RegExp(Z, "g");
  var re = new RegExp(
    t(
      "[^]",
      "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]",
      "[\\.]",
      '[\\"]',
      ee
    ),
    "g"
  );
  var oe = new RegExp(t("[^]", Q, "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]"), "g");
  var ie = oe;
  function se(e) {
    var t = I(e);
    return t.match(te) ? t : e;
  }
  var ae = {
    scheme: "mailto",
    parse: function (e, t) {
      var n = e;
      var r = (n.to = n.path ? n.path.split(",") : []);
      n.path = undefined;
      if (n.query) {
        for (
          var o = !1, i = {}, s = n.query.split("&"), a = 0, c = s.length;
          a < c;
          ++a
        ) {
          var l = s[a].split("=");
          switch (l[0]) {
            case "to":
              for (var u = l[1].split(","), d = 0, p = u.length; d < p; ++d)
                r.push(u[d]);
              break;
            case "subject":
              n.subject = z(l[1], t);
              break;
            case "body":
              n.body = z(l[1], t);
              break;
            default:
              (o = !0), (i[z(l[0], t)] = z(l[1], t));
          }
        }
        o && (n.headers = i);
      }
      n.query = undefined;
      for (h = 0, f = r.length, undefined; h < f; ++h) {
        var h;
        var f;
        var m = r[h].split("@");
        m[0] = z(m[0]);
        if (t.unicodeSupport) m[1] = z(m[1], t).toLowerCase();
        else
          try {
            m[1] = C(z(m[1], t).toLowerCase());
          } catch (e) {
            n.error =
              n.error ||
              "Email address's domain name can not be converted to ASCII via punycode: " +
                e;
          }
        r[h] = m.join("@");
      }
      return n;
    },
    serialize: function (e, t) {
      var n;
      var r = e;
      var i =
        null != (n = e.to)
          ? n instanceof Array
            ? n
            : "number" != typeof n.length || n.split || n.setInterval || n.call
            ? [n]
            : Array.prototype.slice.call(n)
          : [];
      if (i) {
        for (s = 0, a = i.length, undefined; s < a; ++s) {
          var s;
          var a;
          var c = String(i[s]);
          var l = c.lastIndexOf("@");
          var u = c.slice(0, l).replace(ne, se).replace(ne, o).replace(re, k);
          var d = c.slice(l + 1);
          try {
            d = t.iri ? S(d) : C(z(d, t).toLowerCase());
          } catch (e) {
            r.error =
              r.error ||
              "Email address's domain name can not be converted to " +
                (t.iri ? "Unicode" : "ASCII") +
                " via punycode: " +
                e;
          }
          i[s] = u + "@" + d;
        }
        r.path = i.join(",");
      }
      var p = (e.headers = e.headers || {});
      if (e.subject) {
        p.subject = e.subject;
      }
      if (e.body) {
        p.body = e.body;
      }
      var h = [];
      for (var f in p)
        if (p[f] !== X[f]) {
          h.push(
            f.replace(ne, se).replace(ne, o).replace(oe, k) +
              "=" +
              p[f].replace(ne, se).replace(ne, o).replace(ie, k)
          );
        }
      if (h.length) {
        r.query = h.join("&");
      }
      return r;
    },
  };
  var ce = /^([^\:]+)\:(.*)/;
  var le = {
    scheme: "urn",
    parse: function (e, t) {
      var n = e.path && e.path.match(ce);
      var r = e;
      if (n) {
        var o = t.scheme || r.scheme || "urn";
        var i = n[1].toLowerCase();
        var s = n[2];
        var a = o + ":" + (t.nid || i);
        var c = T[a];
        r.nid = i;
        r.nss = s;
        r.path = undefined;
        if (c) {
          r = c.parse(r, t);
        }
      } else r.error = r.error || "URN can not be parsed.";
      return r;
    },
    serialize: function (e, t) {
      var n = t.scheme || e.scheme || "urn";
      var r = e.nid;
      var o = n + ":" + (t.nid || r);
      var i = T[o];
      if (i) {
        e = i.serialize(e, t);
      }
      var s = e;
      var a = e.nss;
      s.path = (r || t.nid) + ":" + a;
      return s;
    },
  };
  var ue = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/;
  var de = {
    scheme: "urn:uuid",
    parse: function (e, t) {
      var n = e;
      n.uuid = n.nss;
      n.nss = undefined;
      if (t.tolerant || (n.uuid && n.uuid.match(ue))) {
        n.error = n.error || "UUID is not valid.";
      }
      return n;
    },
    serialize: function (e, t) {
      var n = e;
      n.nss = (e.uuid || "").toLowerCase();
      return n;
    },
  };
  T[G.scheme] = G;
  T[V.scheme] = V;
  T[K.scheme] = K;
  T[J.scheme] = J;
  T[ae.scheme] = ae;
  T[le.scheme] = le;
  T[de.scheme] = de;
  e.SCHEMES = T;
  e.pctEncChar = k;
  e.pctDecChars = I;
  e.parse = L;
  e.removeDotSegments = B;
  e.serialize = U;
  e.resolveComponents = H;
  e.resolve = function (e, t, n) {
    var r = (function (e, t) {
      var n = e;
      if (t) for (var r in t) n[r] = t[r];
      return n;
    })(
      {
        scheme: "null",
      },
      n
    );
    return U(H(L(e, r), L(t, r), r, !0), r);
  };
  e.normalize = function (e, t) {
    if ("string" == typeof e) {
      e = U(L(e, t), t);
    } else {
      if ("object" === r(e)) {
        e = L(U(e, t), t);
      }
    }
    return e;
  };
  e.equal = function (e, t, n) {
    if ("string" == typeof e) {
      e = U(L(e, n), n);
    } else {
      if ("object" === r(e)) {
        e = U(e, n);
      }
    }
    if ("string" == typeof t) {
      t = U(L(t, n), n);
    } else {
      if ("object" === r(t)) {
        t = U(t, n);
      }
    }
    return e === t;
  };
  e.escapeComponent = function (e, t) {
    return e && e.toString().replace(t && t.iri ? a.ESCAPE : s.ESCAPE, k);
  };
  e.unescapeComponent = z;
  Object.defineProperty(e, "__esModule", {
    value: !0,
  });
})(exports);
