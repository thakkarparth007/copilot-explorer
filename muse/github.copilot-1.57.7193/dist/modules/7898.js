var r = require(465);
function o() {
  this.extend = new a();
  this.filter = new a();
  this.format = new c();
  this.version = require(2301).i8;
}
var i = false;
o.prototype.callSite = function e(t) {
  if (t) {
    t = {};
  }
  i = true;
  var n = {};
  Error.captureStackTrace(n, e);
  var r = n.stack;
  i = false;
  r = r.slice(t.slice || 0);
  if (t.extend) {
    r = this.extend._modify(n, r);
  }
  if (t.filter) {
    r = this.filter._modify(n, r);
  }
  return r;
};
var s = new o();
function a() {
  this._modifiers = [];
}
function c() {
  this._formater = r;
  this._previous = undefined;
}
a.prototype._modify = function (e, t) {
  for (n = 0, r = this._modifiers.length, undefined; n < r; n++) {
    var n;
    var r;
    t = this._modifiers[n](e, t);
  }
  return t;
};
a.prototype.attach = function (e) {
  this._modifiers.push(e);
};
a.prototype.deattach = function (e) {
  var t = this._modifiers.indexOf(e);
  return -1 !== t && (this._modifiers.splice(t, 1), true);
};
c.prototype.replace = function (e) {
  if (e) {
    this._formater = e;
  } else {
    this.restore();
  }
};
c.prototype.restore = function () {
  this._formater = r;
  this._previous = undefined;
};
c.prototype._backup = function () {
  this._previous = this._formater;
};
c.prototype._roolback = function () {
  if (this._previous === r) {
    this.replace(undefined);
  } else {
    this.replace(this._previous);
  }
  this._previous = undefined;
};
if (Error.prepareStackTrace) {
  s.format.replace(Error.prepareStackTrace);
}
var l = false;
function u(e, t) {
  if (i) return t;
  if (l) return r(e, t);
  var n = t.concat();
  n = s.extend._modify(e, n);
  n = (n = s.filter._modify(e, n)).slice(0, Error.stackTraceLimit);
  if (
    Object.isExtensible(e) &&
    undefined === Object.getOwnPropertyDescriptor(e, "callSite")
  ) {
    e.callSite = {
      original: t,
      mutated: n,
    };
  }
  l = true;
  var o = s.format._formater(e, n);
  l = false;
  return o;
}
Object.defineProperty(Error, "prepareStackTrace", {
  get: function () {
    return u;
  },
  set: function (e) {
    if (e === u) {
      s.format._roolback();
    } else {
      s.format._backup();
      s.format.replace(e);
    }
  },
});
Object.defineProperty(Error.prototype, "callSite", {
  get: function () {
    this.stack;
    return this.callSite;
  },
  set: function (e) {
    Object.defineProperty(this, "callSite", {
      value: e,
      writable: true,
      configurable: true,
    });
  },
  configurable: true,
});
module.exports = s;