var M_copilot_utils_NOTSURE = require("copilot-utils"),
  M_channel_NOTSURE = require("channel"),
  i = [],
  s = {
    syslog: function (e) {
      var t = {
        emerg: M_copilot_utils_NOTSURE.SeverityLevel.Critical,
        alert: M_copilot_utils_NOTSURE.SeverityLevel.Critical,
        crit: M_copilot_utils_NOTSURE.SeverityLevel.Critical,
        error: M_copilot_utils_NOTSURE.SeverityLevel.Error,
        warning: M_copilot_utils_NOTSURE.SeverityLevel.Warning,
        notice: M_copilot_utils_NOTSURE.SeverityLevel.Information,
        info: M_copilot_utils_NOTSURE.SeverityLevel.Information,
        debug: M_copilot_utils_NOTSURE.SeverityLevel.Verbose,
      };
      return undefined === t[e]
        ? M_copilot_utils_NOTSURE.SeverityLevel.Information
        : t[e];
    },
    npm: function (e) {
      var t = {
        error: M_copilot_utils_NOTSURE.SeverityLevel.Error,
        warn: M_copilot_utils_NOTSURE.SeverityLevel.Warning,
        info: M_copilot_utils_NOTSURE.SeverityLevel.Information,
        verbose: M_copilot_utils_NOTSURE.SeverityLevel.Verbose,
        debug: M_copilot_utils_NOTSURE.SeverityLevel.Verbose,
        silly: M_copilot_utils_NOTSURE.SeverityLevel.Verbose,
      };
      return undefined === t[e]
        ? M_copilot_utils_NOTSURE.SeverityLevel.Information
        : t[e];
    },
    unknown: function (e) {
      return M_copilot_utils_NOTSURE.SeverityLevel.Information;
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
      M_channel_NOTSURE.channel.subscribe("winston", a);
    }
    i.push(t);
  } else {
    if (
      0 ===
      (i = i.filter(function (e) {
        return e != t;
      })).length
    ) {
      M_channel_NOTSURE.channel.unsubscribe("winston", a);
    }
  }
};
