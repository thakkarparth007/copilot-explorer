const { EventEmitter: r } = require("events");
module.exports = () => {
  const e = {};
  const t = new r();
  t.setMaxListeners(0);
  return {
    acquire: (n) =>
      new Promise((r) => {
        if (!e[n]) {
          e[n] = !0;
          return void r();
        }
        const o = (i) => {
          if (e[n]) {
            e[n] = !0;
            t.removeListener(n, o);
            r(i);
          }
        };
        t.on(n, o);
      }),
    release: (n, r) => {
      Reflect.deleteProperty(e, n);
      setImmediate(() => t.emit(n, r));
    },
  };
};