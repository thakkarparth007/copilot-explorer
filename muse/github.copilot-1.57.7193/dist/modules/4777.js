var r = require(4953),
  o = [];
exports.qP = function (e) {
  o.forEach(function (t) {
    var n = e.data.query || {},
      r = n.sql || "Unknown query",
      o = !e.data.err,
      i = (n._connection || {}).config || {},
      s = i.socketPath ? i.socketPath : (i.host || "localhost") + ":" + i.port;
    t.trackDependency({
      target: s,
      data: r,
      name: r,
      duration: e.data.duration,
      success: o,
      resultCode: o ? "0" : "1",
      dependencyTypeName: "mysql"
    });
  });
};
exports.wp = function (e, n) {
  e ? (0 === o.length && r.channel.subscribe("mysql", exports.qP), o.push(n)) : 0 === (o = o.filter(function (e) {
    return e != n;
  })).length && r.channel.unsubscribe("mysql", exports.qP);
};