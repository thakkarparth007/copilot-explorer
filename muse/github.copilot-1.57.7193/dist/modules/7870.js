Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Context = undefined;
exports.Context = class {
  constructor(e) {
    var t;
    this.baseContext = e;
    this.constructionStack = [];
    this.instances = new Map();
    const n =
      null === (t = new Error().stack) || undefined === t
        ? undefined
        : t.split("\n");
    if (n) {
      this.constructionStack.push(...n.slice(1));
    }
  }
  get(e) {
    const t = this.tryGet(e);
    if (t) return t;
    throw new Error(`No instance of ${e.name} has been registered.\n${this}`);
  }
  tryGet(e) {
    return (
      this.instances.get(e) ||
      (this.baseContext ? this.baseContext.tryGet(e) : undefined)
    );
  }
  set(e, t) {
    if (this.tryGet(e))
      throw new Error(
        `An instance of ${e.name} has already been registered. Use forceSet() if you're sure it's a good idea.`
      );
    this.instances.set(e, t);
  }
  forceSet(e, t) {
    this.instances.set(e, t);
  }
  toString() {
    var e;
    var t;
    let n = "    Context created at:\n";
    for (const e of this.constructionStack || []) n += `    ${e}\n`;
    n +=
      null !==
        (t =
          null === (e = this.baseContext) || undefined === e
            ? undefined
            : e.toString()) && undefined !== t
        ? t
        : "";
    return n;
  }
  get debug() {
    const e = {};
    for (const [t, n] of this.instances) e[t.name] = n;
    return e;
  }
};