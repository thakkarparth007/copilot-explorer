Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.VSCodeEditorInfo =
  exports.makeVscInfo =
  exports.getExtension =
  exports.setExtension =
  exports.VSCodeConfigProvider =
    undefined;
const M_vscode = require("vscode");
const M_config_stuff = require("config-stuff");
const M_copilot_scheme = require("copilot-scheme");
const M_runtime_mode_maybe = require("runtime-mode");
const M_package_json_maybe = require("package-json");
function c(e) {
  return "string" == typeof e ? e : JSON.stringify(e);
}
class VSCodeConfigProvider extends M_config_stuff.ConfigProvider {
  constructor() {
    super();
    this.config = M_vscode.workspace.getConfiguration(
      M_copilot_scheme.CopilotConfigPrefix
    );
    M_vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(M_copilot_scheme.CopilotConfigPrefix)) {
        this.config = M_vscode.workspace.getConfiguration(
          M_copilot_scheme.CopilotConfigPrefix
        );
      }
    });
  }
  getConfigKeyFromObject(e, t) {
    const n = this.config[e][t];
    return undefined === n
      ? M_config_stuff.getConfigDefaultForObjectKey(e, t)
      : n;
  }
  getConfig(e) {
    if (Array.isArray(e)) return this.getConfigKeyFromObject(e[0], e[1]);
    const t = this.config.get(e);
    if (undefined === t)
      throw new Error(
        `Missing config default value: ${M_copilot_scheme.CopilotConfigPrefix}.${e}`
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
      const t = M_package_json_maybe.contributes.configuration[0].properties;
      for (const n in t) {
        const t = n
          .replace(`${M_copilot_scheme.CopilotConfigPrefix}.`, "")
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
      const e = M_vscode.window.activeTextEditor;
      t = e && e.document.languageId;
    }
    return t && t in n ? n[t] : n["*"];
  }
  updateEnabledConfig(e, t, n) {
    const r = e
      .get(M_config_stuff.ConfigProvider)
      .getConfig(M_config_stuff.ConfigKey.Enable);
    r[t] = n;
    return this.config.update(M_config_stuff.ConfigKey.Enable, r, !0);
  }
}
let u;
exports.VSCodeConfigProvider = VSCodeConfigProvider;
exports.setExtension = function (e) {
  u = e;
};
exports.getExtension = function (e) {
  if (!u && M_runtime_mode_maybe.isRunningInTest(e)) {
    u = M_vscode.extensions.all.find((e) => e.id.startsWith("GitHub.copilot"));
  }
  if (!u) throw new Error("No GitHub.copilot extension found");
  return u;
};
exports.makeVscInfo = function () {
  return new M_config_stuff.VscInfo(
    M_vscode.env.sessionId,
    M_vscode.env.machineId,
    M_vscode.version
  );
};
class VSCodeEditorInfo extends M_config_stuff.EditorAndPluginInfo {
  getEditorInfo(e) {
    return {
      name: "vscode",
      version: M_vscode.version,
    };
  }
  getEditorPluginInfo(e) {
    return {
      name: "copilot",
      version: M_config_stuff.getVersion(e),
    };
  }
}
exports.VSCodeEditorInfo = VSCodeEditorInfo;
