var M_copilot_utils_maybe = require("copilot-utils");
var M_channel_maybe = require("channel");
var i = [];
var s = {
  syslog: function (e) {
    var t = {
      emerg: M_copilot_utils_maybe.SeverityLevel.Critical,
      alert: M_copilot_utils_maybe.SeverityLevel.Critical,
      crit: M_copilot_utils_maybe.SeverityLevel.Critical,
      error: M_copilot_utils_maybe.SeverityLevel.Error,
      warning: M_copilot_utils_maybe.SeverityLevel.Warning,
      notice: M_copilot_utils_maybe.SeverityLevel.Information,
      info: M_copilot_utils_maybe.SeverityLevel.Information,
      debug: M_copilot_utils_maybe.SeverityLevel.Verbose,
    };
    return undefined === t[e]
      ? M_copilot_utils_maybe.SeverityLevel.Information
      : t[e];
  },
  npm: function (e) {
    var t = {
      error: M_copilot_utils_maybe.SeverityLevel.Error,
      warn: M_copilot_utils_maybe.SeverityLevel.Warning,
      info: M_copilot_utils_maybe.SeverityLevel.Information,
      verbose: M_copilot_utils_maybe.SeverityLevel.Verbose,
      debug: M_copilot_utils_maybe.SeverityLevel.Verbose,
      silly: M_copilot_utils_maybe.SeverityLevel.Verbose,
    };
    return undefined === t[e]
      ? M_copilot_utils_maybe.SeverityLevel.Information
      : t[e];
  },
  unknown: function (e) {
    return M_copilot_utils_maybe.SeverityLevel.Information;
  },
};
var a = function (e) {
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
      M_channel_maybe.channel.subscribe("winston", a);
    }
    i.push(t);
  } else {
    if (
      0 ===
      (i = i.filter(function (e) {
        return e != t;
      })).length
    ) {
      M_channel_maybe.channel.unsubscribe("winston", a);
    }
  }
};
