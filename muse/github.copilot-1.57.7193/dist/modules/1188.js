var r = require(2728);
function H() {
  this._array = [];
  this._sorted = !0;
  this._last = {
    generatedLine: -1,
    generatedColumn: 0
  };
}
H.prototype.unsortedForEach = function (e, t) {
  this._array.forEach(e, t);
};
H.prototype.add = function (e) {
  var t, n, o, i, s, a;
  n = e;
  o = (t = this._last).generatedLine;
  i = n.generatedLine;
  s = t.generatedColumn;
  a = n.generatedColumn;
  i > o || i == o && a >= s || r.compareByGeneratedPositionsInflated(t, n) <= 0 ? (this._last = e, this._array.push(e)) : (this._sorted = !1, this._array.push(e));
};
H.prototype.toArray = function () {
  this._sorted || (this._array.sort(r.compareByGeneratedPositionsInflated), this._sorted = !0);
  return this._array;
};
exports.H = H;