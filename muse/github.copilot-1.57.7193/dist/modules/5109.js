var r, o, i, s, a, c, l, u, d, p, h, f, m, g, _, y, v, b, w;
r = require(8249);
require(888);
module.exports = void (
  r.lib.Cipher ||
  ((o = r),
  (i = o.lib),
  (s = i.Base),
  (a = i.WordArray),
  (c = i.BufferedBlockAlgorithm),
  (l = o.enc),
  l.Utf8,
  (u = l.Base64),
  (d = o.algo.EvpKDF),
  (p = i.Cipher =
    c.extend({
      cfg: s.extend(),
      createEncryptor: function (e, t) {
        return this.create(this._ENC_XFORM_MODE, e, t);
      },
      createDecryptor: function (e, t) {
        return this.create(this._DEC_XFORM_MODE, e, t);
      },
      init: function (e, t, n) {
        (this.cfg = this.cfg.extend(n)),
          (this._xformMode = e),
          (this._key = t),
          this.reset();
      },
      reset: function () {
        c.reset.call(this), this._doReset();
      },
      process: function (e) {
        return this._append(e), this._process();
      },
      finalize: function (e) {
        return e && this._append(e), this._doFinalize();
      },
      keySize: 4,
      ivSize: 4,
      _ENC_XFORM_MODE: 1,
      _DEC_XFORM_MODE: 2,
      _createHelper: (function () {
        function e(e) {
          return "string" == typeof e ? w : v;
        }
        return function (t) {
          return {
            encrypt: function (n, r, o) {
              return e(r).encrypt(t, n, r, o);
            },
            decrypt: function (n, r, o) {
              return e(r).decrypt(t, n, r, o);
            },
          };
        };
      })(),
    })),
  (i.StreamCipher = p.extend({
    _doFinalize: function () {
      return this._process(!0);
    },
    blockSize: 1,
  })),
  (h = o.mode = {}),
  (f = i.BlockCipherMode =
    s.extend({
      createEncryptor: function (e, t) {
        return this.Encryptor.create(e, t);
      },
      createDecryptor: function (e, t) {
        return this.Decryptor.create(e, t);
      },
      init: function (e, t) {
        (this._cipher = e), (this._iv = t);
      },
    })),
  (m = h.CBC =
    (function () {
      var e = f.extend();
      function t(e, t, n) {
        var r,
          o = this._iv;
        o ? ((r = o), (this._iv = void 0)) : (r = this._prevBlock);
        for (var i = 0; i < n; i++) e[t + i] ^= r[i];
      }
      return (
        (e.Encryptor = e.extend({
          processBlock: function (e, n) {
            var r = this._cipher,
              o = r.blockSize;
            t.call(this, e, n, o),
              r.encryptBlock(e, n),
              (this._prevBlock = e.slice(n, n + o));
          },
        })),
        (e.Decryptor = e.extend({
          processBlock: function (e, n) {
            var r = this._cipher,
              o = r.blockSize,
              i = e.slice(n, n + o);
            r.decryptBlock(e, n), t.call(this, e, n, o), (this._prevBlock = i);
          },
        })),
        e
      );
    })()),
  (g = (o.pad = {}).Pkcs7 =
    {
      pad: function (e, t) {
        for (
          var n = 4 * t,
            r = n - (e.sigBytes % n),
            o = (r << 24) | (r << 16) | (r << 8) | r,
            i = [],
            s = 0;
          s < r;
          s += 4
        )
          i.push(o);
        var c = a.create(i, r);
        e.concat(c);
      },
      unpad: function (e) {
        var t = 255 & e.words[(e.sigBytes - 1) >>> 2];
        e.sigBytes -= t;
      },
    }),
  (i.BlockCipher = p.extend({
    cfg: p.cfg.extend({
      mode: m,
      padding: g,
    }),
    reset: function () {
      var e;
      p.reset.call(this);
      var t = this.cfg,
        n = t.iv,
        r = t.mode;
      this._xformMode == this._ENC_XFORM_MODE
        ? (e = r.createEncryptor)
        : ((e = r.createDecryptor), (this._minBufferSize = 1)),
        this._mode && this._mode.__creator == e
          ? this._mode.init(this, n && n.words)
          : ((this._mode = e.call(r, this, n && n.words)),
            (this._mode.__creator = e));
    },
    _doProcessBlock: function (e, t) {
      this._mode.processBlock(e, t);
    },
    _doFinalize: function () {
      var e,
        t = this.cfg.padding;
      return (
        this._xformMode == this._ENC_XFORM_MODE
          ? (t.pad(this._data, this.blockSize), (e = this._process(!0)))
          : ((e = this._process(!0)), t.unpad(e)),
        e
      );
    },
    blockSize: 4,
  })),
  (_ = i.CipherParams =
    s.extend({
      init: function (e) {
        this.mixIn(e);
      },
      toString: function (e) {
        return (e || this.formatter).stringify(this);
      },
    })),
  (y = (o.format = {}).OpenSSL =
    {
      stringify: function (e) {
        var t = e.ciphertext,
          n = e.salt;
        return (
          n ? a.create([1398893684, 1701076831]).concat(n).concat(t) : t
        ).toString(u);
      },
      parse: function (e) {
        var t,
          n = u.parse(e),
          r = n.words;
        return (
          1398893684 == r[0] &&
            1701076831 == r[1] &&
            ((t = a.create(r.slice(2, 4))), r.splice(0, 4), (n.sigBytes -= 16)),
          _.create({
            ciphertext: n,
            salt: t,
          })
        );
      },
    }),
  (v = i.SerializableCipher =
    s.extend({
      cfg: s.extend({
        format: y,
      }),
      encrypt: function (e, t, n, r) {
        r = this.cfg.extend(r);
        var o = e.createEncryptor(n, r),
          i = o.finalize(t),
          s = o.cfg;
        return _.create({
          ciphertext: i,
          key: n,
          iv: s.iv,
          algorithm: e,
          mode: s.mode,
          padding: s.padding,
          blockSize: e.blockSize,
          formatter: r.format,
        });
      },
      decrypt: function (e, t, n, r) {
        return (
          (r = this.cfg.extend(r)),
          (t = this._parse(t, r.format)),
          e.createDecryptor(n, r).finalize(t.ciphertext)
        );
      },
      _parse: function (e, t) {
        return "string" == typeof e ? t.parse(e, this) : e;
      },
    })),
  (b = (o.kdf = {}).OpenSSL =
    {
      execute: function (e, t, n, r) {
        r || (r = a.random(8));
        var o = d
            .create({
              keySize: t + n,
            })
            .compute(e, r),
          i = a.create(o.words.slice(t), 4 * n);
        return (
          (o.sigBytes = 4 * t),
          _.create({
            key: o,
            iv: i,
            salt: r,
          })
        );
      },
    }),
  (w = i.PasswordBasedCipher =
    v.extend({
      cfg: v.cfg.extend({
        kdf: b,
      }),
      encrypt: function (e, t, n, r) {
        var o = (r = this.cfg.extend(r)).kdf.execute(n, e.keySize, e.ivSize);
        r.iv = o.iv;
        var i = v.encrypt.call(this, e, t, o.key, r);
        return i.mixIn(o), i;
      },
      decrypt: function (e, t, n, r) {
        (r = this.cfg.extend(r)), (t = this._parse(t, r.format));
        var o = r.kdf.execute(n, e.keySize, e.ivSize, t.salt);
        return (r.iv = o.iv), v.decrypt.call(this, e, t, o.key, r);
      },
    })))
);