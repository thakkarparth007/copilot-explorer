const M_http_cache_semantics_NOTSURE = require("http-cache-semantics"),
  { Headers: o } = require("headers"),
  i = (e) => ({
    url: e.url,
    method: e.method,
    headers: e.headers.plain(),
  }),
  s = (e) => ({
    status: e.status,
    headers: e.headers.plain(),
  });
module.exports = class {
  constructor(e, t, n) {
    this.policy = new M_http_cache_semantics_NOTSURE(i(e), s(t), n);
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
