const r = require("timers");
function o() {}
function i() {}
function s() {}
const a = new Map();
const c = new Map();
const l = new Map();
let u = null;
let d = false;
function p(e, t, n, o, i, s, a) {
  const c = r[n];
  const l = r[o];
  r[n] = function () {
    if (!t.enabled) return c.apply(r, arguments);
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
      let t = true;
      try {
        o.apply(this, arguments);
        t = false;
      } finally {
        if (t && process.listenerCount("uncaughtException") > 0) {
          process.once("uncaughtException", function () {
            e.post.call(l, p, true);
            s.delete(h);
            e.destroy.call(null, p);
          });
        }
      }
      e.post.call(l, p, false);
      u = null;
      if (a || d) {
        d = false;
        s.delete(h);
        e.destroy.call(null, p);
      }
    };
    h = c.apply(r, n);
    s.set(h, p);
    return h;
  };
  r[o] = function (t) {
    if (u === t && null !== t) d = true;
    else if (s.has(t)) {
      const n = s.get(t);
      s.delete(t);
      e.destroy.call(null, n);
    }
    l.apply(r, arguments);
  };
}
module.exports = function () {
  p(this._hooks, this._state, "setTimeout", "clearTimeout", o, a, true);
  p(this._hooks, this._state, "setInterval", "clearInterval", i, c, false);
  p(this._hooks, this._state, "setImmediate", "clearImmediate", s, l, true);
  global.setTimeout = r.setTimeout;
  global.setInterval = r.setInterval;
  global.setImmediate = r.setImmediate;
  global.clearTimeout = r.clearTimeout;
  global.clearInterval = r.clearInterval;
  global.clearImmediate = r.clearImmediate;
};