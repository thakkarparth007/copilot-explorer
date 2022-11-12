Object.defineProperty(exports, "__esModule", {
  value: !0
});
process.env.APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL = !0;
var r = require(7147),
  o = require(2037),
  i = require(1017),
  s = require(9496),
  a = require(9574),
  c = function () {
    function e(e, t, n, o) {
      var a = this;
      this.extensionId = e;
      this.extensionVersion = t;
      this.firstParty = !1;
      this.userOptIn = !1;
      this.firstParty = !!o;
      var c = process.env.VSCODE_LOGS || "";
      c && e && "trace" === process.env.VSCODE_LOG_LEVEL && (c = i.join(c, e + ".txt"), this.logStream = r.createWriteStream(c, {
        flags: "a",
        encoding: "utf8",
        autoClose: !0
      }));
      this.updateUserOptIn(n);
      undefined !== s.env.onDidChangeTelemetryEnabled ? this.optOutListener = s.env.onDidChangeTelemetryEnabled(function () {
        return a.updateUserOptIn(n);
      }) : this.optOutListener = s.workspace.onDidChangeConfiguration(function () {
        return a.updateUserOptIn(n);
      });
    }
    e.prototype.updateUserOptIn = function (t) {
      var n = s.workspace.getConfiguration(e.TELEMETRY_CONFIG_ID),
        r = undefined === s.env.isTelemetryEnabled ? n.get(e.TELEMETRY_CONFIG_ENABLED_ID, !0) : s.env.isTelemetryEnabled;
      this.userOptIn !== r && (this.userOptIn = r, this.userOptIn ? this.createAppInsightsClient(t) : this.dispose());
    };
    e.prototype.createAppInsightsClient = function (e) {
      a.defaultClient ? (this.appInsightsClient = new a.TelemetryClient(e), this.appInsightsClient.channel.setUseDiskRetryCaching(!0)) : (a.setup(e).setAutoCollectRequests(!1).setAutoCollectPerformance(!1).setAutoCollectExceptions(!1).setAutoCollectDependencies(!1).setAutoDependencyCorrelation(!1).setAutoCollectConsole(!1).setUseDiskRetryCaching(!0).start(), this.appInsightsClient = a.defaultClient);
      this.appInsightsClient.commonProperties = this.getCommonProperties();
      s && s.env && (this.appInsightsClient.context.tags[this.appInsightsClient.context.keys.userId] = s.env.machineId, this.appInsightsClient.context.tags[this.appInsightsClient.context.keys.sessionId] = s.env.sessionId);
      e && 0 === e.indexOf("AIF-") && (this.appInsightsClient.config.endpointUrl = "https://vortex.data.microsoft.com/collect/v1", this.firstParty = !0);
    };
    e.prototype.getCommonProperties = function () {
      var e = Object.create(null);
      e["common.os"] = o.platform();
      e["common.platformversion"] = (o.release() || "").replace(/^(\d+)(\.\d+)?(\.\d+)?(.*)/, "$1$2$3");
      e["common.extname"] = this.extensionId;
      e["common.extversion"] = this.extensionVersion;
      if (s && s.env) {
        switch (e["common.vscodemachineid"] = s.env.machineId, e["common.vscodesessionid"] = s.env.sessionId, e["common.vscodeversion"] = s.version, e["common.isnewappinstall"] = s.env.isNewAppInstall, s.env.uiKind) {
          case s.UIKind.Web:
            e["common.uikind"] = "web";
            break;
          case s.UIKind.Desktop:
            e["common.uikind"] = "desktop";
            break;
          default:
            e["common.uikind"] = "unknown";
        }
        e["common.remotename"] = this.cleanRemoteName(s.env.remoteName);
      }
      return e;
    };
    e.prototype.cleanRemoteName = function (e) {
      if (!e) return "none";
      var t = "other";
      ["ssh-remote", "dev-container", "attached-container", "wsl"].forEach(function (n) {
        0 === e.indexOf(n + "+") && (t = n);
      });
      return t;
    };
    e.prototype.shouldSendErrorTelemetry = function () {
      return !this.firstParty || "other" !== this.cleanRemoteName(s.env.remoteName) || undefined !== this.extension && this.extension.extensionKind !== s.ExtensionKind.Workspace && s.env.uiKind !== s.UIKind.Web;
    };
    Object.defineProperty(e.prototype, "extension", {
      get: function () {
        undefined === this._extension && (this._extension = s.extensions.getExtension(this.extensionId));
        return this._extension;
      },
      enumerable: !1,
      configurable: !0
    });
    e.prototype.cloneAndChange = function (e, t) {
      if (null === e || "object" != typeof e) return e;
      if ("function" != typeof t) return e;
      var n = {};
      for (var r in e) n[r] = t(r, e[r]);
      return n;
    };
    e.prototype.anonymizeFilePaths = function (e, t) {
      if (null == e) return "";
      var n = [new RegExp(s.env.appRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi")];
      this.extension && n.push(new RegExp(this.extension.extensionPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"));
      var r = e;
      if (t) {
        for (var o = [], i = 0, a = n; i < a.length; i++) for (var c = a[i];;) {
          var l = c.exec(e);
          if (!l) break;
          o.push([l.index, c.lastIndex]);
        }
        var u = /^[\\\/]?(node_modules|node_modules\.asar)[\\\/]/,
          d = /(file:\/\/)?([a-zA-Z]:(\\\\|\\|\/)|(\\\\|\\|\/))?([\w-\._]+(\\\\|\\|\/))+[\w-\._]*/g,
          p = 0;
        r = "";
        for (var h = function () {
          var t = d.exec(e);
          if (!t) return "break";
          !u.test(t[0]) && o.every(function (e) {
            var n = e[0],
              r = e[1];
            return t.index < n || t.index >= r;
          }) && (r += e.substring(p, t.index) + "<REDACTED: user-file-path>", p = d.lastIndex);
        }; "break" !== h(););
        p < e.length && (r += e.substr(p));
      }
      for (var f = 0, m = n; f < m.length; f++) {
        c = m[f];
        r = r.replace(c, "");
      }
      return r;
    };
    e.prototype.sendTelemetryEvent = function (e, t, n) {
      var r = this;
      if (this.userOptIn && e && this.appInsightsClient) {
        var o = this.cloneAndChange(t, function (e, t) {
          return r.anonymizeFilePaths(t, r.firstParty);
        });
        this.appInsightsClient.trackEvent({
          name: this.extensionId + "/" + e,
          properties: o,
          measurements: n
        });
        this.logStream && this.logStream.write("telemetry/" + e + " " + JSON.stringify({
          properties: t,
          measurements: n
        }) + "\n");
      }
    };
    e.prototype.sendTelemetryErrorEvent = function (e, t, n, r) {
      var o = this;
      if (this.userOptIn && e && this.appInsightsClient) {
        var i = this.cloneAndChange(t, function (e, t) {
          return o.shouldSendErrorTelemetry() ? o.anonymizeFilePaths(t, o.firstParty) : undefined === r || -1 !== r.indexOf(e) ? "REDACTED" : o.anonymizeFilePaths(t, o.firstParty);
        });
        this.appInsightsClient.trackEvent({
          name: this.extensionId + "/" + e,
          properties: i,
          measurements: n
        });
        this.logStream && this.logStream.write("telemetry/" + e + " " + JSON.stringify({
          properties: t,
          measurements: n
        }) + "\n");
      }
    };
    e.prototype.sendTelemetryException = function (e, t, n) {
      var r = this;
      if (this.shouldSendErrorTelemetry() && this.userOptIn && e && this.appInsightsClient) {
        var o = this.cloneAndChange(t, function (e, t) {
          return r.anonymizeFilePaths(t, r.firstParty);
        });
        this.appInsightsClient.trackException({
          exception: e,
          properties: o,
          measurements: n
        });
        this.logStream && this.logStream.write("telemetry/" + e.name + " " + e.message + " " + JSON.stringify({
          properties: t,
          measurements: n
        }) + "\n");
      }
    };
    e.prototype.dispose = function () {
      var e = this;
      this.optOutListener.dispose();
      var t = new Promise(function (t) {
          if (!e.logStream) return t(undefined);
          e.logStream.on("finish", t);
          e.logStream.end();
        }),
        n = new Promise(function (t) {
          e.appInsightsClient ? e.appInsightsClient.flush({
            callback: function () {
              e.appInsightsClient = undefined;
              t(undefined);
            }
          }) : t(undefined);
        });
      return Promise.all([n, t]);
    };
    e.TELEMETRY_CONFIG_ID = "telemetry";
    e.TELEMETRY_CONFIG_ENABLED_ID = "enableTelemetry";
    return e;
  }();
exports.default = c;