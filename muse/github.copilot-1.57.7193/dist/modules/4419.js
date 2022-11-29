Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.LiveOpenAIFetcher = exports.postProcessChoices = exports.OpenAIFetcher = exports.extractEngineName = exports.getProcessingTime = exports.getRequestId = exports.CopilotUiKind = undefined;
const r = require(3837),
  o = require(362),
  i = require(6932),
  s = require(1133),
  a = require(9189),
  c = require(5413),
  l = require(9899),
  u = require(2279),
  d = require(6722),
  p = require(766),
  h = require(9657),
  f = require(6333),
  m = require(937),
  g = require(2901),
  _ = new l.Logger(l.LogLevel.INFO, "fetch");
var y;
function getRequestId(e, t) {
  return {
    headerRequestId: e.headers.get("x-request-id") || "",
    completionId: t && t.id ? t.id : "",
    created: t && t.created ? t.created : 0,
    serverExperiments: e.headers.get("X-Copilot-Experiment") || "",
    deploymentId: e.headers.get("azureml-model-deployment") || ""
  };
}
function getProcessingTime(e) {
  const t = e.headers.get("openai-processing-ms");
  return t ? parseInt(t, 10) : 0;
}
function extractEngineName(e, t) {
  return t.split("/").pop() || (_.error(e, "Malformed engine URL: " + t), t);
}
!function (e) {
  e.GhostText = "ghostText";
  e.Panel = "synthesize";
}(y = exports.CopilotUiKind || (exports.CopilotUiKind = {}));
exports.getRequestId = getRequestId;
exports.getProcessingTime = getProcessingTime;
exports.extractEngineName = extractEngineName;
class OpenAIFetcher {}
function postProcessChoices(e, t) {
  return null != t && t ? e : i.asyncIterableFilter(e, async e => e.completionText.trim().length > 0);
}
exports.OpenAIFetcher = OpenAIFetcher;
exports.postProcessChoices = postProcessChoices;
exports.LiveOpenAIFetcher = class extends OpenAIFetcher {
  async fetchAndStreamCompletions(e, t, n, r, o) {
    const s = e.get(d.StatusReporter),
      a = "completions",
      c = await this.fetchWithParameters(e, a, t, o);
    if ("not-sent" === c) return {
      type: "canceled",
      reason: "before fetch request"
    };
    if (null == o ? undefined : o.isCancellationRequested) {
      const t = await c.body();
      try {
        t.destroy();
      } catch (t) {
        l.logger.error(e, `Error destroying stream: ${t}`);
      }
      return {
        type: "canceled",
        reason: "after fetch request"
      };
    }
    if (undefined === c) {
      const n = this.createTelemetryData(a, e, t);
      s.setWarning();
      n.properties.error = "Response was undefined";
      f.telemetry(e, "request.shownWarning", n);
      return {
        type: "failed",
        reason: "fetch response was undefined"
      };
    }
    if (200 !== c.status) {
      const n = this.createTelemetryData(a, e, t);
      return this.handleError(e, s, n, c);
    }
    return {
      type: "success",
      choices: postProcessChoices(i.asyncIterableMap(g.processSSE(e, c, r, n, o), async t => g.prepareSolutionForReturn(e, t, n)), t.allowEmptyChoices),
      getProcessingTime: () => getProcessingTime(c)
    };
  }
  createTelemetryData(e, t, n) {
    return f.TelemetryData.createAndMarkAsIssued({
      endpoint: e,
      engineName: extractEngineName(t, n.engineUrl),
      uiKind: n.uiKind,
      headerRequestId: n.ourRequestId
    });
  }
  async fetchWithParameters(e, t, n, i) {
    var g;
    const _ = s.getLanguageConfig(e, s.ConfigKey.Stops),
      b = await e.get(a.Features).disableLogProb(),
      x = {
        prompt: n.prompt.prefix,
        suffix: n.prompt.suffix,
        max_tokens: s.getConfig(e, s.ConfigKey.SolutionLength),
        temperature: m.getTemperatureForSamples(e, n.count),
        top_p: s.getConfig(e, s.ConfigKey.TopP),
        n: n.count,
        stop: _
      };
    !n.requestLogProbs && b || (x.logprobs = 2);
    const E = p.tryGetGitHubNWO(n.repoInfo);
    undefined !== E && (x.nwo = E);
    [h.RepetitionFilterMode.PROXY, h.RepetitionFilterMode.BOTH].includes(await e.get(a.Features).repetitionFilterMode()) && (x.feature_flags = [...(null !== (g = x.feature_flags) && undefined !== g ? g : []), "filter-repetitions"]);
    n.postOptions && Object.assign(x, n.postOptions);
    return (null == i ? undefined : i.isCancellationRequested) ? "not-sent" : (l.logger.info(e, `[fetchCompletions] engine ${n.engineUrl}`), await function (e, t, n, o, i, s, a, p, h) {
      var m;
      const g = e.get(d.StatusReporter),
        _ = r.format("%s/%s", n, o);
      if (!a) return void l.logger.error(e, `Failed to send request to ${_} due to missing key`);
      const b = f.TelemetryData.createAndMarkAsIssued({
        endpoint: o,
        engineName: extractEngineName(e, n),
        uiKind: p
      }, f.telemetrizePromptLength(t));
      for (const [e, t] of Object.entries(s)) "prompt" != e && "suffix" != e && (b.properties[`request.option.${e}`] = null !== (m = JSON.stringify(t)) && undefined !== m ? m : "undefined");
      b.properties.headerRequestId = i;
      f.telemetry(e, "request.sent", b);
      const x = f.now(),
        E = function (e) {
          switch (e) {
            case y.GhostText:
              return "copilot-ghost";
            case y.Panel:
              return "copilot-panel";
          }
        }(p);
      return u.postRequest(e, _, a, E, i, s, h).then(n => {
        const r = getRequestId(n, undefined);
        b.extendWithRequestId(r);
        const o = f.now() - x;
        b.measurements.totalTimeMs = o;
        l.logger.info(e, `request.response: [${_}] took ${o} ms`);
        l.logger.debug(e, "request.response properties", b.properties);
        l.logger.debug(e, "request.response measurements", b.measurements);
        l.logger.debug(e, `prompt: ${JSON.stringify(t)}`);
        f.telemetry(e, "request.response", b);
        const i = n.headers.get("x-copilot-delay"),
          s = i ? parseInt(i, 10) : 0;
        e.get(c.GhostTextDebounceManager).extraDebounceMs = s;
        return n;
      }).catch(t => {
        var n, r, o, i;
        if (u.isAbortError(t)) throw t;
        g.setWarning();
        const s = b.extendedBy({
          error: "Network exception"
        });
        f.telemetry(e, "request.shownWarning", s);
        b.properties.code = String(null !== (n = t.code) && undefined !== n ? n : "");
        b.properties.errno = String(null !== (r = t.errno) && undefined !== r ? r : "");
        b.properties.message = String(null !== (o = t.message) && undefined !== o ? o : "");
        b.properties.type = String(null !== (i = t.type) && undefined !== i ? i : "");
        const a = f.now() - x;
        throw b.measurements.totalTimeMs = a, l.logger.debug(e, `request.response: [${_}] took ${a} ms`), l.logger.debug(e, "request.error properties", b.properties), l.logger.debug(e, "request.error measurements", b.measurements), l.logger.error(e, `Request Error: ${t.message}`), f.telemetry(e, "request.error", b), t;
      }).finally(() => {
        f.logEnginePrompt(e, t, b);
      });
    }(e, n.prompt, n.engineUrl, t, n.ourRequestId, x, (await e.get(o.CopilotTokenManager).getCopilotToken(e)).token, n.uiKind, i));
  }
  async handleError(e, t, n, r) {
    t.setWarning();
    n.properties.error = `Response status was ${r.status}`;
    n.properties.status = String(r.status);
    f.telemetry(e, "request.shownWarning", n);
    if (401 === r.status || 403 === r.status) return e.get(o.CopilotTokenManager).resetCopilotToken(e, r.status), {
      type: "failed",
      reason: `token expired or invalid: ${r.status}`
    };
    if (499 === r.status) {
      _.info(e, "Cancelled by server");
      return {
        type: "failed",
        reason: "canceled by server"
      };
    }
    const i = await r.text();
    return 466 === r.status ? (t.setError(i), _.info(e, i), {
      type: "failed",
      reason: `client not supported: ${i}`
    }) : (_.error(e, "Unhandled status from server:", r.status, i), {
      type: "failed",
      reason: `unhandled status from server: ${r.status} ${i}`
    });
  }
};