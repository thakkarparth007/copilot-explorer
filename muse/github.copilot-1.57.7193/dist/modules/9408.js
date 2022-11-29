Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.registerDefaultHandlers = undefined;
const r = require(2279),
  o = require(6333);
exports.registerDefaultHandlers = function (e, t) {
  process.addListener("uncaughtException", (t) => {
    console.error("uncaughtException", t);
    o.telemetryException(e, t, "uncaughtException");
  });
  let n = !1;
  process.addListener("unhandledRejection", (i, s) => {
    if (n) return;
    n = !0;
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
        !1
      );
      o.telemetryError(
        e,
        "unhandledRejection",
        o.TelemetryData.createAndMarkAsIssued({
          origin: "unhandledRejection",
          reason: a,
        }),
        !0
      );
      n = !1;
    }
  });
};
