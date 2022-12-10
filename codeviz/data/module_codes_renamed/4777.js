var M_channel_NOTSURE = require("channel"),
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
      dependencyTypeName: "mysql",
    });
  });
};
exports.wp = function (e, n) {
  if (e) {
    if (0 === o.length) {
      M_channel_NOTSURE.channel.subscribe("mysql", exports.qP);
    }
    o.push(n);
  } else {
    if (
      0 ===
      (o = o.filter(function (e) {
        return e != n;
      })).length
    ) {
      M_channel_NOTSURE.channel.unsubscribe("mysql", exports.qP);
    }
  }
};
