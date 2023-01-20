Object.defineProperty(exports, "__esModule", {
  value: true,
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