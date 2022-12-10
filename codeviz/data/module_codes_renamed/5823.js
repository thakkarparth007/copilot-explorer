var M_copilot_utils_NOTSURE = require("copilot-utils"),
  M_channel_NOTSURE = require("channel"),
  i = [],
  s = {
    10: M_copilot_utils_NOTSURE.SeverityLevel.Verbose,
    20: M_copilot_utils_NOTSURE.SeverityLevel.Verbose,
    30: M_copilot_utils_NOTSURE.SeverityLevel.Information,
    40: M_copilot_utils_NOTSURE.SeverityLevel.Warning,
    50: M_copilot_utils_NOTSURE.SeverityLevel.Error,
    60: M_copilot_utils_NOTSURE.SeverityLevel.Critical,
  },
  a = function (e) {
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
      M_channel_NOTSURE.channel.subscribe("bunyan", a);
    }
    i.push(t);
  } else {
    if (
      0 ===
      (i = i.filter(function (e) {
        return e != t;
      })).length
    ) {
      M_channel_NOTSURE.channel.unsubscribe("bunyan", a);
    }
  }
};
