Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ExpConfig = exports.ExpTreatmentVariables = undefined;
const r = require(6333),
  o = require(6500);
var i;
(i = exports.ExpTreatmentVariables || (exports.ExpTreatmentVariables = {})).AA = "copilotaa";
i.CustomEngine = "copilotcustomengine";
i.Fetcher = "copilotfetcher";
i.OverrideBlockMode = "copilotoverrideblockmode";
i.OverrideNumGhostCompletions = "copilotoverridednumghostcompletions";
i.SuffixPercent = "CopilotSuffixPercent";
i.BeforeRequestWaitMs = "copilotlms";
i.NeighboringTabsOption = "copilotneighboringtabs";
i.DebounceMs = "copilotdebouncems";
i.DebouncePredict = "copilotdebouncepredict";
i.ContextualFilterEnable = "copilotcontextualfilterenable";
i.ContextualFilterAcceptThreshold = "copilotcontextualfilteracceptthreshold";
i.disableLogProb = "copilotLogProb";
i.RepetitionFilterMode = "copilotrepetitionfiltermode";
i.GranularityTimePeriodSizeInH = "copilottimeperiodsizeinh";
i.GranularityByCallBuckets = "copilotbycallbuckets";
i.SuffixStartMode = "copilotsuffixstartmode";
i.SuffixMatchThreshold = "copilotsuffixmatchthreshold";
i.FimSuffixLengthThreshold = "copilotfimsuffixlenthreshold";
i.MultiLogitBias = "copilotlbeot";
class ExpConfig {
  constructor(e, t, n) {
    this.variables = e;
    this.assignmentContext = t;
    this.features = n;
  }
  static createFallbackConfig(e, t) {
    r.telemetryExpProblem(e, {
      reason: t
    });
    return this.createEmptyConfig();
  }
  static createEmptyConfig() {
    return new ExpConfig({}, "", "");
  }
  addToTelemetry(e) {
    e.properties[o.ExpServiceTelemetryNames.featuresTelemetryPropertyName] = this.features;
    e.properties[o.ExpServiceTelemetryNames.assignmentContextTelemetryPropertyName] = this.assignmentContext;
  }
}
exports.ExpConfig = ExpConfig;