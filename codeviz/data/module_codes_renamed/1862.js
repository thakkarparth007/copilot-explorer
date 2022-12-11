Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.VSCodeCopilotTokenManager =
  exports.ExtensionNotificationSender =
  exports.setExtensionContext =
  exports.telemetryAcceptanceKey =
    undefined;
const M_vscode = require("vscode");
const M_copilot_github_auth_stuff = require("copilot-github-auth-stuff");
const M_telemetry_constants_maybe = require("telemetry-constants");
const M_logging_utils = require("logging-utils");
const M_telemetry_stuff = require("telemetry-stuff");
const M_github_auth_maybe = require("github-auth");
exports.telemetryAcceptanceKey = `github.copilot.telemetryAccepted.${M_telemetry_constants_maybe.LAST_TELEMETRY_TERMS_UPDATE}`;
const l = new M_logging_utils.Logger(M_logging_utils.LogLevel.INFO, "auth");
let u;
let d = !1;
exports.setExtensionContext = function (e) {
  u = e;
};
exports.ExtensionNotificationSender = class {
  async showWarningMessage(e, ...t) {
    return {
      title: await M_vscode.window.showWarningMessage(
        e,
        ...t.map((e) => e.title)
      ),
    };
  }
};
class VSCodeCopilotTokenManager extends M_copilot_github_auth_stuff.CopilotTokenManager {
  constructor() {
    super();
    this.copilotToken = undefined;
  }
  async getGitHubToken() {
    const e = await M_github_auth_maybe.getSession();
    return null == e ? undefined : e.accessToken;
  }
  async getCopilotToken(e, n) {
    if (
      !this.copilotToken ||
      this.copilotToken.expires_at < M_copilot_github_auth_stuff.nowSeconds() ||
      n
    ) {
      this.copilotToken = await (async function (e) {
        var n;
        const s = await (async function (e) {
          const t = await M_github_auth_maybe.getSession();
          if (!t) {
            l.info(e, "GitHub login failed");
            M_telemetry_stuff.telemetryError(e, "auth.github_login_failed");
            return {
              kind: "failure",
              reason: "GitHubLoginFailed",
            };
          }
          l.debug(
            e,
            `Logged in as ${t.account.label}, oauth token ${t.accessToken}`
          );
          const n = await M_copilot_github_auth_stuff.authFromGitHubToken(e, {
            token: t.accessToken,
          });
          if ("success" == n.kind) {
            const r = n.token;
            l.debug(e, `Copilot HMAC for ${t.account.label}: ${r}`);
          }
          return n;
        })(e);
        if ("failure" === s.kind && "NotAuthorized" === s.reason)
          throw Error(
            null !== (n = s.message) && undefined !== n
              ? n
              : "User not authorized"
          );
        if ("failure" === s.kind && "HTTP401" === s.reason) {
          const e =
            "Your GitHub token is invalid. Please sign out from your GitHub account using VSCode UI and try again.";
          throw (
            (d || ((d = !0), M_vscode.window.showWarningMessage(e)), Error(e))
          );
        }
        if ("failure" === s.kind) throw Error("Failed to get copilot token");
        if (
          "unconfigured" === s.telemetry &&
          !(await (async function (e) {
            var n;
            const o = null == u ? undefined : u.globalState;
            if (!o) return !1;
            const s =
              null === (n = M_github_auth_maybe.getGithubAccount()) ||
              undefined === n
                ? undefined
                : n.label;
            if (!s) return !1;
            const l = s;
            const d = o.get(exports.telemetryAcceptanceKey, undefined);
            if (d && d === s) return !0;
            const p = await M_vscode.window.showWarningMessage(
              `I agree to these [telemetry terms](${M_telemetry_constants_maybe.TELEMETRY_TERMS_URL}) as part of the GitHub Copilot technical preview.`,
              "Cancel",
              "Agree"
            );
            if ("Agree" !== p) {
              const t = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
                choice: null != p ? p : "undefined",
              });
              M_telemetry_stuff.telemetry(
                e,
                "auth.telemetry_terms_rejected",
                t
              );
              return !1;
            }
            o.update(exports.telemetryAcceptanceKey, l);
            const h = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
              terms_date:
                M_telemetry_constants_maybe.LAST_TELEMETRY_TERMS_UPDATE,
            });
            M_telemetry_stuff.telemetry(e, "auth.telemetry_terms_accepted", h);
            return !0;
          })(e))
        )
          throw Error("User did not agree to telemetry");
        return s;
      })(e);
      M_copilot_github_auth_stuff.refreshToken(
        e,
        this,
        this.copilotToken.refresh_in
      );
    }
    return this.copilotToken;
  }
  resetCopilotToken(e, t) {
    if (undefined !== t) {
      M_telemetry_stuff.telemetry(e, "auth.reset_token_" + t);
    }
    l.debug(e, `Resetting copilot token on HTTP error ${t || "unknown"}`);
    this.copilotToken = undefined;
  }
}
exports.VSCodeCopilotTokenManager = VSCodeCopilotTokenManager;
