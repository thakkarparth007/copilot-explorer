function n(e, t, n) {
  var r = e[t];
  e[t] = e[n];
  e[n] = r;
}
function r(e, t, o, i) {
  if (o < i) {
    var s = o - 1;
    n(e, ((u = o), (d = i), Math.round(u + Math.random() * (d - u))), i);
    for (a = e[i], c = o, undefined; c < i; c++) {
      var a;
      var c;
      if (t(e[c], a) <= 0) {
        n(e, (s += 1), c);
      }
    }
    n(e, s + 1, c);
    var l = s + 1;
    r(e, t, o, l - 1);
    r(e, t, l + 1, i);
  }
  var u;
  var d;
}
exports.U = function (e, t) {
  r(e, t, 0, e.length - 1);
};