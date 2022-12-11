var M_assert = require("assert");
var M_event_listener_wrap_maybe = require("event-listener-wrap");
var i = "error@context";
function s(e) {
  this.name = e;
  this.active = null;
  this._set = [];
  this.id = null;
}
function a(e) {
  return process.namespaces[e];
}
function c(e) {
  var t = a(e);
  M_assert.ok(t, "can't delete nonexistent namespace!");
  M_assert.ok(t.id, "don't assign to process.namespaces directly!");
  process.removeAsyncListener(t.id);
  process.namespaces[e] = null;
}
function l() {
  if (process.namespaces) {
    Object.keys(process.namespaces).forEach(function (e) {
      c(e);
    });
  }
  process.namespaces = Object.create(null);
}
if (process.addAsyncListener) {
  require("async-listener-polyfill");
}
s.prototype.set = function (e, t) {
  if (!this.active)
    throw new Error(
      "No context available. ns.run() or ns.bind() must be called first."
    );
  this.active[e] = t;
  return t;
};
s.prototype.get = function (e) {
  if (this.active) return this.active[e];
};
s.prototype.createContext = function () {
  return Object.create(this.active);
};
s.prototype.run = function (e) {
  var t = this.createContext();
  this.enter(t);
  try {
    e(t);
    return t;
  } catch (e) {
    throw (e && (e[i] = t), e);
  } finally {
    this.exit(t);
  }
};
s.prototype.runAndReturn = function (e) {
  var t;
  this.run(function (n) {
    t = e(n);
  });
  return t;
};
s.prototype.bind = function (e, t) {
  if (t) {
    t = this.active ? this.active : this.createContext();
  }
  var n = this;
  return function () {
    n.enter(t);
    try {
      return e.apply(this, arguments);
    } catch (e) {
      throw (e && (e[i] = t), e);
    } finally {
      n.exit(t);
    }
  };
};
s.prototype.enter = function (e) {
  M_assert.ok(e, "context must be provided for entering");
  this._set.push(this.active);
  this.active = e;
};
s.prototype.exit = function (e) {
  M_assert.ok(e, "context must be provided for exiting");
  if (this.active === e)
    return (
      M_assert.ok(this._set.length, "can't remove top context"),
      void (this.active = this._set.pop())
    );
  var t = this._set.lastIndexOf(e);
  M_assert.ok(t >= 0, "context not currently entered; can't exit");
  M_assert.ok(t, "can't remove top context");
  this._set.splice(t, 1);
};
s.prototype.bindEmitter = function (e) {
  M_assert.ok(e.on && e.addListener && e.emit, "can only bind real EEs");
  var t = this;
  var n = "context@" + this.name;
  M_event_listener_wrap_maybe(
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
      var t = e;
      var n = e["cls@contexts"];
      Object.keys(n).forEach(function (e) {
        var r = n[e];
        t = r.namespace.bind(t, r.context);
      });
      return t;
    }
  );
};
s.prototype.fromException = function (e) {
  return e[i];
};
if (process.namespaces) {
  l();
}
module.exports = {
  getNamespace: a,
  createNamespace: function (e) {
    M_assert.ok(e, "namespace must be given a name!");
    var t = new s(e);
    t.id = process.addAsyncListener({
      create: function () {
        return t.active;
      },
      before: function (e, n) {
        if (n) {
          t.enter(n);
        }
      },
      after: function (e, n) {
        if (n) {
          t.exit(n);
        }
      },
      error: function (e) {
        if (e) {
          t.exit(e);
        }
      },
    });
    process.namespaces[e] = t;
    return t;
  },
  destroyNamespace: c,
  reset: l,
};
