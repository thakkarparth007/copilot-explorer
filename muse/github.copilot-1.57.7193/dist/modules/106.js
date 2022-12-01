Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.debounce = exports.Debouncer = undefined;
exports.Debouncer = class {
  async debounce(e) {
    if (this.state) {
      clearTimeout(this.state.timer);
      this.state.reject();
      this.state = undefined;
    }
    return new Promise((t, n) => {
      this.state = {
        timer: setTimeout(() => t(), e),
        reject: n,
      };
    });
  }
};
exports.debounce = function (e, t) {
  let n;
  return (...r) => (
    n && clearTimeout(n),
    new Promise((o) => {
      n = setTimeout(() => {
        const e = t(...r);
        o(e);
      }, e);
    })
  );
};