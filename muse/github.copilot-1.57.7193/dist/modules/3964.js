const r = require(3837),
  o = require(9491),
  i = require(9867),
  s = require(852),
  a = "error@context",
  c = process.env.DEBUG_CLS_HOOKED;
let l = -1;
function u(e) {
  this.name = e;
  this.active = null;
  this._set = [];
  this.id = null;
  this._contexts = new Map();
  this._indent = 0;
}
function d(e) {
  return process.namespaces[e];
}
function p(e) {
  let t = d(e);
  o.ok(t, "can't delete nonexistent namespace! \"" + e + '"');
  o.ok(t.id, "don't assign to process.namespaces directly! " + r.inspect(t));
  process.namespaces[e] = null;
}
function h(...e) {
  c && process._rawDebug(`${r.format(...e)}`);
}
module.exports = {
  getNamespace: d,
  createNamespace: function (e) {
    o.ok(e, "namespace must be given a name.");
    c && h(`NS-CREATING NAMESPACE (${e})`);
    let t = new u(e);
    t.id = l;
    s.createHook({
      init(n, o, i, a) {
        l = s.executionAsyncId();
        if (t.active) {
          if (t._contexts.set(n, t.active), c) {
            h(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}INIT [${o}] (${e}) asyncId:${n} currentUid:${l} triggerId:${i} active:${r.inspect(t.active, {
              showHidden: !0,
              depth: 2,
              colors: !0
            })} resource:${a}`);
          }
        } else if (0 === l) {
          const i = s.triggerAsyncId(),
            u = t._contexts.get(i);
          if (u) {
            if (t._contexts.set(n, u), c) {
              h(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}INIT USING CONTEXT FROM TRIGGERID [${o}] (${e}) asyncId:${n} currentUid:${l} triggerId:${i} active:${r.inspect(t.active, {
                showHidden: !0,
                depth: 2,
                colors: !0
              })} resource:${a}`);
            }
          } else if (c) {
            h(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}INIT MISSING CONTEXT [${o}] (${e}) asyncId:${n} currentUid:${l} triggerId:${i} active:${r.inspect(t.active, {
              showHidden: !0,
              depth: 2,
              colors: !0
            })} resource:${a}`);
          }
        }
        if (c && "PROMISE" === o) {
          h(r.inspect(a, {
            showHidden: !0
          }));
          const s = a.parentId;
          h(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}INIT RESOURCE-PROMISE [${o}] (${e}) parentId:${s} asyncId:${n} currentUid:${l} triggerId:${i} active:${r.inspect(t.active, {
            showHidden: !0,
            depth: 2,
            colors: !0
          })} resource:${a}`);
        }
      },
      before(n) {
        let o;
        l = s.executionAsyncId();
        o = t._contexts.get(n) || t._contexts.get(l);
        if (o) {
          if (c) {
            const i = s.triggerAsyncId();
            h(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}BEFORE (${e}) asyncId:${n} currentUid:${l} triggerId:${i} active:${r.inspect(t.active, {
              showHidden: !0,
              depth: 2,
              colors: !0
            })} context:${r.inspect(o)}`), t._indent += 2;
          }
          t.enter(o);
        } else if (c) {
          const o = s.triggerAsyncId();
          h(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}BEFORE MISSING CONTEXT (${e}) asyncId:${n} currentUid:${l} triggerId:${o} active:${r.inspect(t.active, {
            showHidden: !0,
            depth: 2,
            colors: !0
          })} namespace._contexts:${r.inspect(t._contexts, {
            showHidden: !0,
            depth: 2,
            colors: !0
          })}`), t._indent += 2;
        }
      },
      after(n) {
        let o;
        l = s.executionAsyncId();
        o = t._contexts.get(n) || t._contexts.get(l);
        if (o) {
          if (c) {
            const i = s.triggerAsyncId();
            t._indent -= 2;
            h(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}AFTER (${e}) asyncId:${n} currentUid:${l} triggerId:${i} active:${r.inspect(t.active, {
              showHidden: !0,
              depth: 2,
              colors: !0
            })} context:${r.inspect(o)}`);
          }
          t.exit(o);
        } else if (c) {
          const i = s.triggerAsyncId();
          t._indent -= 2;
          h(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}AFTER MISSING CONTEXT (${e}) asyncId:${n} currentUid:${l} triggerId:${i} active:${r.inspect(t.active, {
            showHidden: !0,
            depth: 2,
            colors: !0
          })} context:${r.inspect(o)}`);
        }
      },
      destroy(n) {
        l = s.executionAsyncId();
        if (c) {
          const o = s.triggerAsyncId();
          h(`${" ".repeat(t._indent < 0 ? 0 : t._indent)}DESTROY (${e}) currentUid:${l} asyncId:${n} triggerId:${o} active:${r.inspect(t.active, {
            showHidden: !0,
            depth: 2,
            colors: !0
          })} context:${r.inspect(t._contexts.get(l))}`);
        }
        t._contexts.delete(n);
      }
    }).enable();
    process.namespaces[e] = t;
    return t;
  },
  destroyNamespace: p,
  reset: function () {
    process.namespaces && Object.keys(process.namespaces).forEach(function (e) {
      p(e);
    });
    process.namespaces = Object.create(null);
  },
  ERROR_SYMBOL: a
};
u.prototype.set = function (e, t) {
  if (!this.active) throw new Error("No context available. ns.run() or ns.bind() must be called first.");
  this.active[e] = t;
  c && h(" ".repeat(this._indent < 0 ? 0 : this._indent) + "CONTEXT-SET KEY:" + e + "=" + t + " in ns:" + this.name + " currentUid:" + l + " active:" + r.inspect(this.active, {
    showHidden: !0,
    depth: 2,
    colors: !0
  }));
  return t;
};
u.prototype.get = function (e) {
  if (this.active) {
    if (c) {
      const t = s.executionAsyncId(),
        n = s.triggerAsyncId(),
        o = " ".repeat(this._indent < 0 ? 0 : this._indent);
      h(o + "CONTEXT-GETTING KEY:" + e + "=" + this.active[e] + " (" + this.name + ") currentUid:" + l + " active:" + r.inspect(this.active, {
        showHidden: !0,
        depth: 2,
        colors: !0
      }));
      h(`${o}CONTEXT-GETTING KEY: (${this.name}) ${e}=${this.active[e]} currentUid:${l} asyncHooksCurrentId:${t} triggerId:${n} len:${this._set.length} active:${r.inspect(this.active)}`);
    }
    return this.active[e];
  }
  if (c) {
    const t = s.currentId(),
      n = s.triggerAsyncId();
    h(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-GETTING KEY NO ACTIVE NS: (${this.name}) ${e}=undefined currentUid:${l} asyncHooksCurrentId:${t} triggerId:${n} len:${this._set.length}`);
  }
};
u.prototype.createContext = function () {
  let e = Object.create(this.active ? this.active : Object.prototype);
  e._ns_name = this.name;
  e.id = l;
  if (c) {
    const t = s.executionAsyncId(),
      n = s.triggerAsyncId();
    h(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-CREATED Context: (${this.name}) currentUid:${l} asyncHooksCurrentId:${t} triggerId:${n} len:${this._set.length} context:${r.inspect(e, {
      showHidden: !0,
      depth: 2,
      colors: !0
    })}`);
  }
  return e;
};
u.prototype.run = function (e) {
  let t = this.createContext();
  this.enter(t);
  try {
    if (c) {
      const e = s.triggerAsyncId(),
        n = s.executionAsyncId();
      h(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-RUN BEGIN: (${this.name}) currentUid:${l} triggerId:${e} asyncHooksCurrentId:${n} len:${this._set.length} context:${r.inspect(t)}`);
    }
    e(t);
    return t;
  } catch (e) {
    throw e && (e[a] = t), e;
  } finally {
    if (c) {
      const e = s.triggerAsyncId(),
        n = s.executionAsyncId();
      h(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-RUN END: (${this.name}) currentUid:${l} triggerId:${e} asyncHooksCurrentId:${n} len:${this._set.length} ${r.inspect(t)}`);
    }
    this.exit(t);
  }
};
u.prototype.runAndReturn = function (e) {
  let t;
  this.run(function (n) {
    t = e(n);
  });
  return t;
};
u.prototype.runPromise = function (e) {
  let t = this.createContext();
  this.enter(t);
  let n = e(t);
  if (!n || !n.then || !n.catch) throw new Error("fn must return a promise.");
  c && h("CONTEXT-runPromise BEFORE: (" + this.name + ") currentUid:" + l + " len:" + this._set.length + " " + r.inspect(t));
  return n.then(e => (c && h("CONTEXT-runPromise AFTER then: (" + this.name + ") currentUid:" + l + " len:" + this._set.length + " " + r.inspect(t)), this.exit(t), e)).catch(e => {
    throw e[a] = t, c && h("CONTEXT-runPromise AFTER catch: (" + this.name + ") currentUid:" + l + " len:" + this._set.length + " " + r.inspect(t)), this.exit(t), e;
  });
};
u.prototype.bind = function (e, t) {
  t || (t = this.active ? this.active : this.createContext());
  let n = this;
  return function () {
    n.enter(t);
    try {
      return e.apply(this, arguments);
    } catch (e) {
      throw e && (e[a] = t), e;
    } finally {
      n.exit(t);
    }
  };
};
u.prototype.enter = function (e) {
  o.ok(e, "context must be provided for entering");
  if (c) {
    const t = s.executionAsyncId(),
      n = s.triggerAsyncId();
    h(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-ENTER: (${this.name}) currentUid:${l} triggerId:${n} asyncHooksCurrentId:${t} len:${this._set.length} ${r.inspect(e)}`);
  }
  this._set.push(this.active);
  this.active = e;
};
u.prototype.exit = function (e) {
  o.ok(e, "context must be provided for exiting");
  if (c) {
    const t = s.executionAsyncId(),
      n = s.triggerAsyncId();
    h(`${" ".repeat(this._indent < 0 ? 0 : this._indent)}CONTEXT-EXIT: (${this.name}) currentUid:${l} triggerId:${n} asyncHooksCurrentId:${t} len:${this._set.length} ${r.inspect(e)}`);
  }
  if (this.active === e) {
    o.ok(this._set.length, "can't remove top context");
    return void (this.active = this._set.pop());
  }
  let t = this._set.lastIndexOf(e);
  t < 0 ? (c && h("??ERROR?? context exiting but not entered - ignoring: " + r.inspect(e)), o.ok(t >= 0, "context not currently entered; can't exit. \n" + r.inspect(this) + "\n" + r.inspect(e))) : (o.ok(t, "can't remove top context"), this._set.splice(t, 1));
};
u.prototype.bindEmitter = function (e) {
  o.ok(e.on && e.addListener && e.emit, "can only bind real EEs");
  let t = this,
    n = "context@" + this.name;
  i(e, function (e) {
    e && (e["cls@contexts"] || (e["cls@contexts"] = Object.create(null)), e["cls@contexts"][n] = {
      namespace: t,
      context: t.active
    });
  }, function (e) {
    if (!e || !e["cls@contexts"]) return e;
    let t = e,
      n = e["cls@contexts"];
    Object.keys(n).forEach(function (e) {
      let r = n[e];
      t = r.namespace.bind(t, r.context);
    });
    return t;
  });
};
u.prototype.fromException = function (e) {
  return e[a];
};
process.namespaces = {};