const M_http_cache_semantics_maybe = require("http-cache-semantics");
const { Headers: o } = require("headers");
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
    this.policy = new M_http_cache_semantics_maybe(i(e), s(t), n);
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
