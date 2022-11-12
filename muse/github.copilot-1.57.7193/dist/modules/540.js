!function (e) {
  "use strict";

  function t() {
    for (var e = arguments.length, t = Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    if (t.length > 1) {
      t[0] = t[0].slice(0, -1);
      for (var r = t.length - 1, o = 1; o < r; ++o) t[o] = t[o].slice(1, -1);
      t[r] = t[r].slice(1);
      return t.join("");
    }
    return t[0];
  }
  function n(e) {
    return "(?:" + e + ")";
  }
  function r(e) {
    return undefined === e ? "undefined" : null === e ? "null" : Object.prototype.toString.call(e).split(" ").pop().split("]").shift().toLowerCase();
  }
  function o(e) {
    return e.toUpperCase();
  }
  function i(e) {
    var r = "[A-Za-z]",
      o = "[0-9]",
      i = t(o, "[A-Fa-f]"),
      s = n(n("%[EFef]" + i + "%" + i + i + "%" + i + i) + "|" + n("%[89A-Fa-f]" + i + "%" + i + i) + "|" + n("%" + i + i)),
      a = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",
      c = t("[\\:\\/\\?\\#\\[\\]\\@]", a),
      l = e ? "[\\uE000-\\uF8FF]" : "[]",
      u = t(r, o, "[\\-\\.\\_\\~]", e ? "[\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]" : "[]"),
      d = n(r + t(r, o, "[\\+\\-\\.]") + "*"),
      p = n(n(s + "|" + t(u, a, "[\\:]")) + "*"),
      h = (n(n("25[0-5]") + "|" + n("2[0-4][0-9]") + "|" + n("1[0-9][0-9]") + "|" + n("[1-9][0-9]") + "|" + o), n(n("25[0-5]") + "|" + n("2[0-4][0-9]") + "|" + n("1[0-9][0-9]") + "|" + n("0?[1-9][0-9]") + "|0?0?" + o)),
      f = n(h + "\\." + h + "\\." + h + "\\." + h),
      m = n(i + "{1,4}"),
      g = n(n(m + "\\:" + m) + "|" + f),
      _ = n(n(m + "\\:") + "{6}" + g),
      y = n("\\:\\:" + n(m + "\\:") + "{5}" + g),
      v = n(n(m) + "?\\:\\:" + n(m + "\\:") + "{4}" + g),
      b = n(n(n(m + "\\:") + "{0,1}" + m) + "?\\:\\:" + n(m + "\\:") + "{3}" + g),
      w = n(n(n(m + "\\:") + "{0,2}" + m) + "?\\:\\:" + n(m + "\\:") + "{2}" + g),
      x = n(n(n(m + "\\:") + "{0,3}" + m) + "?\\:\\:" + m + "\\:" + g),
      E = n(n(n(m + "\\:") + "{0,4}" + m) + "?\\:\\:" + g),
      C = n(n(n(m + "\\:") + "{0,5}" + m) + "?\\:\\:" + m),
      S = n(n(n(m + "\\:") + "{0,6}" + m) + "?\\:\\:"),
      T = n([_, y, v, b, w, x, E, C, S].join("|")),
      k = n(n(u + "|" + s) + "+"),
      I = (n(T + "\\%25" + k), n(T + n("\\%25|\\%(?!" + i + "{2})") + k)),
      P = n("[vV]" + i + "+\\." + t(u, a, "[\\:]") + "+"),
      A = n("\\[" + n(I + "|" + T + "|" + P) + "\\]"),
      O = n(n(s + "|" + t(u, a)) + "*"),
      N = n(A + "|" + f + "(?!" + O + ")|" + O),
      R = n("[0-9]*"),
      M = n(n(p + "@") + "?" + N + n("\\:" + R) + "?"),
      L = n(s + "|" + t(u, a, "[\\:\\@]")),
      $ = n(L + "*"),
      D = n(L + "+"),
      F = n(n(s + "|" + t(u, a, "[\\@]")) + "+"),
      j = n(n("\\/" + $) + "*"),
      q = n("\\/" + n(D + j) + "?"),
      B = n(F + j),
      U = n(D + j),
      H = "(?!" + L + ")",
      z = (n(j + "|" + q + "|" + B + "|" + U + "|" + H), n(n(L + "|" + t("[\\/\\?]", l)) + "*")),
      G = n(n(L + "|[\\/\\?]") + "*"),
      V = n(n("\\/\\/" + M + j) + "|" + q + "|" + U + "|" + H),
      W = n(d + "\\:" + V + n("\\?" + z) + "?" + n("\\#" + G) + "?"),
      K = n(n("\\/\\/" + M + j) + "|" + q + "|" + B + "|" + H),
      J = n(K + n("\\?" + z) + "?" + n("\\#" + G) + "?");
    n(W + "|" + J);
    n(d + "\\:" + V + n("\\?" + z) + "?");
    n(n("\\/\\/(" + n("(" + p + ")@") + "?(" + N + ")" + n("\\:(" + R + ")") + "?)") + "?(" + j + "|" + q + "|" + U + "|" + H + ")");
    n("\\?(" + z + ")");
    n("\\#(" + G + ")");
    n(n("\\/\\/(" + n("(" + p + ")@") + "?(" + N + ")" + n("\\:(" + R + ")") + "?)") + "?(" + j + "|" + q + "|" + B + "|" + H + ")");
    n("\\?(" + z + ")");
    n("\\#(" + G + ")");
    n(n("\\/\\/(" + n("(" + p + ")@") + "?(" + N + ")" + n("\\:(" + R + ")") + "?)") + "?(" + j + "|" + q + "|" + U + "|" + H + ")");
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
      IPV6ADDRESS: new RegExp("^\\[?(" + T + ")" + n(n("\\%25|\\%(?!" + i + "{2})") + "(" + k + ")") + "?\\]?$")
    };
  }
  var s = i(!1),
    a = i(!0),
    c = function (e, t) {
      if (Array.isArray(e)) return e;
      if (Symbol.iterator in Object(e)) return function (e, t) {
        var n = [],
          r = !0,
          o = !1,
          i = undefined;
        try {
          for (var s, a = e[Symbol.iterator](); !(r = (s = a.next()).done) && (n.push(s.value), !t || n.length !== t); r = !0);
        } catch (e) {
          o = !0;
          i = e;
        } finally {
          try {
            !r && a.return && a.return();
          } finally {
            if (o) throw i;
          }
        }
        return n;
      }(e, t);
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    },
    l = 2147483647,
    u = 36,
    d = /^xn--/,
    p = /[^\0-\x7E]/,
    h = /[\x2E\u3002\uFF0E\uFF61]/g,
    f = {
      overflow: "Overflow: input needs wider integers to process",
      "not-basic": "Illegal input >= 0x80 (not a basic code point)",
      "invalid-input": "Invalid input"
    },
    m = Math.floor,
    g = String.fromCharCode;
  function _(e) {
    throw new RangeError(f[e]);
  }
  function y(e, t) {
    var n = e.split("@"),
      r = "";
    n.length > 1 && (r = n[0] + "@", e = n[1]);
    return r + function (e, t) {
      for (var n = [], r = e.length; r--;) n[r] = t(e[r]);
      return n;
    }((e = e.replace(h, ".")).split("."), t).join(".");
  }
  function v(e) {
    for (var t = [], n = 0, r = e.length; n < r;) {
      var o = e.charCodeAt(n++);
      if (o >= 55296 && o <= 56319 && n < r) {
        var i = e.charCodeAt(n++);
        56320 == (64512 & i) ? t.push(((1023 & o) << 10) + (1023 & i) + 65536) : (t.push(o), n--);
      } else t.push(o);
    }
    return t;
  }
  var b = function (e, t) {
      return e + 22 + 75 * (e < 26) - ((0 != t) << 5);
    },
    w = function (e, t, n) {
      var r = 0;
      for (e = n ? m(e / 700) : e >> 1, e += m(e / t); e > 455; r += u) e = m(e / 35);
      return m(r + 36 * e / (e + 38));
    },
    x = function (e) {
      var t,
        n = [],
        r = e.length,
        o = 0,
        i = 128,
        s = 72,
        a = e.lastIndexOf("-");
      a < 0 && (a = 0);
      for (var c = 0; c < a; ++c) {
        e.charCodeAt(c) >= 128 && _("not-basic");
        n.push(e.charCodeAt(c));
      }
      for (var d = a > 0 ? a + 1 : 0; d < r;) {
        for (var p = o, h = 1, f = u;; f += u) {
          d >= r && _("invalid-input");
          var g = (t = e.charCodeAt(d++)) - 48 < 10 ? t - 22 : t - 65 < 26 ? t - 65 : t - 97 < 26 ? t - 97 : u;
          (g >= u || g > m((l - o) / h)) && _("overflow");
          o += g * h;
          var y = f <= s ? 1 : f >= s + 26 ? 26 : f - s;
          if (g < y) break;
          var v = u - y;
          h > m(l / v) && _("overflow");
          h *= v;
        }
        var b = n.length + 1;
        s = w(o - p, b, 0 == p);
        m(o / b) > l - i && _("overflow");
        i += m(o / b);
        o %= b;
        n.splice(o++, 0, i);
      }
      return String.fromCodePoint.apply(String, n);
    },
    E = function (e) {
      var t = [],
        n = (e = v(e)).length,
        r = 128,
        o = 0,
        i = 72,
        s = !0,
        a = !1,
        c = undefined;
      try {
        for (var d, p = e[Symbol.iterator](); !(s = (d = p.next()).done); s = !0) {
          var h = d.value;
          h < 128 && t.push(g(h));
        }
      } catch (e) {
        a = !0;
        c = e;
      } finally {
        try {
          !s && p.return && p.return();
        } finally {
          if (a) throw c;
        }
      }
      var f = t.length,
        y = f;
      for (f && t.push("-"); y < n;) {
        var x = l,
          E = !0,
          C = !1,
          S = undefined;
        try {
          for (var T, k = e[Symbol.iterator](); !(E = (T = k.next()).done); E = !0) {
            var I = T.value;
            I >= r && I < x && (x = I);
          }
        } catch (e) {
          C = !0;
          S = e;
        } finally {
          try {
            !E && k.return && k.return();
          } finally {
            if (C) throw S;
          }
        }
        var P = y + 1;
        x - r > m((l - o) / P) && _("overflow");
        o += (x - r) * P;
        r = x;
        var A = !0,
          O = !1,
          N = undefined;
        try {
          for (var R, M = e[Symbol.iterator](); !(A = (R = M.next()).done); A = !0) {
            var L = R.value;
            L < r && ++o > l && _("overflow");
            if (L == r) {
              for (var $ = o, D = u;; D += u) {
                var F = D <= i ? 1 : D >= i + 26 ? 26 : D - i;
                if ($ < F) break;
                var j = $ - F,
                  q = u - F;
                t.push(g(b(F + j % q, 0))), $ = m(j / q);
              }
              t.push(g(b($, 0))), i = w(o, P, y == f), o = 0, ++y;
            }
          }
        } catch (e) {
          O = !0;
          N = e;
        } finally {
          try {
            !A && M.return && M.return();
          } finally {
            if (O) throw N;
          }
        }
        ++o;
        ++r;
      }
      return t.join("");
    },
    C = function (e) {
      return y(e, function (e) {
        return p.test(e) ? "xn--" + E(e) : e;
      });
    },
    S = function (e) {
      return y(e, function (e) {
        return d.test(e) ? x(e.slice(4).toLowerCase()) : e;
      });
    },
    T = {};
  function k(e) {
    var t = e.charCodeAt(0);
    return t < 16 ? "%0" + t.toString(16).toUpperCase() : t < 128 ? "%" + t.toString(16).toUpperCase() : t < 2048 ? "%" + (t >> 6 | 192).toString(16).toUpperCase() + "%" + (63 & t | 128).toString(16).toUpperCase() : "%" + (t >> 12 | 224).toString(16).toUpperCase() + "%" + (t >> 6 & 63 | 128).toString(16).toUpperCase() + "%" + (63 & t | 128).toString(16).toUpperCase();
  }
  function I(e) {
    for (var t = "", n = 0, r = e.length; n < r;) {
      var o = parseInt(e.substr(n + 1, 2), 16);
      if (o < 128) {
        t += String.fromCharCode(o);
        n += 3;
      } else if (o >= 194 && o < 224) {
        if (r - n >= 6) {
          var i = parseInt(e.substr(n + 4, 2), 16);
          t += String.fromCharCode((31 & o) << 6 | 63 & i);
        } else t += e.substr(n, 6);
        n += 6;
      } else if (o >= 224) {
        if (r - n >= 9) {
          var s = parseInt(e.substr(n + 4, 2), 16),
            a = parseInt(e.substr(n + 7, 2), 16);
          t += String.fromCharCode((15 & o) << 12 | (63 & s) << 6 | 63 & a);
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
    e.scheme && (e.scheme = String(e.scheme).replace(t.PCT_ENCODED, n).toLowerCase().replace(t.NOT_SCHEME, ""));
    undefined !== e.userinfo && (e.userinfo = String(e.userinfo).replace(t.PCT_ENCODED, n).replace(t.NOT_USERINFO, k).replace(t.PCT_ENCODED, o));
    undefined !== e.host && (e.host = String(e.host).replace(t.PCT_ENCODED, n).toLowerCase().replace(t.NOT_HOST, k).replace(t.PCT_ENCODED, o));
    undefined !== e.path && (e.path = String(e.path).replace(t.PCT_ENCODED, n).replace(e.scheme ? t.NOT_PATH : t.NOT_PATH_NOSCHEME, k).replace(t.PCT_ENCODED, o));
    undefined !== e.query && (e.query = String(e.query).replace(t.PCT_ENCODED, n).replace(t.NOT_QUERY, k).replace(t.PCT_ENCODED, o));
    undefined !== e.fragment && (e.fragment = String(e.fragment).replace(t.PCT_ENCODED, n).replace(t.NOT_FRAGMENT, k).replace(t.PCT_ENCODED, o));
    return e;
  }
  function A(e) {
    return e.replace(/^0*(.*)/, "$1") || "0";
  }
  function O(e, t) {
    var n = e.match(t.IPV4ADDRESS) || [],
      r = c(n, 2)[1];
    return r ? r.split(".").map(A).join(".") : e;
  }
  function N(e, t) {
    var n = e.match(t.IPV6ADDRESS) || [],
      r = c(n, 3),
      o = r[1],
      i = r[2];
    if (o) {
      for (var s = o.toLowerCase().split("::").reverse(), a = c(s, 2), l = a[0], u = a[1], d = u ? u.split(":").map(A) : [], p = l.split(":").map(A), h = t.IPV4ADDRESS.test(p[p.length - 1]), f = h ? 7 : 8, m = p.length - f, g = Array(f), _ = 0; _ < f; ++_) g[_] = d[_] || p[m + _] || "";
      h && (g[f - 1] = O(g[f - 1], t));
      var y = g.reduce(function (e, t, n) {
          if (!t || "0" === t) {
            var r = e[e.length - 1];
            r && r.index + r.length === n ? r.length++ : e.push({
              index: n,
              length: 1
            });
          }
          return e;
        }, []).sort(function (e, t) {
          return t.length - e.length;
        })[0],
        v = undefined;
      if (y && y.length > 1) {
        var b = g.slice(0, y.index),
          w = g.slice(y.index + y.length);
        v = b.join(":") + "::" + w.join(":");
      } else v = g.join(":");
      i && (v += "%" + i);
      return v;
    }
    return e;
  }
  var R = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?(\[[^\/?#\]]+\]|[^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#((?:.|\n|\r)*))?/i,
    M = undefined === "".match(/(){0}/)[1];
  function L(e) {
    var t = arguments.length > 1 && undefined !== arguments[1] ? arguments[1] : {},
      n = {},
      r = !1 !== t.iri ? a : s;
    "suffix" === t.reference && (e = (t.scheme ? t.scheme + ":" : "") + "//" + e);
    var o = e.match(R);
    if (o) {
      M ? (n.scheme = o[1], n.userinfo = o[3], n.host = o[4], n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = o[7], n.fragment = o[8], isNaN(n.port) && (n.port = o[5])) : (n.scheme = o[1] || undefined, n.userinfo = -1 !== e.indexOf("@") ? o[3] : undefined, n.host = -1 !== e.indexOf("//") ? o[4] : undefined, n.port = parseInt(o[5], 10), n.path = o[6] || "", n.query = -1 !== e.indexOf("?") ? o[7] : undefined, n.fragment = -1 !== e.indexOf("#") ? o[8] : undefined, isNaN(n.port) && (n.port = e.match(/\/\/(?:.|\n)*\:(?:\/|\?|\#|$)/) ? o[4] : undefined));
      n.host && (n.host = N(O(n.host, r), r));
      undefined !== n.scheme || undefined !== n.userinfo || undefined !== n.host || undefined !== n.port || n.path || undefined !== n.query ? undefined === n.scheme ? n.reference = "relative" : undefined === n.fragment ? n.reference = "absolute" : n.reference = "uri" : n.reference = "same-document";
      t.reference && "suffix" !== t.reference && t.reference !== n.reference && (n.error = n.error || "URI is not a " + t.reference + " reference.");
      var i = T[(t.scheme || n.scheme || "").toLowerCase()];
      if (t.unicodeSupport || i && i.unicodeSupport) P(n, r);else {
        if (n.host && (t.domainHost || i && i.domainHost)) try {
          n.host = C(n.host.replace(r.PCT_ENCODED, I).toLowerCase());
        } catch (e) {
          n.error = n.error || "Host's domain name can not be converted to ASCII via punycode: " + e;
        }
        P(n, s);
      }
      i && i.parse && i.parse(n, t);
    } else n.error = n.error || "URI can not be parsed.";
    return n;
  }
  function $(e, t) {
    var n = !1 !== t.iri ? a : s,
      r = [];
    undefined !== e.userinfo && (r.push(e.userinfo), r.push("@"));
    undefined !== e.host && r.push(N(O(String(e.host), n), n).replace(n.IPV6ADDRESS, function (e, t, n) {
      return "[" + t + (n ? "%25" + n : "") + "]";
    }));
    "number" != typeof e.port && "string" != typeof e.port || (r.push(":"), r.push(String(e.port)));
    return r.length ? r.join("") : undefined;
  }
  var D = /^\.\.?\//,
    F = /^\/\.(\/|$)/,
    j = /^\/\.\.(\/|$)/,
    q = /^\/?(?:.|\n)*?(?=\/|$)/;
  function B(e) {
    for (var t = []; e.length;) if (e.match(D)) e = e.replace(D, "");else if (e.match(F)) e = e.replace(F, "/");else if (e.match(j)) {
      e = e.replace(j, "/");
      t.pop();
    } else if ("." === e || ".." === e) e = "";else {
      var n = e.match(q);
      if (!n) throw new Error("Unexpected dot segment condition");
      var r = n[0];
      e = e.slice(r.length);
      t.push(r);
    }
    return t.join("");
  }
  function U(e) {
    var t = arguments.length > 1 && undefined !== arguments[1] ? arguments[1] : {},
      n = t.iri ? a : s,
      r = [],
      o = T[(t.scheme || e.scheme || "").toLowerCase()];
    o && o.serialize && o.serialize(e, t);
    if (e.host) if (n.IPV6ADDRESS.test(e.host)) ;else if (t.domainHost || o && o.domainHost) try {
      e.host = t.iri ? S(e.host) : C(e.host.replace(n.PCT_ENCODED, I).toLowerCase());
    } catch (n) {
      e.error = e.error || "Host's domain name can not be converted to " + (t.iri ? "Unicode" : "ASCII") + " via punycode: " + n;
    }
    P(e, n);
    "suffix" !== t.reference && e.scheme && (r.push(e.scheme), r.push(":"));
    var i = $(e, t);
    undefined !== i && ("suffix" !== t.reference && r.push("//"), r.push(i), e.path && "/" !== e.path.charAt(0) && r.push("/"));
    if (void 0 !== e.path) {
      var c = e.path;
      t.absolutePath || o && o.absolutePath || (c = B(c)), void 0 === i && (c = c.replace(/^\/\//, "/%2F")), r.push(c);
    }
    undefined !== e.query && (r.push("?"), r.push(e.query));
    undefined !== e.fragment && (r.push("#"), r.push(e.fragment));
    return r.join("");
  }
  function H(e, t) {
    var n = arguments.length > 2 && undefined !== arguments[2] ? arguments[2] : {},
      r = {};
    arguments[3] || (e = L(U(e, n), n), t = L(U(t, n), n));
    !(n = n || {}).tolerant && t.scheme ? (r.scheme = t.scheme, r.userinfo = t.userinfo, r.host = t.host, r.port = t.port, r.path = B(t.path || ""), r.query = t.query) : (undefined !== t.userinfo || undefined !== t.host || undefined !== t.port ? (r.userinfo = t.userinfo, r.host = t.host, r.port = t.port, r.path = B(t.path || ""), r.query = t.query) : (t.path ? ("/" === t.path.charAt(0) ? r.path = B(t.path) : (undefined === e.userinfo && undefined === e.host && undefined === e.port || e.path ? e.path ? r.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : r.path = t.path : r.path = "/" + t.path, r.path = B(r.path)), r.query = t.query) : (r.path = e.path, undefined !== t.query ? r.query = t.query : r.query = e.query), r.userinfo = e.userinfo, r.host = e.host, r.port = e.port), r.scheme = e.scheme);
    r.fragment = t.fragment;
    return r;
  }
  function z(e, t) {
    return e && e.toString().replace(t && t.iri ? a.PCT_ENCODED : s.PCT_ENCODED, I);
  }
  var G = {
      scheme: "http",
      domainHost: !0,
      parse: function (e, t) {
        e.host || (e.error = e.error || "HTTP URIs must have a host.");
        return e;
      },
      serialize: function (e, t) {
        var n = "https" === String(e.scheme).toLowerCase();
        e.port !== (n ? 443 : 80) && "" !== e.port || (e.port = undefined);
        e.path || (e.path = "/");
        return e;
      }
    },
    V = {
      scheme: "https",
      domainHost: G.domainHost,
      parse: G.parse,
      serialize: G.serialize
    };
  function W(e) {
    return "boolean" == typeof e.secure ? e.secure : "wss" === String(e.scheme).toLowerCase();
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
        e.port !== (W(e) ? 443 : 80) && "" !== e.port || (e.port = undefined);
        "boolean" == typeof e.secure && (e.scheme = e.secure ? "wss" : "ws", e.secure = undefined);
        if (e.resourceName) {
          var n = e.resourceName.split("?"),
            r = c(n, 2),
            o = r[0],
            i = r[1];
          e.path = o && "/" !== o ? o : void 0, e.query = i, e.resourceName = void 0;
        }
        e.fragment = undefined;
        return e;
      }
    },
    J = {
      scheme: "wss",
      domainHost: K.domainHost,
      parse: K.parse,
      serialize: K.serialize
    },
    X = {},
    Q = "[A-Za-z0-9\\-\\.\\_\\~\\xA0-\\u200D\\u2010-\\u2029\\u202F-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]",
    Y = "[0-9A-Fa-f]",
    Z = n(n("%[EFef][0-9A-Fa-f]%" + Y + Y + "%" + Y + Y) + "|" + n("%[89A-Fa-f][0-9A-Fa-f]%" + Y + Y) + "|" + n("%" + Y + Y)),
    ee = t("[\\!\\$\\%\\'\\(\\)\\*\\+\\,\\-\\.0-9\\<\\>A-Z\\x5E-\\x7E]", '[\\"\\\\]'),
    te = new RegExp(Q, "g"),
    ne = new RegExp(Z, "g"),
    re = new RegExp(t("[^]", "[A-Za-z0-9\\!\\$\\%\\'\\*\\+\\-\\^\\_\\`\\{\\|\\}\\~]", "[\\.]", '[\\"]', ee), "g"),
    oe = new RegExp(t("[^]", Q, "[\\!\\$\\'\\(\\)\\*\\+\\,\\;\\:\\@]"), "g"),
    ie = oe;
  function se(e) {
    var t = I(e);
    return t.match(te) ? t : e;
  }
  var ae = {
      scheme: "mailto",
      parse: function (e, t) {
        var n = e,
          r = n.to = n.path ? n.path.split(",") : [];
        n.path = undefined;
        if (n.query) {
          for (var o = !1, i = {}, s = n.query.split("&"), a = 0, c = s.length; a < c; ++a) {
            var l = s[a].split("=");
            switch (l[0]) {
              case "to":
                for (var u = l[1].split(","), d = 0, p = u.length; d < p; ++d) r.push(u[d]);
                break;
              case "subject":
                n.subject = z(l[1], t);
                break;
              case "body":
                n.body = z(l[1], t);
                break;
              default:
                o = !0, i[z(l[0], t)] = z(l[1], t);
            }
          }
          o && (n.headers = i);
        }
        n.query = undefined;
        for (var h = 0, f = r.length; h < f; ++h) {
          var m = r[h].split("@");
          m[0] = z(m[0]);
          if (t.unicodeSupport) m[1] = z(m[1], t).toLowerCase();else try {
            m[1] = C(z(m[1], t).toLowerCase());
          } catch (e) {
            n.error = n.error || "Email address's domain name can not be converted to ASCII via punycode: " + e;
          }
          r[h] = m.join("@");
        }
        return n;
      },
      serialize: function (e, t) {
        var n,
          r = e,
          i = null != (n = e.to) ? n instanceof Array ? n : "number" != typeof n.length || n.split || n.setInterval || n.call ? [n] : Array.prototype.slice.call(n) : [];
        if (i) {
          for (var s = 0, a = i.length; s < a; ++s) {
            var c = String(i[s]),
              l = c.lastIndexOf("@"),
              u = c.slice(0, l).replace(ne, se).replace(ne, o).replace(re, k),
              d = c.slice(l + 1);
            try {
              d = t.iri ? S(d) : C(z(d, t).toLowerCase());
            } catch (e) {
              r.error = r.error || "Email address's domain name can not be converted to " + (t.iri ? "Unicode" : "ASCII") + " via punycode: " + e;
            }
            i[s] = u + "@" + d;
          }
          r.path = i.join(",");
        }
        var p = e.headers = e.headers || {};
        e.subject && (p.subject = e.subject);
        e.body && (p.body = e.body);
        var h = [];
        for (var f in p) p[f] !== X[f] && h.push(f.replace(ne, se).replace(ne, o).replace(oe, k) + "=" + p[f].replace(ne, se).replace(ne, o).replace(ie, k));
        h.length && (r.query = h.join("&"));
        return r;
      }
    },
    ce = /^([^\:]+)\:(.*)/,
    le = {
      scheme: "urn",
      parse: function (e, t) {
        var n = e.path && e.path.match(ce),
          r = e;
        if (n) {
          var o = t.scheme || r.scheme || "urn",
            i = n[1].toLowerCase(),
            s = n[2],
            a = o + ":" + (t.nid || i),
            c = T[a];
          r.nid = i;
          r.nss = s;
          r.path = undefined;
          c && (r = c.parse(r, t));
        } else r.error = r.error || "URN can not be parsed.";
        return r;
      },
      serialize: function (e, t) {
        var n = t.scheme || e.scheme || "urn",
          r = e.nid,
          o = n + ":" + (t.nid || r),
          i = T[o];
        i && (e = i.serialize(e, t));
        var s = e,
          a = e.nss;
        s.path = (r || t.nid) + ":" + a;
        return s;
      }
    },
    ue = /^[0-9A-Fa-f]{8}(?:\-[0-9A-Fa-f]{4}){3}\-[0-9A-Fa-f]{12}$/,
    de = {
      scheme: "urn:uuid",
      parse: function (e, t) {
        var n = e;
        n.uuid = n.nss;
        n.nss = undefined;
        t.tolerant || n.uuid && n.uuid.match(ue) || (n.error = n.error || "UUID is not valid.");
        return n;
      },
      serialize: function (e, t) {
        var n = e;
        n.nss = (e.uuid || "").toLowerCase();
        return n;
      }
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
    var r = function (e, t) {
      var n = e;
      if (t) for (var r in t) n[r] = t[r];
      return n;
    }({
      scheme: "null"
    }, n);
    return U(H(L(e, r), L(t, r), r, !0), r);
  };
  e.normalize = function (e, t) {
    "string" == typeof e ? e = U(L(e, t), t) : "object" === r(e) && (e = L(U(e, t), t));
    return e;
  };
  e.equal = function (e, t, n) {
    "string" == typeof e ? e = U(L(e, n), n) : "object" === r(e) && (e = U(e, n));
    "string" == typeof t ? t = U(L(t, n), n) : "object" === r(t) && (t = U(t, n));
    return e === t;
  };
  e.escapeComponent = function (e, t) {
    return e && e.toString().replace(t && t.iri ? a.ESCAPE : s.ESCAPE, k);
  };
  e.unescapeComponent = z;
  Object.defineProperty(e, "__esModule", {
    value: !0
  });
}(exports);