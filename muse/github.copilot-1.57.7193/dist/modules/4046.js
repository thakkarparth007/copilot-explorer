const r = require("util");
const o = require("assert");
const i = require(9867);
const s = require(3223);
const a = "error@context";
const c = [];
for (let e in s.providers) c[s.providers[e]] = e;
const l = process.env.DEBUG_CLS_HOOKED;
let u = -1;
function d(e) {
  this.name = e;
  this.active = null;
  this._set = [];
  this.id = null;
  this._contexts = new Map();
}
function p(e) {
  return process.namespaces[e];
}
function h(e) {
  let t = p(e);
  o.ok(t, "can't delete nonexistent namespace! \"" + e + '"');
  o.ok(t.id, "don't assign to process.namespaces directly! " + r.inspect(t));
  process.namespaces[e] = null;
}
function f(e) {
  if (process.env.DEBUG) {
    process._rawDebug(e);
  }
}
function m(e) {
  return e
    ? "function" == typeof e
      ? e.name
        ? e.name
        : (e
            .toString()
            .trim()
            .match(/^function\s*([^\s(]+)/) || [])[1]
      : e.constructor && e.constructor.name
      ? e.constructor.name
      : undefined
    : e;
}
module.exports = {
  getNamespace: p,
  createNamespace: function (e) {
    o.ok(e, "namespace must be given a name.");
    if (l) {
      f("CREATING NAMESPACE " + e);
    }
    let t = new d(e);
    t.id = u;
    s.addHooks({
      init(n, o, i, s, a) {
        u = n;
        if (s) {
          t._contexts.set(n, t._contexts.get(s));
          if (l) {
            f(
              "PARENTID: " + e + " uid:" + n + " parent:" + s + " provider:" + i
            );
          }
        } else {
          t._contexts.set(u, t.active);
        }
        if (l) {
          f(
            "INIT " +
              e +
              " uid:" +
              n +
              " parent:" +
              s +
              " provider:" +
              c[i] +
              " active:" +
              r.inspect(t.active, !0)
          );
        }
      },
      pre(n, o) {
        u = n;
        let i = t._contexts.get(n);
        if (i) {
          if (l) {
            f(
              " PRE " +
                e +
                " uid:" +
                n +
                " handle:" +
                m(o) +
                " context:" +
                r.inspect(i)
            );
          }
          t.enter(i);
        } else {
          if (l) {
            f(" PRE MISSING CONTEXT " + e + " uid:" + n + " handle:" + m(o));
          }
        }
      },
      post(n, o) {
        u = n;
        let i = t._contexts.get(n);
        if (i) {
          if (l) {
            f(
              " POST " +
                e +
                " uid:" +
                n +
                " handle:" +
                m(o) +
                " context:" +
                r.inspect(i)
            );
          }
          t.exit(i);
        } else {
          if (l) {
            f(" POST MISSING CONTEXT " + e + " uid:" + n + " handle:" + m(o));
          }
        }
      },
      destroy(n) {
        u = n;
        if (l) {
          f(
            "DESTROY " +
              e +
              " uid:" +
              n +
              " context:" +
              r.inspect(t._contexts.get(u)) +
              " active:" +
              r.inspect(t.active, !0)
          );
        }
        t._contexts.delete(n);
      },
    });
    process.namespaces[e] = t;
    return t;
  },
  destroyNamespace: h,
  reset: function () {
    if (process.namespaces) {
      Object.keys(process.namespaces).forEach(function (e) {
        h(e);
      });
    }
    process.namespaces = Object.create(null);
  },
  ERROR_SYMBOL: a,
};
d.prototype.set = function (e, t) {
  if (!this.active)
    throw new Error(
      "No context available. ns.run() or ns.bind() must be called first."
    );
  if (l) {
    f(
      "    SETTING KEY:" +
        e +
        "=" +
        t +
        " in ns:" +
        this.name +
        " uid:" +
        u +
        " active:" +
        r.inspect(this.active, !0)
    );
  }
  this.active[e] = t;
  return t;
};
d.prototype.get = function (e) {
  if (this.active) {
    if (l) {
      f(
        "    GETTING KEY:" +
          e +
          "=" +
          this.active[e] +
          " " +
          this.name +
          " uid:" +
          u +
          " active:" +
          r.inspect(this.active, !0)
      );
    }
    return this.active[e];
  }
  if (l) {
    f(
      "    GETTING KEY:" +
        e +
        "=undefined " +
        this.name +
        " uid:" +
        u +
        " active:" +
        r.inspect(this.active, !0)
    );
  }
};
d.prototype.createContext = function () {
  if (l) {
    f(
      "   CREATING Context: " +
        this.name +
        " uid:" +
        u +
        " len:" +
        this._set.length +
        "  active:" +
        r.inspect(this.active, !0, 2, !0)
    );
  }
  let e = Object.create(this.active ? this.active : Object.prototype);
  e._ns_name = this.name;
  e.id = u;
  if (l) {
    f(
      "   CREATED Context: " +
        this.name +
        " uid:" +
        u +
        " len:" +
        this._set.length +
        "  context:" +
        r.inspect(e, !0, 2, !0)
    );
  }
  return e;
};
d.prototype.run = function (e) {
  let t = this.createContext();
  this.enter(t);
  try {
    if (l) {
      f(
        " BEFORE RUN: " +
          this.name +
          " uid:" +
          u +
          " len:" +
          this._set.length +
          " " +
          r.inspect(t)
      );
    }
    e(t);
    return t;
  } catch (e) {
    throw (e && (e[a] = t), e);
  } finally {
    if (l) {
      f(
        " AFTER RUN: " +
          this.name +
          " uid:" +
          u +
          " len:" +
          this._set.length +
          " " +
          r.inspect(t)
      );
    }
    this.exit(t);
  }
};
d.prototype.runAndReturn = function (e) {
  var t;
  this.run(function (n) {
    t = e(n);
  });
  return t;
};
d.prototype.runPromise = function (e) {
  let t = this.createContext();
  this.enter(t);
  let n = e(t);
  if (!n || !n.then || !n.catch) throw new Error("fn must return a promise.");
  if (l) {
    f(
      " BEFORE runPromise: " +
        this.name +
        " uid:" +
        u +
        " len:" +
        this._set.length +
        " " +
        r.inspect(t)
    );
  }
  return n
    .then(
      (e) => (
        l &&
          f(
            " AFTER runPromise: " +
              this.name +
              " uid:" +
              u +
              " len:" +
              this._set.length +
              " " +
              r.inspect(t)
          ),
        this.exit(t),
        e
      )
    )
    .catch((e) => {
      throw (
        ((e[a] = t),
        l &&
          f(
            " AFTER runPromise: " +
              this.name +
              " uid:" +
              u +
              " len:" +
              this._set.length +
              " " +
              r.inspect(t)
          ),
        this.exit(t),
        e)
      );
    });
};
d.prototype.bind = function (e, t) {
  if (t) {
    t = this.active ? this.active : this.createContext();
  }
  let n = this;
  return function () {
    n.enter(t);
    try {
      return e.apply(this, arguments);
    } catch (e) {
      throw (e && (e[a] = t), e);
    } finally {
      n.exit(t);
    }
  };
};
d.prototype.enter = function (e) {
  o.ok(e, "context must be provided for entering");
  if (l) {
    f(
      "  ENTER " +
        this.name +
        " uid:" +
        u +
        " len:" +
        this._set.length +
        " context: " +
        r.inspect(e)
    );
  }
  this._set.push(this.active);
  this.active = e;
};
d.prototype.exit = function (e) {
  o.ok(e, "context must be provided for exiting");
  if (l) {
    f(
      "  EXIT " +
        this.name +
        " uid:" +
        u +
        " len:" +
        this._set.length +
        " context: " +
        r.inspect(e)
    );
  }
  if (this.active === e)
    return (
      o.ok(this._set.length, "can't remove top context"),
      void (this.active = this._set.pop())
    );
  let t = this._set.lastIndexOf(e);
  if (t < 0) {
    if (l) {
      f(
        "??ERROR?? context exiting but not entered - ignoring: " + r.inspect(e)
      );
    }
    o.ok(
      t >= 0,
      "context not currently entered; can't exit. \n" +
        r.inspect(this) +
        "\n" +
        r.inspect(e)
    );
  } else {
    o.ok(t, "can't remove top context");
    this._set.splice(t, 1);
  }
};
d.prototype.bindEmitter = function (e) {
  o.ok(e.on && e.addListener && e.emit, "can only bind real EEs");
  let t = this;
  let n = "context@" + this.name;
  i(
    e,
    function (e) {
      if (e) {
        if (e["cls@contexts"]) {
          e["cls@contexts"] = Object.create(null);
        }
        e["cls@contexts"][n] = {
          namespace: t,
          context: t.active,
        };
      }
    },
    function (e) {
      if (!e || !e["cls@contexts"]) return e;
      let t = e;
      let n = e["cls@contexts"];
      Object.keys(n).forEach(function (e) {
        let r = n[e];
        t = r.namespace.bind(t, r.context);
      });
      return t;
    }
  );
};
d.prototype.fromException = function (e) {
  return e[a];
};
process.namespaces = {};
if (s._state && !s._state.enabled) {
  s.enable();
}
if (l) {
  var g = require(2512);
  for (var _ in g.filter._modifiers) g.filter.deattach(_);
}