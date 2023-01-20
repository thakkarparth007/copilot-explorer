Object.defineProperty(exports, "__esModule", {
  value: true,
});
var r = require("path");
var o = require(4014);
var i = require("module");
var s = Object.keys(process.binding("natives"));
var a = i.prototype.require;
exports.makePatchingRequire = function (e) {
  var t = {};
  return function (n) {
    var c = a.apply(this, arguments);
    if (e[n]) {
      var l = i._resolveFilename(n, this);
      if (t.hasOwnProperty(l)) return t[l];
      var u = undefined;
      if (s.indexOf(n) < 0)
        try {
          u = a.call(this, r.join(n, "package.json")).version;
        } catch (e) {
          return c;
        }
      else u = process.version.substring(1);
      var d = u.indexOf("-");
      if (d >= 0) {
        u = u.substring(0, d);
      }
      for (p = c, h = 0, f = e[n], undefined; h < f.length; h++) {
        var p;
        var h;
        var f;
        var m = f[h];
        if (o.satisfies(u, m.versionSpecifier)) {
          p = m.patch(p, l);
        }
      }
      return (t[l] = p);
    }
    return c;
  };
};