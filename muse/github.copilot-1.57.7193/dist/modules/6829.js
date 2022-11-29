const { EventEmitter: r } = require(2361),
  o = Symbol("AbortSignal internals");
class i {
  constructor() {
    this[o] = {
      eventEmitter: new r(),
      onabort: null,
      aborted: !1,
    };
  }
  get aborted() {
    return this[o].aborted;
  }
  get onabort() {
    return this[o].onabort;
  }
  set onabort(e) {
    this[o].onabort = e;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  removeEventListener(e, t) {
    this[o].eventEmitter.removeListener(e, t);
  }
  addEventListener(e, t) {
    this[o].eventEmitter.on(e, t);
  }
  dispatchEvent(e) {
    const t = {
        type: e,
        target: this,
      },
      n = `on${e}`;
    if ("function" == typeof this[o][n]) {
      this[n](t);
    }
    this[o].eventEmitter.emit(e, t);
  }
  fire() {
    this[o].aborted = !0;
    this.dispatchEvent("abort");
  }
}
Object.defineProperties(i.prototype, {
  addEventListener: {
    enumerable: !0,
  },
  removeEventListener: {
    enumerable: !0,
  },
  dispatchEvent: {
    enumerable: !0,
  },
  aborted: {
    enumerable: !0,
  },
  onabort: {
    enumerable: !0,
  },
});
class s extends i {
  constructor(e) {
    if (!Number.isInteger(e))
      throw new TypeError("Expected an integer, got " + typeof e);
    super();
    this[o].timerId = setTimeout(() => {
      this.fire();
    }, e);
  }
  clear() {
    clearTimeout(this[o].timerId);
  }
}
Object.defineProperties(s.prototype, {
  clear: {
    enumerable: !0,
  },
});
const a = Symbol("AbortController internals");
class c {
  constructor() {
    this[a] = {
      signal: new i(),
    };
  }
  get signal() {
    return this[a].signal;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  abort() {
    if (this[a].signal.aborted) {
      this[a].signal.fire();
    }
  }
}
Object.defineProperties(c.prototype, {
  signal: {
    enumerable: !0,
  },
  abort: {
    enumerable: !0,
  },
});
module.exports = {
  AbortController: c,
  AbortSignal: i,
  TimeoutSignal: s,
};
