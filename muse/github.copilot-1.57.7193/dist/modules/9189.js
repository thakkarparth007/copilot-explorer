Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.Features = exports.Task = undefined;
const r = require(3055563),
  o = require(299),
  i = require(3076),
  s = require(1133),
  a = require(7744),
  c = require(9657),
  l = require(219),
  u = require(9748),
  d = require(8142),
  p = require(9030);
class h {
  constructor(e) {
    this.ctx = e;
    this.cache = new i.LRUCache(200);
  }
  async fetchExpConfig(e) {
    let t = this.cache.get(e.stringify());
    if (t) {
      t = new Task(
        () =>
          this.ctx
            .get(u.ExpConfigMaker)
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
    this.granularityDirectory = new p.GranularityDirectory(
      "unspecified",
      e.get(o.Clock)
    );
  }
  setPrefix(e) {
    this.granularityDirectory = new p.GranularityDirectory(
      e,
      this.ctx.get(o.Clock)
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
        (r = a.variables[l.ExpTreatmentVariables.GranularityByCallBuckets]) &&
      undefined !== r
        ? r
        : NaN),
      +(null !==
        (o =
          a.variables[l.ExpTreatmentVariables.GranularityTimePeriodSizeInH]) &&
      undefined !== o
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
    return new d.FilterSettings({
      ...this.staticFilters,
      ...this.getDynamicFilterValues(),
      ...e,
    });
  }
  async getExpConfig(e) {
    try {
      return this.assignments.fetchExpConfig(e);
    } catch (e) {
      return l.ExpConfig.createFallbackConfig(
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
    const t = this.assignments.getCachedExpConfig(new d.FilterSettings({}));
    return JSON.stringify(
      null !== (e = null == t ? undefined : t.variables) && undefined !== e
        ? e
        : {}
    );
  }
  async customEngine(e, t, n, r, o) {
    var i;
    const s = {
      [d.Filter.CopilotRepository]: e,
      [d.Filter.CopilotFileType]: t,
      [d.Filter.CopilotDogfood]: n,
      [d.Filter.CopilotUserKind]: r,
    };
    return null !==
      (i = await this.getAssignment(
        l.ExpTreatmentVariables.CustomEngine,
        s,
        o
      )) && undefined !== i
      ? i
      : "";
  }
  async beforeRequestWaitMs(e, t, n) {
    var r;
    const o = {
      [d.Filter.CopilotRepository]: e,
      [d.Filter.CopilotFileType]: t,
    };
    return null !==
      (r = await this.getAssignment(
        l.ExpTreatmentVariables.BeforeRequestWaitMs,
        o,
        n
      )) && undefined !== r
      ? r
      : 0;
  }
  async multiLogitBias(e, t, n) {
    var r;
    const o = {
      [d.Filter.CopilotRepository]: e,
      [d.Filter.CopilotFileType]: t,
    };
    return (
      null !==
        (r = await this.getAssignment(
          l.ExpTreatmentVariables.MultiLogitBias,
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
      (e = await this.getAssignment(l.ExpTreatmentVariables.DebounceMs)) &&
      undefined !== e
      ? e
      : 0;
  }
  async debouncePredict() {
    var e;
    return (
      null !==
        (e = await this.getAssignment(
          l.ExpTreatmentVariables.DebouncePredict
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
          l.ExpTreatmentVariables.ContextualFilterEnable
        )) ||
      undefined === e ||
      e
    );
  }
  async contextualFilterAcceptThreshold() {
    var e;
    return null !==
      (e = await this.getAssignment(
        l.ExpTreatmentVariables.ContextualFilterAcceptThreshold
      )) && undefined !== e
      ? e
      : a.contextualFilterAcceptThreshold;
  }
  async disableLogProb() {
    var e;
    return (
      null !==
        (e = await this.getAssignment(
          l.ExpTreatmentVariables.disableLogProb
        )) &&
      undefined !== e &&
      e
    );
  }
  async overrideBlockMode() {
    return await this.getAssignment(l.ExpTreatmentVariables.OverrideBlockMode);
  }
  async overrideNumGhostCompletions() {
    return await this.getAssignment(
      l.ExpTreatmentVariables.OverrideNumGhostCompletions
    );
  }
  async suffixPercent(e, t) {
    var n;
    const r = {
      [d.Filter.CopilotRepository]: e,
      [d.Filter.CopilotFileType]: t,
    };
    return s.getConfig(this.ctx, s.ConfigKey.DebugOverrideEngine)
      ? 0
      : null !==
          (n = await this.getAssignment(
            l.ExpTreatmentVariables.SuffixPercent,
            r
          )) && undefined !== n
      ? n
      : 0;
  }
  async suffixMatchThreshold(e, t) {
    var n;
    const r = {
      [d.Filter.CopilotRepository]: e,
      [d.Filter.CopilotFileType]: t,
    };
    return null !==
      (n = await this.getAssignment(
        l.ExpTreatmentVariables.SuffixMatchThreshold,
        r
      )) && undefined !== n
      ? n
      : 0;
  }
  async fimSuffixLengthThreshold(e, t) {
    var n;
    const r = {
      [d.Filter.CopilotRepository]: e,
      [d.Filter.CopilotFileType]: t,
    };
    return null !==
      (n = await this.getAssignment(
        l.ExpTreatmentVariables.FimSuffixLengthThreshold,
        r
      )) && undefined !== n
      ? n
      : 0;
  }
  async suffixStartMode(e, t) {
    const n = {
      [d.Filter.CopilotRepository]: e,
      [d.Filter.CopilotFileType]: t,
    };
    switch (
      await this.getAssignment(l.ExpTreatmentVariables.SuffixStartMode, n)
    ) {
      default:
        return r.SuffixStartMode.Cursor;
      case "cursortrimstart":
        return r.SuffixStartMode.CursorTrimStart;
      case "siblingblock":
        return r.SuffixStartMode.SiblingBlock;
      case "siblingblocktrimstart":
        return r.SuffixStartMode.SiblingBlockTrimStart;
    }
  }
  async neighboringTabsOption(e, t) {
    const n = {
      [d.Filter.CopilotRepository]: e,
      [d.Filter.CopilotFileType]: t,
    };
    switch (
      await this.getAssignment(l.ExpTreatmentVariables.NeighboringTabsOption, n)
    ) {
      case "none":
        return r.NeighboringTabsOption.None;
      case "conservative":
        return r.NeighboringTabsOption.Conservative;
      case "medium":
        return r.NeighboringTabsOption.Medium;
      default:
        return r.NeighboringTabsOption.Eager;
      case "eagerbutlittle":
        return r.NeighboringTabsOption.EagerButLittle;
    }
  }
  async repetitionFilterMode() {
    switch (
      await this.getAssignment(l.ExpTreatmentVariables.RepetitionFilterMode)
    ) {
      case "proxy":
        return c.RepetitionFilterMode.PROXY;
      case "both":
        return c.RepetitionFilterMode.BOTH;
      default:
        return c.RepetitionFilterMode.CLIENT;
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