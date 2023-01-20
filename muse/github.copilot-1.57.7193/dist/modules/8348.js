const t =
  "object" == typeof performance &&
  performance &&
  "function" == typeof performance.now
    ? performance
    : Date;
const n =
  "function" == typeof AbortController
    ? AbortController
    : class {
        constructor() {
          this.signal = new i();
        }
        abort() {
          this.signal.dispatchEvent("abort");
        }
      };
const r = "function" == typeof AbortSignal;
const o = "function" == typeof n.AbortSignal;
const i = r
  ? AbortSignal
  : o
  ? n.AbortController
  : class {
      constructor() {
        this.aborted = false;
        this._listeners = [];
      }
      dispatchEvent(e) {
        if ("abort" === e) {
          this.aborted = true;
          const t = {
            type: e,
            target: this,
          };
          this.onabort(t);
          this._listeners.forEach((e) => e(t), this);
        }
      }
      onabort() {}
      addEventListener(e, t) {
        if ("abort" === e) {
          this._listeners.push(t);
        }
      }
      removeEventListener(e, t) {
        if ("abort" === e) {
          this._listeners = this._listeners.filter((e) => e !== t);
        }
      }
    };
const s = new Set();
const a = (e, t) => {
  const n = `LRU_CACHE_OPTION_${e}`;
  if (u(n)) {
    d(n, `${e} option`, `options.${t}`, g);
  }
};
const c = (e, t) => {
  const n = `LRU_CACHE_METHOD_${e}`;
  if (u(n)) {
    const { prototype: r } = g;
    const { get: o } = Object.getOwnPropertyDescriptor(r, e);
    d(n, `${e} method`, `cache.${t}()`, o);
  }
};
const l = (...e) => {
  if (
    "object" == typeof process &&
    process &&
    "function" == typeof process.emitWarning
  ) {
    process.emitWarning(...e);
  } else {
    console.error(...e);
  }
};
const u = (e) => !s.has(e);
const d = (e, t, n, r) => {
  s.add(e);
  l(
    `The ${t} is deprecated. Please use ${n} instead.`,
    "DeprecationWarning",
    e,
    r
  );
};
const p = (e) => e && e === Math.floor(e) && e > 0 && isFinite(e);
const h = (e) =>
  p(e)
    ? e <= Math.pow(2, 8)
      ? Uint8Array
      : e <= Math.pow(2, 16)
      ? Uint16Array
      : e <= Math.pow(2, 32)
      ? Uint32Array
      : e <= Number.MAX_SAFE_INTEGER
      ? f
      : null
    : null;
class f extends Array {
  constructor(e) {
    super(e);
    this.fill(0);
  }
}
class m {
  constructor(e) {
    if (0 === e) return [];
    const t = h(e);
    this.heap = new t(e);
    this.length = 0;
  }
  push(e) {
    this.heap[this.length++] = e;
  }
  pop() {
    return this.heap[--this.length];
  }
}
class g {
  constructor(e = {}) {
    const {
      max: t = 0,
      ttl: n,
      ttlResolution: r = 1,
      ttlAutopurge: o,
      updateAgeOnGet: i,
      updateAgeOnHas: c,
      allowStale: d,
      dispose: f,
      disposeAfter: _,
      noDisposeOnSet: y,
      noUpdateTTL: v,
      maxSize: b = 0,
      sizeCalculation: w,
      fetchMethod: x,
      fetchContext: E,
      noDeleteOnFetchRejection: C,
      noDeleteOnStaleGet: S,
    } = e;
    const { length: T, maxAge: k, stale: I } = e instanceof g ? {} : e;
    if (0 !== t && !p(t))
      throw new TypeError("max option must be a nonnegative integer");
    const P = t ? h(t) : Array;
    if (!P) throw new Error("invalid max value: " + t);
    this.max = t;
    this.maxSize = b;
    this.sizeCalculation = w || T;
    if (this.sizeCalculation) {
      if (!this.maxSize)
        throw new TypeError(
          "cannot set sizeCalculation without setting maxSize"
        );
      if ("function" != typeof this.sizeCalculation)
        throw new TypeError("sizeCalculation set to non-function");
    }
    this.fetchMethod = x || null;
    if (this.fetchMethod && "function" != typeof this.fetchMethod)
      throw new TypeError("fetchMethod must be a function if specified");
    this.fetchContext = E;
    if (!this.fetchMethod && void 0 !== E)
      throw new TypeError("cannot set fetchContext without fetchMethod");
    this.keyMap = new Map();
    this.keyList = new Array(t).fill(null);
    this.valList = new Array(t).fill(null);
    this.next = new P(t);
    this.prev = new P(t);
    this.head = 0;
    this.tail = 0;
    this.free = new m(t);
    this.initialFill = 1;
    this.size = 0;
    if ("function" == typeof f) {
      this.dispose = f;
    }
    if ("function" == typeof _) {
      this.disposeAfter = _;
      this.disposed = [];
    } else {
      this.disposeAfter = null;
      this.disposed = null;
    }
    this.noDisposeOnSet = !!y;
    this.noUpdateTTL = !!v;
    this.noDeleteOnFetchRejection = !!C;
    if (0 !== this.maxSize) {
      if (!p(this.maxSize))
        throw new TypeError("maxSize must be a positive integer if specified");
      this.initializeSizeTracking();
    }
    this.allowStale = !!d || !!I;
    this.noDeleteOnStaleGet = !!S;
    this.updateAgeOnGet = !!i;
    this.updateAgeOnHas = !!c;
    this.ttlResolution = p(r) || 0 === r ? r : 1;
    this.ttlAutopurge = !!o;
    this.ttl = n || k || 0;
    if (this.ttl) {
      if (!p(this.ttl))
        throw new TypeError("ttl must be a positive integer if specified");
      this.initializeTTLTracking();
    }
    if (0 === this.max && 0 === this.ttl && 0 === this.maxSize)
      throw new TypeError("At least one of max, maxSize, or ttl is required");
    if (!this.ttlAutopurge && !this.max && !this.maxSize) {
      const e = "LRU_CACHE_UNBOUNDED";
      if (u(e)) {
        s.add(e);
        l(
          "TTL caching without ttlAutopurge, max, or maxSize can result in unbounded memory consumption.",
          "UnboundedCacheWarning",
          e,
          g
        );
      }
    }
    if (I) {
      a("stale", "allowStale");
    }
    if (k) {
      a("maxAge", "ttl");
    }
    if (T) {
      a("length", "sizeCalculation");
    }
  }
  getRemainingTTL(e) {
    return this.has(e, {
      updateAgeOnHas: false,
    })
      ? 1 / 0
      : 0;
  }
  initializeTTLTracking() {
    this.ttls = new f(this.max);
    this.starts = new f(this.max);
    this.setItemTTL = (e, n, r = t.now()) => {
      this.starts[e] = 0 !== n ? r : 0;
      this.ttls[e] = n;
      if (0 !== n && this.ttlAutopurge) {
        const t = setTimeout(() => {
          this.isStale(e) && this.delete(this.keyList[e]);
        }, n + 1);
        t.unref && t.unref();
      }
    };
    this.updateItemAge = (e) => {
      this.starts[e] = 0 !== this.ttls[e] ? t.now() : 0;
    };
    let e = 0;
    const n = () => {
      const n = t.now();
      if (this.ttlResolution > 0) {
        e = n;
        const t = setTimeout(() => (e = 0), this.ttlResolution);
        if (t.unref) {
          t.unref();
        }
      }
      return n;
    };
    this.getRemainingTTL = (t) => {
      const r = this.keyMap.get(t);
      return undefined === r
        ? 0
        : 0 === this.ttls[r] || 0 === this.starts[r]
        ? 1 / 0
        : this.starts[r] + this.ttls[r] - (e || n());
    };
    this.isStale = (t) =>
      0 !== this.ttls[t] &&
      0 !== this.starts[t] &&
      (e || n()) - this.starts[t] > this.ttls[t];
  }
  updateItemAge(e) {}
  setItemTTL(e, t, n) {}
  isStale(e) {
    return false;
  }
  initializeSizeTracking() {
    this.calculatedSize = 0;
    this.sizes = new f(this.max);
    this.removeItemSize = (e) => {
      this.calculatedSize -= this.sizes[e];
      this.sizes[e] = 0;
    };
    this.requireSize = (e, t, n, r) => {
      if (!p(n)) {
        if (!r)
          throw new TypeError("invalid size value (must be positive integer)");
        if ("function" != typeof r)
          throw new TypeError("sizeCalculation must be a function");
        n = r(t, e);
        if (!p(n))
          throw new TypeError(
            "sizeCalculation return invalid (expect positive integer)"
          );
      }
      return n;
    };
    this.addItemSize = (e, t) => {
      this.sizes[e] = t;
      const n = this.maxSize - this.sizes[e];
      for (; this.calculatedSize > n; ) this.evict(true);
      this.calculatedSize += this.sizes[e];
    };
  }
  removeItemSize(e) {}
  addItemSize(e, t) {}
  requireSize(e, t, n, r) {
    if (n || r)
      throw new TypeError("cannot set size without setting maxSize on cache");
  }
  *indexes({ allowStale: e = this.allowStale } = {}) {
    if (this.size)
      for (
        let t = this.tail;
        this.isValidIndex(t) &&
        ((!e && this.isStale(t)) || (yield t), t !== this.head);

      )
        t = this.prev[t];
  }
  *rindexes({ allowStale: e = this.allowStale } = {}) {
    if (this.size)
      for (
        let t = this.head;
        this.isValidIndex(t) &&
        ((!e && this.isStale(t)) || (yield t), t !== this.tail);

      )
        t = this.next[t];
  }
  isValidIndex(e) {
    return this.keyMap.get(this.keyList[e]) === e;
  }
  *entries() {
    for (const e of this.indexes()) yield [this.keyList[e], this.valList[e]];
  }
  *rentries() {
    for (const e of this.rindexes()) yield [this.keyList[e], this.valList[e]];
  }
  *keys() {
    for (const e of this.indexes()) yield this.keyList[e];
  }
  *rkeys() {
    for (const e of this.rindexes()) yield this.keyList[e];
  }
  *values() {
    for (const e of this.indexes()) yield this.valList[e];
  }
  *rvalues() {
    for (const e of this.rindexes()) yield this.valList[e];
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  find(e, t = {}) {
    for (const n of this.indexes())
      if (e(this.valList[n], this.keyList[n], this))
        return this.get(this.keyList[n], t);
  }
  forEach(e, t = this) {
    for (const n of this.indexes())
      e.call(t, this.valList[n], this.keyList[n], this);
  }
  rforEach(e, t = this) {
    for (const n of this.rindexes())
      e.call(t, this.valList[n], this.keyList[n], this);
  }
  get prune() {
    c("prune", "purgeStale");
    return this.purgeStale;
  }
  purgeStale() {
    let e = false;
    for (const t of this.rindexes({
      allowStale: true,
    }))
      if (this.isStale(t)) {
        this.delete(this.keyList[t]);
        e = true;
      }
    return e;
  }
  dump() {
    const e = [];
    for (const n of this.indexes({
      allowStale: true,
    })) {
      const r = this.keyList[n];
      const o = this.valList[n];
      const i = {
        value: this.isBackgroundFetch(o) ? o.__staleWhileFetching : o,
      };
      if (this.ttls) {
        i.ttl = this.ttls[n];
        const e = t.now() - this.starts[n];
        i.start = Math.floor(Date.now() - e);
      }
      if (this.sizes) {
        i.size = this.sizes[n];
      }
      e.unshift([r, i]);
    }
    return e;
  }
  load(e) {
    this.clear();
    for (const [n, r] of e) {
      if (r.start) {
        const e = Date.now() - r.start;
        r.start = t.now() - e;
      }
      this.set(n, r.value, r);
    }
  }
  dispose(e, t, n) {}
  set(
    e,
    t,
    {
      ttl: n = this.ttl,
      start: r,
      noDisposeOnSet: o = this.noDisposeOnSet,
      size: i = 0,
      sizeCalculation: s = this.sizeCalculation,
      noUpdateTTL: a = this.noUpdateTTL,
    } = {}
  ) {
    i = this.requireSize(e, t, i, s);
    if (this.maxSize && i > this.maxSize) return this;
    let c = 0 === this.size ? undefined : this.keyMap.get(e);
    if (undefined === c) {
      c = this.newIndex();
      this.keyList[c] = e;
      this.valList[c] = t;
      this.keyMap.set(e, c);
      this.next[this.tail] = c;
      this.prev[c] = this.tail;
      this.tail = c;
      this.size++;
      this.addItemSize(c, i);
      a = false;
    } else {
      const n = this.valList[c];
      if (t !== n) {
        if (this.isBackgroundFetch(n)) {
          n.__abortController.abort();
        } else {
          if (o) {
            this.dispose(n, e, "set");
            if (this.disposeAfter) {
              this.disposed.push([n, e, "set"]);
            }
          }
        }
        this.removeItemSize(c);
        this.valList[c] = t;
        this.addItemSize(c, i);
      }
      this.moveToTail(c);
    }
    if (0 === n || 0 !== this.ttl || this.ttls) {
      this.initializeTTLTracking();
    }
    if (a) {
      this.setItemTTL(c, n, r);
    }
    if (this.disposeAfter)
      for (; this.disposed.length; )
        this.disposeAfter(...this.disposed.shift());
    return this;
  }
  newIndex() {
    return 0 === this.size
      ? this.tail
      : this.size === this.max && 0 !== this.max
      ? this.evict(false)
      : 0 !== this.free.length
      ? this.free.pop()
      : this.initialFill++;
  }
  pop() {
    if (this.size) {
      const e = this.valList[this.head];
      this.evict(true);
      return e;
    }
  }
  evict(e) {
    const t = this.head;
    const n = this.keyList[t];
    const r = this.valList[t];
    if (this.isBackgroundFetch(r)) {
      r.__abortController.abort();
    } else {
      this.dispose(r, n, "evict");
      if (this.disposeAfter) {
        this.disposed.push([r, n, "evict"]);
      }
    }
    this.removeItemSize(t);
    if (e) {
      this.keyList[t] = null;
      this.valList[t] = null;
      this.free.push(t);
    }
    this.head = this.next[t];
    this.keyMap.delete(n);
    this.size--;
    return t;
  }
  has(e, { updateAgeOnHas: t = this.updateAgeOnHas } = {}) {
    const n = this.keyMap.get(e);
    return (
      undefined !== n && !this.isStale(n) && (t && this.updateItemAge(n), true)
    );
  }
  peek(e, { allowStale: t = this.allowStale } = {}) {
    const n = this.keyMap.get(e);
    if (undefined !== n && (t || !this.isStale(n))) {
      const e = this.valList[n];
      return this.isBackgroundFetch(e) ? e.__staleWhileFetching : e;
    }
  }
  backgroundFetch(e, t, r, o) {
    const i = undefined === t ? undefined : this.valList[t];
    if (this.isBackgroundFetch(i)) return i;
    const s = new n();
    const a = {
      signal: s.signal,
      options: r,
      context: o,
    };
    const c = new Promise((t) => t(this.fetchMethod(e, i, a))).then(
      (t) => (s.signal.aborted || this.set(e, t, a.options), t),
      (n) => {
        if (this.valList[t] === c) {
          if (
            r.noDeleteOnFetchRejection &&
            undefined !== c.__staleWhileFetching
          ) {
            this.valList[t] = c.__staleWhileFetching;
          } else {
            this.delete(e);
          }
        }
        if (c.__returned === c) throw n;
      }
    );
    c.__abortController = s;
    c.__staleWhileFetching = i;
    c.__returned = null;
    if (undefined === t) {
      this.set(e, c, a.options);
      t = this.keyMap.get(e);
    } else {
      this.valList[t] = c;
    }
    return c;
  }
  isBackgroundFetch(e) {
    return (
      e &&
      "object" == typeof e &&
      "function" == typeof e.then &&
      Object.prototype.hasOwnProperty.call(e, "__staleWhileFetching") &&
      Object.prototype.hasOwnProperty.call(e, "__returned") &&
      (e.__returned === e || null === e.__returned)
    );
  }
  async fetch(
    e,
    {
      allowStale: t = this.allowStale,
      updateAgeOnGet: n = this.updateAgeOnGet,
      noDeleteOnStaleGet: r = this.noDeleteOnStaleGet,
      ttl: o = this.ttl,
      noDisposeOnSet: i = this.noDisposeOnSet,
      size: s = 0,
      sizeCalculation: a = this.sizeCalculation,
      noUpdateTTL: c = this.noUpdateTTL,
      noDeleteOnFetchRejection: l = this.noDeleteOnFetchRejection,
      fetchContext: u = this.fetchContext,
      forceRefresh: d = false,
    } = {}
  ) {
    if (!this.fetchMethod)
      return this.get(e, {
        allowStale: t,
        updateAgeOnGet: n,
        noDeleteOnStaleGet: r,
      });
    const p = {
      allowStale: t,
      updateAgeOnGet: n,
      noDeleteOnStaleGet: r,
      ttl: o,
      noDisposeOnSet: i,
      size: s,
      sizeCalculation: a,
      noUpdateTTL: c,
      noDeleteOnFetchRejection: l,
    };
    let h = this.keyMap.get(e);
    if (undefined === h) {
      const t = this.backgroundFetch(e, h, p, u);
      return (t.__returned = t);
    }
    {
      const r = this.valList[h];
      if (this.isBackgroundFetch(r))
        return t && undefined !== r.__staleWhileFetching
          ? r.__staleWhileFetching
          : (r.__returned = r);
      if (!d && !this.isStale(h)) {
        this.moveToTail(h);
        if (n) {
          this.updateItemAge(h);
        }
        return r;
      }
      const o = this.backgroundFetch(e, h, p, u);
      return t && undefined !== o.__staleWhileFetching
        ? o.__staleWhileFetching
        : (o.__returned = o);
    }
  }
  get(
    e,
    {
      allowStale: t = this.allowStale,
      updateAgeOnGet: n = this.updateAgeOnGet,
      noDeleteOnStaleGet: r = this.noDeleteOnStaleGet,
    } = {}
  ) {
    const o = this.keyMap.get(e);
    if (undefined !== o) {
      const i = this.valList[o];
      const s = this.isBackgroundFetch(i);
      if (this.isStale(o))
        return s
          ? t
            ? i.__staleWhileFetching
            : undefined
          : (r || this.delete(e), t ? i : undefined);
      if (s) return;
      this.moveToTail(o);
      if (n) {
        this.updateItemAge(o);
      }
      return i;
    }
  }
  connect(e, t) {
    this.prev[t] = e;
    this.next[e] = t;
  }
  moveToTail(e) {
    if (e !== this.tail) {
      if (e === this.head) {
        this.head = this.next[e];
      } else {
        this.connect(this.prev[e], this.next[e]);
      }
      this.connect(this.tail, e);
      this.tail = e;
    }
  }
  get del() {
    c("del", "delete");
    return this.delete;
  }
  delete(e) {
    let t = false;
    if (0 !== this.size) {
      const n = this.keyMap.get(e);
      if (undefined !== n) {
        t = true;
        if (1 === this.size) this.clear();
        else {
          this.removeItemSize(n);
          const t = this.valList[n];
          if (this.isBackgroundFetch(t)) {
            t.__abortController.abort();
          } else {
            this.dispose(t, e, "delete");
            if (this.disposeAfter) {
              this.disposed.push([t, e, "delete"]);
            }
          }
          this.keyMap.delete(e);
          this.keyList[n] = null;
          this.valList[n] = null;
          if (n === this.tail) {
            this.tail = this.prev[n];
          } else {
            if (n === this.head) {
              this.head = this.next[n];
            } else {
              this.next[this.prev[n]] = this.next[n];
              this.prev[this.next[n]] = this.prev[n];
            }
          }
          this.size--;
          this.free.push(n);
        }
      }
    }
    if (this.disposed)
      for (; this.disposed.length; )
        this.disposeAfter(...this.disposed.shift());
    return t;
  }
  clear() {
    for (const e of this.rindexes({
      allowStale: true,
    })) {
      const t = this.valList[e];
      if (this.isBackgroundFetch(t)) t.__abortController.abort();
      else {
        const n = this.keyList[e];
        this.dispose(t, n, "delete");
        if (this.disposeAfter) {
          this.disposed.push([t, n, "delete"]);
        }
      }
    }
    this.keyMap.clear();
    this.valList.fill(null);
    this.keyList.fill(null);
    if (this.ttls) {
      this.ttls.fill(0);
      this.starts.fill(0);
    }
    if (this.sizes) {
      this.sizes.fill(0);
    }
    this.head = 0;
    this.tail = 0;
    this.initialFill = 1;
    this.free.length = 0;
    this.calculatedSize = 0;
    this.size = 0;
    if (this.disposed)
      for (; this.disposed.length; )
        this.disposeAfter(...this.disposed.shift());
  }
  get reset() {
    c("reset", "clear");
    return this.clear;
  }
  get length() {
    ((e, t) => {
      const n = "LRU_CACHE_PROPERTY_length";
      if (u(n)) {
        const { prototype: t } = g;
        const { get: r } = Object.getOwnPropertyDescriptor(t, e);
        d(n, "length property", "cache.size", r);
      }
    })("length");
    return this.size;
  }
  static get AbortController() {
    return n;
  }
  static get AbortSignal() {
    return i;
  }
}
module.exports = g;