var r = require(5290);
var o = require(4953);
var i = [];
var s = {
  10: r.SeverityLevel.Verbose,
  20: r.SeverityLevel.Verbose,
  30: r.SeverityLevel.Information,
  40: r.SeverityLevel.Warning,
  50: r.SeverityLevel.Error,
  60: r.SeverityLevel.Critical,
};
var a = function (e) {
  var t = e.data.result;
  i.forEach(function (n) {
    var r = s[e.data.level];
    if (t instanceof Error) {
      n.trackException({
        exception: t,
      });
    } else {
      n.trackTrace({
        message: t,
        severity: r,
      });
    }
  });
};
exports.wp = function (e, t) {
  if (e) {
    if (0 === i.length) {
      o.channel.subscribe("bunyan", a);
    }
    i.push(t);
  } else {
    if (
      0 ===
      (i = i.filter(function (e) {
        return e != t;
      })).length
    ) {
      o.channel.unsubscribe("bunyan", a);
    }
  }
};