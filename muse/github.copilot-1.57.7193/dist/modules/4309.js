var r = require(5290),
  o = require(4953),
  i = [],
  s = function (e) {
    var t = e.data.message;
    i.forEach(function (n) {
      if (t instanceof Error) {
        n.trackException({
          exception: t,
        });
      } else {
        if (t.lastIndexOf("\n") == t.length - 1) {
          t = t.substring(0, t.length - 1);
        }
        n.trackTrace({
          message: t,
          severity: e.data.stderr
            ? r.SeverityLevel.Warning
            : r.SeverityLevel.Information,
        });
      }
    });
  };
exports.wp = function (e, t) {
  if (e) {
    if (0 === i.length) {
      o.channel.subscribe("console", s);
    }
    i.push(t);
  } else {
    if (
      0 ===
      (i = i.filter(function (e) {
        return e != t;
      })).length
    ) {
      o.channel.unsubscribe("console", s);
    }
  }
};