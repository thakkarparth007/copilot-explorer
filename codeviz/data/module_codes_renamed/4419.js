Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.LiveOpenAIFetcher =
  exports.postProcessChoices =
  exports.OpenAIFetcher =
  exports.extractEngineName =
  exports.getProcessingTime =
  exports.getRequestId =
  exports.CopilotUiKind =
    undefined;
const r = require("util"),
  M_copilot_github_auth_stuff = require("copilot-github-auth-stuff"),
  M_async_iterable_utils_NOTSURE = require("async-iterable-utils"),
  M_config_stuff = require("config-stuff"),
  M_task_NOTSURE = require("task"),
  M_ghost_text_debouncer_NOTSURE = require("ghost-text-debouncer"),
  M_logging_utils = require("logging-utils"),
  M_helix_fetcher_and_network_stuff = require("helix-fetcher-and-network-stuff"),
  M_status_reporter_NOTSURE = require("status-reporter"),
  M_background_context_provider = require("background-context-provider"),
  M_repetition_filter_NOTSURE = require("repetition-filter"),
  M_telemetry_stuff = require("telemetry-stuff"),
  M_openai_choices_utils = require("openai-choices-utils"),
  M_sse_utils_NOTSURE = require("sse-utils"),
  _ = new M_logging_utils.Logger(M_logging_utils.LogLevel.INFO, "fetch");
var y;
function getRequestId(e, t) {
  return {
    headerRequestId: e.headers.get("x-request-id") || "",
    completionId: t && t.id ? t.id : "",
    created: t && t.created ? t.created : 0,
    serverExperiments: e.headers.get("X-Copilot-Experiment") || "",
    deploymentId: e.headers.get("azureml-model-deployment") || "",
  };
}
function getProcessingTime(e) {
  const t = e.headers.get("openai-processing-ms");
  return t ? parseInt(t, 10) : 0;
}
function extractEngineName(e, t) {
  return t.split("/").pop() || (_.error(e, "Malformed engine URL: " + t), t);
}
!(function (e) {
  e.GhostText = "ghostText";
  e.Panel = "synthesize";
})((y = exports.CopilotUiKind || (exports.CopilotUiKind = {})));
exports.getRequestId = getRequestId;
exports.getProcessingTime = getProcessingTime;
exports.extractEngineName = extractEngineName;
class OpenAIFetcher {}
function postProcessChoices(e, t) {
  return null != t && t
    ? e
    : M_async_iterable_utils_NOTSURE.asyncIterableFilter(
        e,
        async (e) => e.completionText.trim().length > 0
      );
}
exports.OpenAIFetcher = OpenAIFetcher;
exports.postProcessChoices = postProcessChoices;
exports.LiveOpenAIFetcher = class extends OpenAIFetcher {
  async fetchAndStreamCompletions(e, t, n, r, o) {
    const s = e.get(M_status_reporter_NOTSURE.StatusReporter),
      a = "completions",
      c = await this.fetchWithParameters(e, a, t, o);
    if ("not-sent" === c)
      return {
        type: "canceled",
        reason: "before fetch request",
      };
    if (null == o ? undefined : o.isCancellationRequested) {
      const t = await c.body();
      try {
        t.destroy();
      } catch (t) {
        M_logging_utils.logger.error(e, `Error destroying stream: ${t}`);
      }
      return {
        type: "canceled",
        reason: "after fetch request",
      };
    }
    if (undefined === c) {
      const n = this.createTelemetryData(a, e, t);
      s.setWarning();
      n.properties.error = "Response was undefined";
      M_telemetry_stuff.telemetry(e, "request.shownWarning", n);
      return {
        type: "failed",
        reason: "fetch response was undefined",
      };
    }
    if (200 !== c.status) {
      const n = this.createTelemetryData(a, e, t);
      return this.handleError(e, s, n, c);
    }
    return {
      type: "success",
      choices: postProcessChoices(
        M_async_iterable_utils_NOTSURE.asyncIterableMap(
          M_sse_utils_NOTSURE.processSSE(e, c, r, n, o),
          async (t) => M_sse_utils_NOTSURE.prepareSolutionForReturn(e, t, n)
        ),
        t.allowEmptyChoices
      ),
      getProcessingTime: () => getProcessingTime(c),
    };
  }
  createTelemetryData(e, t, n) {
    return M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
      endpoint: e,
      engineName: extractEngineName(t, n.engineUrl),
      uiKind: n.uiKind,
      headerRequestId: n.ourRequestId,
    });
  }
  async fetchWithParameters(e, t, n, i) {
    var g;
    const _ = M_config_stuff.getLanguageConfig(
        e,
        M_config_stuff.ConfigKey.Stops
      ),
      b = await e.get(M_task_NOTSURE.Features).disableLogProb(),
      x = {
        prompt: n.prompt.prefix,
        suffix: n.prompt.suffix,
        max_tokens: M_config_stuff.getConfig(
          e,
          M_config_stuff.ConfigKey.SolutionLength
        ),
        temperature: M_openai_choices_utils.getTemperatureForSamples(
          e,
          n.count
        ),
        top_p: M_config_stuff.getConfig(e, M_config_stuff.ConfigKey.TopP),
        n: n.count,
        stop: _,
      };
    if (!n.requestLogProbs && b) {
      x.logprobs = 2;
    }
    const E = M_background_context_provider.tryGetGitHubNWO(n.repoInfo);
    if (undefined !== E) {
      x.nwo = E;
    }
    if (
      [
        M_repetition_filter_NOTSURE.RepetitionFilterMode.PROXY,
        M_repetition_filter_NOTSURE.RepetitionFilterMode.BOTH,
      ].includes(await e.get(M_task_NOTSURE.Features).repetitionFilterMode())
    ) {
      x.feature_flags = [
        ...(null !== (g = x.feature_flags) && undefined !== g ? g : []),
        "filter-repetitions",
      ];
    }
    if (n.postOptions) {
      Object.assign(x, n.postOptions);
    }
    return (null == i ? undefined : i.isCancellationRequested)
      ? "not-sent"
      : (M_logging_utils.logger.info(
          e,
          `[fetchCompletions] engine ${n.engineUrl}`
        ),
        await (function (e, t, n, o, i, s, a, p, h) {
          var m;
          const g = e.get(M_status_reporter_NOTSURE.StatusReporter),
            _ = r.format("%s/%s", n, o);
          if (!a)
            return void M_logging_utils.logger.error(
              e,
              `Failed to send request to ${_} due to missing key`
            );
          const b = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued(
            {
              endpoint: o,
              engineName: extractEngineName(e, n),
              uiKind: p,
            },
            M_telemetry_stuff.telemetrizePromptLength(t)
          );
          for (const [e, t] of Object.entries(s))
            if ("prompt" != e && "suffix" != e) {
              b.properties[`request.option.${e}`] =
                null !== (m = JSON.stringify(t)) && undefined !== m
                  ? m
                  : "undefined";
            }
          b.properties.headerRequestId = i;
          M_telemetry_stuff.telemetry(e, "request.sent", b);
          const x = M_telemetry_stuff.now(),
            E = (function (e) {
              switch (e) {
                case y.GhostText:
                  return "copilot-ghost";
                case y.Panel:
                  return "copilot-panel";
              }
            })(p);
          return M_helix_fetcher_and_network_stuff.postRequest(
            e,
            _,
            a,
            E,
            i,
            s,
            h
          )
            .then((n) => {
              const r = getRequestId(n, undefined);
              b.extendWithRequestId(r);
              const o = M_telemetry_stuff.now() - x;
              b.measurements.totalTimeMs = o;
              M_logging_utils.logger.info(
                e,
                `request.response: [${_}] took ${o} ms`
              );
              M_logging_utils.logger.debug(
                e,
                "request.response properties",
                b.properties
              );
              M_logging_utils.logger.debug(
                e,
                "request.response measurements",
                b.measurements
              );
              M_logging_utils.logger.debug(e, `prompt: ${JSON.stringify(t)}`);
              M_telemetry_stuff.telemetry(e, "request.response", b);
              const i = n.headers.get("x-copilot-delay"),
                s = i ? parseInt(i, 10) : 0;
              e.get(
                M_ghost_text_debouncer_NOTSURE.GhostTextDebounceManager
              ).extraDebounceMs = s;
              return n;
            })
            .catch((t) => {
              var n, r, o, i;
              if (M_helix_fetcher_and_network_stuff.isAbortError(t)) throw t;
              g.setWarning();
              const s = b.extendedBy({
                error: "Network exception",
              });
              M_telemetry_stuff.telemetry(e, "request.shownWarning", s);
              b.properties.code = String(
                null !== (n = t.code) && undefined !== n ? n : ""
              );
              b.properties.errno = String(
                null !== (r = t.errno) && undefined !== r ? r : ""
              );
              b.properties.message = String(
                null !== (o = t.message) && undefined !== o ? o : ""
              );
              b.properties.type = String(
                null !== (i = t.type) && undefined !== i ? i : ""
              );
              const a = M_telemetry_stuff.now() - x;
              throw (
                ((b.measurements.totalTimeMs = a),
                M_logging_utils.logger.debug(
                  e,
                  `request.response: [${_}] took ${a} ms`
                ),
                M_logging_utils.logger.debug(
                  e,
                  "request.error properties",
                  b.properties
                ),
                M_logging_utils.logger.debug(
                  e,
                  "request.error measurements",
                  b.measurements
                ),
                M_logging_utils.logger.error(e, `Request Error: ${t.message}`),
                M_telemetry_stuff.telemetry(e, "request.error", b),
                t)
              );
            })
            .finally(() => {
              M_telemetry_stuff.logEnginePrompt(e, t, b);
            });
        })(
          e,
          n.prompt,
          n.engineUrl,
          t,
          n.ourRequestId,
          x,
          (
            await e
              .get(M_copilot_github_auth_stuff.CopilotTokenManager)
              .getCopilotToken(e)
          ).token,
          n.uiKind,
          i
        ));
  }
  async handleError(e, t, n, r) {
    t.setWarning();
    n.properties.error = `Response status was ${r.status}`;
    n.properties.status = String(r.status);
    M_telemetry_stuff.telemetry(e, "request.shownWarning", n);
    if (401 === r.status || 403 === r.status)
      return (
        e
          .get(M_copilot_github_auth_stuff.CopilotTokenManager)
          .resetCopilotToken(e, r.status),
        {
          type: "failed",
          reason: `token expired or invalid: ${r.status}`,
        }
      );
    if (499 === r.status) {
      _.info(e, "Cancelled by server");
      return {
        type: "failed",
        reason: "canceled by server",
      };
    }
    const i = await r.text();
    return 466 === r.status
      ? (t.setError(i),
        _.info(e, i),
        {
          type: "failed",
          reason: `client not supported: ${i}`,
        })
      : (_.error(e, "Unhandled status from server:", r.status, i),
        {
          type: "failed",
          reason: `unhandled status from server: ${r.status} ${i}`,
        });
  }
};
