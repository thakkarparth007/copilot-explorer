Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.activate = undefined;
const r = require(4398),
  o = require(1133),
  i = require(6333),
  s = require(9380);
function a(e, t, n, o, a) {
  const c = new r.default(t, n, o);
  s.setupExperimentationService(e);
  i.configureReporter(e, c);
  return c;
}
exports.activate = function (e, t) {
  const n = t.extension.packageJSON.name,
    r = o.getVersion(e),
    s = a(e, n, r, i.APP_INSIGHTS_KEY, t.globalState),
    c = a(e, n, r, i.APP_INSIGHTS_KEY_SECURE, t.globalState);
  t.subscriptions.push(s);
  t.subscriptions.push(c);
  return new i.TelemetryReporters(s, c);
};