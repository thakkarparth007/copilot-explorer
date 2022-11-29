var r = require(5290),
  o = require(4953),
  i = [],
  s = {
    syslog: function (e) {
      var t = {
        emerg: r.SeverityLevel.Critical,
        alert: r.SeverityLevel.Critical,
        crit: r.SeverityLevel.Critical,
        error: r.SeverityLevel.Error,
        warning: r.SeverityLevel.Warning,
        notice: r.SeverityLevel.Information,
        info: r.SeverityLevel.Information,
        debug: r.SeverityLevel.Verbose,
      };
      return undefined === t[e] ? r.SeverityLevel.Information : t[e];
    },
    npm: function (e) {
      var t = {
        error: r.SeverityLevel.Error,
        warn: r.SeverityLevel.Warning,
        info: r.SeverityLevel.Information,
        verbose: r.SeverityLevel.Verbose,
        debug: r.SeverityLevel.Verbose,
        silly: r.SeverityLevel.Verbose,
      };
      return undefined === t[e] ? r.SeverityLevel.Information : t[e];
    },
    unknown: function (e) {
      return r.SeverityLevel.Information;
    },
  },
  a = function (e) {
    var t = e.data.message;
    i.forEach(function (n) {
      if (t instanceof Error)
        n.trackException({
          exception: t,
          properties: e.data.meta,
        });
      else {
        var r = s[e.data.levelKind](e.data.level);
        n.trackTrace({
          message: t,
          severity: r,
          properties: e.data.meta,
        });
      }
    });
  };
exports.wp = function (e, t) {
  if (e) {
    if (0 === i.length) {
      o.channel.subscribe("winston", a);
    }
    i.push(t);
  } else {
    if (
      0 ===
      (i = i.filter(function (e) {
        return e != t;
      })).length
    ) {
      o.channel.unsubscribe("winston", a);
    }
  }
};
