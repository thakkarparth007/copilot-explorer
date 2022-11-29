Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.CopilotStatusBar = undefined;
const r = require(9496),
  o = require(106),
  i = require(1133),
  s = require(6333),
  a = require(3060);
exports.CopilotStatusBar = class {
  constructor(e) {
    this.ctx = e;
    this.showingMessage = !1;
    this.status = "Normal";
    this.errorMessage = "";
    this.disabledColor = new r.ThemeColor("statusBarItem.warningBackground");
    this.delayedUpdateDisplay = o.debounce(100, () => {
      this.updateDisplay();
    });
    this.enabled = this.checkEnabledForLanguage();
    this.item = r.window.createStatusBarItem(r.StatusBarAlignment.Right, 0);
    this.updateDisplay();
    this.item.show();
    r.window.onDidChangeActiveTextEditor(() => {
      this.updateStatusBarIndicator();
    });
    r.workspace.onDidCloseTextDocument(() => {
      this.updateStatusBarIndicator();
    });
    r.workspace.onDidOpenTextDocument(() => {
      this.updateStatusBarIndicator();
    });
  }
  updateStatusBarIndicator() {
    this.enabled = this.checkEnabledForLanguage();
    this.updateDisplay();
  }
  checkEnabledForLanguage() {
    return i.getEnabledConfig(this.ctx) || !1;
  }
  updateDisplay() {
    switch (this.status) {
      case "Error":
        this.item.text = "$(copilot-notconnected)";
        this.item.command = a.CMDShowActivationErrors;
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
        this.item.command = a.CMDToggleCopilot;
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
    const t = this.ctx.get(i.ConfigProvider),
      n = this.enabled,
      o =
        null === (e = r.window.activeTextEditor) || undefined === e
          ? undefined
          : e.document.languageId,
      a = "editor.action.inlineSuggest.hide";
    if (this.showingMessage) return;
    const c = s.TelemetryData.createAndMarkAsIssued({
      languageId: o || "*",
    });
    if (i.getEnabledConfig(this.ctx, "*") == i.getEnabledConfig(this.ctx, o)) {
      this.showingMessage = !0;
      setTimeout(() => {
        this.showingMessage = !1;
      }, 15e3);
      const e = n ? "Disable" : "Enable",
        i = `${e} Globally`,
        l = `${e} for ${o}`,
        u = o ? [i, l] : [i];
      r.window
        .showInformationMessage(
          `Would you like to ${n ? "disable" : "enable"} Copilot?`,
          ...u
        )
        .then((e) => {
          const l = e === i;
          this.showingMessage = !1;
          if (void 0 === e)
            return void (0, s.telemetry)(this.ctx, "statusBar.cancelToggle");
          s.telemetry(
            this.ctx,
            "statusBar" + (l ? ".global" : ".language") + (n ? "Off" : "On"),
            c
          );
          if (n) {
            r.commands.executeCommand(a);
          }
          const u = l ? "*" : o;
          t.updateEnabledConfig(this.ctx, u, !n).then(() => {
            this.enabled = !n;
            this.updateDisplay();
          });
        });
    } else {
      s.telemetry(this.ctx, "statusBar.language" + (n ? "Off" : "On"), c);
      if (n) {
        r.commands.executeCommand(a);
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
    r.window.showWarningMessage(this.errorMessage, ...t).then((t) => {
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
