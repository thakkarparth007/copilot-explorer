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
      var n = t[0].trim();
      var r = t[1].trim();
      var o = Boolean(n.match(/^[\ ]?[a-z0-9\*\-\_/]{1,241}$/));
      var i = Boolean(r.match(/^[\ ]?[a-z0-9\*\-\_/]{1,14}$/));
      return o && i;
    }
    return 1 == t.length && Boolean(e.match(/^[\ ]?[a-z0-9\*\-\_/]{1,256}$/));
  };
  e.prototype.parseHeader = function (t) {
    var n = [];
    var r = {};
    var o = t.split(",");
    if (o.length > 32) return null;
    for (i = 0, s = o, undefined; i < s.length; i++) {
      var i;
      var s;
      var a = s[i].trim();
      if (0 !== a.length) {
        var c = a.split("=");
        if (2 !== c.length) return null;
        if (!e.validateKeyChars(c[0])) return null;
        if (r[c[0]]) return null;
        r[c[0]] = true;
        n.push(a);
      }
    }
    return n;
  };
  e.strict = true;
  return e;
})();
module.exports = t;