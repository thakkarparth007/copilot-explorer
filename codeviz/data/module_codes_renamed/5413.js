Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getDebounceLimit = exports.GhostTextDebounceManager = undefined;
const M_task_maybe = require("task");
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
    (await e.get(M_task_maybe.Features).debouncePredict()) &&
    t.measurements.contextualFilterScore
  ) {
    const e = t.measurements.contextualFilterScore;
    const r = 0.275;
    const o = 6;
    n = 25 + 250 / (1 + Math.pow(e / r, o));
  } else n = await e.get(M_task_maybe.Features).debounceMs();
  return (n > 0 ? n : 75) + e.get(GhostTextDebounceManager).extraDebounceMs;
};
