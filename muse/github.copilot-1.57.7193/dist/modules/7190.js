const r = require(9512);
function o() {}
function i() {}
function s() {}
const a = new Map(),
  c = new Map(),
  l = new Map();
let u = null,
  d = !1;
function p(e, t, n, o, i, s, a) {
  const c = r[n],
    l = r[o];
  r[n] = function () {
    if (!t.enabled) return c.apply(r, arguments);
    const n = new Array(arguments.length);
    for (let e = 0; e < arguments.length; e++) n[e] = arguments[e];
    const o = n[0];
    if ("function" != typeof o) throw new TypeError('"callback" argument must be a function');
    const l = new i(),
      p = --t.counter;
    let h;
    e.init.call(l, p, 0, null, null);
    n[0] = function () {
      u = h;
      e.pre.call(l, p);
      let t = !0;
      try {
        o.apply(this, arguments);
        t = !1;
      } finally {
        t && process.listenerCount("uncaughtException") > 0 && process.once("uncaughtException", function () {
          e.post.call(l, p, !0);
          s.delete(h);
          e.destroy.call(null, p);
        });
      }
      e.post.call(l, p, !1);
      u = null;
      (a || d) && (d = !1, s.delete(h), e.destroy.call(null, p));
    };
    h = c.apply(r, n);
    s.set(h, p);
    return h;
  };
  r[o] = function (t) {
    if (u === t && null !== t) d = !0;else if (s.has(t)) {
      const n = s.get(t);
      s.delete(t);
      e.destroy.call(null, n);
    }
    l.apply(r, arguments);
  };
}
module.exports = function () {
  p(this._hooks, this._state, "setTimeout", "clearTimeout", o, a, !0);
  p(this._hooks, this._state, "setInterval", "clearInterval", i, c, !1);
  p(this._hooks, this._state, "setImmediate", "clearImmediate", s, l, !0);
  global.setTimeout = r.setTimeout;
  global.setInterval = r.setInterval;
  global.setImmediate = r.setImmediate;
  global.clearTimeout = r.clearTimeout;
  global.clearInterval = r.clearInterval;
  global.clearImmediate = r.clearImmediate;
};