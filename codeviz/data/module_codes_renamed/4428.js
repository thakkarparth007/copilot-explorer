Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.activate = undefined;
const M_telemetry_sender = require("telemetry-sender"),
  M_config_stuff = require("config-stuff"),
  M_telemetry_stuff = require("telemetry-stuff"),
  M_experimentation_service_setup_NOTSURE = require("experimentation-service-setup");
function a(e, t, n, o, a) {
  const c = new M_telemetry_sender.default(t, n, o);
  M_experimentation_service_setup_NOTSURE.setupExperimentationService(e);
  M_telemetry_stuff.configureReporter(e, c);
  return c;
}
exports.activate = function (e, t) {
  const n = t.extension.packageJSON.name,
    r = M_config_stuff.getVersion(e),
    s = a(e, n, r, M_telemetry_stuff.APP_INSIGHTS_KEY, t.globalState),
    c = a(e, n, r, M_telemetry_stuff.APP_INSIGHTS_KEY_SECURE, t.globalState);
  t.subscriptions.push(s);
  t.subscriptions.push(c);
  return new M_telemetry_stuff.TelemetryReporters(s, c);
};
