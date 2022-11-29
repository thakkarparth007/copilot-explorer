(module, exports, require) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), exports.deactivate = exports.activate = exports.init = void 0;
    const t = require(3055);
    require(406);
    const o = require(9496),
        i = require(362),
        s = require(299),
        a = require(1133),
        c = require(4197),
        l = require(7870),
        u = require(9408),
        d = require(1839),
        p = require(9189),
        h = require(9748),
        f = require(8965),
        m = require(5413),
        g = require(9899),
        _ = require(2279),
        y = require(1547),
        v = require(4419),
        b = require(6722),
        w = require(2533),
        x = require(766),
        E = require(6333),
        C = require(956),
        S = require(70),
        T = require(8771),
        k = require(6403),
        I = require(3136),
        P = require(7057),
        A = require(3197),
        O = require(1862),
        N = require(9425),
        R = require(3060),
        M = (require(1929), require(6267)),
        L = require(2990),
        $ = require(6857),
        D = require(9477),
        F = require(7254),
        j = require(4428),
        q = require(8129),
        B = require(385),
        U = o.window.createOutputChannel("GitHub Copilot");

    function H() {
        (0, _.init)((new a.BuildInfo).getVersion())
    }

    function z(e, t, n) {
        return o.commands.registerCommand(t, (async (...r) => {
            try {
                return await n(...r)
            } catch (n) {
                E.telemetryException(e, n, t)
            }
        }))
    }
    let G;
    exports.init = H, H(), exports.activate = async function(e) {
        const n = new l.Context;
        n.set(a.ConfigProvider, new N.VSCodeConfigProvider), n.set(s.Clock, new s.Clock), n.set(a.BuildInfo, new a.BuildInfo), n.set(a.EditorAndPluginInfo, new N.VSCodeEditorInfo), n.set(g.LogVerbose, new g.LogVerbose(!1)), n.set(m.GhostTextDebounceManager, new m.GhostTextDebounceManager), n.set(f.ContextualFilterManager, new f.ContextualFilterManager);
        const r = new g.MultiLog([new g.ConsoleLog(console), new g.OutputChannelLog(U)]);
        n.set(g.LogTarget, r), n.set(k.LocationFactory, new q.ExtensionLocationFactory), n.set(I.TextDocumentManager, new B.ExtensionTextDocumentManager), n.set(p.Features, new p.Features(n));
        const H = new _.HelixFetcher(n);
        n.set(_.Fetcher, H), (0, D.initProxyEnvironment)(H, process.env), n.set(t.FileSystem, $.extensionFileSystem), n.set(y.NotificationSender, new O.ExtensionNotificationSender), n.set(E.TelemetryEndpointUrl, new E.TelemetryEndpointUrl), e.extensionMode === o.ExtensionMode.Test ? (n.set(i.CopilotTokenManager, (0, C.makeTestingCopilotTokenManager)()), n.set(a.VscInfo, (0, a.getTestVscInfo)()), n.set(S.RuntimeMode, S.RuntimeMode.fromEnvironment(!0)), n.set(h.ExpConfigMaker, new h.ExpConfigNone), n.set(E.TelemetryReporters, E.setupStandardReporters(n, "copilot-test")), n.set(P.UrlOpener, new T.TestUrlOpener)) : (n.set(i.CopilotTokenManager, new O.VSCodeCopilotTokenManager), n.set(a.VscInfo, (0, N.makeVscInfo)()), n.set(v.OpenAIFetcher, new v.LiveOpenAIFetcher), n.set(a.BlockModeConfig, new a.ConfigBlockModeConfig), n.set(S.RuntimeMode, S.RuntimeMode.fromEnvironment(!1)), n.set(h.ExpConfigMaker, new h.ExpConfigFromTAS), n.set(E.TelemetryReporters, j.activate(n, e)), n.set(P.UrlOpener, new P.RealUrlOpener)), "GitHub.copilot-nightly" === e.extension.id && (0, u.registerDefaultHandlers)(n, "vscode"), (0, N.setExtension)(e.extension), (0, O.setExtensionContext)(e), e.globalState.setKeysForSync([O.telemetryAcceptanceKey]);
        const V = (0, a.getBuildType)(n) === a.BuildType.DEV,
            W = "GitHub.copilot-nightly" === e.extension.id;
        if (W && o.extensions.all.find((e => "GitHub.copilot" === e.id))) return void("Uninstall" === await o.window.showWarningMessage("To use GitHub Copilot Nightly you need to uninstall GitHub Copilot extension", "Uninstall") && await o.commands.executeCommand("workbench.extensions.uninstallExtension", "GitHub.copilot"));
        (W || V) && o.commands.executeCommand("setContext", "github.copilot.nightly", !0);
        const K = function(e, t) {
            const n = new F.CopilotStatusBar(e);
            return t.subscriptions.push(z(e, R.CMDToggleCopilot, (() => {
                n.toggleStatusBar()
            }))), t.subscriptions.push(z(e, R.CMDShowActivationErrors, (() => {
                n.showActivationErrors(U)
            }))), t.subscriptions.push(n.getStatusBarItem()), n
        }(n, e);
        n.set(b.StatusReporter, K);
        const J = async () => {
            try {
                await n.get(i.CopilotTokenManager).getCopilotToken(n)
            } catch (e) {
                const t = e.message || e;
                E.telemetryError(n, "activationFailed", E.TelemetryData.createAndMarkAsIssued({
                    reason: t
                })), n.get(E.TelemetryReporters).deactivate();
                const r = `GitHub Copilot could not connect to server. Extension activation failed: "${t}"`;
                return K.setError(r, J), g.logger.error(n, r), void o.commands.executeCommand("setContext", "github.copilot.activated", !1)
            }
            K.forceNormal(), o.commands.executeCommand("setContext", "github.copilot.activated", !0), e.subscriptions.push(z(n, R.CMDOpenPanel, (() => {
                o.commands.executeCommand("editor.action.inlineSuggest.hide"), (0, M.commandOpenPanel)(n)
            }))), e.subscriptions.push(z(n, R.CMDOpenPanelForRange, (e => {
                (0, M.commandOpenPanel)(n, e)
            })), z(n, R.CMDAcceptPanelSolution, (async (e, t, n, r, i) => {
                const s = new o.WorkspaceEdit;
                if (s.insert(e, t, n), await o.workspace.applyEdit(s), i(), await o.commands.executeCommand("workbench.action.closeActiveEditor"), r && o.window.activeTextEditor && o.window.activeTextEditor.document.uri.toString() === e.toString()) {
                    const e = t.translate(1).with(void 0, 0),
                        n = new o.Selection(e, e);
                    o.window.activeTextEditor.selection = n
                }
            }))), e.subscriptions.push(z(n, R.CMDSendFeedback, (() => {
                o.env.openExternal(o.Uri.parse("https://github.com/github/feedback/discussions/categories/copilot"))
            })));
            const t = new L.CopilotPanel(n);
            e.subscriptions.push(o.workspace.registerTextDocumentContentProvider(c.CopilotScheme, t), o.languages.registerCodeLensProvider({
                scheme: c.CopilotScheme
            }, t));
            try {
                e.subscriptions.push(...(0, A.registerGhostText)(n));
                const t = o.workspace.getConfiguration(),
                    r = t.inspect("editor.inlineSuggest.enabled");
                void 0 === (null == r ? void 0 : r.globalValue) && t.update("editor.inlineSuggest.enabled", !0, o.ConfigurationTarget.Global)
            } catch (e) {
                o.window.showErrorMessage("GitHub Copilot requires VS Code 1.57+. Please update your VS Code")
            }
            e.subscriptions.push((0, d.registerDocumentTracker)(n)), e.subscriptions.push(o.window.onDidChangeActiveTextEditor((e => e ? e.document.isUntitled || "file" === e.document.uri.scheme && (0, x.extractRepoInfoInBackground)(n, e.document.fileName) : void 0)));
            const r = e.extensionMode !== o.ExtensionMode.Development;
            w.init(n, r, new g.Logger(g.LogLevel.INFO, "promptlib proxy")), E.telemetry(n, "extension.activate"), G = n
        };
        await J()
    }, exports.deactivate = function() {
        G && (E.telemetry(G, "extension.deactivate"), G.get(E.TelemetryReporters).deactivate()), w.terminate()
    }
}