Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.setupExperimentationService = exports.logger = undefined;
const r = require("vscode"),
  o = require(1133),
  i = require(9189),
  s = require(8142),
  a = require(9899);
function c(e) {
  return e.split("-")[0];
}
exports.logger = new a.Logger(a.LogLevel.INFO, "Exp");
exports.setupExperimentationService = function (e) {
  const t = e.get(i.Features);
  t.setPrefix(r.env.machineId);
  t.registerStaticFilters(
    (function (e) {
      const t = e.get(o.BuildInfo);
      return {
        [s.Filter.ApplicationVersion]: c(r.version),
        [s.Filter.Build]: r.env.appName,
        [s.Filter.ClientId]: r.env.machineId,
        [s.Filter.ExtensionName]: t.getName(),
        [s.Filter.ExtensionVersion]: c(t.getVersion()),
        [s.Filter.Language]: r.env.language,
        [s.Filter.TargetPopulation]: s.TargetPopulation.Public,
      };
    })(e)
  );
  t.registerDynamicFilter(s.Filter.CopilotOverrideEngine, () =>
    o.getConfig(e, o.ConfigKey.DebugOverrideEngine)
  );
};