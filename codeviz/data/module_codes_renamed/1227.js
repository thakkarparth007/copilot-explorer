var M_channel_NOTSURE = require("channel"),
  o = [];
exports.qP = function (e) {
  o.forEach(function (t) {
    var n = e.data.query,
      r =
        (n.preparable && n.preparable.text) ||
        n.plan ||
        n.text ||
        "unknown query",
      o = !e.data.error,
      i = e.data.database.host + ":" + e.data.database.port;
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
      M_channel_NOTSURE.channel.subscribe("postgres", exports.qP);
    }
    o.push(n);
  } else {
    if (
      0 ===
      (o = o.filter(function (e) {
        return e != n;
      })).length
    ) {
      M_channel_NOTSURE.channel.unsubscribe("postgres", exports.qP);
    }
  }
};
