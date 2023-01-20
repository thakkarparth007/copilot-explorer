const { EventEmitter: r } = require("events");
const o = Symbol("AbortSignal internals");
class i {
  constructor() {
    this[o] = {
      eventEmitter: new r(),
      onabort: null,
      aborted: false,
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
    };
    const n = `on${e}`;
    if ("function" == typeof this[o][n]) {
      this[n](t);
    }
    this[o].eventEmitter.emit(e, t);
  }
  fire() {
    this[o].aborted = true;
    this.dispatchEvent("abort");
  }
}
Object.defineProperties(i.prototype, {
  addEventListener: {
    enumerable: true,
  },
  removeEventListener: {
    enumerable: true,
  },
  dispatchEvent: {
    enumerable: true,
  },
  aborted: {
    enumerable: true,
  },
  onabort: {
    enumerable: true,
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
    enumerable: true,
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
    enumerable: true,
  },
  abort: {
    enumerable: true,
  },
});
module.exports = {
  AbortController: c,
  AbortSignal: i,
  TimeoutSignal: s,
};