var r,
  o = this && this.__extends || (r = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (e, t) {
    e.__proto__ = t;
  } || function (e, t) {
    for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
  }, function (e, t) {
    function n() {
      this.constructor = e;
    }
    r(e, t);
    e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
  }),
  i = function (e) {
    function t() {
      var t = e.call(this) || this;
      t.ver = 2;
      t.properties = {};
      return t;
    }
    o(t, e);
    return t;
  }(require(8934));
module.exports = i;