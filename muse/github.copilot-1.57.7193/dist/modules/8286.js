module.exports = (e, t) =>
  class extends e {
    constructor(e) {
      var n;
      var r;
      super(function (e, i) {
        n = this;
        r = [
          function (n) {
            t(o, false);
            return e(n);
          },
          function (e) {
            t(o, false);
            return i(e);
          },
        ];
      });
      var o = this;
      try {
        e.apply(n, r);
      } catch (e) {
        r[1](e);
      }
      return o;
    }
  };