Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.Features = exports.Task = undefined;
const M_getPrompt_main_stuff = require("getPrompt-main-stuff"),
  M_clock = require("clock"),
  M_prompt_cache = require("prompt-cache"),
  M_config_stuff = require("config-stuff"),
  M_contextual_filter_constants = require("contextual-filter-constants"),
  M_repetition_filter_NOTSURE = require("repetition-filter"),
  M_exp_config_NOTSURE = require("exp-config"),
  M_exp_config_maker_NOTSURE = require("exp-config-maker"),
  M_filter_NOTSURE = require("filter"),
  M_granularity_directory_NOTSURE = require("granularity-directory");
class h {
  constructor(e) {
    this.ctx = e;
    this.cache = new M_prompt_cache.LRUCache(200);
  }
  async fetchExpConfig(e) {
    let t = this.cache.get(e.stringify());
    if (t) {
      t = new Task(
        () =>
          this.ctx
            .get(M_exp_config_maker_NOTSURE.ExpConfigMaker)
            .fetchExperiments(this.ctx, e.toHeaders()),
        36e5
      );
      this.cache.put(e.stringify(), t);
    }
    return t.run();
  }
  getCachedExpConfig(e) {
    const t = this.cache.get(e.stringify());
    return null == t ? undefined : t.value();
  }
}
class Task {
  constructor(e, t = 1 / 0) {
    this.producer = e;
    this.expirationMs = t;
  }
  async run() {
    if (undefined === this.promise) {
      this.promise = this.producer();
      this.storeResult(this.promise).then(() => {
        if (this.expirationMs < 1 / 0 && undefined !== this.promise) {
          setTimeout(() => (this.promise = undefined), this.expirationMs);
        }
      });
    }
    return this.promise;
  }
  async storeResult(e) {
    try {
      this.result = await e;
    } finally {
      if (undefined === this.result) {
        this.promise = undefined;
      }
    }
  }
  value() {
    return this.result;
  }
}
exports.Task = Task;
class Features {
  constructor(e) {
    this.ctx = e;
    this.staticFilters = {};
    this.dynamicFilters = {};
    this.upcomingDynamicFilters = {};
    this.assignments = new h(this.ctx);
    this.granularityDirectory =
      new M_granularity_directory_NOTSURE.GranularityDirectory(
        "unspecified",
        e.get(M_clock.Clock)
      );
  }
  setPrefix(e) {
    this.granularityDirectory =
      new M_granularity_directory_NOTSURE.GranularityDirectory(
        e,
        this.ctx.get(M_clock.Clock)
      );
  }
  registerStaticFilters(e) {
    Object.assign(this.staticFilters, e);
  }
  registerDynamicFilter(e, t) {
    this.dynamicFilters[e] = t;
  }
  getDynamicFilterValues() {
    const e = {};
    for (const [t, n] of Object.entries(this.dynamicFilters)) e[t] = n();
    return e;
  }
  registerUpcomingDynamicFilter(e, t) {
    this.upcomingDynamicFilters[e] = t;
  }
  async getAssignment(e, t = {}, n) {
    var r, o;
    const i = this.makeFilterSettings(t),
      s = this.granularityDirectory.extendFilters(i),
      a = await this.getExpConfig(s.newFilterSettings);
    this.granularityDirectory.update(
      i,
      +(null !==
        (r =
          a.variables[
            M_exp_config_NOTSURE.ExpTreatmentVariables.GranularityByCallBuckets
          ]) && undefined !== r
        ? r
        : NaN),
      +(null !==
        (o =
          a.variables[
            M_exp_config_NOTSURE.ExpTreatmentVariables
              .GranularityTimePeriodSizeInH
          ]) && undefined !== o
        ? o
        : NaN)
    );
    const c = this.granularityDirectory.extendFilters(i),
      u = c.newFilterSettings,
      d = await this.getExpConfig(u);
    let p = new Promise((e) =>
      setTimeout(e, Features.upcomingDynamicFilterCheckDelayMs)
    );
    for (const e of c.otherFilterSettingsToPrefetch)
      p = p.then(async () => {
        await new Promise((e) =>
          setTimeout(e, Features.upcomingDynamicFilterCheckDelayMs)
        );
        this.getExpConfig(e);
      });
    this.prepareForUpcomingFilters(u);
    if (n) {
      n.filtersAndExp = {
        exp: d,
        filters: u,
      };
    }
    return d.variables[e];
  }
  makeFilterSettings(e) {
    return new M_filter_NOTSURE.FilterSettings({
      ...this.staticFilters,
      ...this.getDynamicFilterValues(),
      ...e,
    });
  }
  async getExpConfig(e) {
    try {
      return this.assignments.fetchExpConfig(e);
    } catch (e) {
      return M_exp_config_NOTSURE.ExpConfig.createFallbackConfig(
        this.ctx,
        `Error fetching ExP config: ${e}`
      );
    }
  }
  async prepareForUpcomingFilters(e) {
    if (!(new Date().getMinutes() < 60 - Features.upcomingTimeBucketMinutes))
      for (const [t, n] of Object.entries(this.upcomingDynamicFilters)) {
        await new Promise((e) =>
          setTimeout(e, Features.upcomingDynamicFilterCheckDelayMs)
        );
        this.getExpConfig(e.withChange(t, n()));
      }
  }
  stringify() {
    var e;
    const t = this.assignments.getCachedExpConfig(
      new M_filter_NOTSURE.FilterSettings({})
    );
    return JSON.stringify(
      null !== (e = null == t ? undefined : t.variables) && undefined !== e
        ? e
        : {}
    );
  }
  async customEngine(e, t, n, r, o) {
    var i;
    const s = {
      [M_filter_NOTSURE.Filter.CopilotRepository]: e,
      [M_filter_NOTSURE.Filter.CopilotFileType]: t,
      [M_filter_NOTSURE.Filter.CopilotDogfood]: n,
      [M_filter_NOTSURE.Filter.CopilotUserKind]: r,
    };
    return null !==
      (i = await this.getAssignment(
        M_exp_config_NOTSURE.ExpTreatmentVariables.CustomEngine,
        s,
        o
      )) && undefined !== i
      ? i
      : "";
  }
  async beforeRequestWaitMs(e, t, n) {
    var r;
    const o = {
      [M_filter_NOTSURE.Filter.CopilotRepository]: e,
      [M_filter_NOTSURE.Filter.CopilotFileType]: t,
    };
    return null !==
      (r = await this.getAssignment(
        M_exp_config_NOTSURE.ExpTreatmentVariables.BeforeRequestWaitMs,
        o,
        n
      )) && undefined !== r
      ? r
      : 0;
  }
  async multiLogitBias(e, t, n) {
    var r;
    const o = {
      [M_filter_NOTSURE.Filter.CopilotRepository]: e,
      [M_filter_NOTSURE.Filter.CopilotFileType]: t,
    };
    return (
      null !==
        (r = await this.getAssignment(
          M_exp_config_NOTSURE.ExpTreatmentVariables.MultiLogitBias,
          o,
          n
        )) &&
      undefined !== r &&
      r
    );
  }
  async debounceMs() {
    var e;
    return null !==
      (e = await this.getAssignment(
        M_exp_config_NOTSURE.ExpTreatmentVariables.DebounceMs
      )) && undefined !== e
      ? e
      : 0;
  }
  async debouncePredict() {
    var e;
    return (
      null !==
        (e = await this.getAssignment(
          M_exp_config_NOTSURE.ExpTreatmentVariables.DebouncePredict
        )) &&
      undefined !== e &&
      e
    );
  }
  async contextualFilterEnable() {
    var e;
    return (
      null ===
        (e = await this.getAssignment(
          M_exp_config_NOTSURE.ExpTreatmentVariables.ContextualFilterEnable
        )) ||
      undefined === e ||
      e
    );
  }
  async contextualFilterAcceptThreshold() {
    var e;
    return null !==
      (e = await this.getAssignment(
        M_exp_config_NOTSURE.ExpTreatmentVariables
          .ContextualFilterAcceptThreshold
      )) && undefined !== e
      ? e
      : M_contextual_filter_constants.contextualFilterAcceptThreshold;
  }
  async disableLogProb() {
    var e;
    return (
      null !==
        (e = await this.getAssignment(
          M_exp_config_NOTSURE.ExpTreatmentVariables.disableLogProb
        )) &&
      undefined !== e &&
      e
    );
  }
  async overrideBlockMode() {
    return await this.getAssignment(
      M_exp_config_NOTSURE.ExpTreatmentVariables.OverrideBlockMode
    );
  }
  async overrideNumGhostCompletions() {
    return await this.getAssignment(
      M_exp_config_NOTSURE.ExpTreatmentVariables.OverrideNumGhostCompletions
    );
  }
  async suffixPercent(e, t) {
    var n;
    const r = {
      [M_filter_NOTSURE.Filter.CopilotRepository]: e,
      [M_filter_NOTSURE.Filter.CopilotFileType]: t,
    };
    return M_config_stuff.getConfig(
      this.ctx,
      M_config_stuff.ConfigKey.DebugOverrideEngine
    )
      ? 0
      : null !==
          (n = await this.getAssignment(
            M_exp_config_NOTSURE.ExpTreatmentVariables.SuffixPercent,
            r
          )) && undefined !== n
      ? n
      : 0;
  }
  async suffixMatchThreshold(e, t) {
    var n;
    const r = {
      [M_filter_NOTSURE.Filter.CopilotRepository]: e,
      [M_filter_NOTSURE.Filter.CopilotFileType]: t,
    };
    return null !==
      (n = await this.getAssignment(
        M_exp_config_NOTSURE.ExpTreatmentVariables.SuffixMatchThreshold,
        r
      )) && undefined !== n
      ? n
      : 0;
  }
  async fimSuffixLengthThreshold(e, t) {
    var n;
    const r = {
      [M_filter_NOTSURE.Filter.CopilotRepository]: e,
      [M_filter_NOTSURE.Filter.CopilotFileType]: t,
    };
    return null !==
      (n = await this.getAssignment(
        M_exp_config_NOTSURE.ExpTreatmentVariables.FimSuffixLengthThreshold,
        r
      )) && undefined !== n
      ? n
      : 0;
  }
  async suffixStartMode(e, t) {
    const n = {
      [M_filter_NOTSURE.Filter.CopilotRepository]: e,
      [M_filter_NOTSURE.Filter.CopilotFileType]: t,
    };
    switch (
      await this.getAssignment(
        M_exp_config_NOTSURE.ExpTreatmentVariables.SuffixStartMode,
        n
      )
    ) {
      default:
        return M_getPrompt_main_stuff.SuffixStartMode.Cursor;
      case "cursortrimstart":
        return M_getPrompt_main_stuff.SuffixStartMode.CursorTrimStart;
      case "siblingblock":
        return M_getPrompt_main_stuff.SuffixStartMode.SiblingBlock;
      case "siblingblocktrimstart":
        return M_getPrompt_main_stuff.SuffixStartMode.SiblingBlockTrimStart;
    }
  }
  async neighboringTabsOption(e, t) {
    const n = {
      [M_filter_NOTSURE.Filter.CopilotRepository]: e,
      [M_filter_NOTSURE.Filter.CopilotFileType]: t,
    };
    switch (
      await this.getAssignment(
        M_exp_config_NOTSURE.ExpTreatmentVariables.NeighboringTabsOption,
        n
      )
    ) {
      case "none":
        return M_getPrompt_main_stuff.NeighboringTabsOption.None;
      case "conservative":
        return M_getPrompt_main_stuff.NeighboringTabsOption.Conservative;
      case "medium":
        return M_getPrompt_main_stuff.NeighboringTabsOption.Medium;
      default:
        return M_getPrompt_main_stuff.NeighboringTabsOption.Eager;
      case "eagerbutlittle":
        return M_getPrompt_main_stuff.NeighboringTabsOption.EagerButLittle;
    }
  }
  async repetitionFilterMode() {
    switch (
      await this.getAssignment(
        M_exp_config_NOTSURE.ExpTreatmentVariables.RepetitionFilterMode
      )
    ) {
      case "proxy":
        return M_repetition_filter_NOTSURE.RepetitionFilterMode.PROXY;
      case "both":
        return M_repetition_filter_NOTSURE.RepetitionFilterMode.BOTH;
      default:
        return M_repetition_filter_NOTSURE.RepetitionFilterMode.CLIENT;
    }
  }
  async addExpAndFilterToTelemetry(e) {
    const t = this.makeFilterSettings({});
    e.filtersAndExp = {
      filters: t,
      exp: await this.getExpConfig(t),
    };
  }
}
exports.Features = Features;
Features.upcomingDynamicFilterCheckDelayMs = 20;
Features.upcomingTimeBucketMinutes = 5 + Math.floor(11 * Math.random());
