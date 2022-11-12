Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.forceSendingTelemetry = exports.dropTelemetryConfig = exports.setTelemetryConfig = exports.logEnginePrompt = exports.logEngineCompletion = exports.telemetryError = exports.telemetryException = exports.telemetryRaw = exports.telemetryExpProblem = exports.telemetry = exports.configureReporter = exports.TelemetryEndpointUrl = exports.now = exports.telemetrizePromptLength = exports.TelemetryData = exports.setupEmptyReporters = exports.setupStandardReporters = exports.TelemetryReporters = exports.APP_INSIGHTS_KEY_SECURE = exports.APP_INSIGHTS_KEY = undefined;
const r = require(1581),
  o = require(4398),
  i = require(1133),
  s = require(9189),
  a = require(6500),
  c = require(70),
  l = require(2499);
exports.APP_INSIGHTS_KEY = "7d7048df-6dd0-4048-bb23-b716c1461f8f";
exports.APP_INSIGHTS_KEY_SECURE = "3fdd7f28-937a-48c8-9a21-ba337db23bd1";
class u {
  constructor(e, t) {
    this.reporter = e;
    this.reporterSecure = t;
  }
  getReporter(e) {
    return this.reporter;
  }
  getSecureReporter(e) {
    if (y()) return this.reporterSecure;
    if (c.shouldFailForDebugPurposes(e)) throw new Error("Internal error: telemetry opt-out");
  }
  setReporter(e) {
    this.reporter = e;
  }
  setSecureReporter(e) {
    this.reporterSecure = e;
  }
  async deactivate() {
    let e = Promise.resolve();
    this.reporter && (e = this.reporter.dispose(), this.reporter = undefined);
    let t = Promise.resolve();
    this.reporterSecure && (t = this.reporterSecure.dispose(), this.reporterSecure = undefined);
    await Promise.all([e, t]);
  }
  hackOptOutListener() {
    this.reporter.optOutListener = {
      dispose() {}
    };
    this.reporterSecure.optOutListener = {
      dispose() {}
    };
  }
  setToken(e) {
    this.reporter && this.configureToken(this.reporter, e);
    this.reporterSecure && this.configureToken(this.reporterSecure, e);
  }
  configureToken(e, t) {
    const n = e;
    n && n.appInsightsClient && (n.appInsightsClient.context.tags.github_telemetry_token = t.token);
  }
}
let d;
function p(e, t, n, r) {
  const i = new o.default(t, n, r);
  _(e, i);
  return i;
}
exports.TelemetryReporters = u;
exports.setupStandardReporters = function (e, n) {
  const r = i.getVersion(e),
    o = p(e, n, r, exports.APP_INSIGHTS_KEY),
    s = p(e, n, r, exports.APP_INSIGHTS_KEY_SECURE),
    a = e.get(u);
  a.setReporter(o);
  a.setSecureReporter(s);
  return a;
};
exports.setupEmptyReporters = function () {
  return new u();
};
class h {
  constructor(e, t, n) {
    this.properties = e;
    this.measurements = t;
    this.issuedTime = n;
  }
  static createAndMarkAsIssued(e, t) {
    return new h(e || {}, t || {}, m());
  }
  extendedBy(e, t) {
    const n = {
        ...this.properties,
        ...e
      },
      r = {
        ...this.measurements,
        ...t
      },
      o = new h(n, r, this.issuedTime);
    o.displayedTime = this.displayedTime;
    o.filtersAndExp = this.filtersAndExp;
    return o;
  }
  markAsDisplayed() {
    undefined === this.displayedTime && (this.displayedTime = m());
  }
  async extendWithExpTelemetry(e) {
    this.filtersAndExp || (await e.get(s.Features).addExpAndFilterToTelemetry(this));
    this.filtersAndExp.exp.addToTelemetry(this);
    this.filtersAndExp.filters.addToTelemetry(this);
  }
  extendWithEditorAgnosticFields(e) {
    this.properties.editor_version = i.formatNameAndVersion(e.get(i.EditorAndPluginInfo).getEditorInfo(e));
    this.properties.editor_plugin_version = i.formatNameAndVersion(e.get(i.EditorAndPluginInfo).getEditorPluginInfo(e));
    const t = e.get(i.VscInfo);
    this.properties.client_machineid = t.machineId;
    this.properties.client_sessionid = t.sessionId;
    this.properties.copilot_version = `copilot/${i.getVersion(e)}`;
    this.properties.common_extname = e.get(i.EditorAndPluginInfo).getEditorPluginInfo(e).name;
    this.properties.common_extversion = e.get(i.EditorAndPluginInfo).getEditorPluginInfo(e).version;
  }
  extendWithConfigProperties(e) {
    const t = i.dumpConfig(e);
    try {
      t["copilot.build"] = i.getBuild(e);
      t["copilot.buildType"] = i.getBuildType(e);
    } catch (e) {}
    d && (t["copilot.trackingId"] = d.trackingId);
    this.properties = {
      ...this.properties,
      ...t
    };
  }
  extendWithRequestId(e) {
    const t = {
      completionId: e.completionId,
      created: e.created.toString(),
      headerRequestId: e.headerRequestId,
      serverExperiments: e.serverExperiments,
      deploymentId: e.deploymentId
    };
    this.properties = {
      ...this.properties,
      ...t
    };
  }
  static maybeRemoveRepoInfoFromPropertiesHack(e, t) {
    if (e) return t;
    const n = {};
    for (const e in t) h.keysToRemoveFromStandardTelemetryHack.includes(e) || (n[e] = t[e]);
    return n;
  }
  sanitizeKeys() {
    this.properties = h.sanitizeKeys(this.properties);
    this.measurements = h.sanitizeKeys(this.measurements);
  }
  static sanitizeKeys(e) {
    e = e || {};
    const t = {};
    for (const n in e) t[h.keysExemptedFromSanitization.includes(n) ? n : n.replace(/\./g, "_")] = e[n];
    return t;
  }
  updateTimeSinceIssuedAndDisplayed() {
    const e = m() - this.issuedTime;
    this.measurements.timeSinceIssuedMs = e;
    if (void 0 !== this.displayedTime) {
      const e = m() - this.displayedTime;
      this.measurements.timeSinceDisplayedMs = e;
    }
  }
  validateData(e, t) {
    var n;
    let r;
    h.validateTelemetryProperties(this.properties) || (r = {
      problem: "properties",
      error: JSON.stringify(h.validateTelemetryProperties.errors)
    });
    if (!h.validateTelemetryMeasurements(this.measurements)) {
      const e = JSON.stringify(h.validateTelemetryMeasurements.errors);
      void 0 === r ? r = {
        problem: "measurements",
        error: e
      } : (r.problem = "both", r.error += `; ${e}`);
    }
    if (undefined === r) return !0;
    if (c.shouldFailForDebugPurposes(e)) throw new Error(`Invalid telemetry data: ${r.problem} ${r.error} properties=${JSON.stringify(this.properties)} measurements=${JSON.stringify(this.measurements)}`);
    b(e, "invalidTelemetryData", h.createAndMarkAsIssued({
      properties: JSON.stringify(this.properties),
      measurements: JSON.stringify(this.measurements),
      problem: r.problem,
      validationError: r.error
    }), t);
    t && b(e, "invalidTelemetryData_in_secure", h.createAndMarkAsIssued({
      problem: r.problem,
      requestId: null !== (n = this.properties.requestId) && undefined !== n ? n : "unknown"
    }), !1);
    return !1;
  }
  async makeReadyForSending(e, t, n) {
    this.extendWithConfigProperties(e);
    this.extendWithEditorAgnosticFields(e);
    this.sanitizeKeys();
    "IncludeExp" === n && (await this.extendWithExpTelemetry(e));
    this.updateTimeSinceIssuedAndDisplayed();
    this.validateData(e, t) || (this.properties.telemetry_failed_validation = "true");
  }
}
function f(e, t, n, r) {
  const o = t ? e.get(u).getSecureReporter(e) : e.get(u).getReporter(e);
  o && o.sendTelemetryEvent(n, h.maybeRemoveRepoInfoFromPropertiesHack(t, r.properties), r.measurements);
}
function m() {
  return new Date().getTime();
}
exports.TelemetryData = h;
h.ajv = new r.default({
  strictNumbers: !1
});
h.validateTelemetryProperties = h.ajv.compile({
  type: "object",
  additionalProperties: {
    type: "string"
  },
  required: []
});
h.validateTelemetryMeasurements = h.ajv.compile({
  type: "object",
  properties: {
    meanLogProb: {
      type: "number",
      nullable: !0
    },
    meanAlternativeLogProb: {
      type: "number",
      nullable: !0
    }
  },
  additionalProperties: {
    type: "number"
  },
  required: []
});
h.keysExemptedFromSanitization = [a.ExpServiceTelemetryNames.assignmentContextTelemetryPropertyName, a.ExpServiceTelemetryNames.featuresTelemetryPropertyName];
h.keysToRemoveFromStandardTelemetryHack = ["gitRepoHost", "gitRepoName", "gitRepoOwner", "gitRepoUrl", "gitRepoPath", "repo", "request_option_nwo"];
exports.telemetrizePromptLength = function (e) {
  return e.isFimEnabled ? {
    promptPrefixCharLen: e.prefix.length,
    promptSuffixCharLen: e.suffix.length
  } : {
    promptCharLen: e.prefix.length
  };
};
exports.now = m;
class g {
  constructor(e = "https://copilot-telemetry.githubusercontent.com/telemetry") {
    this.url = e;
  }
  getUrl() {
    return this.url;
  }
  setUrlForTesting(e) {
    this.url = e;
  }
}
function _(e, t) {
  const n = t;
  if (n.appInsightsClient) {
    const t = n.appInsightsClient.commonProperties,
      r = h.sanitizeKeys(t);
    n.appInsightsClient.commonProperties = r;
    n.appInsightsClient.context.tags[n.appInsightsClient.context.keys.cloudRoleInstance] = "REDACTED";
    const o = e.get(g).getUrl();
    n.appInsightsClient.config.endpointUrl = o;
  }
}
function y() {
  var e;
  return null !== (e = null == d ? undefined : d.optedIn) && undefined !== e && e;
}
async function v(e, t, n, r) {
  if (r && !y()) return;
  const o = n || h.createAndMarkAsIssued({}, {});
  await o.makeReadyForSending(e, null != r && r, "IncludeExp");
  f(e, null != r && r, t, o);
}
async function b(e, t, n, r) {
  if (r && !y()) return;
  const o = n || h.createAndMarkAsIssued({}, {});
  await o.makeReadyForSending(e, null != r && r, "IncludeExp");
  (function (e, t, n, r) {
    const o = t ? e.get(u).getSecureReporter(e) : e.get(u).getReporter(e);
    o && o.sendTelemetryErrorEvent(n, h.maybeRemoveRepoInfoFromPropertiesHack(t, r.properties), r.measurements);
  })(e, null != r && r, t, o);
}
exports.TelemetryEndpointUrl = g;
exports.configureReporter = _;
exports.telemetry = v;
exports.telemetryExpProblem = async function (e, t) {
  const n = h.createAndMarkAsIssued(t, {});
  await n.makeReadyForSending(e, !1, "SkipExp");
  f(e, !1, "expProblem", n);
};
exports.telemetryRaw = async function (e, t, n, r) {
  f(e, !1, t, {
    properties: n,
    measurements: r
  });
};
exports.telemetryException = async function (e, t, n, r) {
  const o = t instanceof Error ? t : new Error("Non-error thrown: " + t),
    i = y(),
    s = h.createAndMarkAsIssued({
      origin: l.redactPaths(n),
      reason: i ? "Exception logged to restricted telemetry" : "Exception, not logged due to opt-out",
      ...r
    });
  await s.makeReadyForSending(e, !1, "IncludeExp");
  f(e, !1, "exception", s);
  if (!i) return;
  const a = h.createAndMarkAsIssued({
    origin: n,
    ...r
  });
  await a.makeReadyForSending(e, !0, "IncludeExp");
  (function (e, t, n, r) {
    const o = e.get(u).getSecureReporter(e);
    o && o.sendTelemetryException(n, h.maybeRemoveRepoInfoFromPropertiesHack(true, r.properties), r.measurements);
  })(e, 0, o, a);
};
exports.telemetryError = b;
exports.logEngineCompletion = async function (e, t, n, r, o) {
  var i;
  const s = h.createAndMarkAsIssued({
    completionTextJson: JSON.stringify(t),
    choiceIndex: o.toString()
  });
  if (n.logprobs) for (const [e, t] of Object.entries(n.logprobs)) s.properties["logprobs_" + e] = null !== (i = JSON.stringify(t)) && undefined !== i ? i : "unset";
  s.extendWithRequestId(r);
  await v(e, "engine.completion", s, !0);
};
exports.logEnginePrompt = async function (e, t, n) {
  let r;
  r = t.isFimEnabled ? {
    promptPrefixJson: JSON.stringify(t.prefix),
    promptSuffixJson: JSON.stringify(t.suffix),
    promptElementRanges: JSON.stringify(t.promptElementRanges)
  } : {
    promptJson: JSON.stringify(t.prefix),
    promptElementRanges: JSON.stringify(t.promptElementRanges)
  };
  const o = n.extendedBy(r);
  await v(e, "engine.prompt", o, !0);
};
exports.setTelemetryConfig = function (e) {
  d = e;
};
exports.dropTelemetryConfig = function () {
  d = undefined;
};
exports.forceSendingTelemetry = function (e, n) {
  const r = n.getReporter(e);
  if (r) {
    const n = r;
    n.userOptIn = !0;
    n.createAppInsightsClient(exports.APP_INSIGHTS_KEY);
    _(e, r);
  }
  try {
    const r = n.getSecureReporter(e);
    if (r) {
      const n = r;
      n.userOptIn = !0;
      n.createAppInsightsClient(exports.APP_INSIGHTS_KEY_SECURE);
      _(e, r);
    }
  } catch (e) {}
};