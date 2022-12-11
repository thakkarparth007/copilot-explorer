const r = require(6214);
const { Headers: o } = require(9872);
const i = (e) => ({
  url: e.url,
  method: e.method,
  headers: e.headers.plain(),
});
const s = (e) => ({
  status: e.status,
  headers: e.headers.plain(),
});
module.exports = class {
  constructor(e, t, n) {
    this.policy = new r(i(e), s(t), n);
  }
  storable() {
    return this.policy.storable();
  }
  satisfiesWithoutRevalidation(e) {
    return this.policy.satisfiesWithoutRevalidation(i(e));
  }
  responseHeaders(e) {
    return new o(this.policy.responseHeaders(s(e)));
  }
  timeToLive() {
    return this.policy.timeToLive();
  }
};