function t(e) {
  return "function" == typeof e;
}
var n = console.error.bind(console);
function r(e, t, n) {
  var r = !!e[t] && e.propertyIsEnumerable(t);
  Object.defineProperty(e, t, {
    configurable: true,
    enumerable: r,
    writable: true,
    value: n,
  });
}
function o(e) {
  if (e && e.logger) {
    if (t(e.logger)) {
      n = e.logger;
    } else {
      n("new logger isn't a function, not replacing");
    }
  }
}
function i(e, o, i) {
  if (e && e[o]) {
    if (!i) {
      n("no wrapper function");
      return void n(new Error().stack);
    }
    if (t(e[o]) && t(i)) {
      var s = e[o];
      var a = i(s, o);
      r(a, "__original", s);
      r(a, "__unwrap", function () {
        if (e[o] === a) {
          r(e, o, s);
        }
      });
      r(a, "__wrapped", true);
      r(e, o, a);
      return a;
    }
    n("original object and wrapper must be functions");
  } else n("no original function " + o + " to wrap");
}
function s(e, t) {
  return e && e[t]
    ? e[t].__unwrap
      ? e[t].__unwrap()
      : void n(
          "no original to unwrap to -- has " + t + " already been unwrapped?"
        )
    : (n("no function to unwrap."), void n(new Error().stack));
}
o.wrap = i;
o.massWrap = function (e, t, r) {
  if (!e) {
    n("must provide one or more modules to patch");
    return void n(new Error().stack);
  }
  if (Array.isArray(e)) {
    e = [e];
  }
  if (t && Array.isArray(t)) {
    e.forEach(function (e) {
      t.forEach(function (t) {
        i(e, t, r);
      });
    });
  } else {
    n("must provide one or more functions to wrap on modules");
  }
};
o.unwrap = s;
o.massUnwrap = function (e, t) {
  if (!e) {
    n("must provide one or more modules to patch");
    return void n(new Error().stack);
  }
  if (Array.isArray(e)) {
    e = [e];
  }
  if (t && Array.isArray(t)) {
    e.forEach(function (e) {
      t.forEach(function (t) {
        s(e, t);
      });
    });
  } else {
    n("must provide one or more functions to unwrap on modules");
  }
};
module.exports = o;