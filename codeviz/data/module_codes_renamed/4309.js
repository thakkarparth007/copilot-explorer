var M_copilot_utils_maybe = require("copilot-utils");
var M_channel_maybe = require("channel");
var i = [];
var s = function (e) {
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
          ? M_copilot_utils_maybe.SeverityLevel.Warning
          : M_copilot_utils_maybe.SeverityLevel.Information,
      });
    }
  });
};
exports.wp = function (e, t) {
  if (e) {
    if (0 === i.length) {
      M_channel_maybe.channel.subscribe("console", s);
    }
    i.push(t);
  } else {
    if (
      0 ===
      (i = i.filter(function (e) {
        return e != t;
      })).length
    ) {
      M_channel_maybe.channel.unsubscribe("console", s);
    }
  }
};
