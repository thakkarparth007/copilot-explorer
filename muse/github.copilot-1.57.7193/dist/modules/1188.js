var r = require(2728);
function H() {
  this._array = [];
  this._sorted = true;
  this._last = {
    generatedLine: -1,
    generatedColumn: 0,
  };
}
H.prototype.unsortedForEach = function (e, t) {
  this._array.forEach(e, t);
};
H.prototype.add = function (e) {
  var t;
  var n;
  var o;
  var i;
  var s;
  var a;
  n = e;
  o = (t = this._last).generatedLine;
  i = n.generatedLine;
  s = t.generatedColumn;
  a = n.generatedColumn;
  if (
    i > o ||
    (i == o && a >= s) ||
    r.compareByGeneratedPositionsInflated(t, n) <= 0
  ) {
    this._last = e;
    this._array.push(e);
  } else {
    this._sorted = false;
    this._array.push(e);
  }
};
H.prototype.toArray = function () {
  if (this._sorted) {
    this._array.sort(r.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};
exports.H = H;