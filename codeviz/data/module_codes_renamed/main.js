Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.deactivate = exports.activate = exports.init = undefined;
const M_getPrompt_main_stuff = require("getPrompt-main-stuff");
require("install-source-map-support");
const M_vscode = require("vscode");
const M_copilot_github_auth_stuff = require("copilot-github-auth-stuff");
const M_clock = require("clock");
const M_config_stuff = require("config-stuff");
const M_copilot_scheme = require("copilot-scheme");
const M_context = require("context");
const M_nightly_telemetry_stuff = require("nightly-telemetry-stuff");
const M_doc_tracker = require("doc-tracker");
const M_task_maybe = require("task");
const M_exp_config_maker_maybe = require("exp-config-maker");
const M_contextual_filter_manager = require("contextual-filter-manager");
const M_ghost_text_debouncer_maybe = require("ghost-text-debouncer");
const M_logging_utils = require("logging-utils");
const M_helix_fetcher_and_network_stuff = require("helix-fetcher-and-network-stuff");
const M_notification_sender_maybe = require("notification-sender");
const M_live_openai_fetcher = require("live-openai-fetcher");
const M_status_reporter_maybe = require("status-reporter");
const M_get_prompt_parsing_utils_maybe = require("get-prompt-parsing-utils");
const M_background_context_provider = require("background-context-provider");
const M_telemetry_stuff = require("telemetry-stuff");
const M_testing_copilot_token_manager_maybe = require("testing_copilot_token_manager");
const M_runtime_mode_maybe = require("runtime-mode");
const M_test_utils_maybe = require("test-utils");
const M_location_factory = require("location-factory");
const M_text_doc_relative_path = require("text-doc-relative-path");
const M_url_opener = require("url-opener");
const M_inline_completion_provider = require("inline-completion-provider");
const M_copilot_token_manager_maybe = require("copilot-token-manager");
const M_vscode_utils = require("vscode-utils");
const M_copilot_vscode_cmds = require("copilot-vscode-cmds");
const M =
  (require("open-copilot-action-provider"), require("open-panel-command"));
const M_copilot_panel = require("copilot-panel");
const M_extension_fs_maybe = require("extension-fs");
const M_proxy_environment_init_maybe = require("proxy-environment-init");
const M_copilot_status_bar = require("copilot-status-bar");
const M_telemetry_wrapper = require("telemetry-wrapper");
const M_extension_location_factory = require("extension-location-factory");
const M_text_doc_manager = require("text-doc-manager");
const U = M_vscode.window.createOutputChannel("GitHub Copilot");
function init() {
  M_helix_fetcher_and_network_stuff.init(
    new M_config_stuff.BuildInfo().getVersion()
  );
}
function z(e, t, n) {
  return M_vscode.commands.registerCommand(t, async (...r) => {
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
    M_ghost_text_debouncer_maybe.GhostTextDebounceManager,
    new M_ghost_text_debouncer_maybe.GhostTextDebounceManager()
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
  n.set(M_task_maybe.Features, new M_task_maybe.Features(n));
  const H = new M_helix_fetcher_and_network_stuff.HelixFetcher(n);
  n.set(M_helix_fetcher_and_network_stuff.Fetcher, H);
  M_proxy_environment_init_maybe.initProxyEnvironment(H, process.env);
  n.set(
    M_getPrompt_main_stuff.FileSystem,
    M_extension_fs_maybe.extensionFileSystem
  );
  n.set(
    M_notification_sender_maybe.NotificationSender,
    new M_copilot_token_manager_maybe.ExtensionNotificationSender()
  );
  n.set(
    M_telemetry_stuff.TelemetryEndpointUrl,
    new M_telemetry_stuff.TelemetryEndpointUrl()
  );
  if (e.extensionMode === M_vscode.ExtensionMode.Test) {
    n.set(
      M_copilot_github_auth_stuff.CopilotTokenManager,
      M_testing_copilot_token_manager_maybe.makeTestingCopilotTokenManager()
    );
    n.set(M_config_stuff.VscInfo, M_config_stuff.getTestVscInfo());
    n.set(
      M_runtime_mode_maybe.RuntimeMode,
      M_runtime_mode_maybe.RuntimeMode.fromEnvironment(!0)
    );
    n.set(
      M_exp_config_maker_maybe.ExpConfigMaker,
      new M_exp_config_maker_maybe.ExpConfigNone()
    );
    n.set(
      M_telemetry_stuff.TelemetryReporters,
      M_telemetry_stuff.setupStandardReporters(n, "copilot-test")
    );
    n.set(M_url_opener.UrlOpener, new M_test_utils_maybe.TestUrlOpener());
  } else {
    n.set(
      M_copilot_github_auth_stuff.CopilotTokenManager,
      new M_copilot_token_manager_maybe.VSCodeCopilotTokenManager()
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
      M_runtime_mode_maybe.RuntimeMode,
      M_runtime_mode_maybe.RuntimeMode.fromEnvironment(!1)
    );
    n.set(
      M_exp_config_maker_maybe.ExpConfigMaker,
      new M_exp_config_maker_maybe.ExpConfigFromTAS()
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
  M_copilot_token_manager_maybe.setExtensionContext(e);
  e.globalState.setKeysForSync([
    M_copilot_token_manager_maybe.telemetryAcceptanceKey,
  ]);
  const V = M_config_stuff.getBuildType(n) === M_config_stuff.BuildType.DEV;
  const W = "GitHub.copilot-nightly" === e.extension.id;
  if (W && M_vscode.extensions.all.find((e) => "GitHub.copilot" === e.id))
    return void (
      "Uninstall" ===
        (await M_vscode.window.showWarningMessage(
          "To use GitHub Copilot Nightly you need to uninstall GitHub Copilot extension",
          "Uninstall"
        )) &&
      (await M_vscode.commands.executeCommand(
        "workbench.extensions.uninstallExtension",
        "GitHub.copilot"
      ))
    );
  if (W || V) {
    M_vscode.commands.executeCommand(
      "setContext",
      "github.copilot.nightly",
      !0
    );
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
  n.set(M_status_reporter_maybe.StatusReporter, K);
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
      return void M_vscode.commands.executeCommand(
        "setContext",
        "github.copilot.activated",
        !1
      );
    }
    K.forceNormal();
    M_vscode.commands.executeCommand(
      "setContext",
      "github.copilot.activated",
      !0
    );
    e.subscriptions.push(
      z(n, M_copilot_vscode_cmds.CMDOpenPanel, () => {
        M_vscode.commands.executeCommand("editor.action.inlineSuggest.hide");
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
          const s = new M_vscode.WorkspaceEdit();
          s.insert(e, t, n);
          await M_vscode.workspace.applyEdit(s);
          i();
          await M_vscode.commands.executeCommand(
            "workbench.action.closeActiveEditor"
          );
          if (
            r &&
            M_vscode.window.activeTextEditor &&
            M_vscode.window.activeTextEditor.document.uri.toString() ===
              e.toString()
          ) {
            const e = t.translate(1).with(void 0, 0),
              n = new M_vscode.Selection(e, e);
            M_vscode.window.activeTextEditor.selection = n;
          }
        }
      )
    );
    e.subscriptions.push(
      z(n, M_copilot_vscode_cmds.CMDSendFeedback, () => {
        M_vscode.env.openExternal(
          M_vscode.Uri.parse(
            "https://github.com/github/feedback/discussions/categories/copilot"
          )
        );
      })
    );
    const t = new M_copilot_panel.CopilotPanel(n);
    e.subscriptions.push(
      M_vscode.workspace.registerTextDocumentContentProvider(
        M_copilot_scheme.CopilotScheme,
        t
      ),
      M_vscode.languages.registerCodeLensProvider(
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
      const t = M_vscode.workspace.getConfiguration();
      const r = t.inspect("editor.inlineSuggest.enabled");
      if (undefined === (null == r ? undefined : r.globalValue)) {
        t.update(
          "editor.inlineSuggest.enabled",
          !0,
          M_vscode.ConfigurationTarget.Global
        );
      }
    } catch (e) {
      M_vscode.window.showErrorMessage(
        "GitHub Copilot requires VS Code 1.57+. Please update your VS Code"
      );
    }
    e.subscriptions.push(M_doc_tracker.registerDocumentTracker(n));
    e.subscriptions.push(
      M_vscode.window.onDidChangeActiveTextEditor((e) =>
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
    const r = e.extensionMode !== M_vscode.ExtensionMode.Development;
    M_get_prompt_parsing_utils_maybe.init(
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
  M_get_prompt_parsing_utils_maybe.terminate();
};
