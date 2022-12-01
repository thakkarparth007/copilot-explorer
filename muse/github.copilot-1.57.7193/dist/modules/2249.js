var n;
exports = module.exports = SemVer;
n =
  "object" == typeof process &&
  process.env &&
  process.env.NODE_DEBUG &&
  /\bsemver\b/i.test(process.env.NODE_DEBUG)
    ? function () {
        var e = Array.prototype.slice.call(arguments, 0);
        e.unshift("SEMVER");
        console.log.apply(console, e);
      }
    : function () {};
exports.SEMVER_SPEC_VERSION = "2.0.0";
var r = Number.MAX_SAFE_INTEGER || 9007199254740991,
  o = (exports.re = []),
  i = (exports.src = []),
  s = 0,
  a = s++;
i[a] = "0|[1-9]\\d*";
var c = s++;
i[c] = "[0-9]+";
var l = s++;
i[l] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
var u = s++;
i[u] = "(" + i[a] + ")\\.(" + i[a] + ")\\.(" + i[a] + ")";
var d = s++;
i[d] = "(" + i[c] + ")\\.(" + i[c] + ")\\.(" + i[c] + ")";
var p = s++;
i[p] = "(?:" + i[a] + "|" + i[l] + ")";
var h = s++;
i[h] = "(?:" + i[c] + "|" + i[l] + ")";
var f = s++;
i[f] = "(?:-(" + i[p] + "(?:\\." + i[p] + ")*))";
var m = s++;
i[m] = "(?:-?(" + i[h] + "(?:\\." + i[h] + ")*))";
var g = s++;
i[g] = "[0-9A-Za-z-]+";
var _ = s++;
i[_] = "(?:\\+(" + i[g] + "(?:\\." + i[g] + ")*))";
var y = s++,
  v = "v?" + i[u] + i[f] + "?" + i[_] + "?";
i[y] = "^" + v + "$";
var b = "[v=\\s]*" + i[d] + i[m] + "?" + i[_] + "?",
  w = s++;
i[w] = "^" + b + "$";
var x = s++;
i[x] = "((?:<|>)?=?)";
var E = s++;
i[E] = i[c] + "|x|X|\\*";
var C = s++;
i[C] = i[a] + "|x|X|\\*";
var S = s++;
i[S] =
  "[v=\\s]*(" +
  i[C] +
  ")(?:\\.(" +
  i[C] +
  ")(?:\\.(" +
  i[C] +
  ")(?:" +
  i[f] +
  ")?" +
  i[_] +
  "?)?)?";
var T = s++;
i[T] =
  "[v=\\s]*(" +
  i[E] +
  ")(?:\\.(" +
  i[E] +
  ")(?:\\.(" +
  i[E] +
  ")(?:" +
  i[m] +
  ")?" +
  i[_] +
  "?)?)?";
var k = s++;
i[k] = "^" + i[x] + "\\s*" + i[S] + "$";
var I = s++;
i[I] = "^" + i[x] + "\\s*" + i[T] + "$";
var P = s++;
i[P] =
  "(?:^|[^\\d])(\\d{1,16})(?:\\.(\\d{1,16}))?(?:\\.(\\d{1,16}))?(?:$|[^\\d])";
var A = s++;
i[A] = "(?:~>?)";
var O = s++;
i[O] = "(\\s*)" + i[A] + "\\s+";
o[O] = new RegExp(i[O], "g");
var N = s++;
i[N] = "^" + i[A] + i[S] + "$";
var R = s++;
i[R] = "^" + i[A] + i[T] + "$";
var M = s++;
i[M] = "(?:\\^)";
var L = s++;
i[L] = "(\\s*)" + i[M] + "\\s+";
o[L] = new RegExp(i[L], "g");
var $ = s++;
i[$] = "^" + i[M] + i[S] + "$";
var D = s++;
i[D] = "^" + i[M] + i[T] + "$";
var F = s++;
i[F] = "^" + i[x] + "\\s*(" + b + ")$|^$";
var j = s++;
i[j] = "^" + i[x] + "\\s*(" + v + ")$|^$";
var q = s++;
i[q] = "(\\s*)" + i[x] + "\\s*(" + b + "|" + i[S] + ")";
o[q] = new RegExp(i[q], "g");
var B = s++;
i[B] = "^\\s*(" + i[S] + ")\\s+-\\s+(" + i[S] + ")\\s*$";
var U = s++;
i[U] = "^\\s*(" + i[T] + ")\\s+-\\s+(" + i[T] + ")\\s*$";
var H = s++;
i[H] = "(<|>)?=?\\s*\\*";
for (var z = 0; z < 35; z++) {
  n(z, i[z]);
  if (o[z]) {
    o[z] = new RegExp(i[z]);
  }
}
function parse(e, t) {
  if (t && "object" == typeof t) {
    t = {
      loose: !!t,
      includePrerelease: !1,
    };
  }
  if (e instanceof SemVer) return e;
  if ("string" != typeof e) return null;
  if (e.length > 256) return null;
  if (!(t.loose ? o[w] : o[y]).test(e)) return null;
  try {
    return new SemVer(e, t);
  } catch (e) {
    return null;
  }
}
function SemVer(e, t) {
  if (t && "object" == typeof t) {
    t = {
      loose: !!t,
      includePrerelease: !1,
    };
  }
  if (e instanceof SemVer) {
    if (e.loose === t.loose) return e;
    e = e.version;
  } else if ("string" != typeof e) throw new TypeError("Invalid Version: " + e);
  if (e.length > 256)
    throw new TypeError("version is longer than 256 characters");
  if (!(this instanceof SemVer)) return new SemVer(e, t);
  n("SemVer", e, t);
  this.options = t;
  this.loose = !!t.loose;
  var i = e.trim().match(t.loose ? o[w] : o[y]);
  if (!i) throw new TypeError("Invalid Version: " + e);
  this.raw = e;
  this.major = +i[1];
  this.minor = +i[2];
  this.patch = +i[3];
  if (this.major > r || this.major < 0)
    throw new TypeError("Invalid major version");
  if (this.minor > r || this.minor < 0)
    throw new TypeError("Invalid minor version");
  if (this.patch > r || this.patch < 0)
    throw new TypeError("Invalid patch version");
  if (i[4]) {
    this.prerelease = i[4].split(".").map(function (e) {
      if (/^[0-9]+$/.test(e)) {
        var t = +e;
        if (t >= 0 && t < r) return t;
      }
      return e;
    });
  } else {
    this.prerelease = [];
  }
  this.build = i[5] ? i[5].split(".") : [];
  this.format();
}
exports.parse = parse;
exports.valid = function (e, t) {
  var n = parse(e, t);
  return n ? n.version : null;
};
exports.clean = function (e, t) {
  var n = parse(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
exports.SemVer = SemVer;
SemVer.prototype.format = function () {
  this.version = this.major + "." + this.minor + "." + this.patch;
  if (this.prerelease.length) {
    this.version += "-" + this.prerelease.join(".");
  }
  return this.version;
};
SemVer.prototype.toString = function () {
  return this.version;
};
SemVer.prototype.compare = function (e) {
  n("SemVer.compare", this.version, this.options, e);
  if (e instanceof SemVer) {
    e = new SemVer(e, this.options);
  }
  return this.compareMain(e) || this.comparePre(e);
};
SemVer.prototype.compareMain = function (e) {
  if (e instanceof SemVer) {
    e = new SemVer(e, this.options);
  }
  return (
    compareIdentifiers(this.major, e.major) ||
    compareIdentifiers(this.minor, e.minor) ||
    compareIdentifiers(this.patch, e.patch)
  );
};
SemVer.prototype.comparePre = function (e) {
  if (e instanceof SemVer) {
    e = new SemVer(e, this.options);
  }
  if (this.prerelease.length && !e.prerelease.length) return -1;
  if (!this.prerelease.length && e.prerelease.length) return 1;
  if (!this.prerelease.length && !e.prerelease.length) return 0;
  var t = 0;
  do {
    var r = this.prerelease[t],
      o = e.prerelease[t];
    n("prerelease compare", t, r, o);
    if (void 0 === r && void 0 === o) return 0;
    if (undefined === o) return 1;
    if (undefined === r) return -1;
    if (r !== o) return compareIdentifiers(r, o);
  } while (++t);
};
SemVer.prototype.inc = function (e, t) {
  switch (e) {
    case "premajor":
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor = 0;
      this.major++;
      this.inc("pre", t);
      break;
    case "preminor":
      this.prerelease.length = 0;
      this.patch = 0;
      this.minor++;
      this.inc("pre", t);
      break;
    case "prepatch":
      this.prerelease.length = 0;
      this.inc("patch", t);
      this.inc("pre", t);
      break;
    case "prerelease":
      if (0 === this.prerelease.length) {
        this.inc("patch", t);
      }
      this.inc("pre", t);
      break;
    case "major":
      if (
        0 === this.minor &&
        0 === this.patch &&
        0 !== this.prerelease.length
      ) {
        this.major++;
      }
      this.minor = 0;
      this.patch = 0;
      this.prerelease = [];
      break;
    case "minor":
      if (0 === this.patch && 0 !== this.prerelease.length) {
        this.minor++;
      }
      this.patch = 0;
      this.prerelease = [];
      break;
    case "patch":
      if (0 === this.prerelease.length) {
        this.patch++;
      }
      this.prerelease = [];
      break;
    case "pre":
      if (0 === this.prerelease.length) this.prerelease = [0];
      else {
        for (var n = this.prerelease.length; --n >= 0; )
          if ("number" == typeof this.prerelease[n]) {
            this.prerelease[n]++;
            n = -2;
          }
        if (-1 === n) {
          this.prerelease.push(0);
        }
      }
      if (t) {
        if (this.prerelease[0] === t) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [t, 0];
          }
        } else {
          this.prerelease = [t, 0];
        }
      }
      break;
    default:
      throw new Error("invalid increment argument: " + e);
  }
  this.format();
  this.raw = this.version;
  return this;
};
exports.inc = function (e, t, n, r) {
  if ("string" == typeof n) {
    r = n;
    n = undefined;
  }
  try {
    return new SemVer(e, n).inc(t, r).version;
  } catch (e) {
    return null;
  }
};
exports.diff = function (e, t) {
  if (eq(e, t)) return null;
  var n = parse(e),
    r = parse(t),
    o = "";
  if (n.prerelease.length || r.prerelease.length) {
    o = "pre";
    var i = "prerelease";
  }
  for (var s in n)
    if (("major" === s || "minor" === s || "patch" === s) && n[s] !== r[s])
      return o + s;
  return i;
};
exports.compareIdentifiers = compareIdentifiers;
var W = /^[0-9]+$/;
function compareIdentifiers(e, t) {
  var n = W.test(e),
    r = W.test(t);
  if (n && r) {
    e = +e;
    t = +t;
  }
  return e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}
function compare(e, t, n) {
  return new SemVer(e, n).compare(new SemVer(t, n));
}
function gt(e, t, n) {
  return compare(e, t, n) > 0;
}
function lt(e, t, n) {
  return compare(e, t, n) < 0;
}
function eq(e, t, n) {
  return 0 === compare(e, t, n);
}
function neq(e, t, n) {
  return 0 !== compare(e, t, n);
}
function ee(e, t, n) {
  return compare(e, t, n) >= 0;
}
function te(e, t, n) {
  return compare(e, t, n) <= 0;
}
function ne(e, t, n, r) {
  switch (t) {
    case "===":
      if ("object" == typeof e) {
        e = e.version;
      }
      if ("object" == typeof n) {
        n = n.version;
      }
      return e === n;
    case "!==":
      if ("object" == typeof e) {
        e = e.version;
      }
      if ("object" == typeof n) {
        n = n.version;
      }
      return e !== n;
    case "":
    case "=":
    case "==":
      return eq(e, n, r);
    case "!=":
      return neq(e, n, r);
    case ">":
      return gt(e, n, r);
    case ">=":
      return ee(e, n, r);
    case "<":
      return lt(e, n, r);
    case "<=":
      return te(e, n, r);
    default:
      throw new TypeError("Invalid operator: " + t);
  }
}
function re(e, t) {
  if (t && "object" == typeof t) {
    t = {
      loose: !!t,
      includePrerelease: !1,
    };
  }
  if (e instanceof re) {
    if (e.loose === !!t.loose) return e;
    e = e.value;
  }
  if (!(this instanceof re)) return new re(e, t);
  n("comparator", e, t);
  this.options = t;
  this.loose = !!t.loose;
  this.parse(e);
  if (this.semver === oe) {
    this.value = "";
  } else {
    this.value = this.operator + this.semver.version;
  }
  n("comp", this);
}
exports.rcompareIdentifiers = function (e, t) {
  return compareIdentifiers(t, e);
};
exports.major = function (e, t) {
  return new SemVer(e, t).major;
};
exports.minor = function (e, t) {
  return new SemVer(e, t).minor;
};
exports.patch = function (e, t) {
  return new SemVer(e, t).patch;
};
exports.compare = compare;
exports.compareLoose = function (e, t) {
  return compare(e, t, !0);
};
exports.rcompare = function (e, t, n) {
  return compare(t, e, n);
};
exports.sort = function (e, n) {
  return e.sort(function (e, r) {
    return exports.compare(e, r, n);
  });
};
exports.rsort = function (e, n) {
  return e.sort(function (e, r) {
    return exports.rcompare(e, r, n);
  });
};
exports.gt = gt;
exports.lt = lt;
exports.eq = eq;
exports.neq = neq;
exports.gte = ee;
exports.lte = te;
exports.cmp = ne;
exports.Comparator = re;
var oe = {};
function ie(e, t) {
  if (t && "object" == typeof t) {
    t = {
      loose: !!t,
      includePrerelease: !1,
    };
  }
  if (e instanceof ie)
    return e.loose === !!t.loose &&
      e.includePrerelease === !!t.includePrerelease
      ? e
      : new ie(e.raw, t);
  if (e instanceof re) return new ie(e.value, t);
  if (!(this instanceof ie)) return new ie(e, t);
  this.options = t;
  this.loose = !!t.loose;
  this.includePrerelease = !!t.includePrerelease;
  this.raw = e;
  this.set = e
    .split(/\s*\|\|\s*/)
    .map(function (e) {
      return this.parseRange(e.trim());
    }, this)
    .filter(function (e) {
      return e.length;
    });
  if (!this.set.length) throw new TypeError("Invalid SemVer Range: " + e);
  this.format();
}
function se(e) {
  return !e || "x" === e.toLowerCase() || "*" === e;
}
function ae(e, t, n, r, o, i, s, a, c, l, u, d, p) {
  return (
    (t = se(n)
      ? ""
      : se(r)
      ? ">=" + n + ".0.0"
      : se(o)
      ? ">=" + n + "." + r + ".0"
      : ">=" + t) +
    " " +
    (a = se(c)
      ? ""
      : se(l)
      ? "<" + (+c + 1) + ".0.0"
      : se(u)
      ? "<" + c + "." + (+l + 1) + ".0"
      : d
      ? "<=" + c + "." + l + "." + u + "-" + d
      : "<=" + a)
  ).trim();
}
function ce(e, t, r) {
  for (var o = 0; o < e.length; o++) if (!e[o].test(t)) return !1;
  if (t.prerelease.length && !r.includePrerelease) {
    for (o = 0; o < e.length; o++) {
      n(e[o].semver);
      if (e[o].semver !== oe && e[o].semver.prerelease.length > 0) {
        var i = e[o].semver;
        if (i.major === t.major && i.minor === t.minor && i.patch === t.patch)
          return !0;
      }
    }
    return !1;
  }
  return !0;
}
function le(e, t, n) {
  try {
    t = new ie(t, n);
  } catch (e) {
    return !1;
  }
  return t.test(e);
}
function ue(e, t, n, r) {
  var o, i, s, a, c;
  switch (((e = new SemVer(e, r)), (t = new ie(t, r)), n)) {
    case ">":
      o = gt;
      i = te;
      s = lt;
      a = ">";
      c = ">=";
      break;
    case "<":
      o = lt;
      i = ee;
      s = gt;
      a = "<";
      c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (le(e, t, r)) return !1;
  for (var l = 0; l < t.set.length; ++l) {
    var u = t.set[l],
      d = null,
      p = null;
    u.forEach(function (e) {
      if (e.semver === oe) {
        e = new re(">=0.0.0");
      }
      d = d || e;
      p = p || e;
      if (o(e.semver, d.semver, r)) {
        d = e;
      } else {
        if (s(e.semver, p.semver, r)) {
          p = e;
        }
      }
    });
    if (d.operator === a || d.operator === c) return !1;
    if ((!p.operator || p.operator === a) && i(e, p.semver)) return !1;
    if (p.operator === c && s(e, p.semver)) return !1;
  }
  return !0;
}
re.prototype.parse = function (e) {
  var t = this.options.loose ? o[F] : o[j],
    n = e.match(t);
  if (!n) throw new TypeError("Invalid comparator: " + e);
  this.operator = n[1];
  if ("=" === this.operator) {
    this.operator = "";
  }
  if (n[2]) {
    this.semver = new SemVer(n[2], this.options.loose);
  } else {
    this.semver = oe;
  }
};
re.prototype.toString = function () {
  return this.value;
};
re.prototype.test = function (e) {
  n("Comparator.test", e, this.options.loose);
  return (
    this.semver === oe ||
    ("string" == typeof e && (e = new SemVer(e, this.options)),
    ne(e, this.operator, this.semver, this.options))
  );
};
re.prototype.intersects = function (e, t) {
  if (!(e instanceof re)) throw new TypeError("a Comparator is required");
  var n;
  if (t && "object" == typeof t) {
    t = {
      loose: !!t,
      includePrerelease: !1,
    };
  }
  if ("" === this.operator)
    return (n = new ie(e.value, t)), le(this.value, n, t);
  if ("" === e.operator) {
    n = new ie(this.value, t);
    return le(e.semver, n, t);
  }
  var r = !(
      (">=" !== this.operator && ">" !== this.operator) ||
      (">=" !== e.operator && ">" !== e.operator)
    ),
    o = !(
      ("<=" !== this.operator && "<" !== this.operator) ||
      ("<=" !== e.operator && "<" !== e.operator)
    ),
    i = this.semver.version === e.semver.version,
    s = !(
      (">=" !== this.operator && "<=" !== this.operator) ||
      (">=" !== e.operator && "<=" !== e.operator)
    ),
    a =
      ne(this.semver, "<", e.semver, t) &&
      (">=" === this.operator || ">" === this.operator) &&
      ("<=" === e.operator || "<" === e.operator),
    c =
      ne(this.semver, ">", e.semver, t) &&
      ("<=" === this.operator || "<" === this.operator) &&
      (">=" === e.operator || ">" === e.operator);
  return r || o || (i && s) || a || c;
};
exports.Range = ie;
ie.prototype.format = function () {
  this.range = this.set
    .map(function (e) {
      return e.join(" ").trim();
    })
    .join("||")
    .trim();
  return this.range;
};
ie.prototype.toString = function () {
  return this.range;
};
ie.prototype.parseRange = function (e) {
  var t = this.options.loose;
  e = e.trim();
  var r = t ? o[U] : o[B];
  e = e.replace(r, ae);
  n("hyphen replace", e);
  e = e.replace(o[q], "$1$2$3");
  n("comparator trim", e, o[q]);
  e = (e = (e = e.replace(o[O], "$1~")).replace(o[L], "$1^"))
    .split(/\s+/)
    .join(" ");
  var i = t ? o[F] : o[j],
    s = e
      .split(" ")
      .map(function (e) {
        return (function (e, t) {
          n("comp", e, t);
          e = (function (e, t) {
            return e
              .trim()
              .split(/\s+/)
              .map(function (e) {
                return (function (e, t) {
                  n("caret", e, t);
                  var r = t.loose ? o[D] : o[$];
                  return e.replace(r, function (t, r, o, i, s) {
                    var a;
                    n("caret", e, t, r, o, i, s);
                    if (se(r)) {
                      a = "";
                    } else {
                      if (se(o)) {
                        a = ">=" + r + ".0.0 <" + (+r + 1) + ".0.0";
                      } else {
                        if (se(i)) {
                          a =
                            "0" === r
                              ? ">=" +
                                r +
                                "." +
                                o +
                                ".0 <" +
                                r +
                                "." +
                                (+o + 1) +
                                ".0"
                              : ">=" + r + "." + o + ".0 <" + (+r + 1) + ".0.0";
                        } else {
                          if (s) {
                            n("replaceCaret pr", s);
                            a =
                              "0" === r
                                ? "0" === o
                                  ? ">=" +
                                    r +
                                    "." +
                                    o +
                                    "." +
                                    i +
                                    "-" +
                                    s +
                                    " <" +
                                    r +
                                    "." +
                                    o +
                                    "." +
                                    (+i + 1)
                                  : ">=" +
                                    r +
                                    "." +
                                    o +
                                    "." +
                                    i +
                                    "-" +
                                    s +
                                    " <" +
                                    r +
                                    "." +
                                    (+o + 1) +
                                    ".0"
                                : ">=" +
                                  r +
                                  "." +
                                  o +
                                  "." +
                                  i +
                                  "-" +
                                  s +
                                  " <" +
                                  (+r + 1) +
                                  ".0.0";
                          } else {
                            n("no pr");
                            a =
                              "0" === r
                                ? "0" === o
                                  ? ">=" +
                                    r +
                                    "." +
                                    o +
                                    "." +
                                    i +
                                    " <" +
                                    r +
                                    "." +
                                    o +
                                    "." +
                                    (+i + 1)
                                  : ">=" +
                                    r +
                                    "." +
                                    o +
                                    "." +
                                    i +
                                    " <" +
                                    r +
                                    "." +
                                    (+o + 1) +
                                    ".0"
                                : ">=" +
                                  r +
                                  "." +
                                  o +
                                  "." +
                                  i +
                                  " <" +
                                  (+r + 1) +
                                  ".0.0";
                          }
                        }
                      }
                    }
                    n("caret return", a);
                    return a;
                  });
                })(e, t);
              })
              .join(" ");
          })(e, t);
          n("caret", e);
          e = (function (e, t) {
            return e
              .trim()
              .split(/\s+/)
              .map(function (e) {
                return (function (e, t) {
                  var r = t.loose ? o[R] : o[N];
                  return e.replace(r, function (t, r, o, i, s) {
                    var a;
                    n("tilde", e, t, r, o, i, s);
                    if (se(r)) {
                      a = "";
                    } else {
                      if (se(o)) {
                        a = ">=" + r + ".0.0 <" + (+r + 1) + ".0.0";
                      } else {
                        if (se(i)) {
                          a =
                            ">=" +
                            r +
                            "." +
                            o +
                            ".0 <" +
                            r +
                            "." +
                            (+o + 1) +
                            ".0";
                        } else {
                          if (s) {
                            n("replaceTilde pr", s);
                            a =
                              ">=" +
                              r +
                              "." +
                              o +
                              "." +
                              i +
                              "-" +
                              s +
                              " <" +
                              r +
                              "." +
                              (+o + 1) +
                              ".0";
                          } else {
                            a =
                              ">=" +
                              r +
                              "." +
                              o +
                              "." +
                              i +
                              " <" +
                              r +
                              "." +
                              (+o + 1) +
                              ".0";
                          }
                        }
                      }
                    }
                    n("tilde return", a);
                    return a;
                  });
                })(e, t);
              })
              .join(" ");
          })(e, t);
          n("tildes", e);
          e = (function (e, t) {
            n("replaceXRanges", e, t);
            return e
              .split(/\s+/)
              .map(function (e) {
                return (function (e, t) {
                  e = e.trim();
                  var r = t.loose ? o[I] : o[k];
                  return e.replace(r, function (t, r, o, i, s, a) {
                    n("xRange", e, t, r, o, i, s, a);
                    var c = se(o),
                      l = c || se(i),
                      u = l || se(s);
                    if ("=" === r && u) {
                      r = "";
                    }
                    if (c) {
                      t = ">" === r || "<" === r ? "<0.0.0" : "*";
                    } else {
                      if (r && u) {
                        if (l) {
                          i = 0;
                        }
                        s = 0;
                        if (">" === r) {
                          r = ">=";
                          if (l) {
                            o = +o + 1;
                            i = 0;
                            s = 0;
                          } else {
                            i = +i + 1;
                            s = 0;
                          }
                        } else {
                          if ("<=" === r) {
                            r = "<";
                            if (l) {
                              o = +o + 1;
                            } else {
                              i = +i + 1;
                            }
                          }
                        }
                        t = r + o + "." + i + "." + s;
                      } else {
                        if (l) {
                          t = ">=" + o + ".0.0 <" + (+o + 1) + ".0.0";
                        } else {
                          if (u) {
                            t =
                              ">=" +
                              o +
                              "." +
                              i +
                              ".0 <" +
                              o +
                              "." +
                              (+i + 1) +
                              ".0";
                          }
                        }
                      }
                    }
                    n("xRange return", t);
                    return t;
                  });
                })(e, t);
              })
              .join(" ");
          })(e, t);
          n("xrange", e);
          e = (function (e, t) {
            n("replaceStars", e, t);
            return e.trim().replace(o[H], "");
          })(e, t);
          n("stars", e);
          return e;
        })(e, this.options);
      }, this)
      .join(" ")
      .split(/\s+/);
  if (this.options.loose) {
    s = s.filter(function (e) {
      return !!e.match(i);
    });
  }
  return s.map(function (e) {
    return new re(e, this.options);
  }, this);
};
ie.prototype.intersects = function (e, t) {
  if (!(e instanceof ie)) throw new TypeError("a Range is required");
  return this.set.some(function (n) {
    return n.every(function (n) {
      return e.set.some(function (e) {
        return e.every(function (e) {
          return n.intersects(e, t);
        });
      });
    });
  });
};
exports.toComparators = function (e, t) {
  return new ie(e, t).set.map(function (e) {
    return e
      .map(function (e) {
        return e.value;
      })
      .join(" ")
      .trim()
      .split(" ");
  });
};
ie.prototype.test = function (e) {
  if (!e) return !1;
  if ("string" == typeof e) {
    e = new SemVer(e, this.options);
  }
  for (var t = 0; t < this.set.length; t++)
    if (ce(this.set[t], e, this.options)) return !0;
  return !1;
};
exports.satisfies = le;
exports.maxSatisfying = function (e, t, n) {
  var r = null,
    o = null;
  try {
    var i = new ie(t, n);
  } catch (e) {
    return null;
  }
  e.forEach(function (e) {
    if (i.test(e)) {
      if (r && -1 !== o.compare(e)) {
        o = new SemVer((r = e), n);
      }
    }
  });
  return r;
};
exports.minSatisfying = function (e, t, n) {
  var r = null,
    o = null;
  try {
    var i = new ie(t, n);
  } catch (e) {
    return null;
  }
  e.forEach(function (e) {
    if (i.test(e)) {
      if (r && 1 !== o.compare(e)) {
        o = new SemVer((r = e), n);
      }
    }
  });
  return r;
};
exports.minVersion = function (e, t) {
  e = new ie(e, t);
  var n = new SemVer("0.0.0");
  if (e.test(n)) return n;
  n = new SemVer("0.0.0-0");
  if (e.test(n)) return n;
  n = null;
  for (var r = 0; r < e.set.length; ++r)
    e.set[r].forEach(function (e) {
      var t = new SemVer(e.semver.version);
      switch (e.operator) {
        case ">":
          if (0 === t.prerelease.length) {
            t.patch++;
          } else {
            t.prerelease.push(0);
          }
          t.raw = t.format();
        case "":
        case ">=":
          if (n && !gt(n, t)) {
            n = t;
          }
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error("Unexpected operation: " + e.operator);
      }
    });
  return n && e.test(n) ? n : null;
};
exports.validRange = function (e, t) {
  try {
    return new ie(e, t).range || "*";
  } catch (e) {
    return null;
  }
};
exports.ltr = function (e, t, n) {
  return ue(e, t, "<", n);
};
exports.gtr = function (e, t, n) {
  return ue(e, t, ">", n);
};
exports.outside = ue;
exports.prerelease = function (e, t) {
  var n = parse(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
exports.intersects = function (e, t, n) {
  e = new ie(e, n);
  t = new ie(t, n);
  return e.intersects(t);
};
exports.coerce = function (e) {
  if (e instanceof SemVer) return e;
  if ("string" != typeof e) return null;
  var t = e.match(o[P]);
  return null == t
    ? null
    : parse(t[1] + "." + (t[2] || "0") + "." + (t[3] || "0"));
};