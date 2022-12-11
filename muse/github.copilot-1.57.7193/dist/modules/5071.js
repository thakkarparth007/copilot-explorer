var r = require(4953);
var o = [];
exports.qP = function (e) {
  o.forEach(function (t) {
    if ("info" !== e.data.commandObj.command) {
      t.trackDependency({
        target: e.data.address,
        name: e.data.commandObj.command,
        data: e.data.commandObj.command,
        duration: e.data.duration,
        success: !e.data.err,
        resultCode: e.data.err ? "1" : "0",
        dependencyTypeName: "redis",
      });
    }
  });
};
exports.wp = function (e, n) {
  if (e) {
    if (0 === o.length) {
      r.channel.subscribe("redis", exports.qP);
    }
    o.push(n);
  } else {
    if (
      0 ===
      (o = o.filter(function (e) {
        return e != n;
      })).length
    ) {
      r.channel.unsubscribe("redis", exports.qP);
    }
  }
};