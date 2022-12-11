Object.defineProperty(exports, "__esModule", {
  value: !0,
});
process.env.APPLICATION_INSIGHTS_NO_DIAGNOSTIC_CHANNEL = !0;
var M_fs = require("fs");
var M_os = require("os");
var M_path = require("path");
var M_vscode = require("vscode");
var M_telemetry_client_manager = require("telemetry-client-manager");
var c = (function () {
  function e(e, t, n, o) {
    var a = this;
    this.extensionId = e;
    this.extensionVersion = t;
    this.firstParty = !1;
    this.userOptIn = !1;
    this.firstParty = !!o;
    var c = process.env.VSCODE_LOGS || "";
    if (c && e && "trace" === process.env.VSCODE_LOG_LEVEL) {
      c = M_path.join(c, e + ".txt");
      this.logStream = M_fs.createWriteStream(c, {
        flags: "a",
        encoding: "utf8",
        autoClose: !0,
      });
    }
    this.updateUserOptIn(n);
    if (undefined !== M_vscode.env.onDidChangeTelemetryEnabled) {
      this.optOutListener = M_vscode.env.onDidChangeTelemetryEnabled(
        function () {
          return a.updateUserOptIn(n);
        }
      );
    } else {
      this.optOutListener = M_vscode.workspace.onDidChangeConfiguration(
        function () {
          return a.updateUserOptIn(n);
        }
      );
    }
  }
  e.prototype.updateUserOptIn = function (t) {
    var n = M_vscode.workspace.getConfiguration(e.TELEMETRY_CONFIG_ID);
    var r =
      undefined === M_vscode.env.isTelemetryEnabled
        ? n.get(e.TELEMETRY_CONFIG_ENABLED_ID, !0)
        : M_vscode.env.isTelemetryEnabled;
    if (this.userOptIn !== r) {
      this.userOptIn = r;
      if (this.userOptIn) {
        this.createAppInsightsClient(t);
      } else {
        this.dispose();
      }
    }
  };
  e.prototype.createAppInsightsClient = function (e) {
    if (M_telemetry_client_manager.defaultClient) {
      this.appInsightsClient = new M_telemetry_client_manager.TelemetryClient(
        e
      );
      this.appInsightsClient.channel.setUseDiskRetryCaching(!0);
    } else {
      M_telemetry_client_manager.setup(e)
        .setAutoCollectRequests(!1)
        .setAutoCollectPerformance(!1)
        .setAutoCollectExceptions(!1)
        .setAutoCollectDependencies(!1)
        .setAutoDependencyCorrelation(!1)
        .setAutoCollectConsole(!1)
        .setUseDiskRetryCaching(!0)
        .start();
      this.appInsightsClient = M_telemetry_client_manager.defaultClient;
    }
    this.appInsightsClient.commonProperties = this.getCommonProperties();
    if (M_vscode && M_vscode.env) {
      this.appInsightsClient.context.tags[
        this.appInsightsClient.context.keys.userId
      ] = M_vscode.env.machineId;
      this.appInsightsClient.context.tags[
        this.appInsightsClient.context.keys.sessionId
      ] = M_vscode.env.sessionId;
    }
    if (e && 0 === e.indexOf("AIF-")) {
      this.appInsightsClient.config.endpointUrl =
        "https://vortex.data.microsoft.com/collect/v1";
      this.firstParty = !0;
    }
  };
  e.prototype.getCommonProperties = function () {
    var e = Object.create(null);
    e["common.os"] = M_os.platform();
    e["common.platformversion"] = (M_os.release() || "").replace(
      /^(\d+)(\.\d+)?(\.\d+)?(.*)/,
      "$1$2$3"
    );
    e["common.extname"] = this.extensionId;
    e["common.extversion"] = this.extensionVersion;
    if (M_vscode && M_vscode.env) {
      switch (
        ((e["common.vscodemachineid"] = M_vscode.env.machineId),
        (e["common.vscodesessionid"] = M_vscode.env.sessionId),
        (e["common.vscodeversion"] = M_vscode.version),
        (e["common.isnewappinstall"] = M_vscode.env.isNewAppInstall),
        M_vscode.env.uiKind)
      ) {
        case M_vscode.UIKind.Web:
          e["common.uikind"] = "web";
          break;
        case M_vscode.UIKind.Desktop:
          e["common.uikind"] = "desktop";
          break;
        default:
          e["common.uikind"] = "unknown";
      }
      e["common.remotename"] = this.cleanRemoteName(M_vscode.env.remoteName);
    }
    return e;
  };
  e.prototype.cleanRemoteName = function (e) {
    if (!e) return "none";
    var t = "other";
    ["ssh-remote", "dev-container", "attached-container", "wsl"].forEach(
      function (n) {
        if (0 === e.indexOf(n + "+")) {
          t = n;
        }
      }
    );
    return t;
  };
  e.prototype.shouldSendErrorTelemetry = function () {
    return (
      !this.firstParty ||
      "other" !== this.cleanRemoteName(M_vscode.env.remoteName) ||
      (undefined !== this.extension &&
        this.extension.extensionKind !== M_vscode.ExtensionKind.Workspace &&
        M_vscode.env.uiKind !== M_vscode.UIKind.Web)
    );
  };
  Object.defineProperty(e.prototype, "extension", {
    get: function () {
      if (undefined === this._extension) {
        this._extension = M_vscode.extensions.getExtension(this.extensionId);
      }
      return this._extension;
    },
    enumerable: !1,
    configurable: !0,
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
    var n = [
      new RegExp(
        M_vscode.env.appRoot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "gi"
      ),
    ];
    if (this.extension) {
      n.push(
        new RegExp(
          this.extension.extensionPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          "gi"
        )
      );
    }
    var r = e;
    if (t) {
      for (o = [], i = 0, a = n, undefined; i < a.length; i++) {
        var o;
        var i;
        var a;
        for (var c = a[i]; ; ) {
          var l = c.exec(e);
          if (!l) break;
          o.push([l.index, c.lastIndex]);
        }
      }
      var u = /^[\\\/]?(node_modules|node_modules\.asar)[\\\/]/;
      var d =
        /(file:\/\/)?([a-zA-Z]:(\\\\|\\|\/)|(\\\\|\\|\/))?([\w-\._]+(\\\\|\\|\/))+[\w-\._]*/g;
      var p = 0;
      r = "";
      for (
        var h = function () {
          var t = d.exec(e);
          if (!t) return "break";
          if (
            !u.test(t[0]) &&
            o.every(function (e) {
              var n = e[0];
              var r = e[1];
              return t.index < n || t.index >= r;
            })
          ) {
            r += e.substring(p, t.index) + "<REDACTED: user-file-path>";
            p = d.lastIndex;
          }
        };
        "break" !== h();

      );
      if (p < e.length) {
        r += e.substr(p);
      }
    }
    for (f = 0, m = n, undefined; f < m.length; f++) {
      var f;
      var m;
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
        measurements: n,
      });
      if (this.logStream) {
        this.logStream.write(
          "telemetry/" +
            e +
            " " +
            JSON.stringify({
              properties: t,
              measurements: n,
            }) +
            "\n"
        );
      }
    }
  };
  e.prototype.sendTelemetryErrorEvent = function (e, t, n, r) {
    var o = this;
    if (this.userOptIn && e && this.appInsightsClient) {
      var i = this.cloneAndChange(t, function (e, t) {
        return o.shouldSendErrorTelemetry()
          ? o.anonymizeFilePaths(t, o.firstParty)
          : undefined === r || -1 !== r.indexOf(e)
          ? "REDACTED"
          : o.anonymizeFilePaths(t, o.firstParty);
      });
      this.appInsightsClient.trackEvent({
        name: this.extensionId + "/" + e,
        properties: i,
        measurements: n,
      });
      if (this.logStream) {
        this.logStream.write(
          "telemetry/" +
            e +
            " " +
            JSON.stringify({
              properties: t,
              measurements: n,
            }) +
            "\n"
        );
      }
    }
  };
  e.prototype.sendTelemetryException = function (e, t, n) {
    var r = this;
    if (
      this.shouldSendErrorTelemetry() &&
      this.userOptIn &&
      e &&
      this.appInsightsClient
    ) {
      var o = this.cloneAndChange(t, function (e, t) {
        return r.anonymizeFilePaths(t, r.firstParty);
      });
      this.appInsightsClient.trackException({
        exception: e,
        properties: o,
        measurements: n,
      });
      if (this.logStream) {
        this.logStream.write(
          "telemetry/" +
            e.name +
            " " +
            e.message +
            " " +
            JSON.stringify({
              properties: t,
              measurements: n,
            }) +
            "\n"
        );
      }
    }
  };
  e.prototype.dispose = function () {
    var e = this;
    this.optOutListener.dispose();
    var t = new Promise(function (t) {
      if (!e.logStream) return t(undefined);
      e.logStream.on("finish", t);
      e.logStream.end();
    });
    var n = new Promise(function (t) {
      if (e.appInsightsClient) {
        e.appInsightsClient.flush({
          callback: function () {
            e.appInsightsClient = undefined;
            t(undefined);
          },
        });
      } else {
        t(undefined);
      }
    });
    return Promise.all([n, t]);
  };
  e.TELEMETRY_CONFIG_ID = "telemetry";
  e.TELEMETRY_CONFIG_ENABLED_ID = "enableTelemetry";
  return e;
})();
exports.default = c;
