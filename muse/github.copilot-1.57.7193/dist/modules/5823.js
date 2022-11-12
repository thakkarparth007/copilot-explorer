var r = require(5290),
  o = require(4953),
  i = [],
  s = {
    10: r.SeverityLevel.Verbose,
    20: r.SeverityLevel.Verbose,
    30: r.SeverityLevel.Information,
    40: r.SeverityLevel.Warning,
    50: r.SeverityLevel.Error,
    60: r.SeverityLevel.Critical
  },
  a = function (e) {
    var t = e.data.result;
    i.forEach(function (n) {
      var r = s[e.data.level];
      t instanceof Error ? n.trackException({
        exception: t
      }) : n.trackTrace({
        message: t,
        severity: r
      });
    });
  };
exports.wp = function (e, t) {
  e ? (0 === i.length && o.channel.subscribe("bunyan", a), i.push(t)) : 0 === (i = i.filter(function (e) {
    return e != t;
  })).length && o.channel.unsubscribe("bunyan", a);
};