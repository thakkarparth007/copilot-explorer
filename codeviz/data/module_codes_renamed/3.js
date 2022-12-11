Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getEngineURL =
  exports.TEST_ENGINE_PATHS =
  exports.OPENAI_PROXY_HOST =
    undefined;
const M_config_stuff = require("config-stuff");
const M_task_maybe = require("task");
const M_runtime_mode_maybe = require("runtime-mode");
exports.OPENAI_PROXY_HOST = "https://copilot-proxy.githubusercontent.com";
const s = "/v1/engines/copilot-codex";
exports.TEST_ENGINE_PATHS = [s];
exports.getEngineURL = async function (e, n = "", a, c = "", l = "", u) {
  return (function (e, n) {
    let o = (function (e) {
      return M_runtime_mode_maybe.isRunningInTest(e)
        ? M_config_stuff.getConfig(
            e,
            M_config_stuff.ConfigKey.DebugTestOverrideProxyUrl
          )
        : M_config_stuff.getConfig(
            e,
            M_config_stuff.ConfigKey.DebugOverrideProxyUrl
          );
    })(e);
    if (0 == o.length) {
      o = exports.OPENAI_PROXY_HOST;
    }
    return `${o}${n}`;
  })(
    e,
    await (async function (e, t, n, i, a, c) {
      const l = M_config_stuff.getConfig(
        e,
        M_config_stuff.ConfigKey.DebugOverrideEngine
      );
      if (l) return `/v1/engines/${l}`;
      const u = await e.get(M_task_maybe.Features).customEngine(t, n, i, a, c);
      return "" !== u ? `/v1/engines/${u}` : s;
    })(e, n, a, c, l, u)
  );
};
