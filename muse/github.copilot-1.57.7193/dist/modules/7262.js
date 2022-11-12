const {
    connect: r,
    constants: o
  } = require(1995),
  {
    Readable: i
  } = require(2781),
  s = require(8104)("helix-fetch:h2"),
  {
    RequestAbortedError: a
  } = require(1787),
  {
    decodeStream: c
  } = require(4544),
  {
    NGHTTP2_CANCEL: l
  } = o,
  u = 3e5,
  d = 5e3,
  p = (e, t, n, r = () => {}) => {
    const o = {
        ...e
      },
      i = o[":status"];
    delete o[":status"];
    const s = n ? c(i, e, t, r) : t;
    return {
      statusCode: i,
      statusText: "",
      httpVersion: "2.0",
      httpVersionMajor: 2,
      httpVersionMinor: 0,
      headers: o,
      readable: s,
      decoded: !(!n || s === t)
    };
  };
module.exports = {
  request: async (e, t, n) => {
    const {
        origin: o,
        pathname: c,
        search: h,
        hash: f
      } = t,
      m = `${c}${h}${f}`,
      {
        options: {
          h2: g = {}
        },
        h2: {
          sessionCache: _
        }
      } = e,
      {
        idleSessionTimeout: y = u,
        pushPromiseHandler: v,
        pushHandler: b
      } = g,
      w = {
        ...n
      },
      {
        method: x,
        headers: E,
        socket: C,
        body: S,
        decode: T
      } = w;
    C && delete w.socket;
    E.host && (E[":authority"] = E.host, delete E.host);
    return new Promise((n, c) => {
      let u,
        h = _[o];
      if (!h || h.closed || h.destroyed) {
        const t = !(!1 === e.options.rejectUnauthorized || !1 === g.rejectUnauthorized),
          n = {
            ...g,
            rejectUnauthorized: t
          };
        C && !C.inUse && (n.createConnection = () => (s(`reusing socket #${C.id} (${C.servername})`), C.inUse = !0, C));
        const i = !(!v && !b);
        h = r(o, {
          ...n,
          settings: {
            enablePush: i
          }
        });
        h.setMaxListeners(1e3);
        h.setTimeout(y, () => {
          s(`closing session ${o} after ${y} ms of inactivity`);
          h.close();
        });
        h.once("connect", () => {
          s(`session ${o} established`);
          s(`caching session ${o}`);
          _[o] = h;
        });
        h.on("localSettings", e => {
          s(`session ${o} localSettings: ${JSON.stringify(e)}`);
        });
        h.on("remoteSettings", e => {
          s(`session ${o} remoteSettings: ${JSON.stringify(e)}`);
        });
        h.once("close", () => {
          s(`session ${o} closed`);
          _[o] === h && (s(`discarding cached session ${o}`), delete _[o]);
        });
        h.once("error", e => {
          s(`session ${o} encountered error: ${e}`);
          _[o] === h && (s(`discarding cached session ${o}`), delete _[o]);
        });
        h.on("frameError", (e, t, n) => {
          s(`session ${o} encountered frameError: type: ${e}, code: ${t}, id: ${n}`);
        });
        h.once("goaway", (e, t, n) => {
          s(`session ${o} received GOAWAY frame: errorCode: ${e}, lastStreamID: ${t}, opaqueData: ${n ? n.toString() : undefined}`);
        });
        h.on("stream", (t, n, r) => {
          ((e, t, n, r, o, i) => {
            const {
                options: {
                  h2: {
                    pushPromiseHandler: a,
                    pushHandler: c,
                    pushedStreamIdleTimeout: u = d
                  }
                }
              } = e,
              h = o[":path"],
              f = `${t}${h}`;
            s(`received PUSH_PROMISE: ${f}, stream #${r.id}, headers: ${JSON.stringify(o)}, flags: ${i}`);
            a && a(f, o, () => {
              r.close(l);
            });
            r.on("push", (e, i) => {
              s(`received push headers for ${t}${h}, stream #${r.id}, headers: ${JSON.stringify(e)}, flags: ${i}`);
              r.setTimeout(u, () => {
                s(`closing pushed stream #${r.id} after ${u} ms of inactivity`);
                r.close(l);
              });
              c && c(f, o, p(e, r, n));
            });
            r.on("aborted", () => {
              s(`pushed stream #${r.id} aborted`);
            });
            r.on("error", e => {
              s(`pushed stream #${r.id} encountered error: ${e}`);
            });
            r.on("frameError", (e, t, n) => {
              s(`pushed stream #${r.id} encountered frameError: type: ${e}, code: ${t}, id: ${n}`);
            });
          })(e, o, T, t, n, r);
        });
      } else C && C.id !== h.socket.id && !C.inUse && (s(`discarding redundant socket used for ALPN: #${C.id} ${C.servername}`), C.destroy());
      s(`${x} ${t.host}${m}`);
      const {
          signal: f
        } = w,
        k = () => {
          f.removeEventListener("abort", k);
          c(new a());
          u && u.close(l);
        };
      if (f) {
        if (f.aborted) return void c(new a());
        f.addEventListener("abort", k);
      }
      const I = e => {
        s(`session ${o} encountered error during ${w.method} ${t.href}: ${e}`);
        c(e);
      };
      h.once("error", I);
      u = h.request({
        ":method": x,
        ":path": m,
        ...E
      });
      u.once("response", e => {
        h.off("error", I);
        f && f.removeEventListener("abort", k);
        n(p(e, u, w.decode, c));
      });
      u.once("error", e => {
        h.off("error", I);
        f && f.removeEventListener("abort", k);
        u.rstCode !== l && (s(`${w.method} ${t.href} failed with: ${e.message}`), u.close(l), c(e));
      });
      u.once("frameError", (e, n, r) => {
        h.off("error", I);
        s(`encountered frameError during ${w.method} ${t.href}: type: ${e}, code: ${n}, id: ${r}`);
      });
      u.on("push", (e, t) => {
        s(`received 'push' event: headers: ${JSON.stringify(e)}, flags: ${t}`);
      });
      S instanceof i ? S.pipe(u) : (S && u.write(S), u.end());
    });
  },
  setupContext: e => {
    e.h2 = {
      sessionCache: {}
    };
  },
  resetContext: async ({
    h2: e
  }) => Promise.all(Object.values(e.sessionCache).map(e => new Promise(t => {
    e.on("close", t);
    s(`resetContext: destroying session (socket #${e.socket && e.socket.id}, ${e.socket && e.socket.servername})`);
    e.destroy();
  })))
};