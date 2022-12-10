Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.setupExperimentationService = exports.logger = undefined;
const r = require("vscode"),
  M_config_stuff = require("config-stuff"),
  M_task_NOTSURE = require("task"),
  M_filter_NOTSURE = require("filter"),
  M_logging_utils = require("logging-utils");
function c(e) {
  return e.split("-")[0];
}
exports.logger = new M_logging_utils.Logger(
  M_logging_utils.LogLevel.INFO,
  "Exp"
);
exports.setupExperimentationService = function (e) {
  const t = e.get(M_task_NOTSURE.Features);
  t.setPrefix(r.env.machineId);
  t.registerStaticFilters(
    (function (e) {
      const t = e.get(M_config_stuff.BuildInfo);
      return {
        [M_filter_NOTSURE.Filter.ApplicationVersion]: c(r.version),
        [M_filter_NOTSURE.Filter.Build]: r.env.appName,
        [M_filter_NOTSURE.Filter.ClientId]: r.env.machineId,
        [M_filter_NOTSURE.Filter.ExtensionName]: t.getName(),
        [M_filter_NOTSURE.Filter.ExtensionVersion]: c(t.getVersion()),
        [M_filter_NOTSURE.Filter.Language]: r.env.language,
        [M_filter_NOTSURE.Filter.TargetPopulation]:
          M_filter_NOTSURE.TargetPopulation.Public,
      };
    })(e)
  );
  t.registerDynamicFilter(M_filter_NOTSURE.Filter.CopilotOverrideEngine, () =>
    M_config_stuff.getConfig(e, M_config_stuff.ConfigKey.DebugOverrideEngine)
  );
};
