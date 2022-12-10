var M_copilot_utils_NOTSURE = require("copilot-utils"),
  M_channel_NOTSURE = require("channel"),
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
            ? M_copilot_utils_NOTSURE.SeverityLevel.Warning
            : M_copilot_utils_NOTSURE.SeverityLevel.Information,
        });
      }
    });
  };
exports.wp = function (e, t) {
  if (e) {
    if (0 === i.length) {
      M_channel_NOTSURE.channel.subscribe("console", s);
    }
    i.push(t);
  } else {
    if (
      0 ===
      (i = i.filter(function (e) {
        return e != t;
      })).length
    ) {
      M_channel_NOTSURE.channel.unsubscribe("console", s);
    }
  }
};
