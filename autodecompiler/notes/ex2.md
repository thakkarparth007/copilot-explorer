Look at this monster:

```js
await (function (e, t, n, o, i, s, a, p, h) {
  var m;
  const g = e.get(M_status_reporter_maybe.StatusReporter);
  const _ = M_util.format("%s/%s", n, o);
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
        null !== (m = JSON.stringify(t)) && undefined !== m ? m : "undefined";
    }
  b.properties.headerRequestId = i;
  M_telemetry_stuff.telemetry(e, "request.sent", b);
  const x = M_telemetry_stuff.now();
  const E = (function (e) {
    switch (e) {
      case y.GhostText:
        return "copilot-ghost";
      case y.Panel:
        return "copilot-panel";
    }
  })(p);
  return M_helix_fetcher_and_network_stuff.postRequest(e, _, a, E, i, s, h)
    .then((n) => {
      const r = getRequestId(n, undefined);
      b.extendWithRequestId(r);
      const o = M_telemetry_stuff.now() - x;
      b.measurements.totalTimeMs = o;
      M_logging_utils.logger.info(e, `request.response: [${_}] took ${o} ms`);
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
      const i = n.headers.get("x-copilot-delay");
      const s = i ? parseInt(i, 10) : 0;
      e.get(
        M_ghost_text_debouncer_maybe.GhostTextDebounceManager
      ).extraDebounceMs = s;
      return n;
    })
    .catch((t) => {
      var n;
      var r;
      var o;
      var i;
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
);
```

And the monster ChatGPT wrote:

```js
async function sendRequest(
  context,
  prompt,
  endpoint,
  apiPath,
  requestId,
  options,
  apiKey,
  uiKind,
  additionalHeaders
) {
  let stringifiedValue;
  const statusReporter = context.get(StatusReporter);
  const url = format("%s/%s", endpoint, apiPath);
  if (!apiKey) {
    logger.error(
      context,
      `Failed to send request to ${url} due to missing key`
    );
    return;
  }
  const telemetryData = TelemetryData.createAndMarkAsIssued(
    {
      endpoint: apiPath,
      engineName: extractEngineName(context, endpoint),
      uiKind: uiKind,
    },
    telemetrizePromptLength(prompt)
  );
  for (const [key, value] of Object.entries(options)) {
    if (key !== "prompt" && key !== "suffix") {
      telemetryData.properties[`request.option.${key}`] = stringifiedValue =
        JSON.stringify(value) || "undefined";
    }
  }
  telemetryData.properties.headerRequestId = requestId;
  telemetry(context, "request.sent", telemetryData);
  const startTime = now();
  const uiType = uiKind === y.GhostText ? "copilot-ghost" : "copilot-panel";
  return postRequest(
    context,
    url,
    apiKey,
    uiType,
    requestId,
    options,
    additionalHeaders
  )
    .then((response) => {
      const responseRequestId = getRequestId(response, undefined);
      telemetryData.extendWithRequestId(responseRequestId);
      const totalTime = now() - startTime;
      telemetryData.measurements.totalTimeMs = totalTime;
      logger.info(context, `request.response: [${url}] took ${totalTime} ms`);
      logger.debug(
        context,
        "request.response properties",
        telemetryData.properties
      );
      logger.debug(
        context,
        "request.response measurements",
        telemetryData.measurements
      );
      logger.debug(context, `prompt: ${JSON.stringify(prompt)}`);
      telemetry(context, "request.response", telemetryData);
      const delayHeader = response.headers.get("x-copilot-delay");
      const extraDebounceMs = delayHeader ? parseInt(delayHeader, 10) : 0;
      context.get(GhostTextDebounceManager).extraDebounceMs = extraDebounceMs;
      return response;
    })
    .catch((error) => {
      let code;
      let errno;
      let message;
      let type;
      if (isAbortError(error)) throw error;
      statusReporter.setWarning();
      const extendedTelemetryData = telemetryData.extendedBy({
        error: "Network exception",
      });
      telemetry(context, "request.shownWarning", extendedTelemetryData);
      telemetryData.properties.code = code = error.code || "";
      telemetryData.properties.errno = errno = error.errno || "";
      telemetryData.properties.message = message = error.message || "";
      telemetryData.properties.type = type = error.type || "";
      telemetryData.measurements.totalTimeMs = now() - startTime;
      telemetry(context, "request.failed", telemetryData);
      if (error.response && error.response.data && error.response.data.error) {
        if (error.response.data.error.code === "invalid_request") {
          throw createInvalidRequestError(error.response.data.error.message);
        } else {
          throw createClientError(
            error.response.data.error.code,
            error.response.data.error.message
          );
        }
      } else {
        throw createNetworkError(
          code,
          errno,
          message,
          type,
          error.config.url,
          error.response
        );
      }
    });
}
```

Are they the same? With slight differences?