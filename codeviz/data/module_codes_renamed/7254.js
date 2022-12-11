Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.CopilotStatusBar = undefined;
const M_vscode = require("vscode");
const M_debouncer = require("debouncer");
const M_config_stuff = require("config-stuff");
const M_telemetry_stuff = require("telemetry-stuff");
const M_copilot_vscode_cmds = require("copilot-vscode-cmds");
exports.CopilotStatusBar = class {
  constructor(e) {
    this.ctx = e;
    this.showingMessage = !1;
    this.status = "Normal";
    this.errorMessage = "";
    this.disabledColor = new M_vscode.ThemeColor(
      "statusBarItem.warningBackground"
    );
    this.delayedUpdateDisplay = M_debouncer.debounce(100, () => {
      this.updateDisplay();
    });
    this.enabled = this.checkEnabledForLanguage();
    this.item = M_vscode.window.createStatusBarItem(
      M_vscode.StatusBarAlignment.Right,
      0
    );
    this.updateDisplay();
    this.item.show();
    M_vscode.window.onDidChangeActiveTextEditor(() => {
      this.updateStatusBarIndicator();
    });
    M_vscode.workspace.onDidCloseTextDocument(() => {
      this.updateStatusBarIndicator();
    });
    M_vscode.workspace.onDidOpenTextDocument(() => {
      this.updateStatusBarIndicator();
    });
  }
  updateStatusBarIndicator() {
    this.enabled = this.checkEnabledForLanguage();
    this.updateDisplay();
  }
  checkEnabledForLanguage() {
    return M_config_stuff.getEnabledConfig(this.ctx) || !1;
  }
  updateDisplay() {
    switch (this.status) {
      case "Error":
        this.item.text = "$(copilot-notconnected)";
        this.item.command = M_copilot_vscode_cmds.CMDShowActivationErrors;
        this.item.tooltip = "Copilot activation failed";
        break;
      case "Warning":
        this.item.text = "$(copilot-warning)";
        this.item.command = undefined;
        this.item.tooltip = "Copilot is encountering temporary issues";
        break;
      case "InProgress":
        this.item.text = "$(loading~spin)";
        break;
      case "Normal":
        this.item.text = "$(copilot-logo)";
        this.item.command = M_copilot_vscode_cmds.CMDToggleCopilot;
        this.item.tooltip = this.enabled
          ? "Deactivate Copilot"
          : "Activate Copilot";
        this.item.backgroundColor = this.enabled
          ? undefined
          : this.disabledColor;
    }
  }
  getStatusBarItem() {
    return this.item;
  }
  setProgress() {
    if ("Error" !== this.status) {
      this.status = "InProgress";
      this.delayedUpdateDisplay();
    }
  }
  removeProgress() {
    if ("Error" !== this.status && "Warning" !== this.status) {
      this.status = "Normal";
      this.delayedUpdateDisplay();
    }
  }
  setWarning() {
    if ("Error" !== this.status) {
      this.status = "Warning";
      this.updateDisplay();
    }
  }
  setError(e, t) {
    this.status = "Error";
    this.errorMessage = e;
    this.errorRetry = t;
    this.updateDisplay();
  }
  forceNormal() {
    this.status = "Normal";
    this.errorMessage = "";
    this.errorRetry = undefined;
    this.updateDisplay();
  }
  toggleStatusBar() {
    var e;
    const t = this.ctx.get(M_config_stuff.ConfigProvider);
    const n = this.enabled;
    const o =
      null === (e = M_vscode.window.activeTextEditor) || undefined === e
        ? undefined
        : e.document.languageId;
    const a = "editor.action.inlineSuggest.hide";
    if (this.showingMessage) return;
    const c = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
      languageId: o || "*",
    });
    if (
      M_config_stuff.getEnabledConfig(this.ctx, "*") ==
      M_config_stuff.getEnabledConfig(this.ctx, o)
    ) {
      this.showingMessage = !0;
      setTimeout(() => {
        this.showingMessage = !1;
      }, 15e3);
      const e = n ? "Disable" : "Enable";
      const i = `${e} Globally`;
      const l = `${e} for ${o}`;
      const u = o ? [i, l] : [i];
      M_vscode.window
        .showInformationMessage(
          `Would you like to ${n ? "disable" : "enable"} Copilot?`,
          ...u
        )
        .then((e) => {
          const l = e === i;
          this.showingMessage = !1;
          if (void 0 === e)
            return void (0, M_telemetry_stuff.telemetry)(
              this.ctx,
              "statusBar.cancelToggle"
            );
          M_telemetry_stuff.telemetry(
            this.ctx,
            "statusBar" + (l ? ".global" : ".language") + (n ? "Off" : "On"),
            c
          );
          if (n) {
            M_vscode.commands.executeCommand(a);
          }
          const u = l ? "*" : o;
          t.updateEnabledConfig(this.ctx, u, !n).then(() => {
            this.enabled = !n;
            this.updateDisplay();
          });
        });
    } else {
      M_telemetry_stuff.telemetry(
        this.ctx,
        "statusBar.language" + (n ? "Off" : "On"),
        c
      );
      if (n) {
        M_vscode.commands.executeCommand(a);
      }
      t.updateEnabledConfig(this.ctx, o || "*", !n).then(() => {
        this.enabled = !n;
        this.updateDisplay();
      });
    }
    this.updateDisplay();
  }
  showActivationErrors(e) {
    if (this.showingMessage) return;
    this.showingMessage = !0;
    const t = ["Show output log"];
    if (this.errorRetry) {
      t.push("Retry");
    }
    M_vscode.window.showWarningMessage(this.errorMessage, ...t).then((t) => {
      this.showingMessage = !1;
      if ("Show Output log" === t) {
        e.show();
      }
      if ("Retry" === t && this.errorRetry) {
        this.errorRetry();
      }
    });
  }
};
