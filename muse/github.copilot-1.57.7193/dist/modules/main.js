Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.deactivate = exports.activate = exports.init = undefined;
const t = require(3055563);
require(406);
const o = require("vscode");
const i = require(362);
const s = require(299);
const a = require(1133);
const c = require(4197);
const l = require(7870);
const u = require(9408);
const d = require(1839);
const p = require(9189);
const h = require(9748);
const f = require(8965);
const m = require(5413);
const g = require(9899);
const _ = require(2279);
const y = require(1547);
const v = require(4419);
const b = require(6722);
const w = require(2533);
const x = require(766);
const E = require(6333);
const C = require(956);
const S = require(70);
const T = require(8771);
const k = require(6403);
const I = require(3136);
const P = require(7057);
const A = require(3197);
const O = require(1862);
const N = require(9425);
const R = require(3060);
const M = (require(1929), require(6267));
const L = require(2990);
const $ = require(6857);
const D = require(9477);
const F = require(7254);
const j = require(4428);
const q = require(8129);
const B = require(385);
const U = o.window.createOutputChannel("GitHub Copilot");
function init() {
  _.init(new a.BuildInfo().getVersion());
}
function z(e, t, n) {
  return o.commands.registerCommand(t, async (...r) => {
    try {
      return await n(...r);
    } catch (n) {
      E.telemetryException(e, n, t);
    }
  });
}
let G;
exports.init = init;
init();
exports.activate = async function (e) {
  const n = new l.Context();
  n.set(a.ConfigProvider, new N.VSCodeConfigProvider());
  n.set(s.Clock, new s.Clock());
  n.set(a.BuildInfo, new a.BuildInfo());
  n.set(a.EditorAndPluginInfo, new N.VSCodeEditorInfo());
  n.set(g.LogVerbose, new g.LogVerbose(false));
  n.set(m.GhostTextDebounceManager, new m.GhostTextDebounceManager());
  n.set(f.ContextualFilterManager, new f.ContextualFilterManager());
  const r = new g.MultiLog([
    new g.ConsoleLog(console),
    new g.OutputChannelLog(U),
  ]);
  n.set(g.LogTarget, r);
  n.set(k.LocationFactory, new q.ExtensionLocationFactory());
  n.set(I.TextDocumentManager, new B.ExtensionTextDocumentManager());
  n.set(p.Features, new p.Features(n));
  const H = new _.HelixFetcher(n);
  n.set(_.Fetcher, H);
  D.initProxyEnvironment(H, process.env);
  n.set(t.FileSystem, $.extensionFileSystem);
  n.set(y.NotificationSender, new O.ExtensionNotificationSender());
  n.set(E.TelemetryEndpointUrl, new E.TelemetryEndpointUrl());
  if (e.extensionMode === o.ExtensionMode.Test) {
    n.set(i.CopilotTokenManager, C.makeTestingCopilotTokenManager());
    n.set(a.VscInfo, a.getTestVscInfo());
    n.set(S.RuntimeMode, S.RuntimeMode.fromEnvironment(true));
    n.set(h.ExpConfigMaker, new h.ExpConfigNone());
    n.set(E.TelemetryReporters, E.setupStandardReporters(n, "copilot-test"));
    n.set(P.UrlOpener, new T.TestUrlOpener());
  } else {
    n.set(i.CopilotTokenManager, new O.VSCodeCopilotTokenManager());
    n.set(a.VscInfo, N.makeVscInfo());
    n.set(v.OpenAIFetcher, new v.LiveOpenAIFetcher());
    n.set(a.BlockModeConfig, new a.ConfigBlockModeConfig());
    n.set(S.RuntimeMode, S.RuntimeMode.fromEnvironment(false));
    n.set(h.ExpConfigMaker, new h.ExpConfigFromTAS());
    n.set(E.TelemetryReporters, j.activate(n, e));
    n.set(P.UrlOpener, new P.RealUrlOpener());
  }
  if ("GitHub.copilot-nightly" === e.extension.id) {
    u.registerDefaultHandlers(n, "vscode");
  }
  N.setExtension(e.extension);
  O.setExtensionContext(e);
  e.globalState.setKeysForSync([O.telemetryAcceptanceKey]);
  const V = a.getBuildType(n) === a.BuildType.DEV;
  const W = "GitHub.copilot-nightly" === e.extension.id;
  if (W && o.extensions.all.find((e) => "GitHub.copilot" === e.id))
    return void (
      "Uninstall" ===
        (await o.window.showWarningMessage(
          "To use GitHub Copilot Nightly you need to uninstall GitHub Copilot extension",
          "Uninstall"
        )) &&
      (await o.commands.executeCommand(
        "workbench.extensions.uninstallExtension",
        "GitHub.copilot"
      ))
    );
  if (W || V) {
    o.commands.executeCommand("setContext", "github.copilot.nightly", true);
  }
  const K = (function (e, t) {
    const n = new F.CopilotStatusBar(e);
    t.subscriptions.push(
      z(e, R.CMDToggleCopilot, () => {
        n.toggleStatusBar();
      })
    );
    t.subscriptions.push(
      z(e, R.CMDShowActivationErrors, () => {
        n.showActivationErrors(U);
      })
    );
    t.subscriptions.push(n.getStatusBarItem());
    return n;
  })(n, e);
  n.set(b.StatusReporter, K);
  const J = async () => {
    try {
      await n.get(i.CopilotTokenManager).getCopilotToken(n);
    } catch (e) {
      const t = e.message || e;
      E.telemetryError(
        n,
        "activationFailed",
        E.TelemetryData.createAndMarkAsIssued({
          reason: t,
        })
      );
      n.get(E.TelemetryReporters).deactivate();
      const r = `GitHub Copilot could not connect to server. Extension activation failed: "${t}"`;
      K.setError(r, J);
      g.logger.error(n, r);
      return void o.commands.executeCommand(
        "setContext",
        "github.copilot.activated",
        false
      );
    }
    K.forceNormal();
    o.commands.executeCommand("setContext", "github.copilot.activated", true);
    e.subscriptions.push(
      z(n, R.CMDOpenPanel, () => {
        o.commands.executeCommand("editor.action.inlineSuggest.hide");
        M.commandOpenPanel(n);
      })
    );
    e.subscriptions.push(
      z(n, R.CMDOpenPanelForRange, (e) => {
        M.commandOpenPanel(n, e);
      }),
      z(n, R.CMDAcceptPanelSolution, async (e, t, n, r, i) => {
        const s = new o.WorkspaceEdit();
        s.insert(e, t, n);
        await o.workspace.applyEdit(s);
        i();
        await o.commands.executeCommand("workbench.action.closeActiveEditor");
        if (
          r &&
          o.window.activeTextEditor &&
          o.window.activeTextEditor.document.uri.toString() === e.toString()
        ) {
          const e = t.translate(1).with(void 0, 0),
            n = new o.Selection(e, e);
          o.window.activeTextEditor.selection = n;
        }
      })
    );
    e.subscriptions.push(
      z(n, R.CMDSendFeedback, () => {
        o.env.openExternal(
          o.Uri.parse(
            "https://github.com/github/feedback/discussions/categories/copilot"
          )
        );
      })
    );
    const t = new L.CopilotPanel(n);
    e.subscriptions.push(
      o.workspace.registerTextDocumentContentProvider(c.CopilotScheme, t),
      o.languages.registerCodeLensProvider(
        {
          scheme: c.CopilotScheme,
        },
        t
      )
    );
    try {
      e.subscriptions.push(...A.registerGhostText(n));
      const t = o.workspace.getConfiguration();
      const r = t.inspect("editor.inlineSuggest.enabled");
      if (undefined === (null == r ? undefined : r.globalValue)) {
        t.update(
          "editor.inlineSuggest.enabled",
          true,
          o.ConfigurationTarget.Global
        );
      }
    } catch (e) {
      o.window.showErrorMessage(
        "GitHub Copilot requires VS Code 1.57+. Please update your VS Code"
      );
    }
    e.subscriptions.push(d.registerDocumentTracker(n));
    e.subscriptions.push(
      o.window.onDidChangeActiveTextEditor((e) =>
        e
          ? e.document.isUntitled ||
            ("file" === e.document.uri.scheme &&
              x.extractRepoInfoInBackground(n, e.document.fileName))
          : undefined
      )
    );
    const r = e.extensionMode !== o.ExtensionMode.Development;
    w.init(n, r, new g.Logger(g.LogLevel.INFO, "promptlib proxy"));
    E.telemetry(n, "extension.activate");
    G = n;
  };
  await J();
};
exports.deactivate = function () {
  if (G) {
    E.telemetry(G, "extension.deactivate");
    G.get(E.TelemetryReporters).deactivate();
  }
  w.terminate();
};