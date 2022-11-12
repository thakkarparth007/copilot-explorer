Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.isVerboseLoggingEnabled = exports.isDebugEnabled = exports.shouldFailForDebugPurposes = exports.isRunningInTest = exports.RuntimeMode = undefined;
class n {
  constructor(e) {
    this.flags = e;
  }
  static fromEnvironment(e) {
    return new n({
      debug: (t = process.argv, r = process.env, t.includes("--debug") || "true" === (null === (s = r.GITHUB_COPILOT_DEBUG) || undefined === s ? undefined : s.toLowerCase())),
      verboseLogging: o(process.env),
      testMode: e,
      recordInput: i(process.argv, process.env)
    });
    var t, r, s;
  }
}
function r(e) {
  return e.get(n).flags.testMode;
}
function o(e) {
  if ("COPILOT_AGENT_VERBOSE" in e) {
    const t = e.COPILOT_AGENT_VERBOSE;
    return "1" === t || "true" === t;
  }
  return !1;
}
function i(e, t) {
  var n;
  return e.includes("--record") || "true" === (null === (n = t.GITHUB_COPILOT_RECORD) || undefined === n ? undefined : n.toLowerCase());
}
exports.RuntimeMode = n;
exports.isRunningInTest = r;
exports.shouldFailForDebugPurposes = function (e) {
  return r(e);
};
exports.isDebugEnabled = function (e) {
  return e.get(n).flags.debug;
};
exports.isVerboseLoggingEnabled = function (e) {
  return e.get(n).flags.verboseLogging;
};