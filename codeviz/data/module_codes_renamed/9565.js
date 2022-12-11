function t() {}
module.exports = function () {
  const e = this._hooks;
  const n = this._state;
  const r = global.Promise;
  const o = r.prototype.then;
  function i(t, n, r, o) {
    return "function" != typeof t
      ? o
        ? (function (t) {
            return function (n) {
              e.destroy.call(null, t);
              return n;
            };
          })(r)
        : (function (t) {
            return function (n) {
              throw (e.destroy.call(null, t), n);
            };
          })(r)
      : function () {
          e.pre.call(n, r);
          try {
            return t.apply(this, arguments);
          } finally {
            e.post.call(n, r, !1);
            e.destroy.call(null, r);
          }
        };
  }
  r.prototype.then = function (r, s) {
    if (!n.enabled) return o.call(this, r, s);
    const a = new t();
    const c = --n.counter;
    e.init.call(a, c, 0, null, null);
    return o.call(this, i(r, a, c, !0), i(s, a, c, !1));
  };
};
