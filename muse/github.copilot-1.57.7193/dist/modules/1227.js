var r = require(4953);
var o = [];
exports.qP = function (e) {
  o.forEach(function (t) {
    var n = e.data.query;
    var r =
      (n.preparable && n.preparable.text) ||
      n.plan ||
      n.text ||
      "unknown query";
    var o = !e.data.error;
    var i = e.data.database.host + ":" + e.data.database.port;
    t.trackDependency({
      target: i,
      data: r,
      name: r,
      duration: e.data.duration,
      success: o,
      resultCode: o ? "0" : "1",
      dependencyTypeName: "postgres",
    });
  });
};
exports.wp = function (e, n) {
  if (e) {
    if (0 === o.length) {
      r.channel.subscribe("postgres", exports.qP);
    }
    o.push(n);
  } else {
    if (
      0 ===
      (o = o.filter(function (e) {
        return e != n;
      })).length
    ) {
      r.channel.unsubscribe("postgres", exports.qP);
    }
  }
};