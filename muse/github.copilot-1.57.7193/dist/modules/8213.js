var r = require(2728),
  o = Object.prototype.hasOwnProperty,
  i = "undefined" != typeof Map;
function s() {
  this._array = [];
  this._set = i ? new Map() : Object.create(null);
}
s.fromArray = function (e, t) {
  for (var n = new s(), r = 0, o = e.length; r < o; r++) n.add(e[r], t);
  return n;
};
s.prototype.size = function () {
  return i ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};
s.prototype.add = function (e, t) {
  var n = i ? e : r.toSetString(e),
    s = i ? this.has(e) : o.call(this._set, n),
    a = this._array.length;
  s && !t || this._array.push(e);
  s || (i ? this._set.set(e, a) : this._set[n] = a);
};
s.prototype.has = function (e) {
  if (i) return this._set.has(e);
  var t = r.toSetString(e);
  return o.call(this._set, t);
};
s.prototype.indexOf = function (e) {
  if (i) {
    var t = this._set.get(e);
    if (t >= 0) return t;
  } else {
    var n = r.toSetString(e);
    if (o.call(this._set, n)) return this._set[n];
  }
  throw new Error('"' + e + '" is not in the set.');
};
s.prototype.at = function (e) {
  if (e >= 0 && e < this._array.length) return this._array[e];
  throw new Error("No element indexed by " + e);
};
s.prototype.toArray = function () {
  return this._array.slice();
};
exports.I = s;