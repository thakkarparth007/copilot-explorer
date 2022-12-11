Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ignoreDocument = undefined;
const M_config_stuff = require("config-stuff");
const M_copilot_scheme = require("copilot-scheme");
exports.ignoreDocument = function (e, t) {
  const n = t.languageId;
  return (
    !M_config_stuff.getEnabledConfig(e, n) ||
    !![M_copilot_scheme.CopilotScheme, "output", "search-editor"].includes(
      t.uri.scheme
    )
  );
};
