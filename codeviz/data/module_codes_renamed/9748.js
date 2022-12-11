Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ExpConfigNone =
  exports.ExpConfigFromTAS =
  exports.ExpConfigMaker =
    undefined;
const M_helix_fetcher_and_network_stuff = require("helix-fetcher-and-network-stuff");
const M_exp_config_maybe = require("exp-config");
class ExpConfigMaker {}
exports.ExpConfigMaker = ExpConfigMaker;
exports.ExpConfigFromTAS = class extends ExpConfigMaker {
  async fetchExperiments(e, t) {
    var n;
    const i = e.get(M_helix_fetcher_and_network_stuff.Fetcher);
    let s;
    try {
      s = await i.fetch("https://default.exp-tas.com/vscode/ab", {
        method: "GET",
        headers: t,
      });
    } catch (t) {
      return M_exp_config_maybe.ExpConfig.createFallbackConfig(
        e,
        `Error fetching ExP config: ${t}`
      );
    }
    if (!s.ok)
      return M_exp_config_maybe.ExpConfig.createFallbackConfig(
        e,
        `ExP responded with ${s.status}`
      );
    const a = await s.json();
    const c =
      null !== (n = a.Configs.find((e) => "vscode" === e.Id)) && undefined !== n
        ? n
        : {
            Id: "vscode",
            Parameters: {},
          };
    const l = Object.entries(c.Parameters).map(([e, t]) => e + (t ? "" : "cf"));
    return new M_exp_config_maybe.ExpConfig(
      c.Parameters,
      a.AssignmentContext,
      l.join(";")
    );
  }
};
exports.ExpConfigNone = class extends ExpConfigMaker {
  async fetchExperiments(e, t) {
    return M_exp_config_maybe.ExpConfig.createEmptyConfig();
  }
};
