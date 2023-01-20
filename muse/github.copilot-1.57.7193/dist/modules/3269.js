function t() {}
module.exports = function () {
  const e = this._hooks;
  const n = this._state;
  const r = process.nextTick;
  process.nextTick = function () {
    if (!n.enabled) return r.apply(process, arguments);
    const o = new Array(arguments.length);
    for (let e = 0; e < arguments.length; e++) o[e] = arguments[e];
    const i = o[0];
    if ("function" != typeof i)
      throw new TypeError("callback is not a function");
    const s = new t();
    const a = --n.counter;
    e.init.call(s, a, 0, null, null);
    o[0] = function () {
      e.pre.call(s, a);
      let t = true;
      try {
        i.apply(this, arguments);
        t = false;
      } finally {
        if (t && process.listenerCount("uncaughtException") > 0) {
          process.once("uncaughtException", function () {
            e.post.call(s, a, true);
            e.destroy.call(null, a);
          });
        }
      }
      e.post.call(s, a, false);
      e.destroy.call(null, a);
    };
    return r.apply(process, o);
  };
};