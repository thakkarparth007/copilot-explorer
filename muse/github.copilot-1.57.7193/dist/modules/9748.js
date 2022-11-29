Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.ExpConfigNone = exports.ExpConfigFromTAS = exports.ExpConfigMaker = undefined;
const r = require(2279),
  o = require(219);
class ExpConfigMaker {}
exports.ExpConfigMaker = ExpConfigMaker;
exports.ExpConfigFromTAS = class extends ExpConfigMaker {
  async fetchExperiments(e, t) {
    var n;
    const i = e.get(r.Fetcher);
    let s;
    try {
      s = await i.fetch("https://default.exp-tas.com/vscode/ab", {
        method: "GET",
        headers: t
      });
    } catch (t) {
      return o.ExpConfig.createFallbackConfig(e, `Error fetching ExP config: ${t}`);
    }
    if (!s.ok) return o.ExpConfig.createFallbackConfig(e, `ExP responded with ${s.status}`);
    const a = await s.json(),
      c = null !== (n = a.Configs.find(e => "vscode" === e.Id)) && undefined !== n ? n : {
        Id: "vscode",
        Parameters: {}
      },
      l = Object.entries(c.Parameters).map(([e, t]) => e + (t ? "" : "cf"));
    return new o.ExpConfig(c.Parameters, a.AssignmentContext, l.join(";"));
  }
};
exports.ExpConfigNone = class extends ExpConfigMaker {
  async fetchExperiments(e, t) {
    return o.ExpConfig.createEmptyConfig();
  }
};