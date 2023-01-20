Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.postRequest =
  exports.Response =
  exports.HelixFetcher =
  exports.isAbortError =
  exports.Fetcher =
  exports.init =
    undefined;
const r = require(6143);
const o = require(5468);
const i = require("util");
const s = require(1133);
const a = require(5413);
const c = require(6333);
let l;
let u = false;
exports.init = function (e) {
  if (u) {
    if (e !== l)
      throw new Error(
        `Networking re-initialized with mismatched version (old: ${l}, new: ${e})`
      );
  } else {
    l = e;
    u = true;
  }
};
class Fetcher {}
exports.Fetcher = Fetcher;
exports.isAbortError = function (e) {
  return e instanceof r.AbortError;
};
exports.HelixFetcher = class extends Fetcher {
  constructor(e) {
    super();
    this.ctx = e;
    this.createSocketFactory = (e) => {
      const t = o.httpOverHttp({
        proxy: e,
      });
      return (e) =>
        new Promise((n) => {
          t.createSocket(e, (e) => {
            n(e);
          });
        });
    };
    this.fetchApi = this.createFetchApi(e);
  }
  set proxySettings(e) {
    this._proxySettings = e;
    this.fetchApi = this.createFetchApi(this.ctx);
  }
  get proxySettings() {
    return this._proxySettings;
  }
  createFetchApi(e) {
    var t;
    const n = e.get(s.BuildInfo);
    if (
      false ===
      (null === (t = this._proxySettings) || undefined === t
        ? undefined
        : t.rejectUnauthorized)
    ) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    return r.context({
      userAgent: `GithubCopilot/${n.getVersion()}`,
      socketFactory: this._proxySettings
        ? this.createSocketFactory(this._proxySettings)
        : undefined,
    });
  }
  async fetch(e, t) {
    const n = {
      ...t,
      body: t.body ? t.body : t.json,
      signal: t.signal,
    };
    const r = await this.fetchApi.fetch(e, n);
    return new Response(
      r.status,
      r.statusText,
      r.headers,
      () => r.text(),
      () => r.json(),
      async () => r.body
    );
  }
  disconnectAll() {
    return this.fetchApi.reset();
  }
  makeAbortController() {
    return new r.AbortController();
  }
};
class Response {
  constructor(e, t, n, r, o, i) {
    this.status = e;
    this.statusText = t;
    this.headers = n;
    this.getText = r;
    this.getJson = o;
    this.getBody = i;
    this.ok = this.status >= 200 && this.status < 300;
  }
  async text() {
    return this.getText();
  }
  async json() {
    return this.getJson();
  }
  async body() {
    return this.getBody();
  }
}
exports.Response = Response;
exports.postRequest = function (e, t, n, r, o, l, p) {
  if (!u) throw new Error("Networking must be initialized before being used");
  const h = {
    Authorization: i.format("Bearer %s", n),
    "X-Request-Id": o,
    "Openai-Organization": "github-copilot",
    "VScode-SessionId": e.get(s.VscInfo).sessionId,
    "VScode-MachineId": e.get(s.VscInfo).machineId,
    ...s.editorVersionHeaders(e),
  };
  if (r) {
    h["OpenAI-Intent"] = r;
  }
  const f = e.get(a.GhostTextDebounceManager).forceDelayMs;
  if (f) {
    h["X-Copilot-Force-Delay"] = f.toString();
  }
  const m = {
    method: "POST",
    headers: h,
    json: l,
    timeout: 3e4,
  };
  const g = e.get(Fetcher);
  if (p) {
    const t = g.makeAbortController();
    p.onCancellationRequested(() => {
      c.telemetry(
        e,
        "networking.cancelRequest",
        c.TelemetryData.createAndMarkAsIssued({
          headerRequestId: o,
        })
      );
      t.abort();
    });
    m.signal = t.signal;
  }
  return g.fetch(t, m).catch((n) => {
    if (
      "ECONNRESET" == n.code ||
      "ETIMEDOUT" == n.code ||
      "ERR_HTTP2_INVALID_SESSION" == n.code ||
      "ERR_HTTP2_GOAWAY_SESSION" == n.message
    ) {
      c.telemetry(e, "networking.disconnectAll");
      return g.disconnectAll().then(() => g.fetch(t, m));
    }
    throw n;
  });
};