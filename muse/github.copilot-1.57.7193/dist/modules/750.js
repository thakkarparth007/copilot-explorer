Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.handleGhostTextResultTelemetry =
  exports.mkBasicResultTelemetry =
  exports.mkCanceledResultTelemetry =
  exports.telemetryRejected =
  exports.telemetryAccepted =
  exports.telemetryShown =
    undefined;
const r = require(6333);
const o = require(8965);
exports.telemetryShown = function (e, t, n, o) {
  n.markAsDisplayed();
  const i = o ? `${t}.shownFromCache` : `${t}.shown`;
  r.telemetry(e, i, n);
};
exports.telemetryAccepted = function (e, t, n) {
  const i = t + ".accepted";
  const s = e.get(o.ContextualFilterManager);
  s.previousLabel = 1;
  s.previousLabelTimestamp = Date.now();
  r.telemetry(e, i, n);
};
exports.telemetryRejected = function (e, t, n) {
  const i = t + ".rejected";
  const s = e.get(o.ContextualFilterManager);
  s.previousLabel = 0;
  s.previousLabelTimestamp = Date.now();
  r.telemetry(e, i, n);
};
exports.mkCanceledResultTelemetry = function (e, t = {}) {
  return {
    ...t,
    telemetryBlob: e,
  };
};
exports.mkBasicResultTelemetry = function (e) {
  return {
    headerRequestId: e.properties.headerRequestId,
    copilot_trackingId: e.properties.copilot_trackingId,
  };
};
exports.handleGhostTextResultTelemetry = async function (e, t) {
  if ("success" === t.type) {
    r.telemetryRaw(e, "ghostText.produced", t.telemetryData, {});
    return t.value;
  }
  if ("abortedBeforeIssued" !== t.type) {
    if ("canceled" !== t.type) {
      r.telemetryRaw(
        e,
        `ghostText.${t.type}`,
        {
          ...t.telemetryData,
          reason: t.reason,
        },
        {}
      );
    } else {
      r.telemetry(
        e,
        "ghostText.canceled",
        t.telemetryData.telemetryBlob.extendedBy({
          reason: t.reason,
          cancelledNetworkRequest: t.telemetryData.cancelledNetworkRequest
            ? "true"
            : "false",
        })
      );
    }
  }
};