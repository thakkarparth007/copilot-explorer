Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.activate = undefined;
const M_telemetry_sender = require("telemetry-sender");
const M_config_stuff = require("config-stuff");
const M_telemetry_stuff = require("telemetry-stuff");
const M_experimentation_service_setup_maybe = require("experimentation-service-setup");
function a(e, t, n, o, a) {
  const c = new M_telemetry_sender.default(t, n, o);
  M_experimentation_service_setup_maybe.setupExperimentationService(e);
  M_telemetry_stuff.configureReporter(e, c);
  return c;
}
exports.activate = function (e, t) {
  const n = t.extension.packageJSON.name;
  const r = M_config_stuff.getVersion(e);
  const s = a(e, n, r, M_telemetry_stuff.APP_INSIGHTS_KEY, t.globalState);
  const c = a(
    e,
    n,
    r,
    M_telemetry_stuff.APP_INSIGHTS_KEY_SECURE,
    t.globalState
  );
  t.subscriptions.push(s);
  t.subscriptions.push(c);
  return new M_telemetry_stuff.TelemetryReporters(s, c);
};
