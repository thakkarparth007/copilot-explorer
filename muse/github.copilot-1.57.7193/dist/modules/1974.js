var t = (function () {
  function e(e) {
    this.fieldmap = [];
    if (e) {
      this.fieldmap = this.parseHeader(e);
    }
  }
  e.prototype.toString = function () {
    var e = this.fieldmap;
    return e && 0 != e.length ? e.join(", ") : null;
  };
  e.validateKeyChars = function (e) {
    var t = e.split("@");
    if (2 == t.length) {
      var n = t[0].trim(),
        r = t[1].trim(),
        o = Boolean(n.match(/^[\ ]?[a-z0-9\*\-\_/]{1,241}$/)),
        i = Boolean(r.match(/^[\ ]?[a-z0-9\*\-\_/]{1,14}$/));
      return o && i;
    }
    return 1 == t.length && Boolean(e.match(/^[\ ]?[a-z0-9\*\-\_/]{1,256}$/));
  };
  e.prototype.parseHeader = function (t) {
    var n = [],
      r = {},
      o = t.split(",");
    if (o.length > 32) return null;
    for (var i = 0, s = o; i < s.length; i++) {
      var a = s[i].trim();
      if (0 !== a.length) {
        var c = a.split("=");
        if (2 !== c.length) return null;
        if (!e.validateKeyChars(c[0])) return null;
        if (r[c[0]]) return null;
        r[c[0]] = !0;
        n.push(a);
      }
    }
    return n;
  };
  e.strict = !0;
  return e;
})();
module.exports = t;