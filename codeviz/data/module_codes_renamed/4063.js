module.exports = function e(t, n) {
  if (t === n) return !0;
  if (t && n && "object" == typeof t && "object" == typeof n) {
    if (t.constructor !== n.constructor) return !1;
    var r;
    var o;
    var i;
    if (Array.isArray(t)) {
      if ((r = t.length) != n.length) return !1;
      for (o = r; 0 != o--; ) if (!e(t[o], n[o])) return !1;
      return !0;
    }
    if (t.constructor === RegExp)
      return t.source === n.source && t.flags === n.flags;
    if (t.valueOf !== Object.prototype.valueOf)
      return t.valueOf() === n.valueOf();
    if (t.toString !== Object.prototype.toString)
      return t.toString() === n.toString();
    if ((r = (i = Object.keys(t)).length) !== Object.keys(n).length) return !1;
    for (o = r; 0 != o--; )
      if (!Object.prototype.hasOwnProperty.call(n, i[o])) return !1;
    for (o = r; 0 != o--; ) {
      var s = i[o];
      if (!e(t[s], n[s])) return !1;
    }
    return !0;
  }
  return t != t && n != n;
};
