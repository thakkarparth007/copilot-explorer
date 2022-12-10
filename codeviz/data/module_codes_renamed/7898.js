var M_stack_trace_NOTSURE = require("stack-trace");
function o() {
  this.extend = new a();
  this.filter = new a();
  this.format = new c();
  this.version = require("package_info").i8;
}
var i = !1;
o.prototype.callSite = function e(t) {
  if (t) {
    t = {};
  }
  i = !0;
  var n = {};
  Error.captureStackTrace(n, e);
  var r = n.stack;
  i = !1;
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
  this._formater = M_stack_trace_NOTSURE;
  this._previous = undefined;
}
a.prototype._modify = function (e, t) {
  for (var n = 0, r = this._modifiers.length; n < r; n++)
    t = this._modifiers[n](e, t);
  return t;
};
a.prototype.attach = function (e) {
  this._modifiers.push(e);
};
a.prototype.deattach = function (e) {
  var t = this._modifiers.indexOf(e);
  return -1 !== t && (this._modifiers.splice(t, 1), !0);
};
c.prototype.replace = function (e) {
  if (e) {
    this._formater = e;
  } else {
    this.restore();
  }
};
c.prototype.restore = function () {
  this._formater = M_stack_trace_NOTSURE;
  this._previous = undefined;
};
c.prototype._backup = function () {
  this._previous = this._formater;
};
c.prototype._roolback = function () {
  if (this._previous === M_stack_trace_NOTSURE) {
    this.replace(undefined);
  } else {
    this.replace(this._previous);
  }
  this._previous = undefined;
};
if (Error.prepareStackTrace) {
  s.format.replace(Error.prepareStackTrace);
}
var l = !1;
function u(e, t) {
  if (i) return t;
  if (l) return M_stack_trace_NOTSURE(e, t);
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
  l = !0;
  var o = s.format._formater(e, n);
  l = !1;
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
      writable: !0,
      configurable: !0,
    });
  },
  configurable: !0,
});
module.exports = s;
