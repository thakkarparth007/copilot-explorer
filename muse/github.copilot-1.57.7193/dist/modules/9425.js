Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.VSCodeEditorInfo =
  exports.makeVscInfo =
  exports.getExtension =
  exports.setExtension =
  exports.VSCodeConfigProvider =
    undefined;
const r = require("vscode");
const o = require(1133);
const i = require(4197);
const s = require(70);
const a = require(4147);
function c(e) {
  return "string" == typeof e ? e : JSON.stringify(e);
}
class VSCodeConfigProvider extends o.ConfigProvider {
  constructor() {
    super();
    this.config = r.workspace.getConfiguration(i.CopilotConfigPrefix);
    r.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(i.CopilotConfigPrefix)) {
        this.config = r.workspace.getConfiguration(i.CopilotConfigPrefix);
      }
    });
  }
  getConfigKeyFromObject(e, t) {
    const n = this.config[e][t];
    return undefined === n ? o.getConfigDefaultForObjectKey(e, t) : n;
  }
  getConfig(e) {
    if (Array.isArray(e)) return this.getConfigKeyFromObject(e[0], e[1]);
    const t = this.config.get(e);
    if (undefined === t)
      throw new Error(
        `Missing config default value: ${i.CopilotConfigPrefix}.${e}`
      );
    return t;
  }
  isDefaultSettingOverwritten(e) {
    if (Array.isArray(e)) return undefined !== this.config[e[0]][e[1]];
    const t = this.config.inspect(e);
    return (
      !!t &&
      !!(
        t.globalValue ||
        t.workspaceValue ||
        t.workspaceFolderValue ||
        t.defaultLanguageValue ||
        t.globalLanguageValue ||
        t.workspaceLanguageValue ||
        t.workspaceFolderLanguageValue
      )
    );
  }
  dumpConfig() {
    const e = {};
    try {
      const t = a.contributes.configuration[0].properties;
      for (const n in t) {
        const t = n
          .replace(`${i.CopilotConfigPrefix}.`, "")
          .split(".")
          .reduce((e, t) => e[t], this.config);
        if ("object" == typeof t && null !== t) {
          Object.keys(t)
            .filter((e) => "secret_key" !== e)
            .forEach((r) => (e[`${n}.${r}`] = c(t[r])));
        } else {
          e[n] = c(t);
        }
      }
    } catch (e) {
      console.error(`Failed to retrieve configuration properties ${e}`);
    }
    return e;
  }
  getLanguageConfig(e, t) {
    const n = this.getConfig(e);
    if (undefined === t) {
      const e = r.window.activeTextEditor;
      t = e && e.document.languageId;
    }
    return t && t in n ? n[t] : n["*"];
  }
  updateEnabledConfig(e, t, n) {
    const r = e.get(o.ConfigProvider).getConfig(o.ConfigKey.Enable);
    r[t] = n;
    return this.config.update(o.ConfigKey.Enable, r, true);
  }
}
let u;
exports.VSCodeConfigProvider = VSCodeConfigProvider;
exports.setExtension = function (e) {
  u = e;
};
exports.getExtension = function (e) {
  if (!u && s.isRunningInTest(e)) {
    u = r.extensions.all.find((e) => e.id.startsWith("GitHub.copilot"));
  }
  if (!u) throw new Error("No GitHub.copilot extension found");
  return u;
};
exports.makeVscInfo = function () {
  return new o.VscInfo(r.env.sessionId, r.env.machineId, r.version);
};
class VSCodeEditorInfo extends o.EditorAndPluginInfo {
  getEditorInfo(e) {
    return {
      name: "vscode",
      version: r.version,
    };
  }
  getEditorPluginInfo(e) {
    return {
      name: "copilot",
      version: o.getVersion(e),
    };
  }
}
exports.VSCodeEditorInfo = VSCodeEditorInfo;