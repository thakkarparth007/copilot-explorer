Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getEngineURL =
  exports.TEST_ENGINE_PATHS =
  exports.OPENAI_PROXY_HOST =
    undefined;
const r = require(1133);
const o = require(9189);
const i = require(70);
exports.OPENAI_PROXY_HOST = "https://copilot-proxy.githubusercontent.com";
const s = "/v1/engines/copilot-codex";
exports.TEST_ENGINE_PATHS = [s];
exports.getEngineURL = async function (e, n = "", a, c = "", l = "", u) {
  return (function (e, n) {
    let o = (function (e) {
      return i.isRunningInTest(e)
        ? r.getConfig(e, r.ConfigKey.DebugTestOverrideProxyUrl)
        : r.getConfig(e, r.ConfigKey.DebugOverrideProxyUrl);
    })(e);
    if (0 == o.length) {
      o = exports.OPENAI_PROXY_HOST;
    }
    return `${o}${n}`;
  })(
    e,
    await (async function (e, t, n, i, a, c) {
      const l = r.getConfig(e, r.ConfigKey.DebugOverrideEngine);
      if (l) return `/v1/engines/${l}`;
      const u = await e.get(o.Features).customEngine(t, n, i, a, c);
      return "" !== u ? `/v1/engines/${u}` : s;
    })(e, n, a, c, l, u)
  );
};