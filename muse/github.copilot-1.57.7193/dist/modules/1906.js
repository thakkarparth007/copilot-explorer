module.exports = (e, t, n) => {
  const r = (n) =>
    Object.defineProperty(e, t, {
      value: n,
      enumerable: true,
      writable: true,
    });
  Object.defineProperty(e, t, {
    configurable: true,
    enumerable: true,
    get() {
      const e = n();
      r(e);
      return e;
    },
    set(e) {
      r(e);
    },
  });
  return e;
};