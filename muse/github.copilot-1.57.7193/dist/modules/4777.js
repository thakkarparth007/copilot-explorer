var r = require(4953);
var o = [];
exports.qP = function (e) {
  o.forEach(function (t) {
    var n = e.data.query || {};
    var r = n.sql || "Unknown query";
    var o = !e.data.err;
    var i = (n._connection || {}).config || {};
    var s = i.socketPath
      ? i.socketPath
      : (i.host || "localhost") + ":" + i.port;
    t.trackDependency({
      target: s,
      data: r,
      name: r,
      duration: e.data.duration,
      success: o,
      resultCode: o ? "0" : "1",
      dependencyTypeName: "mysql",
    });
  });
};
exports.wp = function (e, n) {
  if (e) {
    if (0 === o.length) {
      r.channel.subscribe("mysql", exports.qP);
    }
    o.push(n);
  } else {
    if (
      0 ===
      (o = o.filter(function (e) {
        return e != n;
      })).length
    ) {
      r.channel.unsubscribe("mysql", exports.qP);
    }
  }
};