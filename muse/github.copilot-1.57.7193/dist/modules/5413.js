Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getDebounceLimit = exports.GhostTextDebounceManager = undefined;
const r = require(9189);
class GhostTextDebounceManager {
  constructor(e) {
    this.forceDelayMs = e;
    this.extraDebounceMs = 0;
  }
}
exports.GhostTextDebounceManager = GhostTextDebounceManager;
exports.getDebounceLimit = async function (e, t) {
  let n;
  if (
    (await e.get(r.Features).debouncePredict()) &&
    t.measurements.contextualFilterScore
  ) {
    const e = t.measurements.contextualFilterScore;
    const r = 0.275;
    const o = 6;
    n = 25 + 250 / (1 + Math.pow(e / r, o));
  } else n = await e.get(r.Features).debounceMs();
  return (n > 0 ? n : 75) + e.get(GhostTextDebounceManager).extraDebounceMs;
};