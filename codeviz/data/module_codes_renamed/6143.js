const { EventEmitter: r } = require("events"),
  { Readable: o } = require("stream"),
  i = require("clipboard")("helix-fetch"),
  M_abort_controller_NOTSURE = require("abort-controller"),
  { Body: a } = require("body"),
  { Headers: c } = require("headers"),
  { Request: l } = require("request"),
  { Response: u } = require("response-wrapper"),
  { FetchBaseError: d, FetchError: p, AbortError: h } = require("fetch-errors"),
  {
    AbortController: f,
    AbortSignal: m,
    TimeoutSignal: g,
  } = require("abort-controller"),
  M_cache_policy_NOTSURE = require("cache-policy"),
  { cacheableResponse: y } = require("cacheable-response"),
  { sizeof: v } = require("fetch-utils"),
  { isFormData: b } = require("form-data-utils"),
  { context: w, RequestAbortedError: x } = require("helix-fetch"),
  E = ["GET", "HEAD"],
  C = "push",
  S = async (e, t, n) => {
    const { request: r } = e.context,
      i = t instanceof l && undefined === n ? t : new l(t, n),
      {
        method: s,
        body: a,
        signal: d,
        compress: f,
        decode: m,
        follow: g,
        redirect: _,
        init: { body: y },
      } = i;
    let v;
    if (d && d.aborted) {
      const e = new h("The operation was aborted.");
      throw (i.init.body instanceof o && i.init.body.destroy(e), e);
    }
    try {
      v = await r(i.url, {
        ...n,
        method: s,
        headers: i.headers.plain(),
        body: !y || y instanceof o || b(y) ? a : y,
        compress: f,
        decode: m,
        follow: g,
        redirect: _,
        signal: d,
      });
    } catch (e) {
      if (y instanceof o) {
        y.destroy(e);
      }
      if (e instanceof TypeError) throw e;
      if (e instanceof x) throw new h("The operation was aborted.");
      throw new p(e.message, "system", e);
    }
    const w = () => {
      d.removeEventListener("abort", w);
      const e = new h("The operation was aborted.");
      if (i.init.body instanceof o) {
        i.init.body.destroy(e);
      }
      v.readable.emit("error", e);
    };
    if (d) {
      d.addEventListener("abort", w);
    }
    const {
      statusCode: E,
      statusText: C,
      httpVersion: T,
      headers: k,
      readable: I,
      decoded: P,
    } = v;
    if ([301, 302, 303, 307, 308].includes(E)) {
      const { location: t } = k,
        n = null == t ? null : new URL(t, i.url);
      switch (i.redirect) {
        case "manual":
          break;
        case "error":
          throw (
            (d && d.removeEventListener("abort", w),
            new p(
              `uri requested responds with a redirect, redirect mode is set to 'error': ${i.url}`,
              "no-redirect"
            ))
          );
        case "follow": {
          if (null === n) break;
          if (i.counter >= i.follow)
            throw (
              (d && d.removeEventListener("abort", w),
              new p(`maximum redirect reached at: ${i.url}`, "max-redirect"))
            );
          const t = {
            headers: new c(i.headers),
            follow: i.follow,
            compress: i.compress,
            decode: i.decode,
            counter: i.counter + 1,
            method: i.method,
            body: i.body,
            signal: i.signal,
          };
          if (303 !== E && i.body && i.init.body instanceof o)
            throw (
              (d && d.removeEventListener("abort", w),
              new p(
                "Cannot follow redirect with body being a readable stream",
                "unsupported-redirect"
              ))
            );
          if (303 !== E && ((301 !== E && 302 !== E) || "POST" !== i.method)) {
            t.method = "GET";
            t.body = undefined;
            t.headers.delete("content-length");
          }
          if (d) {
            d.removeEventListener("abort", w);
          }
          return S(e, new l(n, t));
        }
      }
    }
    if (d) {
      I.once("end", () => {
        d.removeEventListener("abort", w);
      });
      I.once("error", () => {
        d.removeEventListener("abort", w);
      });
    }
    return new u(I, {
      url: i.url,
      status: E,
      statusText: C,
      headers: k,
      httpVersion: T,
      decoded: P,
      counter: i.counter,
    });
  },
  T = async (e, t, n) => {
    if (0 === e.options.maxCacheSize) return n;
    if (!E.includes(t.method)) return n;
    const r = new M_cache_policy_NOTSURE(t, n, {
      shared: !1,
    });
    if (r.storable()) {
      const o = await y(n);
      e.cache.set(
        t.url,
        {
          policy: r,
          response: o,
        },
        r.timeToLive()
      );
      return o;
    }
    return n;
  },
  k = (e, t = {}) => {
    const n = new URL(e);
    if ("object" != typeof t || Array.isArray(t))
      throw new TypeError("qs: object expected");
    Object.entries(t).forEach(([e, t]) => {
      if (Array.isArray(t)) {
        t.forEach((t) => n.searchParams.append(e, t));
      } else {
        n.searchParams.append(e, t);
      }
    });
    return n.href;
  },
  I = (e) => new g(e);
class P {
  constructor(e) {
    this.options = {
      ...e,
    };
    const { maxCacheSize: t } = this.options;
    let n = "number" == typeof t && t >= 0 ? t : 104857600,
      o = 500;
    if (0 === n) {
      n = 1;
      o = 1;
    }
    this.cache = new M_abort_controller_NOTSURE({
      max: o,
      maxSize: n,
      sizeCalculation: ({ response: e }, t) => v(e),
    });
    this.eventEmitter = new r();
    this.options.h2 = this.options.h2 || {};
    if (undefined === this.options.h2.enablePush) {
      this.options.h2.enablePush = !0;
    }
    const { enablePush: i } = this.options.h2;
    if (i) {
      this.options.h2.pushPromiseHandler = (e, t, n) => {
        const r = {
          ...t,
        };
        Object.keys(r)
          .filter((e) => e.startsWith(":"))
          .forEach((e) => delete r[e]);
        this.pushPromiseHandler(e, r, n);
      };
      this.options.h2.pushHandler = (e, t, n) => {
        const r = {
          ...t,
        };
        Object.keys(r)
          .filter((e) => e.startsWith(":"))
          .forEach((e) => delete r[e]);
        const {
          statusCode: o,
          statusText: i,
          httpVersion: s,
          headers: a,
          readable: c,
          decoded: l,
        } = n;
        this.pushHandler(
          e,
          r,
          new u(c, {
            url: e,
            status: o,
            statusText: i,
            headers: a,
            httpVersion: s,
            decoded: l,
          })
        );
      };
    }
    this.context = w(this.options);
  }
  api() {
    return {
      fetch: async (e, t) => this.fetch(e, t),
      Body: a,
      Headers: c,
      Request: l,
      Response: u,
      AbortController: f,
      AbortSignal: m,
      FetchBaseError: d,
      FetchError: p,
      AbortError: h,
      context: (e = {}) => new P(e).api(),
      noCache: (e = {}) =>
        new P({
          ...e,
          maxCacheSize: 0,
        }).api(),
      h1: (e = {}) =>
        new P({
          ...e,
          alpnProtocols: [this.context.ALPN_HTTP1_1],
        }).api(),
      keepAlive: (e = {}) =>
        new P({
          ...e,
          alpnProtocols: [this.context.ALPN_HTTP1_1],
          h1: {
            keepAlive: !0,
          },
        }).api(),
      h1NoCache: (e = {}) =>
        new P({
          ...e,
          maxCacheSize: 0,
          alpnProtocols: [this.context.ALPN_HTTP1_1],
        }).api(),
      keepAliveNoCache: (e = {}) =>
        new P({
          ...e,
          maxCacheSize: 0,
          alpnProtocols: [this.context.ALPN_HTTP1_1],
          h1: {
            keepAlive: !0,
          },
        }).api(),
      reset: async () => this.context.reset(),
      onPush: (e) => this.onPush(e),
      offPush: (e) => this.offPush(e),
      createUrl: k,
      timeoutSignal: I,
      clearCache: () => this.clearCache(),
      cacheStats: () => this.cacheStats(),
      ALPN_HTTP2: this.context.ALPN_HTTP2,
      ALPN_HTTP2C: this.context.ALPN_HTTP2C,
      ALPN_HTTP1_1: this.context.ALPN_HTTP1_1,
      ALPN_HTTP1_0: this.context.ALPN_HTTP1_0,
    };
  }
  async fetch(e, t) {
    return (async (e, t, n) => {
      const r = new l(t, n);
      if (
        0 !== e.options.maxCacheSize &&
        E.includes(r.method) &&
        !["no-store", "reload"].includes(r.cache)
      ) {
        const { policy: t, response: n } = e.cache.get(r.url) || {};
        if (t && t.satisfiesWithoutRevalidation(r)) {
          n.headers = new c(t.responseHeaders(n));
          const e = n.clone();
          e.fromCache = !0;
          return e;
        }
      }
      const o = await S(e, r);
      return "no-store" !== r.cache ? T(e, r, o) : o;
    })(this, e, t);
  }
  onPush(e) {
    return this.eventEmitter.on(C, e);
  }
  offPush(e) {
    return this.eventEmitter.off(C, e);
  }
  clearCache() {
    this.cache.clear();
  }
  cacheStats() {
    return {
      size: this.cache.calculatedSize,
      count: this.cache.size,
    };
  }
  pushPromiseHandler(e, t, n) {
    i(`received server push promise: ${e}, headers: ${JSON.stringify(t)}`);
    const r = new l(e, {
        headers: t,
      }),
      { policy: o } = this.cache.get(e) || {};
    if (o && o.satisfiesWithoutRevalidation(r)) {
      i(
        `already cached, reject push promise: ${e}, headers: ${JSON.stringify(
          t
        )}`
      );
      n();
    }
  }
  async pushHandler(e, t, n) {
    i(
      `caching resource pushed by server: ${e}, reqHeaders: ${JSON.stringify(
        t
      )}, status: ${n.status}, respHeaders: ${JSON.stringify(n.headers)}`
    );
    const r = await T(
      this,
      new l(e, {
        headers: t,
      }),
      n
    );
    this.eventEmitter.emit(C, e, r);
  }
}
module.exports = new P().api();
