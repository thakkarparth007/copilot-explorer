const { Readable: r } = require("stream"),
  o = require(3055_404),
  {
    types: { isAnyArrayBuffer: i },
  } = require("util"),
  s = require(8348),
  a = require(8104)("helix-fetch:core"),
  { RequestAbortedError: c } = require(1787),
  l = require(9803),
  u = require(7262),
  d = require(3769),
  { isPlainObject: p } = require(4544),
  { isFormData: h, FormDataSerializer: f } = require(9407),
  { version: m } = require(5258),
  g = "h2",
  _ = "h2c",
  y = "http/1.0",
  v = "http/1.1",
  b = 100,
  w = 36e5,
  x = [g, v, y],
  E = `helix-fetch/${m}`,
  C = {
    method: "GET",
    compress: !0,
    decode: !0,
  };
let S = 0;
const T = d(),
  k = (e, t) =>
    new Promise((n, r) => {
      const { signal: i } = t;
      let s;
      const l = () => {
        i.removeEventListener("abort", l);
        const e = new c();
        r(e);
        if (s) {
          s.destroy(e);
        }
      };
      if (i) {
        if (i.aborted) return void r(new c());
        i.addEventListener("abort", l);
      }
      const u = +e.port || 443,
        d = (t) => {
          if (i) {
            i.removeEventListener("abort", l);
          }
          if (t instanceof c) {
            a(`connecting to ${e.hostname}:${u} failed with: ${t.message}`);
            r(t);
          }
        };
      s = o.connect(u, e.hostname, t);
      s.once("secureConnect", () => {
        if (i) {
          i.removeEventListener("abort", l);
        }
        s.off("error", d);
        S += 1;
        s.id = S;
        s.secureConnecting = !1;
        a(`established TLS connection: #${s.id} (${s.servername})`);
        n(s);
      });
      s.once("error", d);
    });
module.exports = {
  request: async (e, t, n) => {
    const o = new URL(t),
      s = {
        ...C,
        ...(n || {}),
      };
    let c;
    if ("string" == typeof s.method) {
      s.method = s.method.toUpperCase();
    }
    s.headers = ((e) => {
      const t = {};
      Object.keys(e).forEach((n) => {
        t[n.toLowerCase()] = e[n];
      });
      return t;
    })(s.headers || {});
    if (undefined === s.headers.host) {
      s.headers.host = o.host;
    }
    if (e.userAgent && undefined === s.headers["user-agent"]) {
      s.headers["user-agent"] = e.userAgent;
    }
    if (s.body instanceof URLSearchParams)
      (c = "application/x-www-form-urlencoded; charset=utf-8"),
        (s.body = s.body.toString());
    else if (h(s.body)) {
      const e = new f(s.body);
      (c = e.contentType()),
        (s.body = e.stream()),
        void 0 === s.headers["transfer-encoding"] &&
          void 0 === s.headers["content-length"] &&
          (s.headers["content-length"] = String(e.length()));
    } else
      "string" == typeof s.body || s.body instanceof String
        ? (c = "text/plain; charset=utf-8")
        : p(s.body)
        ? ((s.body = JSON.stringify(s.body)), (c = "application/json"))
        : i(s.body) && (s.body = Buffer.from(s.body));
    if (undefined === s.headers["content-type"] && undefined !== c) {
      s.headers["content-type"] = c;
    }
    if (null != s.body) {
      if (s.body instanceof r) {
        if (
          "string" == typeof s.body ||
          s.body instanceof String ||
          Buffer.isBuffer(s.body)
        ) {
          s.body = String(s.body);
        }
        if (
          undefined === s.headers["transfer-encoding"] &&
          undefined === s.headers["content-length"]
        ) {
          s.headers["content-length"] = String(
            Buffer.isBuffer(s.body)
              ? s.body.length
              : Buffer.byteLength(s.body, "utf-8")
          );
        }
      }
    }
    if (undefined === s.headers.accept) {
      s.headers.accept = "*/*";
    }
    if (null == s.body && ["POST", "PUT"].includes(s.method)) {
      s.headers["content-length"] = "0";
    }
    if (s.compress && undefined === s.headers["accept-encoding"]) {
      s.headers["accept-encoding"] = "gzip,deflate,br";
    }
    const { signal: d } = s,
      { protocol: m, socket: b = null } = e.socketFactory
        ? await (async (e, t, n, r) => {
            const o = "https:" === t.protocol;
            let i;
            i = t.port ? t.port : o ? 443 : 80;
            const s = {
                ...n,
                host: t.host,
                port: i,
              },
              a = await e(s);
            if (o) {
              const e = {
                ...s,
                ALPNProtocols: r,
              };
              e.socket = a;
              const n = await k(t, e);
              return {
                protocol: n.alpnProtocol || v,
                socket: n,
              };
            }
            return {
              protocol: a.alpnProtocol || v,
              socket: a,
            };
          })(e.socketFactory, o, s, e.alpnProtocols)
        : await (async (e, t, n) => {
            const r = `${t.protocol}//${t.host}`;
            let o = e.alpnCache.get(r);
            if (o)
              return {
                protocol: o,
              };
            switch (t.protocol) {
              case "http:":
                o = v;
                e.alpnCache.set(r, o);
                return {
                  protocol: o,
                };
              case "http2:":
                o = _;
                e.alpnCache.set(r, o);
                return {
                  protocol: o,
                };
              case "https:":
                break;
              default:
                throw new TypeError(`unsupported protocol: ${t.protocol}`);
            }
            const {
                options: { rejectUnauthorized: i, h1: s = {}, h2: a = {} },
              } = e,
              c = !(
                !1 === i ||
                !1 === s.rejectUnauthorized ||
                !1 === a.rejectUnauthorized
              ),
              l = {
                servername: t.hostname,
                ALPNProtocols: e.alpnProtocols,
                signal: n,
                rejectUnauthorized: c,
              },
              u = await (async (e, t) => {
                let n = await T.acquire(e.origin);
                try {
                  if (n) {
                    n = await k(e, t);
                  }
                  return n;
                } finally {
                  T.release(e.origin, n);
                }
              })(t, l);
            o = u.alpnProtocol;
            if (o) {
              o = v;
            }
            e.alpnCache.set(r, o);
            return {
              protocol: o,
              socket: u,
            };
          })(e, o, d);
    switch ((a(`${o.host} -> ${m}`), m)) {
      case g:
        try {
          return await u.request(
            e,
            o,
            b
              ? {
                  ...s,
                  socket: b,
                }
              : s
          );
        } catch (t) {
          const { code: n, message: r } = t;
          throw (
            ("ERR_HTTP2_ERROR" === n &&
              "Protocol error" === r &&
              e.alpnCache.delete(`${o.protocol}//${o.host}`),
            t)
          );
        }
      case _:
        return u.request(
          e,
          new URL(`http://${o.host}${o.pathname}${o.hash}${o.search}`),
          b
            ? {
                ...s,
                socket: b,
              }
            : s
        );
      case y:
      case v:
        return l.request(
          e,
          o,
          b
            ? {
                ...s,
                socket: b,
              }
            : s
        );
      default:
        throw new TypeError(`unsupported protocol: ${m}`);
    }
  },
  setupContext: (e) => {
    const {
      options: {
        alpnProtocols: t = x,
        alpnCacheTTL: n = w,
        alpnCacheSize: r = b,
        userAgent: o = E,
        socketFactory: i,
      },
    } = e;
    e.alpnProtocols = t;
    e.alpnCache = new s({
      max: r,
      ttl: n,
    });
    e.userAgent = o;
    e.socketFactory = i;
    l.setupContext(e);
    u.setupContext(e);
  },
  resetContext: async (e) => (
    e.alpnCache.clear(), Promise.all([l.resetContext(e), u.resetContext(e)])
  ),
  RequestAbortedError: c,
  ALPN_HTTP2: g,
  ALPN_HTTP2C: _,
  ALPN_HTTP1_1: v,
  ALPN_HTTP1_0: y,
};