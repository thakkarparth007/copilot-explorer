Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.setupExperimentationService = exports.logger = undefined;
const M_vscode = require("vscode");
const M_config_stuff = require("config-stuff");
const M_task_maybe = require("task");
const M_filter_maybe = require("filter");
const M_logging_utils = require("logging-utils");
function c(e) {
  return e.split("-")[0];
}
exports.logger = new M_logging_utils.Logger(
  M_logging_utils.LogLevel.INFO,
  "Exp"
);
exports.setupExperimentationService = function (e) {
  const t = e.get(M_task_maybe.Features);
  t.setPrefix(M_vscode.env.machineId);
  t.registerStaticFilters(
    (function (e) {
      const t = e.get(M_config_stuff.BuildInfo);
      return {
        [M_filter_maybe.Filter.ApplicationVersion]: c(M_vscode.version),
        [M_filter_maybe.Filter.Build]: M_vscode.env.appName,
        [M_filter_maybe.Filter.ClientId]: M_vscode.env.machineId,
        [M_filter_maybe.Filter.ExtensionName]: t.getName(),
        [M_filter_maybe.Filter.ExtensionVersion]: c(t.getVersion()),
        [M_filter_maybe.Filter.Language]: M_vscode.env.language,
        [M_filter_maybe.Filter.TargetPopulation]:
          M_filter_maybe.TargetPopulation.Public,
      };
    })(e)
  );
  t.registerDynamicFilter(M_filter_maybe.Filter.CopilotOverrideEngine, () =>
    M_config_stuff.getConfig(e, M_config_stuff.ConfigKey.DebugOverrideEngine)
  );
};
