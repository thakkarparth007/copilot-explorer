Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.deactivate = exports.activate = exports.init = undefined;
const M_getPrompt_main_stuff = require("getPrompt-main-stuff");
require("install-source-map-support");
const o = require("vscode"),
  M_copilot_github_auth_stuff = require("copilot-github-auth-stuff"),
  M_clock = require("clock"),
  M_config_stuff = require("config-stuff"),
  M_copilot_scheme = require("copilot-scheme"),
  M_context = require("context"),
  M_nightly_telemetry_stuff = require("nightly-telemetry-stuff"),
  M_doc_tracker = require("doc-tracker"),
  M_task_NOTSURE = require("task"),
  M_exp_config_maker_NOTSURE = require("exp-config-maker"),
  M_contextual_filter_manager = require("contextual-filter-manager"),
  M_ghost_text_debouncer_NOTSURE = require("ghost-text-debouncer"),
  M_logging_utils = require("logging-utils"),
  M_helix_fetcher_and_network_stuff = require("helix-fetcher-and-network-stuff"),
  M_notification_sender_NOTSURE = require("notification-sender"),
  M_live_openai_fetcher = require("live-openai-fetcher"),
  M_status_reporter_NOTSURE = require("status-reporter"),
  M_get_prompt_parsing_utils_NOTSURE = require("get-prompt-parsing-utils"),
  M_background_context_provider = require("background-context-provider"),
  M_telemetry_stuff = require("telemetry-stuff"),
  M_testing_copilot_token_manager_NOTSURE = require("testing_copilot_token_manager"),
  M_runtime_mode_NOTSURE = require("runtime-mode"),
  M_test_utils_NOTSURE = require("test-utils"),
  M_location_factory = require("location-factory"),
  M_text_doc_relative_path = require("text-doc-relative-path"),
  M_url_opener = require("url-opener"),
  M_inline_completion_provider = require("inline-completion-provider"),
  M_copilot_token_manager_NOTSURE = require("copilot-token-manager"),
  M_vscode_utils = require("vscode-utils"),
  M_copilot_vscode_cmds = require("copilot-vscode-cmds"),
  M = (require("open-copilot-action-provider"), require("open-panel-command")),
  M_copilot_panel = require("copilot-panel"),
  M_extension_fs_NOTSURE = require("extension-fs"),
  M_proxy_environment_init_NOTSURE = require("proxy-environment-init"),
  M_copilot_status_bar = require("copilot-status-bar"),
  M_telemetry_wrapper = require("telemetry-wrapper"),
  M_extension_location_factory = require("extension-location-factory"),
  M_text_doc_manager = require("text-doc-manager"),
  U = o.window.createOutputChannel("GitHub Copilot");
function init() {
  M_helix_fetcher_and_network_stuff.init(
    new M_config_stuff.BuildInfo().getVersion()
  );
}
function z(e, t, n) {
  return o.commands.registerCommand(t, async (...r) => {
    try {
      return await n(...r);
    } catch (n) {
      M_telemetry_stuff.telemetryException(e, n, t);
    }
  });
}
let G;
exports.init = init;
init();
exports.activate = async function (e) {
  const n = new M_context.Context();
  n.set(
    M_config_stuff.ConfigProvider,
    new M_vscode_utils.VSCodeConfigProvider()
  );
  n.set(M_clock.Clock, new M_clock.Clock());
  n.set(M_config_stuff.BuildInfo, new M_config_stuff.BuildInfo());
  n.set(
    M_config_stuff.EditorAndPluginInfo,
    new M_vscode_utils.VSCodeEditorInfo()
  );
  n.set(M_logging_utils.LogVerbose, new M_logging_utils.LogVerbose(!1));
  n.set(
    M_ghost_text_debouncer_NOTSURE.GhostTextDebounceManager,
    new M_ghost_text_debouncer_NOTSURE.GhostTextDebounceManager()
  );
  n.set(
    M_contextual_filter_manager.ContextualFilterManager,
    new M_contextual_filter_manager.ContextualFilterManager()
  );
  const r = new M_logging_utils.MultiLog([
    new M_logging_utils.ConsoleLog(console),
    new M_logging_utils.OutputChannelLog(U),
  ]);
  n.set(M_logging_utils.LogTarget, r);
  n.set(
    M_location_factory.LocationFactory,
    new M_extension_location_factory.ExtensionLocationFactory()
  );
  n.set(
    M_text_doc_relative_path.TextDocumentManager,
    new M_text_doc_manager.ExtensionTextDocumentManager()
  );
  n.set(M_task_NOTSURE.Features, new M_task_NOTSURE.Features(n));
  const H = new M_helix_fetcher_and_network_stuff.HelixFetcher(n);
  n.set(M_helix_fetcher_and_network_stuff.Fetcher, H);
  M_proxy_environment_init_NOTSURE.initProxyEnvironment(H, process.env);
  n.set(
    M_getPrompt_main_stuff.FileSystem,
    M_extension_fs_NOTSURE.extensionFileSystem
  );
  n.set(
    M_notification_sender_NOTSURE.NotificationSender,
    new M_copilot_token_manager_NOTSURE.ExtensionNotificationSender()
  );
  n.set(
    M_telemetry_stuff.TelemetryEndpointUrl,
    new M_telemetry_stuff.TelemetryEndpointUrl()
  );
  if (e.extensionMode === o.ExtensionMode.Test) {
    n.set(
      M_copilot_github_auth_stuff.CopilotTokenManager,
      M_testing_copilot_token_manager_NOTSURE.makeTestingCopilotTokenManager()
    );
    n.set(M_config_stuff.VscInfo, M_config_stuff.getTestVscInfo());
    n.set(
      M_runtime_mode_NOTSURE.RuntimeMode,
      M_runtime_mode_NOTSURE.RuntimeMode.fromEnvironment(!0)
    );
    n.set(
      M_exp_config_maker_NOTSURE.ExpConfigMaker,
      new M_exp_config_maker_NOTSURE.ExpConfigNone()
    );
    n.set(
      M_telemetry_stuff.TelemetryReporters,
      M_telemetry_stuff.setupStandardReporters(n, "copilot-test")
    );
    n.set(M_url_opener.UrlOpener, new M_test_utils_NOTSURE.TestUrlOpener());
  } else {
    n.set(
      M_copilot_github_auth_stuff.CopilotTokenManager,
      new M_copilot_token_manager_NOTSURE.VSCodeCopilotTokenManager()
    );
    n.set(M_config_stuff.VscInfo, M_vscode_utils.makeVscInfo());
    n.set(
      M_live_openai_fetcher.OpenAIFetcher,
      new M_live_openai_fetcher.LiveOpenAIFetcher()
    );
    n.set(
      M_config_stuff.BlockModeConfig,
      new M_config_stuff.ConfigBlockModeConfig()
    );
    n.set(
      M_runtime_mode_NOTSURE.RuntimeMode,
      M_runtime_mode_NOTSURE.RuntimeMode.fromEnvironment(!1)
    );
    n.set(
      M_exp_config_maker_NOTSURE.ExpConfigMaker,
      new M_exp_config_maker_NOTSURE.ExpConfigFromTAS()
    );
    n.set(
      M_telemetry_stuff.TelemetryReporters,
      M_telemetry_wrapper.activate(n, e)
    );
    n.set(M_url_opener.UrlOpener, new M_url_opener.RealUrlOpener());
  }
  if ("GitHub.copilot-nightly" === e.extension.id) {
    M_nightly_telemetry_stuff.registerDefaultHandlers(n, "vscode");
  }
  M_vscode_utils.setExtension(e.extension);
  M_copilot_token_manager_NOTSURE.setExtensionContext(e);
  e.globalState.setKeysForSync([
    M_copilot_token_manager_NOTSURE.telemetryAcceptanceKey,
  ]);
  const V = M_config_stuff.getBuildType(n) === M_config_stuff.BuildType.DEV,
    W = "GitHub.copilot-nightly" === e.extension.id;
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
    o.commands.executeCommand("setContext", "github.copilot.nightly", !0);
  }
  const K = (function (e, t) {
    const n = new M_copilot_status_bar.CopilotStatusBar(e);
    t.subscriptions.push(
      z(e, M_copilot_vscode_cmds.CMDToggleCopilot, () => {
        n.toggleStatusBar();
      })
    );
    t.subscriptions.push(
      z(e, M_copilot_vscode_cmds.CMDShowActivationErrors, () => {
        n.showActivationErrors(U);
      })
    );
    t.subscriptions.push(n.getStatusBarItem());
    return n;
  })(n, e);
  n.set(M_status_reporter_NOTSURE.StatusReporter, K);
  const J = async () => {
    try {
      await n
        .get(M_copilot_github_auth_stuff.CopilotTokenManager)
        .getCopilotToken(n);
    } catch (e) {
      const t = e.message || e;
      M_telemetry_stuff.telemetryError(
        n,
        "activationFailed",
        M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
          reason: t,
        })
      );
      n.get(M_telemetry_stuff.TelemetryReporters).deactivate();
      const r = `GitHub Copilot could not connect to server. Extension activation failed: "${t}"`;
      K.setError(r, J);
      M_logging_utils.logger.error(n, r);
      return void o.commands.executeCommand(
        "setContext",
        "github.copilot.activated",
        !1
      );
    }
    K.forceNormal();
    o.commands.executeCommand("setContext", "github.copilot.activated", !0);
    e.subscriptions.push(
      z(n, M_copilot_vscode_cmds.CMDOpenPanel, () => {
        o.commands.executeCommand("editor.action.inlineSuggest.hide");
        M.commandOpenPanel(n);
      })
    );
    e.subscriptions.push(
      z(n, M_copilot_vscode_cmds.CMDOpenPanelForRange, (e) => {
        M.commandOpenPanel(n, e);
      }),
      z(
        n,
        M_copilot_vscode_cmds.CMDAcceptPanelSolution,
        async (e, t, n, r, i) => {
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
        }
      )
    );
    e.subscriptions.push(
      z(n, M_copilot_vscode_cmds.CMDSendFeedback, () => {
        o.env.openExternal(
          o.Uri.parse(
            "https://github.com/github/feedback/discussions/categories/copilot"
          )
        );
      })
    );
    const t = new M_copilot_panel.CopilotPanel(n);
    e.subscriptions.push(
      o.workspace.registerTextDocumentContentProvider(
        M_copilot_scheme.CopilotScheme,
        t
      ),
      o.languages.registerCodeLensProvider(
        {
          scheme: M_copilot_scheme.CopilotScheme,
        },
        t
      )
    );
    try {
      e.subscriptions.push(
        ...M_inline_completion_provider.registerGhostText(n)
      );
      const t = o.workspace.getConfiguration(),
        r = t.inspect("editor.inlineSuggest.enabled");
      if (undefined === (null == r ? undefined : r.globalValue)) {
        t.update(
          "editor.inlineSuggest.enabled",
          !0,
          o.ConfigurationTarget.Global
        );
      }
    } catch (e) {
      o.window.showErrorMessage(
        "GitHub Copilot requires VS Code 1.57+. Please update your VS Code"
      );
    }
    e.subscriptions.push(M_doc_tracker.registerDocumentTracker(n));
    e.subscriptions.push(
      o.window.onDidChangeActiveTextEditor((e) =>
        e
          ? e.document.isUntitled ||
            ("file" === e.document.uri.scheme &&
              M_background_context_provider.extractRepoInfoInBackground(
                n,
                e.document.fileName
              ))
          : undefined
      )
    );
    const r = e.extensionMode !== o.ExtensionMode.Development;
    M_get_prompt_parsing_utils_NOTSURE.init(
      n,
      r,
      new M_logging_utils.Logger(
        M_logging_utils.LogLevel.INFO,
        "promptlib proxy"
      )
    );
    M_telemetry_stuff.telemetry(n, "extension.activate");
    G = n;
  };
  await J();
};
exports.deactivate = function () {
  if (G) {
    M_telemetry_stuff.telemetry(G, "extension.deactivate");
    G.get(M_telemetry_stuff.TelemetryReporters).deactivate();
  }
  M_get_prompt_parsing_utils_NOTSURE.terminate();
};
