Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.NoOpStatusReporter = exports.StatusReporter = undefined;
class n {}
exports.StatusReporter = n;
exports.NoOpStatusReporter = class extends n {
  setProgress() {}
  removeProgress() {}
  setWarning() {}
  setError(e) {}
  forceNormal() {}
};