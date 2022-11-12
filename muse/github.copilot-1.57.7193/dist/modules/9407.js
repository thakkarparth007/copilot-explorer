const {
    randomBytes: r
  } = require(6113),
  {
    Readable: o
  } = require(2781),
  i = e => "object" == typeof e && 0 === ["arrayBuffer", "stream", "text", "slice", "constructor"].map(t => typeof e[t]).filter(e => "function" !== e).length && "string" == typeof e.type && "number" == typeof e.size && /^(Blob|File)$/.test(e[Symbol.toStringTag]),
  s = e => `--${e}--\r\n\r\n`,
  a = (e, t, n) => {
    let r = "";
    r += `--${e}\r\n`;
    r += `Content-Disposition: form-data; name="${t}"`;
    i(n) && (r += `; filename="${n.name}"\r\n`, r += `Content-Type: ${n.type || "application/octet-stream"}`);
    return `${r}\r\n\r\n`;
  };
module.exports = {
  isFormData: e => null != e && "object" == typeof e && 0 === ["append", "delete", "get", "getAll", "has", "set", "keys", "values", "entries", "constructor"].map(t => typeof e[t]).filter(e => "function" !== e).length && "FormData" === e[Symbol.toStringTag],
  FormDataSerializer: class {
    constructor(e) {
      this.fd = e;
      this.boundary = r(8).toString("hex");
    }
    length() {
      undefined === this._length && (this._length = ((e, t) => {
        let n = 0;
        for (const [r, o] of e) {
          n += Buffer.byteLength(a(t, r, o));
          n += i(o) ? o.size : Buffer.byteLength(String(o));
          n += Buffer.byteLength("\r\n");
        }
        n += Buffer.byteLength(s(t));
        return n;
      })(this.fd, this.boundary));
      return this._length;
    }
    contentType() {
      return `multipart/form-data; boundary=${this.boundary}`;
    }
    stream() {
      return o.from(async function* (e, t) {
        for (const [n, r] of e) {
          yield a(t, n, r);
          i(r) ? yield* r.stream() : yield r;
          yield "\r\n";
        }
        yield s(t);
      }(this.fd, this.boundary));
    }
  }
};