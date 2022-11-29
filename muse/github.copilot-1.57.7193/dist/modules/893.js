Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.CopilotListDocument = undefined;
const r = require(106),
  o = require(1133),
  i = require(6333),
  s = require(2388);
class CopilotListDocument {
  constructor(e, t, n, s, a, c) {
    this.targetDocument = n;
    this.completionContext = s;
    this.token = c;
    this._solutionCount = 0;
    this.solutionCountTarget = 0;
    this._solutions = [];
    this._wasCancelled = !1;
    this._updateHandlers = new Set();
    this.savedTelemetryData = i.TelemetryData.createAndMarkAsIssued();
    this.debouncedEventFire = r.debounce(10, () =>
      this._updateHandlers.forEach((e) => e(this._uri))
    );
    this.onDidResultUpdated = (e) => (
      this._updateHandlers.add(e),
      {
        dispose: () => {
          this._updateHandlers.delete(e);
        },
      }
    );
    this.solutionCountTarget = a;
    this._ctx = e;
    this._uri = t;
    this._showLogprobs = o.getConfig(e, o.ConfigKey.DebugShowScores);
    this.startPosition = this.completionContext.insertPosition;
    this.numberHeaderLines = Math.max(
      1,
      this.formatDisplayLines("").length - 1
    );
  }
  async getDocument() {
    return this.targetDocument;
  }
  get targetUri() {
    return this.targetDocument.uri;
  }
  header() {
    if (this._wasCancelled) return "No synthesized solutions found.";
    {
      const e =
        this._solutionCount - this._solutions.length > 0
          ? " (Duplicates hidden)"
          : "";
      return `Synthesizing ${this._solutionCount}/${this.solutionCountTarget} solutions${e}`;
    }
  }
  areSolutionsDuplicates(e, t) {
    return (
      s.normalizeCompletionText(e.completionText) ===
      s.normalizeCompletionText(t.completionText)
    );
  }
  insertSorted(e, t, n) {
    if (!/^\s*$/.test(t.completionText)) {
      for (let r = 0; r < e.length; r++) {
        const o = e[r];
        if (this.areSolutionsDuplicates(o, t)) {
          if (n(o) < n(t)) {
            e.splice(r, 1);
            break;
          }
          return;
        }
      }
      for (let r = 0; r < e.length; r++)
        if (n(e[r]) < n(t)) return void e.splice(r, 0, t);
      e.push(t);
    }
  }
  reportCancelled() {
    this._wasCancelled = !0;
    this.debouncedEventFire();
  }
  getCancellationToken() {
    return this.token;
  }
  insertSolution(e) {
    const t = {
      displayLines: this.formatDisplayLines(
        e.displayText,
        e.meanProb,
        e.meanLogProb
      ),
      completionText: e.completionText,
      meanLogProb: e.meanLogProb,
      meanProb: e.meanProb,
      prependToCompletion: e.prependToCompletion,
      requestId: e.requestId,
      choiceIndex: e.choiceIndex,
    };
    this.insertSorted(this._solutions, t, (e) => e.meanProb);
    this._solutionCount++;
    this.debouncedEventFire();
  }
  formatDisplayLines(e, t, n) {
    let r = "";
    if (this._showLogprobs) {
      n = n || 0;
      r += `\n\t# mean prob: ${t}`;
    }
    return `${CopilotListDocument.separator}${r}\n\n${e}`.split("\n");
  }
  async runQuery() {
    const e = await s.launchSolutions(this._ctx, this);
    this.processNextSolution(e);
  }
  async processNextSolution(e) {
    switch (e.status) {
      case "FinishedNormally":
      case "FinishedWithError":
        return;
      case "Solution":
        this.insertSolution(e.solution);
        this.processNextSolution(await e.next);
    }
  }
  solutionsReceived() {
    return this._solutionCount;
  }
  solutions() {
    return this._solutions;
  }
  get value() {
    return [this.header()]
      .concat(this._solutions.flatMap((e) => e.displayLines))
      .concat("")
      .join("\n");
  }
}
exports.CopilotListDocument = CopilotListDocument;
CopilotListDocument.separator = "\n=======";
