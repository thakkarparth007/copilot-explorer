Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.refreshToken =
  exports.CopilotTokenManagerFromGitHubToken =
  exports.FixedCopilotTokenManager =
  exports.CopilotTokenManager =
  exports.setTelemetryConfigFromTokenInfo =
  exports.extractTrackingIdFromToken =
  exports.authFromGitHubToken =
  exports.nowSeconds =
  exports.TOKEN_REFRESHED_EVENT =
    undefined;
const r = require("events");
const o = require(1133);
const i = require(9899);
const s = require(2279);
const a = require(1547);
const c = require(6333);
const l = require(7057);
const u = new i.Logger(i.LogLevel.INFO, "auth");
let d = 0;
function nowSeconds() {
  return Math.floor(Date.now() / 1e3);
}
async function authFromGitHubToken(e, t) {
  var n;
  var r;
  c.telemetry(e, "auth.new_login");
  const i =
    null !==
      (r =
        null === (n = t.devOverride) || undefined === n
          ? undefined
          : n.copilotTokenUrl) && undefined !== r
      ? r
      : "https://api.github.com/copilot_internal/v2/token";
  const a = await e.get(s.Fetcher).fetch(i, {
    headers: {
      Authorization: `token ${t.token}`,
      ...o.editorVersionHeaders(e),
    },
  });
  if (!a) {
    u.info(e, "Failed to get copilot token");
    c.telemetryError(e, "auth.request_failed");
    return {
      kind: "failure",
      reason: "FailedToGetToken",
    };
  }
  const l = await a.json();
  if (!l) {
    u.info(e, "Failed to get copilot token");
    c.telemetryError(e, "auth.request_read_failed");
    return {
      kind: "failure",
      reason: "FailedToGetToken",
    };
  }
  m(e, l.user_notification, t);
  if (401 === a.status)
    return (
      u.info(e, "Failed to get copilot token due to 401 status"),
      (0, c.telemetryError)(e, "auth.unknown_401"),
      {
        kind: "failure",
        reason: "HTTP401",
      }
    );
  if (!a.ok || !l.token) {
    u.info(
      e,
      `Invalid copilot token: missing token: ${a.status} ${a.statusText}`
    );
    c.telemetryError(
      e,
      "auth.invalid_token",
      c.TelemetryData.createAndMarkAsIssued({
        status: a.status.toString(),
        status_text: a.statusText,
      })
    );
    const n = l.error_details;
    m(e, n, t);
    return {
      kind: "failure",
      reason: "NotAuthorized",
      ...n,
    };
  }
  const d = l.expires_at;
  l.expires_at = nowSeconds() + l.refresh_in + 60;
  e.get(c.TelemetryReporters).setToken(l);
  setTelemetryConfigFromTokenInfo(l);
  c.telemetry(
    e,
    "auth.new_token",
    c.TelemetryData.createAndMarkAsIssued(
      {},
      {
        adjusted_expires_at: l.expires_at,
        expires_at: d,
        current_time: nowSeconds(),
      }
    )
  );
  return {
    kind: "success",
    ...l,
  };
}
exports.TOKEN_REFRESHED_EVENT = "token_refreshed";
exports.nowSeconds = nowSeconds;
exports.authFromGitHubToken = authFromGitHubToken;
const f = new Map();
function m(e, t, n) {
  if (!t) return;
  const r = nowSeconds();
  if (f.get(t.message)) {
    f.set(t.message, r);
    e.get(a.NotificationSender)
      .showWarningMessage(
        t.message,
        {
          title: t.title,
        },
        {
          title: "Dismiss",
        }
      )
      .catch((t) => {
        console.error(t);
        u.error(e, `Error while sending notification: ${t.message}`);
      })
      .then(async (r) => {
        const i = (null == r ? undefined : r.title) === t.title;
        const a = i || "Dismiss" === (null == r ? undefined : r.title);
        if (i) {
          const n = e.get(o.EditorAndPluginInfo).getEditorPluginInfo(e);
          const r = t.url.replace(
            "{EDITOR}",
            encodeURIComponent(n.name + "_" + n.version)
          );
          await e.get(l.UrlOpener).open(r);
        }
        if ("notification_id" in t && a) {
          await (async function (e, t, n) {
            var r;
            var i;
            const a =
              null !==
                (i =
                  null === (r = n.devOverride) || undefined === r
                    ? undefined
                    : r.notificationUrl) && undefined !== i
                ? i
                : "https://api.github.com/copilot_internal/notification";
            const c = await e.get(s.Fetcher).fetch(a, {
              headers: {
                Authorization: `token ${n.token}`,
                ...o.editorVersionHeaders(e),
              },
              method: "POST",
              body: JSON.stringify({
                notification_id: t,
              }),
            });
            if (c && c.ok) {
              u.error(
                e,
                `Failed to send notification result to GitHub: ${
                  null == c ? undefined : c.status
                } ${null == c ? undefined : c.statusText}`
              );
            }
          })(e, t.notification_id, n);
        }
      });
  }
}
function extractTrackingIdFromToken(e) {
  const t = null == e ? undefined : e.split(":")[0];
  const n = null == t ? undefined : t.split(";");
  for (const e of n) {
    const [t, n] = e.split("=");
    if ("tid" === t) return n;
  }
}
function setTelemetryConfigFromTokenInfo(e) {
  const t = extractTrackingIdFromToken(e.token);
  if (undefined !== t) {
    c.setTelemetryConfig({
      trackingId: t,
      optedIn: "enabled" === e.telemetry || "unconfigured" === e.telemetry,
    });
  }
}
exports.extractTrackingIdFromToken = extractTrackingIdFromToken;
exports.setTelemetryConfigFromTokenInfo = setTelemetryConfigFromTokenInfo;
class CopilotTokenManager {
  constructor() {
    this.tokenRefreshEventEmitter = new r.EventEmitter();
  }
}
function refreshToken(e, n, r) {
  const o = nowSeconds();
  if (d > 0) {
    d++;
    setTimeout(async () => {
      let r;
      let i = "";
      try {
        d--;
        await n.getCopilotToken(e, !0);
        r = "success";
        n.tokenRefreshEventEmitter.emit(exports.TOKEN_REFRESHED_EVENT);
      } catch (e) {
        r = "failure";
        i = e.toString();
      }
      const s = c.TelemetryData.createAndMarkAsIssued(
        {
          result: r,
        },
        {
          time_taken: nowSeconds() - o,
          refresh_count: d,
        }
      );
      if (i) {
        s.properties.reason = i;
      }
      c.telemetry(e, "auth.token_refresh", s);
    }, 1e3 * r);
  }
}
exports.CopilotTokenManager = CopilotTokenManager;
exports.FixedCopilotTokenManager = class extends CopilotTokenManager {
  constructor(e) {
    super();
    this.tokenInfo = e;
    this.wasReset = !1;
    setTelemetryConfigFromTokenInfo(e);
  }
  async getGitHubToken() {
    return Promise.resolve("token");
  }
  async getCopilotToken(e, t) {
    return this.tokenInfo;
  }
  resetCopilotToken(e, t) {
    this.wasReset = !0;
  }
  async checkCopilotToken(e) {
    return {
      status: "OK",
      telemetry: this.tokenInfo.telemetry,
    };
  }
};
exports.CopilotTokenManagerFromGitHubToken = class extends CopilotTokenManager {
  constructor(e) {
    super();
    this.githubToken = e;
    this.copilotToken = undefined;
  }
  async getGitHubToken() {
    return Promise.resolve(this.githubToken.token);
  }
  async getCopilotToken(e, t) {
    var n;
    if (
      !this.copilotToken ||
      this.copilotToken.expires_at < nowSeconds() ||
      t
    ) {
      const t = await authFromGitHubToken(e, this.githubToken);
      if ("failure" === t.kind)
        throw Error(
          `Failed to get copilot token: ${t.reason.toString()} ${
            null !== (n = t.message) && undefined !== n ? n : ""
          }`
        );
      this.copilotToken = {
        ...t,
      };
      refreshToken(e, this, t.refresh_in);
    }
    return this.copilotToken;
  }
  async checkCopilotToken(e) {
    if (!this.copilotToken || this.copilotToken.expires_at < nowSeconds()) {
      const t = await authFromGitHubToken(e, this.githubToken);
      if ("failure" === t.kind) return t;
      this.copilotToken = {
        ...t,
      };
      refreshToken(e, this, t.refresh_in);
    }
    return {
      status: "OK",
      telemetry: this.copilotToken.telemetry,
    };
  }
  resetCopilotToken(e, t) {
    if (undefined !== t) {
      c.telemetry(e, "auth.reset_token_" + t);
    }
    u.debug(e, `Resetting copilot token on HTTP error ${t || "unknown"}`);
    this.copilotToken = undefined;
  }
};
exports.refreshToken = refreshToken;