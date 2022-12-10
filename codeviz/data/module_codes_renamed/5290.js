function r(e) {
  for (var n in e)
    if (exports.hasOwnProperty(n)) {
      exports[n] = e[n];
    }
}
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
r(require("telemetry-constants"));
r(require("telemetry-common"));
r(require("copilot-github-auth-stuff"));
