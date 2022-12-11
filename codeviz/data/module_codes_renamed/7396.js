Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_logging_maybe = require("logging");
exports.IsInitialized = !process.env.APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL;
var o = "DiagnosticChannel";
if (exports.IsInitialized) {
  var M_debug_agent_maybe = require("debug-agent");
  var s = (process.env.APPLICATION_INSIGHTS_NO_PATCH_MODULES || "").split(",");
  var a = {
    bunyan: M_debug_agent_maybe.bunyan,
    console: M_debug_agent_maybe.console,
    mongodb: M_debug_agent_maybe.mongodb,
    mongodbCore: M_debug_agent_maybe.mongodbCore,
    mysql: M_debug_agent_maybe.mysql,
    redis: M_debug_agent_maybe.redis,
    pg: M_debug_agent_maybe.pg,
    pgPool: M_debug_agent_maybe.pgPool,
    winston: M_debug_agent_maybe.winston,
  };
  for (var c in a)
    if (-1 === s.indexOf(c)) {
      a[c].enable();
      M_logging_maybe.info(o, "Subscribed to " + c + " events");
    }
  if (s.length > 0) {
    M_logging_maybe.info(o, "Some modules will not be patched", s);
  }
} else
  M_logging_maybe.info(
    o,
    "Not subscribing to dependency autocollection because APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL was set"
  );
exports.registerContextPreservation = function (e) {
  if (exports.IsInitialized) {
    require("channel").channel.addContextPreservation(e);
  }
};
