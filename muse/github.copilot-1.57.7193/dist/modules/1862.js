Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.VSCodeCopilotTokenManager =
  exports.ExtensionNotificationSender =
  exports.setExtensionContext =
  exports.telemetryAcceptanceKey =
    undefined;
const r = require(9496),
  o = require(362),
  i = require(6794),
  s = require(9899),
  a = require(6333),
  c = require(47);
exports.telemetryAcceptanceKey = `github.copilot.telemetryAccepted.${i.LAST_TELEMETRY_TERMS_UPDATE}`;
const l = new s.Logger(s.LogLevel.INFO, "auth");
let u,
  d = !1;
exports.setExtensionContext = function (e) {
  u = e;
};
exports.ExtensionNotificationSender = class {
  async showWarningMessage(e, ...t) {
    return {
      title: await r.window.showWarningMessage(e, ...t.map((e) => e.title)),
    };
  }
};
class VSCodeCopilotTokenManager extends o.CopilotTokenManager {
  constructor() {
    super();
    this.copilotToken = undefined;
  }
  async getGitHubToken() {
    const e = await c.getSession();
    return null == e ? undefined : e.accessToken;
  }
  async getCopilotToken(e, n) {
    if (
      !this.copilotToken ||
      this.copilotToken.expires_at < o.nowSeconds() ||
      n
    ) {
      this.copilotToken = await (async function (e) {
        var n;
        const s = await (async function (e) {
          const t = await c.getSession();
          if (!t) {
            l.info(e, "GitHub login failed");
            a.telemetryError(e, "auth.github_login_failed");
            return {
              kind: "failure",
              reason: "GitHubLoginFailed",
            };
          }
          l.debug(
            e,
            `Logged in as ${t.account.label}, oauth token ${t.accessToken}`
          );
          const n = await o.authFromGitHubToken(e, {
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
          throw (d || ((d = !0), r.window.showWarningMessage(e)), Error(e));
        }
        if ("failure" === s.kind) throw Error("Failed to get copilot token");
        if (
          "unconfigured" === s.telemetry &&
          !(await (async function (e) {
            var n;
            const o = null == u ? undefined : u.globalState;
            if (!o) return !1;
            const s =
              null === (n = c.getGithubAccount()) || undefined === n
                ? undefined
                : n.label;
            if (!s) return !1;
            const l = s,
              d = o.get(exports.telemetryAcceptanceKey, undefined);
            if (d && d === s) return !0;
            const p = await r.window.showWarningMessage(
              `I agree to these [telemetry terms](${i.TELEMETRY_TERMS_URL}) as part of the GitHub Copilot technical preview.`,
              "Cancel",
              "Agree"
            );
            if ("Agree" !== p) {
              const t = a.TelemetryData.createAndMarkAsIssued({
                choice: null != p ? p : "undefined",
              });
              a.telemetry(e, "auth.telemetry_terms_rejected", t);
              return !1;
            }
            o.update(exports.telemetryAcceptanceKey, l);
            const h = a.TelemetryData.createAndMarkAsIssued({
              terms_date: i.LAST_TELEMETRY_TERMS_UPDATE,
            });
            a.telemetry(e, "auth.telemetry_terms_accepted", h);
            return !0;
          })(e))
        )
          throw Error("User did not agree to telemetry");
        return s;
      })(e);
      o.refreshToken(e, this, this.copilotToken.refresh_in);
    }
    return this.copilotToken;
  }
  resetCopilotToken(e, t) {
    if (undefined !== t) {
      a.telemetry(e, "auth.reset_token_" + t);
    }
    l.debug(e, `Resetting copilot token on HTTP error ${t || "unknown"}`);
    this.copilotToken = undefined;
  }
}
exports.VSCodeCopilotTokenManager = VSCodeCopilotTokenManager;
