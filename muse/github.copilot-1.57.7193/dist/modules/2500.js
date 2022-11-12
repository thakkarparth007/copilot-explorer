const {
    Readable: r
  } = require(2781),
  {
    Headers: o
  } = require(9872),
  {
    Response: i
  } = require(2981),
  s = Symbol("CacheableResponse internals");
class a extends i {
  constructor(e, t) {
    super(e, t);
    const n = new o(t.headers);
    this[s] = {
      headers: n,
      bufferedBody: e
    };
  }
  get headers() {
    return this[s].headers;
  }
  set headers(e) {
    if (!(e instanceof o)) throw new TypeError("instance of Headers expected");
    this[s].headers = e;
  }
  get body() {
    return r.from(this[s].bufferedBody);
  }
  get bodyUsed() {
    return !1;
  }
  async buffer() {
    return this[s].bufferedBody;
  }
  async arrayBuffer() {
    return (e = this[s].bufferedBody).buffer.slice(e.byteOffset, e.byteOffset + e.byteLength);
    var e;
  }
  async text() {
    return this[s].bufferedBody.toString();
  }
  async json() {
    return JSON.parse(await this.text());
  }
  clone() {
    const {
      url: e,
      status: t,
      statusText: n,
      headers: r,
      httpVersion: o,
      decoded: i,
      counter: c
    } = this;
    return new a(this[s].bufferedBody, {
      url: e,
      status: t,
      statusText: n,
      headers: r,
      httpVersion: o,
      decoded: i,
      counter: c
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
}
module.exports = {
  cacheableResponse: async e => {
    const t = await e.buffer(),
      {
        url: n,
        status: r,
        statusText: o,
        headers: i,
        httpVersion: s,
        decoded: c,
        counter: l
      } = e;
    return new a(t, {
      url: n,
      status: r,
      statusText: o,
      headers: i,
      httpVersion: s,
      decoded: c,
      counter: l
    });
  }
};