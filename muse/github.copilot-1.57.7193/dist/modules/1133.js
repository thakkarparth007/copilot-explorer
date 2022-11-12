Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.editorVersionHeaders = exports.EditorAndPluginInfo = exports.formatNameAndVersion = exports.getTestVscInfo = exports.VscInfo = exports.getVersion = exports.getBuild = exports.getBuildType = exports.isProduction = exports.BuildInfo = exports.fimSuffixLengthThreshold = exports.suffixMatchThreshold = exports.suffixPercent = exports.getEnabledConfig = exports.getLanguageConfig = exports.dumpConfig = exports.getHiddenConfig = exports.isDefaultSettingOverwritten = exports.getConfig = exports.getConfigDefaultForObjectKey = exports.getConfigDefaultForKey = exports.InMemoryConfigProvider = exports.DefaultsOnlyConfigProvider = exports.ConfigProvider = exports.ConfigBlockModeConfig = exports.BlockModeConfig = exports.BuildType = exports.shouldDoServerTrimming = exports.shouldDoParsingTrimming = exports.BlockMode = exports.ConfigKey = undefined;
const r = require(3055),
  o = require(4197),
  i = require(9189),
  s = require(4147);
var a, c;
exports.ConfigKey = {
  Enable: "enable",
  InlineSuggestEnable: "inlineSuggest.enable",
  ShowEditorCompletions: ["editor", "showEditorCompletions"],
  EnableAutoCompletions: ["editor", "enableAutoCompletions"],
  DelayCompletions: ["editor", "delayCompletions"],
  FilterCompletions: ["editor", "filterCompletions"],
  DisplayStyle: ["advanced", "displayStyle"],
  SecretKey: ["advanced", "secret_key"],
  SolutionLength: ["advanced", "length"],
  Stops: ["advanced", "stops"],
  Temperature: ["advanced", "temperature"],
  TopP: ["advanced", "top_p"],
  IndentationMode: ["advanced", "indentationMode"],
  InlineSuggestCount: ["advanced", "inlineSuggestCount"],
  ListCount: ["advanced", "listCount"],
  DebugOverrideProxyUrl: ["advanced", "debug.overrideProxyUrl"],
  DebugTestOverrideProxyUrl: ["advanced", "debug.testOverrideProxyUrl"],
  DebugOverrideEngine: ["advanced", "debug.overrideEngine"],
  DebugShowScores: ["advanced", "debug.showScores"],
  DebugOverrideLogLevels: ["advanced", "debug.overrideLogLevels"],
  DebugFilterLogCategories: ["advanced", "debug.filterLogCategories"],
  DebugUseSuffix: ["advanced", "debug.useSuffix"]
};
(function (e) {
  e.Parsing = "parsing";
  e.Server = "server";
  e.ParsingAndServer = "parsingandserver";
})(a = exports.BlockMode || (exports.BlockMode = {}));
exports.shouldDoParsingTrimming = function (e) {
  return [a.Parsing, a.ParsingAndServer].includes(e);
};
exports.shouldDoServerTrimming = function (e) {
  return [a.Server, a.ParsingAndServer].includes(e);
};
(c = exports.BuildType || (exports.BuildType = {})).DEV = "dev";
c.PROD = "prod";
c.NIGHTLY = "nightly";
class l {}
function u(e, t) {
  return e !== a.ParsingAndServer || r.isSupportedLanguageId(t) ? e : a.Server;
}
exports.BlockModeConfig = l;
exports.ConfigBlockModeConfig = class extends l {
  async forLanguage(e, n) {
    if (e.get(d).isDefaultSettingOverwritten(exports.ConfigKey.IndentationMode)) switch (e.get(d).getLanguageConfig(exports.ConfigKey.IndentationMode, n)) {
      case "client":
      case !0:
      case "server":
        return a.Server;
      case "clientandserver":
        return u(a.ParsingAndServer, n);
      default:
        return a.Parsing;
    }
    const o = await e.get(i.Features).overrideBlockMode();
    return o ? u(o, n) : r.isSupportedLanguageId(n) ? a.Parsing : a.Server;
  }
};
class d {}
function p(e) {
  try {
    const t = s.contributes.configuration[0].properties[`${o.CopilotConfigPrefix}.${e}`].default;
    if (undefined === t) throw new Error(`Missing config default value: ${o.CopilotConfigPrefix}.${e}`);
    return t;
  } catch (t) {
    throw new Error(`Error inspecting config default value ${o.CopilotConfigPrefix}.${e}: ${t}`);
  }
}
function h(e, t) {
  try {
    const n = s.contributes.configuration[0].properties[`${o.CopilotConfigPrefix}.${e}`].properties[t].default;
    if (undefined === n) throw new Error(`Missing config default value: ${o.CopilotConfigPrefix}.${e}`);
    return n;
  } catch (n) {
    throw new Error(`Error inspecting config default value ${o.CopilotConfigPrefix}.${e}.${t}: ${n}`);
  }
}
function f(e, t) {
  return e.get(d).getConfig(t);
}
function m(e, t) {
  return e.get(d).isDefaultSettingOverwritten(t);
}
function g(e, t, n) {
  return m(e, t) ? f(e, t) : n.default;
}
function _(e, t, n) {
  return e.get(d).getLanguageConfig(t, n);
}
exports.ConfigProvider = d;
exports.DefaultsOnlyConfigProvider = class extends d {
  getConfig(e) {
    return Array.isArray(e) ? h(e[0], e[1]) : p(e);
  }
  isDefaultSettingOverwritten(e) {
    return !1;
  }
  dumpConfig() {
    return {};
  }
  getLanguageConfig(e, t) {
    const n = this.getConfig(e);
    return t && t in n ? n[t] : n["*"];
  }
};
exports.InMemoryConfigProvider = class {
  constructor(e, t) {
    this.baseConfigProvider = e;
    this.overrides = t;
  }
  getConfig(e) {
    const t = this.overrides.get(e);
    return undefined !== t ? t : this.baseConfigProvider.getConfig(e);
  }
  setConfig(e, t) {
    undefined !== t ? this.overrides.set(e, t) : this.overrides.delete(e);
  }
  setLanguageEnablement(e, n) {
    this.overrides.set(exports.ConfigKey.Enable, {
      [e]: n
    });
  }
  isDefaultSettingOverwritten(e) {
    return !!this.overrides.has(e) || this.baseConfigProvider.isDefaultSettingOverwritten(e);
  }
  keyAsString(e) {
    return Array.isArray(e) ? e.join(".") : e;
  }
  dumpConfig() {
    const e = this.baseConfigProvider.dumpConfig();
    this.overrides.forEach((t, n) => {
      e[this.keyAsString(n)] = JSON.stringify(t);
    });
    return e;
  }
  getLanguageConfig(e, t) {
    const n = this.overrides.get(e);
    return undefined !== n ? undefined !== t ? n[t] : n["*"] : this.baseConfigProvider.getLanguageConfig(e, t);
  }
};
exports.getConfigDefaultForKey = p;
exports.getConfigDefaultForObjectKey = h;
exports.getConfig = f;
exports.isDefaultSettingOverwritten = m;
exports.getHiddenConfig = g;
exports.dumpConfig = function (e) {
  return e.get(d).dumpConfig();
};
exports.getLanguageConfig = _;
exports.getEnabledConfig = function (e, n) {
  return _(e, exports.ConfigKey.Enable, n);
};
exports.suffixPercent = async function (e, n, r) {
  return g(e, exports.ConfigKey.DebugUseSuffix, {
    default: !1
  }) ? 15 : e.get(i.Features).suffixPercent(n, r);
};
exports.suffixMatchThreshold = async function (e, n, r) {
  return g(e, exports.ConfigKey.DebugUseSuffix, {
    default: !1
  }) ? 0 : e.get(i.Features).suffixMatchThreshold(n, r);
};
exports.fimSuffixLengthThreshold = async function (e, n, r) {
  return g(e, exports.ConfigKey.DebugUseSuffix, {
    default: !1
  }) ? -1 : e.get(i.Features).fimSuffixLengthThreshold(n, r);
};
class y {
  constructor() {
    this.packageJson = s;
  }
  isProduction() {
    return "dev" != this.getBuildType();
  }
  getBuildType() {
    return this.packageJson.buildType;
  }
  getVersion() {
    return this.packageJson.version;
  }
  getBuild() {
    return this.packageJson.build;
  }
  getName() {
    return this.packageJson.name;
  }
}
exports.BuildInfo = y;
exports.isProduction = function (e) {
  return e.get(y).isProduction();
};
exports.getBuildType = function (e) {
  return e.get(y).getBuildType();
};
exports.getBuild = function (e) {
  return e.get(y).getBuild();
};
exports.getVersion = function (e) {
  return e.get(y).getVersion();
};
class v {
  constructor(e, t, n) {
    this.sessionId = e;
    this.machineId = t;
    this.vsCodeVersion = n;
  }
}
function b({
  name: e,
  version: t
}) {
  return `${e}/${t}`;
}
exports.VscInfo = v;
exports.getTestVscInfo = function () {
  return new v("test-session-id", "test-machine-id", "test-vscode-version");
};
exports.formatNameAndVersion = b;
class w {}
exports.EditorAndPluginInfo = w;
exports.editorVersionHeaders = function (e) {
  const t = e.get(w);
  return {
    "Editor-Version": b(t.getEditorInfo(e)),
    "Editor-Plugin-Version": b(t.getEditorPluginInfo(e))
  };
};