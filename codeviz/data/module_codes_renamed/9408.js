Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.registerDefaultHandlers = undefined;
const M_helix_fetcher_and_network_stuff = require("helix-fetcher-and-network-stuff"),
  M_telemetry_stuff = require("telemetry-stuff");
exports.registerDefaultHandlers = function (e, t) {
  process.addListener("uncaughtException", (t) => {
    console.error("uncaughtException", t);
    M_telemetry_stuff.telemetryException(e, t, "uncaughtException");
  });
  let n = !1;
  process.addListener("unhandledRejection", (i, s) => {
    if (n) return;
    n = !0;
    if ("vscode" === t && !i) return;
    if (
      "aborted" === i.type ||
      M_helix_fetcher_and_network_stuff.isAbortError(i)
    )
      return;
    if (
      "vscode" === t &&
      [
        "ENOTFOUND",
        "ECONNREFUSED",
        "ECONNRESET",
        "ETIMEDOUT",
        "ENETDOWN",
        "ENETUNREACH",
        "EADDRNOTAVAIL",
      ].includes(i.code)
    )
      return;
    if ("ENOENT" == i.code) return;
    let a = "";
    try {
      a = `${i.message} (${i.code})`;
      a = JSON.stringify(i);
    } catch (e) {
      a = "[actual reason JSON was cyclic]";
    }
    if ("vscode" === t && "{}" === a) {
      console.error("unhandledRejection", a);
      M_telemetry_stuff.telemetryError(
        e,
        "unhandledRejection",
        M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
          origin: "unhandledRejection",
          reason: "Unhandled rejection logged to restricted telemetry",
        }),
        !1
      );
      M_telemetry_stuff.telemetryError(
        e,
        "unhandledRejection",
        M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
          origin: "unhandledRejection",
          reason: a,
        }),
        !0
      );
      n = !1;
    }
  });
};
