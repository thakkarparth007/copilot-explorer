var M_url_utils_maybe = require("url-utils");
var o = Object.prototype.hasOwnProperty;
var i = "undefined" != typeof Map;
function I() {
  this._array = [];
  this._set = i ? new Map() : Object.create(null);
}
I.fromArray = function (e, t) {
  for (n = new I(), r = 0, o = e.length, undefined; r < o; r++) {
    var n;
    var r;
    var o;
    n.add(e[r], t);
  }
  return n;
};
I.prototype.size = function () {
  return i ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};
I.prototype.add = function (e, t) {
  var n = i ? e : M_url_utils_maybe.toSetString(e);
  var s = i ? this.has(e) : o.call(this._set, n);
  var a = this._array.length;
  if (s && !t) {
    this._array.push(e);
  }
  if (s) {
    if (i) {
      this._set.set(e, a);
    } else {
      this._set[n] = a;
    }
  }
};
I.prototype.has = function (e) {
  if (i) return this._set.has(e);
  var t = M_url_utils_maybe.toSetString(e);
  return o.call(this._set, t);
};
I.prototype.indexOf = function (e) {
  if (i) {
    var t = this._set.get(e);
    if (t >= 0) return t;
  } else {
    var n = M_url_utils_maybe.toSetString(e);
    if (o.call(this._set, n)) return this._set[n];
  }
  throw new Error('"' + e + '" is not in the set.');
};
I.prototype.at = function (e) {
  if (e >= 0 && e < this._array.length) return this._array[e];
  throw new Error("No element indexed by " + e);
};
I.prototype.toArray = function () {
  return this._array.slice();
};
exports.I = I;
