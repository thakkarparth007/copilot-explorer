Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.NoOpStatusReporter = exports.StatusReporter = undefined;
class StatusReporter {}
exports.StatusReporter = StatusReporter;
exports.NoOpStatusReporter = class extends StatusReporter {
  setProgress() {}
  removeProgress() {}
  setWarning() {}
  setError(e) {}
  forceNormal() {}
};