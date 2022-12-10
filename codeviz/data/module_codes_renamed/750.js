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
const M_telemetry_stuff = require("telemetry-stuff"),
  M_contextual_filter_manager = require("contextual-filter-manager");
exports.telemetryShown = function (e, t, n, o) {
  n.markAsDisplayed();
  const i = o ? `${t}.shownFromCache` : `${t}.shown`;
  M_telemetry_stuff.telemetry(e, i, n);
};
exports.telemetryAccepted = function (e, t, n) {
  const i = t + ".accepted",
    s = e.get(M_contextual_filter_manager.ContextualFilterManager);
  s.previousLabel = 1;
  s.previousLabelTimestamp = Date.now();
  M_telemetry_stuff.telemetry(e, i, n);
};
exports.telemetryRejected = function (e, t, n) {
  const i = t + ".rejected",
    s = e.get(M_contextual_filter_manager.ContextualFilterManager);
  s.previousLabel = 0;
  s.previousLabelTimestamp = Date.now();
  M_telemetry_stuff.telemetry(e, i, n);
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
    M_telemetry_stuff.telemetryRaw(
      e,
      "ghostText.produced",
      t.telemetryData,
      {}
    );
    return t.value;
  }
  if ("abortedBeforeIssued" !== t.type) {
    if ("canceled" !== t.type) {
      M_telemetry_stuff.telemetryRaw(
        e,
        `ghostText.${t.type}`,
        {
          ...t.telemetryData,
          reason: t.reason,
        },
        {}
      );
    } else {
      M_telemetry_stuff.telemetry(
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
