const M_timers = require("timers");
function o() {}
function i() {}
function s() {}
const a = new Map();
const c = new Map();
const l = new Map();
let u = null;
let d = !1;
function p(e, t, n, o, i, s, a) {
  const c = M_timers[n];
  const l = M_timers[o];
  M_timers[n] = function () {
    if (!t.enabled) return c.apply(M_timers, arguments);
    const n = new Array(arguments.length);
    for (let e = 0; e < arguments.length; e++) n[e] = arguments[e];
    const o = n[0];
    if ("function" != typeof o)
      throw new TypeError('"callback" argument must be a function');
    const l = new i();
    const p = --t.counter;
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
        if (t && process.listenerCount("uncaughtException") > 0) {
          process.once("uncaughtException", function () {
            e.post.call(l, p, !0);
            s.delete(h);
            e.destroy.call(null, p);
          });
        }
      }
      e.post.call(l, p, !1);
      u = null;
      if (a || d) {
        d = !1;
        s.delete(h);
        e.destroy.call(null, p);
      }
    };
    h = c.apply(M_timers, n);
    s.set(h, p);
    return h;
  };
  M_timers[o] = function (t) {
    if (u === t && null !== t) d = !0;
    else if (s.has(t)) {
      const n = s.get(t);
      s.delete(t);
      e.destroy.call(null, n);
    }
    l.apply(M_timers, arguments);
  };
}
module.exports = function () {
  p(this._hooks, this._state, "setTimeout", "clearTimeout", o, a, !0);
  p(this._hooks, this._state, "setInterval", "clearInterval", i, c, !1);
  p(this._hooks, this._state, "setImmediate", "clearImmediate", s, l, !0);
  global.setTimeout = M_timers.setTimeout;
  global.setInterval = M_timers.setInterval;
  global.setImmediate = M_timers.setImmediate;
  global.clearTimeout = M_timers.clearTimeout;
  global.clearInterval = M_timers.clearInterval;
  global.clearImmediate = M_timers.clearImmediate;
};
