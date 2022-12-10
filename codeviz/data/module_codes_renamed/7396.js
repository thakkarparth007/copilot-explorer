Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_logging_NOTSURE = require("logging");
exports.IsInitialized = !process.env.APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL;
var o = "DiagnosticChannel";
if (exports.IsInitialized) {
  var M_debug_agent_NOTSURE = require("debug-agent"),
    s = (process.env.APPLICATION_INSIGHTS_NO_PATCH_MODULES || "").split(","),
    a = {
      bunyan: M_debug_agent_NOTSURE.bunyan,
      console: M_debug_agent_NOTSURE.console,
      mongodb: M_debug_agent_NOTSURE.mongodb,
      mongodbCore: M_debug_agent_NOTSURE.mongodbCore,
      mysql: M_debug_agent_NOTSURE.mysql,
      redis: M_debug_agent_NOTSURE.redis,
      pg: M_debug_agent_NOTSURE.pg,
      pgPool: M_debug_agent_NOTSURE.pgPool,
      winston: M_debug_agent_NOTSURE.winston,
    };
  for (var c in a)
    if (-1 === s.indexOf(c)) {
      a[c].enable();
      M_logging_NOTSURE.info(o, "Subscribed to " + c + " events");
    }
  if (s.length > 0) {
    M_logging_NOTSURE.info(o, "Some modules will not be patched", s);
  }
} else
  M_logging_NOTSURE.info(
    o,
    "Not subscribing to dependency autocollection because APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL was set"
  );
exports.registerContextPreservation = function (e) {
  if (exports.IsInitialized) {
    require("channel").channel.addContextPreservation(e);
  }
};
