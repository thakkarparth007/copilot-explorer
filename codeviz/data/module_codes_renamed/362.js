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
const r = require("events"),
  M_config_stuff = require("config-stuff"),
  M_logging_utils = require("logging-utils"),
  M_helix_fetcher_and_network_stuff = require("helix-fetcher-and-network-stuff"),
  M_notification_sender_NOTSURE = require("notification-sender"),
  M_telemetry_stuff = require("telemetry-stuff"),
  M_url_opener = require("url-opener"),
  u = new M_logging_utils.Logger(M_logging_utils.LogLevel.INFO, "auth");
let d = 0;
function nowSeconds() {
  return Math.floor(Date.now() / 1e3);
}
async function authFromGitHubToken(e, t) {
  var n, r;
  M_telemetry_stuff.telemetry(e, "auth.new_login");
  const i =
      null !==
        (r =
          null === (n = t.devOverride) || undefined === n
            ? undefined
            : n.copilotTokenUrl) && undefined !== r
        ? r
        : "https://api.github.com/copilot_internal/v2/token",
    a = await e.get(M_helix_fetcher_and_network_stuff.Fetcher).fetch(i, {
      headers: {
        Authorization: `token ${t.token}`,
        ...M_config_stuff.editorVersionHeaders(e),
      },
    });
  if (!a) {
    u.info(e, "Failed to get copilot token");
    M_telemetry_stuff.telemetryError(e, "auth.request_failed");
    return {
      kind: "failure",
      reason: "FailedToGetToken",
    };
  }
  const l = await a.json();
  if (!l) {
    u.info(e, "Failed to get copilot token");
    M_telemetry_stuff.telemetryError(e, "auth.request_read_failed");
    return {
      kind: "failure",
      reason: "FailedToGetToken",
    };
  }
  m(e, l.user_notification, t);
  if (401 === a.status)
    return (
      u.info(e, "Failed to get copilot token due to 401 status"),
      (0, M_telemetry_stuff.telemetryError)(e, "auth.unknown_401"),
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
    M_telemetry_stuff.telemetryError(
      e,
      "auth.invalid_token",
      M_telemetry_stuff.TelemetryData.createAndMarkAsIssued({
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
  e.get(M_telemetry_stuff.TelemetryReporters).setToken(l);
  setTelemetryConfigFromTokenInfo(l);
  M_telemetry_stuff.telemetry(
    e,
    "auth.new_token",
    M_telemetry_stuff.TelemetryData.createAndMarkAsIssued(
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
    e.get(M_notification_sender_NOTSURE.NotificationSender)
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
        const i = (null == r ? undefined : r.title) === t.title,
          a = i || "Dismiss" === (null == r ? undefined : r.title);
        if (i) {
          const n = e
              .get(M_config_stuff.EditorAndPluginInfo)
              .getEditorPluginInfo(e),
            r = t.url.replace(
              "{EDITOR}",
              encodeURIComponent(n.name + "_" + n.version)
            );
          await e.get(M_url_opener.UrlOpener).open(r);
        }
        if ("notification_id" in t && a) {
          await (async function (e, t, n) {
            var r, i;
            const a =
                null !==
                  (i =
                    null === (r = n.devOverride) || undefined === r
                      ? undefined
                      : r.notificationUrl) && undefined !== i
                  ? i
                  : "https://api.github.com/copilot_internal/notification",
              c = await e
                .get(M_helix_fetcher_and_network_stuff.Fetcher)
                .fetch(a, {
                  headers: {
                    Authorization: `token ${n.token}`,
                    ...M_config_stuff.editorVersionHeaders(e),
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
  const t = null == e ? undefined : e.split(":")[0],
    n = null == t ? undefined : t.split(";");
  for (const e of n) {
    const [t, n] = e.split("=");
    if ("tid" === t) return n;
  }
}
function setTelemetryConfigFromTokenInfo(e) {
  const t = extractTrackingIdFromToken(e.token);
  if (undefined !== t) {
    M_telemetry_stuff.setTelemetryConfig({
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
      let r,
        i = "";
      try {
        d--;
        await n.getCopilotToken(e, !0);
        r = "success";
        n.tokenRefreshEventEmitter.emit(exports.TOKEN_REFRESHED_EVENT);
      } catch (e) {
        r = "failure";
        i = e.toString();
      }
      const s = M_telemetry_stuff.TelemetryData.createAndMarkAsIssued(
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
      M_telemetry_stuff.telemetry(e, "auth.token_refresh", s);
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
      M_telemetry_stuff.telemetry(e, "auth.reset_token_" + t);
    }
    u.debug(e, `Resetting copilot token on HTTP error ${t || "unknown"}`);
    this.copilotToken = undefined;
  }
};
exports.refreshToken = refreshToken;
