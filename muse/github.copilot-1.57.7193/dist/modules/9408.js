Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.registerDefaultHandlers = undefined;
const r = require(2279);
const o = require(6333);
exports.registerDefaultHandlers = function (e, t) {
  process.addListener("uncaughtException", (t) => {
    console.error("uncaughtException", t);
    o.telemetryException(e, t, "uncaughtException");
  });
  let n = false;
  process.addListener("unhandledRejection", (i, s) => {
    if (n) return;
    n = true;
    if ("vscode" === t && !i) return;
    if ("aborted" === i.type || r.isAbortError(i)) return;
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
      o.telemetryError(
        e,
        "unhandledRejection",
        o.TelemetryData.createAndMarkAsIssued({
          origin: "unhandledRejection",
          reason: "Unhandled rejection logged to restricted telemetry",
        }),
        false
      );
      o.telemetryError(
        e,
        "unhandledRejection",
        o.TelemetryData.createAndMarkAsIssued({
          origin: "unhandledRejection",
          reason: a,
        }),
        true
      );
      n = false;
    }
  });
};