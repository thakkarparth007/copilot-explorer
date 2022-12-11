var r;
r =
  r ||
  (function (e, t) {
    var M_crypto;
    if ("undefined" != typeof window && window.crypto) {
      M_crypto = window.crypto;
    }
    if (!M_crypto && "undefined" != typeof window && window.msCrypto) {
      M_crypto = window.msCrypto;
    }
    if (!M_crypto && "undefined" != typeof global && global.crypto) {
      M_crypto = global.crypto;
    }
    if (!M_crypto)
      try {
        M_crypto = require("crypto");
      } catch (e) {}
    var o = function () {
      if (M_crypto) {
        if ("function" == typeof M_crypto.getRandomValues)
          try {
            return M_crypto.getRandomValues(new Uint32Array(1))[0];
          } catch (e) {}
        if ("function" == typeof M_crypto.randomBytes)
          try {
            return M_crypto.randomBytes(4).readInt32LE();
          } catch (e) {}
      }
      throw new Error(
        "Native crypto module could not be used to get secure random number."
      );
    };
    var i =
      Object.create ||
      (function () {
        function e() {}
        return function (t) {
          var n;
          e.prototype = t;
          n = new e();
          e.prototype = null;
          return n;
        };
      })();
    var s = {};
    var a = (s.lib = {});
    var c = (a.Base = {
      extend: function (e) {
        var t = i(this);
        if (e) {
          t.mixIn(e);
        }
        if (t.hasOwnProperty("init") && this.init !== t.init) {
          t.init = function () {
            t.$super.init.apply(this, arguments);
          };
        }
        t.init.prototype = t;
        t.$super = this;
        return t;
      },
      create: function () {
        var e = this.extend();
        e.init.apply(e, arguments);
        return e;
      },
      init: function () {},
      mixIn: function (e) {
        for (var t in e)
          if (e.hasOwnProperty(t)) {
            this[t] = e[t];
          }
        if (e.hasOwnProperty("toString")) {
          this.toString = e.toString;
        }
      },
      clone: function () {
        return this.init.prototype.extend(this);
      },
    });
    var l = (a.WordArray = c.extend({
      init: function (e, t) {
        e = this.words = e || [];
        this.sigBytes = null != t ? t : 4 * e.length;
      },
      toString: function (e) {
        return (e || d).stringify(this);
      },
      concat: function (e) {
        var t = this.words;
        var n = e.words;
        var r = this.sigBytes;
        var o = e.sigBytes;
        this.clamp();
        if (r % 4)
          for (var i = 0; i < o; i++) {
            var s = (n[i >>> 2] >>> (24 - (i % 4) * 8)) & 255;
            t[(r + i) >>> 2] |= s << (24 - ((r + i) % 4) * 8);
          }
        else for (i = 0; i < o; i += 4) t[(r + i) >>> 2] = n[i >>> 2];
        this.sigBytes += o;
        return this;
      },
      clamp: function () {
        var t = this.words;
        var n = this.sigBytes;
        t[n >>> 2] &= 4294967295 << (32 - (n % 4) * 8);
        t.length = e.ceil(n / 4);
      },
      clone: function () {
        var e = c.clone.call(this);
        e.words = this.words.slice(0);
        return e;
      },
      random: function (e) {
        for (t = [], n = 0, undefined; n < e; n += 4) {
          var t;
          var n;
          t.push(o());
        }
        return new l.init(t, e);
      },
    }));
    var u = (s.enc = {});
    var d = (u.Hex = {
      stringify: function (e) {
        for (
          t = e.words, n = e.sigBytes, r = [], o = 0, undefined;
          o < n;
          o++
        ) {
          var t;
          var n;
          var r;
          var o;
          var i = (t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
          r.push((i >>> 4).toString(16));
          r.push((15 & i).toString(16));
        }
        return r.join("");
      },
      parse: function (e) {
        for (t = e.length, n = [], r = 0, undefined; r < t; r += 2) {
          var t;
          var n;
          var r;
          n[r >>> 3] |= parseInt(e.substr(r, 2), 16) << (24 - (r % 8) * 4);
        }
        return new l.init(n, t / 2);
      },
    });
    var p = (u.Latin1 = {
      stringify: function (e) {
        for (
          t = e.words, n = e.sigBytes, r = [], o = 0, undefined;
          o < n;
          o++
        ) {
          var t;
          var n;
          var r;
          var o;
          var i = (t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
          r.push(String.fromCharCode(i));
        }
        return r.join("");
      },
      parse: function (e) {
        for (t = e.length, n = [], r = 0, undefined; r < t; r++) {
          var t;
          var n;
          var r;
          n[r >>> 2] |= (255 & e.charCodeAt(r)) << (24 - (r % 4) * 8);
        }
        return new l.init(n, t);
      },
    });
    var h = (u.Utf8 = {
      stringify: function (e) {
        try {
          return decodeURIComponent(escape(p.stringify(e)));
        } catch (e) {
          throw new Error("Malformed UTF-8 data");
        }
      },
      parse: function (e) {
        return p.parse(unescape(encodeURIComponent(e)));
      },
    });
    var f = (a.BufferedBlockAlgorithm = c.extend({
      reset: function () {
        this._data = new l.init();
        this._nDataBytes = 0;
      },
      _append: function (e) {
        if ("string" == typeof e) {
          e = h.parse(e);
        }
        this._data.concat(e);
        this._nDataBytes += e.sigBytes;
      },
      _process: function (t) {
        var n;
        var r = this._data;
        var o = r.words;
        var i = r.sigBytes;
        var s = this.blockSize;
        var a = i / (4 * s);
        var c =
          (a = t ? e.ceil(a) : e.max((0 | a) - this._minBufferSize, 0)) * s;
        var u = e.min(4 * c, i);
        if (c) {
          for (var d = 0; d < c; d += s) this._doProcessBlock(o, d);
          n = o.splice(0, c);
          r.sigBytes -= u;
        }
        return new l.init(n, u);
      },
      clone: function () {
        var e = c.clone.call(this);
        e._data = this._data.clone();
        return e;
      },
      _minBufferSize: 0,
    }));
    var m =
      ((a.Hasher = f.extend({
        cfg: c.extend(),
        init: function (e) {
          this.cfg = this.cfg.extend(e);
          this.reset();
        },
        reset: function () {
          f.reset.call(this);
          this._doReset();
        },
        update: function (e) {
          this._append(e);
          this._process();
          return this;
        },
        finalize: function (e) {
          if (e) {
            this._append(e);
          }
          return this._doFinalize();
        },
        blockSize: 16,
        _createHelper: function (e) {
          return function (t, n) {
            return new e.init(n).finalize(t);
          };
        },
        _createHmacHelper: function (e) {
          return function (t, n) {
            return new m.HMAC.init(e, n).finalize(t);
          };
        },
      })),
      (s.algo = {}));
    return s;
  })(Math);
module.exports = r;
