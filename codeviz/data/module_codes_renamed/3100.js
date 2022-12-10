const r = require("clipboard")("helix-fetch:core"),
  {
    request: o,
    setupContext: i,
    resetContext: s,
    RequestAbortedError: a,
    ALPN_HTTP2: c,
    ALPN_HTTP2C: l,
    ALPN_HTTP1_1: u,
    ALPN_HTTP1_0: d,
  } = require("request-core");
class p {
  constructor(e) {
    this.options = {
      ...(e || {}),
    };
    i(this);
  }
  api() {
    return {
      request: async (e, t) => this.request(e, t),
      context: (e = {}) => new p(e).api(),
      reset: async () => this.reset(),
      RequestAbortedError: a,
      ALPN_HTTP2: c,
      ALPN_HTTP2C: l,
      ALPN_HTTP1_1: u,
      ALPN_HTTP1_0: d,
    };
  }
  async request(e, t) {
    return o(this, e, t);
  }
  async reset() {
    r("resetting context");
    return s(this);
  }
}
module.exports = new p().api();
