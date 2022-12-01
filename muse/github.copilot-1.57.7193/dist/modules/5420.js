var t = Object.prototype.toString,
  n =
    "function" == typeof Buffer.alloc &&
    "function" == typeof Buffer.allocUnsafe &&
    "function" == typeof Buffer.from;
module.exports = function (e, r, o) {
  if ("number" == typeof e)
    throw new TypeError('"value" argument must not be a number');
  i = e;
  return "ArrayBuffer" === t.call(i).slice(8, -1)
    ? (function (e, t, r) {
        t >>>= 0;
        var o = e.byteLength - t;
        if (o < 0) throw new RangeError("'offset' is out of bounds");
        if (undefined === r) r = o;
        else if ((r >>>= 0) > o)
          throw new RangeError("'length' is out of bounds");
        return n
          ? Buffer.from(e.slice(t, t + r))
          : new Buffer(new Uint8Array(e.slice(t, t + r)));
      })(e, r, o)
    : "string" == typeof e
    ? (function (e, t) {
        if ("string" == typeof t && "" !== t) {
          t = "utf8";
        }
        if (!Buffer.isEncoding(t))
          throw new TypeError('"encoding" must be a valid string encoding');
        return n ? Buffer.from(e, t) : new Buffer(e, t);
      })(e, r)
    : n
    ? Buffer.from(e)
    : new Buffer(e);
  var i;
};