var r,
  o,
  i = undefined !== i ? i : {};
if (
  undefined ===
  (o =
    "function" ==
    typeof (r = function () {
      var t,
        r = {};
      for (t in i)
        if (i.hasOwnProperty(t)) {
          r[t] = i[t];
        }
      var o,
        s,
        a = [],
        c = "./this.program",
        l = function (e, t) {
          throw t;
        },
        u = !1,
        d = !1;
      u = "object" == typeof window;
      d = "function" == typeof importScripts;
      o =
        "object" == typeof process &&
        "object" == typeof process.versions &&
        "string" == typeof process.versions.node;
      s = !u && !o && !d;
      var p,
        h,
        f,
        m,
        g,
        _ = "";
      if (o) {
        _ = d ? require(3055_622).dirname(_) + "/" : __dirname + "/";
        p = function (e, t) {
          if (m) {
            m = require(3055_747);
          }
          if (g) {
            g = require(3055_622);
          }
          e = g.normalize(e);
          return m.readFileSync(e, t ? null : "utf8");
        };
        f = function (e) {
          var t = p(e, !0);
          if (t.buffer) {
            t = new Uint8Array(t);
          }
          O(t.buffer);
          return t;
        };
        if (process.argv.length > 1) {
          c = process.argv[1].replace(/\\/g, "/");
        }
        a = process.argv.slice(2);
        module.exports = i;
        l = function (e) {
          process.exit(e);
        };
        i.inspect = function () {
          return "[Emscripten Module object]";
        };
      } else {
        if (s) {
          if ("undefined" != typeof read) {
            p = function (e) {
              return read(e);
            };
          }
          f = function (e) {
            var t;
            return "function" == typeof readbuffer
              ? new Uint8Array(readbuffer(e))
              : (O("object" == typeof (t = read(e, "binary"))), t);
          };
          if ("undefined" != typeof scriptArgs) {
            a = scriptArgs;
          } else {
            if (undefined !== arguments) {
              a = arguments;
            }
          }
          if ("function" == typeof quit) {
            l = function (e) {
              quit(e);
            };
          }
          if ("undefined" != typeof print) {
            if ("undefined" == typeof console) {
              console = {};
            }
            console.log = print;
            console.warn = console.error =
              "undefined" != typeof printErr ? printErr : print;
          }
        } else {
          if (u || d) {
            if (d) {
              _ = self.location.href;
            } else {
              if ("undefined" != typeof document && document.currentScript) {
                _ = document.currentScript.src;
              }
            }
            _ =
              0 !== _.indexOf("blob:")
                ? _.substr(0, _.lastIndexOf("/") + 1)
                : "";
            p = function (e) {
              var t = new XMLHttpRequest();
              t.open("GET", e, !1);
              t.send(null);
              return t.responseText;
            };
            if (d) {
              f = function (e) {
                var t = new XMLHttpRequest();
                t.open("GET", e, !1);
                t.responseType = "arraybuffer";
                t.send(null);
                return new Uint8Array(t.response);
              };
            }
            h = function (e, t, n) {
              var r = new XMLHttpRequest();
              r.open("GET", e, !0);
              r.responseType = "arraybuffer";
              r.onload = function () {
                if (200 == r.status || (0 == r.status && r.response)) {
                  t(r.response);
                } else {
                  n();
                }
              };
              r.onerror = n;
              r.send(null);
            };
          }
        }
      }
      if (i.print) {
        console.log.bind(console);
      }
      var y = i.printErr || console.warn.bind(console);
      for (t in r)
        if (r.hasOwnProperty(t)) {
          i[t] = r[t];
        }
      r = null;
      if (i.arguments) {
        a = i.arguments;
      }
      if (i.thisProgram) {
        c = i.thisProgram;
      }
      if (i.quit) {
        l = i.quit;
      }
      var v,
        b = 16,
        w = [];
      function x(e, t) {
        if (!v) {
          v = new WeakMap();
          for (var n = 0; n < J.length; n++) {
            var r = J.get(n);
            if (r) {
              v.set(r, n);
            }
          }
        }
        if (v.has(e)) return v.get(e);
        var o = (function () {
          if (w.length) return w.pop();
          try {
            J.grow(1);
          } catch (e) {
            if (!(e instanceof RangeError)) throw e;
            throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
          }
          return J.length - 1;
        })();
        try {
          J.set(o, e);
        } catch (n) {
          if (!(n instanceof TypeError)) throw n;
          var i = (function (e, t) {
            if ("function" == typeof WebAssembly.Function) {
              for (
                var n = {
                    i: "i32",
                    j: "i64",
                    f: "f32",
                    d: "f64",
                  },
                  r = {
                    parameters: [],
                    results: "v" == t[0] ? [] : [n[t[0]]],
                  },
                  o = 1;
                o < t.length;
                ++o
              )
                r.parameters.push(n[t[o]]);
              return new WebAssembly.Function(r, e);
            }
            var i = [1, 0, 1, 96],
              s = t.slice(0, 1),
              a = t.slice(1),
              c = {
                i: 127,
                j: 126,
                f: 125,
                d: 124,
              };
            for (i.push(a.length), o = 0; o < a.length; ++o) i.push(c[a[o]]);
            if ("v" == s) {
              i.push(0);
            } else {
              i = i.concat([1, c[s]]);
            }
            i[1] = i.length - 2;
            var l = new Uint8Array(
                [0, 97, 115, 109, 1, 0, 0, 0].concat(
                  i,
                  [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]
                )
              ),
              u = new WebAssembly.Module(l);
            return new WebAssembly.Instance(u, {
              e: {
                f: e,
              },
            }).exports.f;
          })(e, t);
          J.set(o, i);
        }
        v.set(e, o);
        return o;
      }
      var E,
        C = function (e) {},
        S = i.dynamicLibraries || [];
      if (i.wasmBinary) {
        E = i.wasmBinary;
      }
      var T,
        k = i.noExitRuntime || !0;
      function I(e, t, n, r) {
        switch (
          ("*" === (n = n || "i8").charAt(n.length - 1) && (n = "i32"), n)
        ) {
          case "i1":
          case "i8":
            R[e >> 0] = t;
            break;
          case "i16":
            L[e >> 1] = t;
            break;
          case "i32":
            $[e >> 2] = t;
            break;
          case "i64":
            pe = [
              t >>> 0,
              ((de = t),
              +Math.abs(de) >= 1
                ? de > 0
                  ? (0 | Math.min(+Math.floor(de / 4294967296), 4294967295)) >>>
                    0
                  : ~~+Math.ceil((de - +(~~de >>> 0)) / 4294967296) >>> 0
                : 0),
            ];
            $[e >> 2] = pe[0];
            $[(e + 4) >> 2] = pe[1];
            break;
          case "float":
            D[e >> 2] = t;
            break;
          case "double":
            F[e >> 3] = t;
            break;
          default:
            se("invalid type for setValue: " + n);
        }
      }
      function P(e, t, n) {
        switch (
          ("*" === (t = t || "i8").charAt(t.length - 1) && (t = "i32"), t)
        ) {
          case "i1":
          case "i8":
            return R[e >> 0];
          case "i16":
            return L[e >> 1];
          case "i32":
          case "i64":
            return $[e >> 2];
          case "float":
            return D[e >> 2];
          case "double":
            return F[e >> 3];
          default:
            se("invalid type for getValue: " + t);
        }
        return null;
      }
      if ("object" != typeof WebAssembly) {
        se("no native wasm support detected");
      }
      var A = !1;
      function O(e, t) {
        if (e) {
          se("Assertion failed: " + t);
        }
      }
      var N,
        R,
        M,
        L,
        $,
        D,
        F,
        j = 1,
        q =
          "undefined" != typeof TextDecoder
            ? new TextDecoder("utf8")
            : undefined;
      function B(e, t, n) {
        for (var r = t + n, o = t; e[o] && !(o >= r); ) ++o;
        if (o - t > 16 && e.subarray && q) return q.decode(e.subarray(t, o));
        for (var i = ""; t < o; ) {
          var s = e[t++];
          if (128 & s) {
            var a = 63 & e[t++];
            if (192 != (224 & s)) {
              var c = 63 & e[t++];
              if (
                (s =
                  224 == (240 & s)
                    ? ((15 & s) << 12) | (a << 6) | c
                    : ((7 & s) << 18) | (a << 12) | (c << 6) | (63 & e[t++])) <
                65536
              )
                i += String.fromCharCode(s);
              else {
                var l = s - 65536;
                i += String.fromCharCode(55296 | (l >> 10), 56320 | (1023 & l));
              }
            } else i += String.fromCharCode(((31 & s) << 6) | a);
          } else i += String.fromCharCode(s);
        }
        return i;
      }
      function U(e, t) {
        return e ? B(M, e, t) : "";
      }
      function H(e, t, n, r) {
        if (!(r > 0)) return 0;
        for (var o = n, i = n + r - 1, s = 0; s < e.length; ++s) {
          var a = e.charCodeAt(s);
          if (a >= 55296 && a <= 57343) {
            a = (65536 + ((1023 & a) << 10)) | (1023 & e.charCodeAt(++s));
          }
          if (a <= 127) {
            if (n >= i) break;
            t[n++] = a;
          } else if (a <= 2047) {
            if (n + 1 >= i) break;
            (t[n++] = 192 | (a >> 6)), (t[n++] = 128 | (63 & a));
          } else if (a <= 65535) {
            if (n + 2 >= i) break;
            (t[n++] = 224 | (a >> 12)),
              (t[n++] = 128 | ((a >> 6) & 63)),
              (t[n++] = 128 | (63 & a));
          } else {
            if (n + 3 >= i) break;
            (t[n++] = 240 | (a >> 18)),
              (t[n++] = 128 | ((a >> 12) & 63)),
              (t[n++] = 128 | ((a >> 6) & 63)),
              (t[n++] = 128 | (63 & a));
          }
        }
        t[n] = 0;
        return n - o;
      }
      function z(e, t, n) {
        return H(e, M, t, n);
      }
      function G(e) {
        for (var t = 0, n = 0; n < e.length; ++n) {
          var r = e.charCodeAt(n);
          if (r >= 55296 && r <= 57343) {
            r = (65536 + ((1023 & r) << 10)) | (1023 & e.charCodeAt(++n));
          }
          if (r <= 127) {
            ++t;
          } else {
            t += r <= 2047 ? 2 : r <= 65535 ? 3 : 4;
          }
        }
        return t;
      }
      function V(e) {
        var t = G(e) + 1,
          n = Ve(t);
        H(e, R, n, t);
        return n;
      }
      function W(e) {
        N = e;
        i.HEAP8 = R = new Int8Array(e);
        i.HEAP16 = L = new Int16Array(e);
        i.HEAP32 = $ = new Int32Array(e);
        i.HEAPU8 = M = new Uint8Array(e);
        i.HEAPU16 = new Uint16Array(e);
        i.HEAPU32 = new Uint32Array(e);
        i.HEAPF32 = D = new Float32Array(e);
        i.HEAPF64 = F = new Float64Array(e);
      }
      var K = i.INITIAL_MEMORY || 33554432;
      if (
        (T = i.wasmMemory
          ? i.wasmMemory
          : new WebAssembly.Memory({
              initial: K / 65536,
              maximum: 32768,
            }))
      ) {
        N = T.buffer;
      }
      K = N.byteLength;
      W(N);
      var J = new WebAssembly.Table({
          initial: 13,
          element: "anyfunc",
        }),
        X = [],
        Q = [],
        Y = [],
        Z = [],
        ee = !1,
        te = 0,
        ne = null,
        re = null;
      function oe(e) {
        te++;
        if (i.monitorRunDependencies) {
          i.monitorRunDependencies(te);
        }
      }
      function ie(e) {
        te--;
        if (i.monitorRunDependencies) {
          i.monitorRunDependencies(te);
        }
        if (0 == te && (null !== ne && (clearInterval(ne), (ne = null)), re)) {
          var t = re;
          (re = null), t();
        }
      }
      function se(e) {
        throw (
          (i.onAbort && i.onAbort(e),
          y((e += "")),
          (A = !0),
          (e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info."),
          new WebAssembly.RuntimeError(e))
        );
      }
      i.preloadedImages = {};
      i.preloadedAudios = {};
      i.preloadedWasm = {};
      var ae = "data:application/octet-stream;base64,";
      function ce(e) {
        return e.startsWith(ae);
      }
      function le(e) {
        return e.startsWith("file://");
      }
      var ue,
        de,
        pe,
        he = "tree-sitter.wasm";
      function fe(e) {
        try {
          if (e == he && E) return new Uint8Array(E);
          if (f) return f(e);
          throw "both async and sync fetching of the wasm failed";
        } catch (e) {
          se(e);
        }
      }
      if (ce(he)) {
        ue = he;
        he = i.locateFile ? i.locateFile(ue, _) : _ + ue;
      }
      var me = {},
        ge = {
          get: function (e, t) {
            if (me[t]) {
              me[t] = new WebAssembly.Global({
                value: "i32",
                mutable: !0,
              });
            }
            return me[t];
          },
        };
      function _e(e) {
        for (; e.length > 0; ) {
          var t = e.shift();
          if ("function" != typeof t) {
            var n = t.func;
            if ("number" == typeof n) {
              if (undefined === t.arg) {
                J.get(n)();
              } else {
                J.get(n)(t.arg);
              }
            } else {
              n(undefined === t.arg ? null : t.arg);
            }
          } else t(i);
        }
      }
      function ye(e) {
        var t = 0;
        function n() {
          for (var n = 0, r = 1; ; ) {
            var o = e[t++];
            n += (127 & o) * r;
            r *= 128;
            if (!(128 & o)) break;
          }
          return n;
        }
        if (e instanceof WebAssembly.Module) {
          var r = WebAssembly.Module.customSections(e, "dylink");
          O(0 != r.length, "need dylink section");
          e = new Int8Array(r[0]);
        } else {
          O(
            1836278016 ==
              new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer)[0],
            "need to see wasm magic number"
          );
          O(0 === e[8], "need the dylink section to be first");
          t = 9;
          n();
          O(6 === e[t]);
          O(e[++t] === "d".charCodeAt(0));
          O(e[++t] === "y".charCodeAt(0));
          O(e[++t] === "l".charCodeAt(0));
          O(e[++t] === "i".charCodeAt(0));
          O(e[++t] === "n".charCodeAt(0));
          O(e[++t] === "k".charCodeAt(0));
          t++;
        }
        var o = {};
        o.memorySize = n();
        o.memoryAlign = n();
        o.tableSize = n();
        o.tableAlign = n();
        var i = n();
        o.neededDynlibs = [];
        for (var s = 0; s < i; ++s) {
          var a = n(),
            c = e.subarray(t, t + a);
          t += a;
          var l = B(c, 0);
          o.neededDynlibs.push(l);
        }
        return o;
      }
      var ve = 0;
      function be() {
        return k || ve > 0;
      }
      var we = {
        nextHandle: 1,
        loadedLibs: {},
        loadedLibNames: {},
      };
      function xe(e, t, n) {
        return e.includes("j")
          ? (function (e, t, n) {
              var r = i["dynCall_" + e];
              return n && n.length
                ? r.apply(null, [t].concat(n))
                : r.call(null, t);
            })(e, t, n)
          : J.get(t).apply(null, n);
      }
      var Ee = 5250832;
      function Ce(e) {
        return [
          "__cpp_exception",
          "__wasm_apply_data_relocs",
          "__dso_handle",
          "__set_stack_limits",
        ].includes(e);
      }
      function Se(e, t) {
        var n = {};
        for (var r in e) {
          var o = e[r];
          if ("object" == typeof o) {
            o = o.value;
          }
          if ("number" == typeof o) {
            o += t;
          }
          n[r] = o;
        }
        (function (e) {
          for (var t in e)
            if (!Ce(t)) {
              var n = !1,
                r = e[t];
              if (t.startsWith("orig$")) {
                t = t.split("$")[1];
                n = !0;
              }
              if (me[t]) {
                me[t] = new WebAssembly.Global({
                  value: "i32",
                  mutable: !0,
                });
              }
              if (n || 0 == me[t].value) {
                if ("function" == typeof r) {
                  me[t].value = x(r);
                } else {
                  if ("number" == typeof r) {
                    me[t].value = r;
                  } else {
                    y("unhandled export type for `" + t + "`: " + typeof r);
                  }
                }
              }
            }
        })(n);
        return n;
      }
      function Te(e) {
        return 0 == e.indexOf("dynCall_") ||
          ["stackAlloc", "stackSave", "stackRestore"].includes(e)
          ? e
          : "_" + e;
      }
      function ke(e, t) {
        var n, r;
        if (t) {
          n = i.asm["orig$" + e];
        }
        if (n) {
          n = i.asm[e];
        }
        if (!n && t) {
          n = i["_orig$" + e];
        }
        if (n) {
          n = i[Te(e)];
        }
        if (!n && e.startsWith("invoke_")) {
          r = e.split("_")[1];
          n = function () {
            var e = ze();
            try {
              return xe(
                r,
                arguments[0],
                Array.prototype.slice.call(arguments, 1)
              );
            } catch (t) {
              Ge(e);
              if (t !== t + 0 && "longjmp" !== t) throw t;
              We(1, 0);
            }
          };
        }
        return n;
      }
      function Ie(e, t) {
        var n = ye(e);
        function r() {
          var r = Math.pow(2, n.memoryAlign);
          r = Math.max(r, b);
          var o,
            i,
            s,
            a =
              ((o = (function (e) {
                if (ee) return Ue(e);
                var t = Ee,
                  n = (t + e + 15) & -16;
                Ee = n;
                me.__heap_base.value = n;
                return t;
              })(n.memorySize + r)),
              (i = r) || (i = b),
              Math.ceil(o / i) * i),
            c = J.length;
          J.grow(n.tableSize);
          for (var l = a; l < a + n.memorySize; l++) R[l] = 0;
          for (l = c; l < c + n.tableSize; l++) J.set(l, null);
          var u = new Proxy(Be, {
              get: function (e, t) {
                switch (t) {
                  case "__memory_base":
                    return a;
                  case "__table_base":
                    return c;
                }
                return t in e
                  ? e[t]
                  : (e[t] = function () {
                      if (n) {
                        n = (function (e) {
                          var t = ke(e, !1);
                          if (t) {
                            t = s[e];
                          }
                          return t;
                        })(t);
                      }
                      return n.apply(null, arguments);
                    });
                var n;
              },
            }),
            d = {
              "GOT.mem": new Proxy(Be, ge),
              "GOT.func": new Proxy(Be, ge),
              env: u,
              wasi_snapshot_preview1: u,
            };
          function p(e) {
            for (var r = 0; r < n.tableSize; r++) {
              var o = J.get(c + r);
              if (o) {
                v.set(o, c + r);
              }
            }
            s = Se(e.exports, a);
            if (t.allowUndefined) {
              Oe();
            }
            var i = s.__wasm_call_ctors;
            if (i) {
              i = s.__post_instantiate;
            }
            if (i) {
              if (ee) {
                i();
              } else {
                Q.push(i);
              }
            }
            return s;
          }
          if (t.loadAsync) {
            if (e instanceof WebAssembly.Module) {
              var h = new WebAssembly.Instance(e, d);
              return Promise.resolve(p(h));
            }
            return WebAssembly.instantiate(e, d).then(function (e) {
              return p(e.instance);
            });
          }
          var f =
            e instanceof WebAssembly.Module ? e : new WebAssembly.Module(e);
          return p((h = new WebAssembly.Instance(f, d)));
        }
        return t.loadAsync
          ? n.neededDynlibs
              .reduce(function (e, n) {
                return e.then(function () {
                  return Ae(n, t);
                });
              }, Promise.resolve())
              .then(function () {
                return r();
              })
          : (n.neededDynlibs.forEach(function (e) {
              Ae(e, t);
            }),
            r());
      }
      function Pe(e, t) {
        for (var n in e)
          if (e.hasOwnProperty(n)) {
            if (Be.hasOwnProperty(n)) {
              Be[n] = e[n];
            }
            var r = Te(n);
            if (i.hasOwnProperty(r)) {
              i[r] = e[n];
            }
          }
      }
      function Ae(e, t) {
        if ("__main__" != e || we.loadedLibNames[e]) {
          we.loadedLibs[-1] = {
            refcount: 1 / 0,
            name: "__main__",
            module: i.asm,
            global: !0,
          };
          we.loadedLibNames.__main__ = -1;
        }
        t = t || {
          global: !0,
          nodelete: !0,
        };
        var n,
          r = we.loadedLibNames[e];
        if (r) {
          n = we.loadedLibs[r];
          if (t.global && !n.global) {
            n.global = !0;
            if ("loading" !== n.module) {
              Pe(n.module);
            }
          }
          if (t.nodelete && n.refcount !== 1 / 0) {
            n.refcount = 1 / 0;
          }
          n.refcount++;
          return t.loadAsync ? Promise.resolve(r) : r;
        }
        function o(e) {
          if (t.fs) {
            var n = t.fs.readFile(e, {
              encoding: "binary",
            });
            if (n instanceof Uint8Array) {
              n = new Uint8Array(n);
            }
            return t.loadAsync ? Promise.resolve(n) : n;
          }
          return t.loadAsync
            ? ((r = e),
              fetch(r, {
                credentials: "same-origin",
              })
                .then(function (e) {
                  if (!e.ok) throw "failed to load binary file at '" + r + "'";
                  return e.arrayBuffer();
                })
                .then(function (e) {
                  return new Uint8Array(e);
                }))
            : f(e);
          var r;
        }
        function s() {
          if (
            undefined !== i.preloadedWasm &&
            undefined !== i.preloadedWasm[e]
          ) {
            var n = i.preloadedWasm[e];
            return t.loadAsync ? Promise.resolve(n) : n;
          }
          return t.loadAsync
            ? o(e).then(function (e) {
                return Ie(e, t);
              })
            : Ie(o(e), t);
        }
        function a(e) {
          if (n.global) {
            Pe(e);
          }
          n.module = e;
        }
        r = we.nextHandle++;
        n = {
          refcount: t.nodelete ? 1 / 0 : 1,
          name: e,
          module: "loading",
          global: t.global,
        };
        we.loadedLibNames[e] = r;
        we.loadedLibs[r] = n;
        return t.loadAsync
          ? s().then(function (e) {
              a(e);
              return r;
            })
          : (a(s()), r);
      }
      function Oe() {
        for (var e in me)
          if (0 == me[e].value) {
            var t = ke(e, !0);
            if ("function" == typeof t) {
              me[e].value = x(t, t.sig);
            } else {
              if ("number" == typeof t) {
                me[e].value = t;
              } else {
                O(!1, "bad export type for `" + e + "`: " + typeof t);
              }
            }
          }
      }
      i.___heap_base = Ee;
      var Ne,
        Re = new WebAssembly.Global(
          {
            value: "i32",
            mutable: !0,
          },
          5250832
        );
      function Me() {
        se();
      }
      i._abort = Me;
      Me.sig = "v";
      Ne = o
        ? function () {
            var e = process.hrtime();
            return 1e3 * e[0] + e[1] / 1e6;
          }
        : "undefined" != typeof dateNow
        ? dateNow
        : function () {
            return performance.now();
          };
      var Le = !0;
      function $e(e, t) {
        var n;
        if (0 === e) n = Date.now();
        else {
          if ((1 !== e && 4 !== e) || !Le) {
            $[He() >> 2] = 28;
            return -1;
          }
          n = Ne();
        }
        $[t >> 2] = (n / 1e3) | 0;
        $[(t + 4) >> 2] = ((n % 1e3) * 1e3 * 1e3) | 0;
        return 0;
      }
      function De(e) {
        try {
          T.grow((e - N.byteLength + 65535) >>> 16);
          W(T.buffer);
          return 1;
        } catch (e) {}
      }
      function Fe(e) {
        Qe(e);
      }
      function je(e) {
        C(e);
      }
      $e.sig = "iii";
      Fe.sig = "vi";
      je.sig = "vi";
      var qe,
        Be = {
          __heap_base: Ee,
          __indirect_function_table: J,
          __memory_base: 1024,
          __stack_pointer: Re,
          __table_base: 1,
          abort: Me,
          clock_gettime: $e,
          emscripten_memcpy_big: function (e, t, n) {
            M.copyWithin(e, t, t + n);
          },
          emscripten_resize_heap: function (e) {
            var t,
              n = M.length;
            if ((e >>>= 0) > 2147483648) return !1;
            for (var r = 1; r <= 4; r *= 2) {
              var o = n * (1 + 0.2 / r);
              o = Math.min(o, e + 100663296);
              if (
                De(
                  Math.min(
                    2147483648,
                    ((t = Math.max(e, o)) % 65536 > 0 &&
                      (t += 65536 - (t % 65536)),
                    t)
                  )
                )
              )
                return !0;
            }
            return !1;
          },
          exit: Fe,
          memory: T,
          setTempRet0: je,
          tree_sitter_log_callback: function (e, t) {
            if (ft) {
              const n = U(t);
              ft(n, 0 !== e);
            }
          },
          tree_sitter_parse_callback: function (e, t, n, r, o) {
            var i = ht(t, {
              row: n,
              column: r,
            });
            if ("string" == typeof i) {
              I(o, i.length, "i32");
              (function (e, t, n) {
                if (undefined === n) {
                  n = 2147483647;
                }
                if (n < 2) return 0;
                for (
                  var r = (n -= 2) < 2 * e.length ? n / 2 : e.length, o = 0;
                  o < r;
                  ++o
                ) {
                  var i = e.charCodeAt(o);
                  L[t >> 1] = i;
                  t += 2;
                }
                L[t >> 1] = 0;
              })(i, e, 10240);
            } else {
              I(o, 0, "i32");
            }
          },
        },
        Ue =
          ((function () {
            var e = {
              env: Be,
              wasi_snapshot_preview1: Be,
              "GOT.mem": new Proxy(Be, ge),
              "GOT.func": new Proxy(Be, ge),
            };
            function t(e, t) {
              var n = e.exports;
              n = Se(n, 1024);
              i.asm = n;
              var r,
                o = ye(t);
              if (o.neededDynlibs) {
                S = o.neededDynlibs.concat(S);
              }
              r = i.asm.__wasm_call_ctors;
              Q.unshift(r);
              ie();
            }
            function n(e) {
              t(e.instance, e.module);
            }
            function r(t) {
              return (function () {
                if (!E && (u || d)) {
                  if ("function" == typeof fetch && !le(he))
                    return fetch(he, {
                      credentials: "same-origin",
                    })
                      .then(function (e) {
                        if (!e.ok)
                          throw (
                            "failed to load wasm binary file at '" + he + "'"
                          );
                        return e.arrayBuffer();
                      })
                      .catch(function () {
                        return fe(he);
                      });
                  if (h)
                    return new Promise(function (e, t) {
                      h(
                        he,
                        function (t) {
                          e(new Uint8Array(t));
                        },
                        t
                      );
                    });
                }
                return Promise.resolve().then(function () {
                  return fe(he);
                });
              })()
                .then(function (t) {
                  return WebAssembly.instantiate(t, e);
                })
                .then(t, function (e) {
                  y("failed to asynchronously prepare wasm: " + e);
                  se(e);
                });
            }
            oe();
            if (i.instantiateWasm)
              try {
                return i.instantiateWasm(e, t);
              } catch (e) {
                return (
                  y("Module.instantiateWasm callback failed with error: " + e),
                  !1
                );
              }
            if (
              E ||
              "function" != typeof WebAssembly.instantiateStreaming ||
              ce(he) ||
              le(he) ||
              "function" != typeof fetch
            ) {
              r(n);
            } else {
              fetch(he, {
                credentials: "same-origin",
              }).then(function (t) {
                return WebAssembly.instantiateStreaming(t, e).then(
                  n,
                  function (e) {
                    y("wasm streaming compile failed: " + e);
                    y("falling back to ArrayBuffer instantiation");
                    return r(n);
                  }
                );
              });
            }
          })(),
          (i.___wasm_call_ctors = function () {
            return (i.___wasm_call_ctors = i.asm.__wasm_call_ctors).apply(
              null,
              arguments
            );
          }),
          (i._malloc = function () {
            return (Ue = i._malloc = i.asm.malloc).apply(null, arguments);
          })),
        He =
          ((i._ts_language_symbol_count = function () {
            return (i._ts_language_symbol_count =
              i.asm.ts_language_symbol_count).apply(null, arguments);
          }),
          (i._ts_language_version = function () {
            return (i._ts_language_version = i.asm.ts_language_version).apply(
              null,
              arguments
            );
          }),
          (i._ts_language_field_count = function () {
            return (i._ts_language_field_count =
              i.asm.ts_language_field_count).apply(null, arguments);
          }),
          (i._ts_language_symbol_name = function () {
            return (i._ts_language_symbol_name =
              i.asm.ts_language_symbol_name).apply(null, arguments);
          }),
          (i._ts_language_symbol_for_name = function () {
            return (i._ts_language_symbol_for_name =
              i.asm.ts_language_symbol_for_name).apply(null, arguments);
          }),
          (i._ts_language_symbol_type = function () {
            return (i._ts_language_symbol_type =
              i.asm.ts_language_symbol_type).apply(null, arguments);
          }),
          (i._ts_language_field_name_for_id = function () {
            return (i._ts_language_field_name_for_id =
              i.asm.ts_language_field_name_for_id).apply(null, arguments);
          }),
          (i._memcpy = function () {
            return (i._memcpy = i.asm.memcpy).apply(null, arguments);
          }),
          (i._free = function () {
            return (i._free = i.asm.free).apply(null, arguments);
          }),
          (i._calloc = function () {
            return (i._calloc = i.asm.calloc).apply(null, arguments);
          }),
          (i._ts_parser_delete = function () {
            return (i._ts_parser_delete = i.asm.ts_parser_delete).apply(
              null,
              arguments
            );
          }),
          (i._ts_parser_reset = function () {
            return (i._ts_parser_reset = i.asm.ts_parser_reset).apply(
              null,
              arguments
            );
          }),
          (i._ts_parser_set_language = function () {
            return (i._ts_parser_set_language =
              i.asm.ts_parser_set_language).apply(null, arguments);
          }),
          (i._ts_parser_timeout_micros = function () {
            return (i._ts_parser_timeout_micros =
              i.asm.ts_parser_timeout_micros).apply(null, arguments);
          }),
          (i._ts_parser_set_timeout_micros = function () {
            return (i._ts_parser_set_timeout_micros =
              i.asm.ts_parser_set_timeout_micros).apply(null, arguments);
          }),
          (i._memcmp = function () {
            return (i._memcmp = i.asm.memcmp).apply(null, arguments);
          }),
          (i._ts_query_new = function () {
            return (i._ts_query_new = i.asm.ts_query_new).apply(
              null,
              arguments
            );
          }),
          (i._ts_query_delete = function () {
            return (i._ts_query_delete = i.asm.ts_query_delete).apply(
              null,
              arguments
            );
          }),
          (i._iswspace = function () {
            return (i._iswspace = i.asm.iswspace).apply(null, arguments);
          }),
          (i._iswalnum = function () {
            return (i._iswalnum = i.asm.iswalnum).apply(null, arguments);
          }),
          (i._ts_query_pattern_count = function () {
            return (i._ts_query_pattern_count =
              i.asm.ts_query_pattern_count).apply(null, arguments);
          }),
          (i._ts_query_capture_count = function () {
            return (i._ts_query_capture_count =
              i.asm.ts_query_capture_count).apply(null, arguments);
          }),
          (i._ts_query_string_count = function () {
            return (i._ts_query_string_count =
              i.asm.ts_query_string_count).apply(null, arguments);
          }),
          (i._ts_query_capture_name_for_id = function () {
            return (i._ts_query_capture_name_for_id =
              i.asm.ts_query_capture_name_for_id).apply(null, arguments);
          }),
          (i._ts_query_string_value_for_id = function () {
            return (i._ts_query_string_value_for_id =
              i.asm.ts_query_string_value_for_id).apply(null, arguments);
          }),
          (i._ts_query_predicates_for_pattern = function () {
            return (i._ts_query_predicates_for_pattern =
              i.asm.ts_query_predicates_for_pattern).apply(null, arguments);
          }),
          (i._ts_tree_copy = function () {
            return (i._ts_tree_copy = i.asm.ts_tree_copy).apply(
              null,
              arguments
            );
          }),
          (i._ts_tree_delete = function () {
            return (i._ts_tree_delete = i.asm.ts_tree_delete).apply(
              null,
              arguments
            );
          }),
          (i._ts_init = function () {
            return (i._ts_init = i.asm.ts_init).apply(null, arguments);
          }),
          (i._ts_parser_new_wasm = function () {
            return (i._ts_parser_new_wasm = i.asm.ts_parser_new_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_parser_enable_logger_wasm = function () {
            return (i._ts_parser_enable_logger_wasm =
              i.asm.ts_parser_enable_logger_wasm).apply(null, arguments);
          }),
          (i._ts_parser_parse_wasm = function () {
            return (i._ts_parser_parse_wasm = i.asm.ts_parser_parse_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_language_type_is_named_wasm = function () {
            return (i._ts_language_type_is_named_wasm =
              i.asm.ts_language_type_is_named_wasm).apply(null, arguments);
          }),
          (i._ts_language_type_is_visible_wasm = function () {
            return (i._ts_language_type_is_visible_wasm =
              i.asm.ts_language_type_is_visible_wasm).apply(null, arguments);
          }),
          (i._ts_tree_root_node_wasm = function () {
            return (i._ts_tree_root_node_wasm =
              i.asm.ts_tree_root_node_wasm).apply(null, arguments);
          }),
          (i._ts_tree_edit_wasm = function () {
            return (i._ts_tree_edit_wasm = i.asm.ts_tree_edit_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_tree_get_changed_ranges_wasm = function () {
            return (i._ts_tree_get_changed_ranges_wasm =
              i.asm.ts_tree_get_changed_ranges_wasm).apply(null, arguments);
          }),
          (i._ts_tree_cursor_new_wasm = function () {
            return (i._ts_tree_cursor_new_wasm =
              i.asm.ts_tree_cursor_new_wasm).apply(null, arguments);
          }),
          (i._ts_tree_cursor_delete_wasm = function () {
            return (i._ts_tree_cursor_delete_wasm =
              i.asm.ts_tree_cursor_delete_wasm).apply(null, arguments);
          }),
          (i._ts_tree_cursor_reset_wasm = function () {
            return (i._ts_tree_cursor_reset_wasm =
              i.asm.ts_tree_cursor_reset_wasm).apply(null, arguments);
          }),
          (i._ts_tree_cursor_goto_first_child_wasm = function () {
            return (i._ts_tree_cursor_goto_first_child_wasm =
              i.asm.ts_tree_cursor_goto_first_child_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_tree_cursor_goto_next_sibling_wasm = function () {
            return (i._ts_tree_cursor_goto_next_sibling_wasm =
              i.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_tree_cursor_goto_parent_wasm = function () {
            return (i._ts_tree_cursor_goto_parent_wasm =
              i.asm.ts_tree_cursor_goto_parent_wasm).apply(null, arguments);
          }),
          (i._ts_tree_cursor_current_node_type_id_wasm = function () {
            return (i._ts_tree_cursor_current_node_type_id_wasm =
              i.asm.ts_tree_cursor_current_node_type_id_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_tree_cursor_current_node_is_named_wasm = function () {
            return (i._ts_tree_cursor_current_node_is_named_wasm =
              i.asm.ts_tree_cursor_current_node_is_named_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_tree_cursor_current_node_is_missing_wasm = function () {
            return (i._ts_tree_cursor_current_node_is_missing_wasm =
              i.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_tree_cursor_current_node_id_wasm = function () {
            return (i._ts_tree_cursor_current_node_id_wasm =
              i.asm.ts_tree_cursor_current_node_id_wasm).apply(null, arguments);
          }),
          (i._ts_tree_cursor_start_position_wasm = function () {
            return (i._ts_tree_cursor_start_position_wasm =
              i.asm.ts_tree_cursor_start_position_wasm).apply(null, arguments);
          }),
          (i._ts_tree_cursor_end_position_wasm = function () {
            return (i._ts_tree_cursor_end_position_wasm =
              i.asm.ts_tree_cursor_end_position_wasm).apply(null, arguments);
          }),
          (i._ts_tree_cursor_start_index_wasm = function () {
            return (i._ts_tree_cursor_start_index_wasm =
              i.asm.ts_tree_cursor_start_index_wasm).apply(null, arguments);
          }),
          (i._ts_tree_cursor_end_index_wasm = function () {
            return (i._ts_tree_cursor_end_index_wasm =
              i.asm.ts_tree_cursor_end_index_wasm).apply(null, arguments);
          }),
          (i._ts_tree_cursor_current_field_id_wasm = function () {
            return (i._ts_tree_cursor_current_field_id_wasm =
              i.asm.ts_tree_cursor_current_field_id_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_tree_cursor_current_node_wasm = function () {
            return (i._ts_tree_cursor_current_node_wasm =
              i.asm.ts_tree_cursor_current_node_wasm).apply(null, arguments);
          }),
          (i._ts_node_symbol_wasm = function () {
            return (i._ts_node_symbol_wasm = i.asm.ts_node_symbol_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_node_child_count_wasm = function () {
            return (i._ts_node_child_count_wasm =
              i.asm.ts_node_child_count_wasm).apply(null, arguments);
          }),
          (i._ts_node_named_child_count_wasm = function () {
            return (i._ts_node_named_child_count_wasm =
              i.asm.ts_node_named_child_count_wasm).apply(null, arguments);
          }),
          (i._ts_node_child_wasm = function () {
            return (i._ts_node_child_wasm = i.asm.ts_node_child_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_node_named_child_wasm = function () {
            return (i._ts_node_named_child_wasm =
              i.asm.ts_node_named_child_wasm).apply(null, arguments);
          }),
          (i._ts_node_child_by_field_id_wasm = function () {
            return (i._ts_node_child_by_field_id_wasm =
              i.asm.ts_node_child_by_field_id_wasm).apply(null, arguments);
          }),
          (i._ts_node_next_sibling_wasm = function () {
            return (i._ts_node_next_sibling_wasm =
              i.asm.ts_node_next_sibling_wasm).apply(null, arguments);
          }),
          (i._ts_node_prev_sibling_wasm = function () {
            return (i._ts_node_prev_sibling_wasm =
              i.asm.ts_node_prev_sibling_wasm).apply(null, arguments);
          }),
          (i._ts_node_next_named_sibling_wasm = function () {
            return (i._ts_node_next_named_sibling_wasm =
              i.asm.ts_node_next_named_sibling_wasm).apply(null, arguments);
          }),
          (i._ts_node_prev_named_sibling_wasm = function () {
            return (i._ts_node_prev_named_sibling_wasm =
              i.asm.ts_node_prev_named_sibling_wasm).apply(null, arguments);
          }),
          (i._ts_node_parent_wasm = function () {
            return (i._ts_node_parent_wasm = i.asm.ts_node_parent_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_node_descendant_for_index_wasm = function () {
            return (i._ts_node_descendant_for_index_wasm =
              i.asm.ts_node_descendant_for_index_wasm).apply(null, arguments);
          }),
          (i._ts_node_named_descendant_for_index_wasm = function () {
            return (i._ts_node_named_descendant_for_index_wasm =
              i.asm.ts_node_named_descendant_for_index_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_node_descendant_for_position_wasm = function () {
            return (i._ts_node_descendant_for_position_wasm =
              i.asm.ts_node_descendant_for_position_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_node_named_descendant_for_position_wasm = function () {
            return (i._ts_node_named_descendant_for_position_wasm =
              i.asm.ts_node_named_descendant_for_position_wasm).apply(
              null,
              arguments
            );
          }),
          (i._ts_node_start_point_wasm = function () {
            return (i._ts_node_start_point_wasm =
              i.asm.ts_node_start_point_wasm).apply(null, arguments);
          }),
          (i._ts_node_end_point_wasm = function () {
            return (i._ts_node_end_point_wasm =
              i.asm.ts_node_end_point_wasm).apply(null, arguments);
          }),
          (i._ts_node_start_index_wasm = function () {
            return (i._ts_node_start_index_wasm =
              i.asm.ts_node_start_index_wasm).apply(null, arguments);
          }),
          (i._ts_node_end_index_wasm = function () {
            return (i._ts_node_end_index_wasm =
              i.asm.ts_node_end_index_wasm).apply(null, arguments);
          }),
          (i._ts_node_to_string_wasm = function () {
            return (i._ts_node_to_string_wasm =
              i.asm.ts_node_to_string_wasm).apply(null, arguments);
          }),
          (i._ts_node_children_wasm = function () {
            return (i._ts_node_children_wasm =
              i.asm.ts_node_children_wasm).apply(null, arguments);
          }),
          (i._ts_node_named_children_wasm = function () {
            return (i._ts_node_named_children_wasm =
              i.asm.ts_node_named_children_wasm).apply(null, arguments);
          }),
          (i._ts_node_descendants_of_type_wasm = function () {
            return (i._ts_node_descendants_of_type_wasm =
              i.asm.ts_node_descendants_of_type_wasm).apply(null, arguments);
          }),
          (i._ts_node_is_named_wasm = function () {
            return (i._ts_node_is_named_wasm =
              i.asm.ts_node_is_named_wasm).apply(null, arguments);
          }),
          (i._ts_node_has_changes_wasm = function () {
            return (i._ts_node_has_changes_wasm =
              i.asm.ts_node_has_changes_wasm).apply(null, arguments);
          }),
          (i._ts_node_has_error_wasm = function () {
            return (i._ts_node_has_error_wasm =
              i.asm.ts_node_has_error_wasm).apply(null, arguments);
          }),
          (i._ts_node_is_missing_wasm = function () {
            return (i._ts_node_is_missing_wasm =
              i.asm.ts_node_is_missing_wasm).apply(null, arguments);
          }),
          (i._ts_query_matches_wasm = function () {
            return (i._ts_query_matches_wasm =
              i.asm.ts_query_matches_wasm).apply(null, arguments);
          }),
          (i._ts_query_captures_wasm = function () {
            return (i._ts_query_captures_wasm =
              i.asm.ts_query_captures_wasm).apply(null, arguments);
          }),
          (i._iswalpha = function () {
            return (i._iswalpha = i.asm.iswalpha).apply(null, arguments);
          }),
          (i._iswdigit = function () {
            return (i._iswdigit = i.asm.iswdigit).apply(null, arguments);
          }),
          (i._iswlower = function () {
            return (i._iswlower = i.asm.iswlower).apply(null, arguments);
          }),
          (i._towupper = function () {
            return (i._towupper = i.asm.towupper).apply(null, arguments);
          }),
          (i._memchr = function () {
            return (i._memchr = i.asm.memchr).apply(null, arguments);
          }),
          (i.___errno_location = function () {
            return (He = i.___errno_location = i.asm.__errno_location).apply(
              null,
              arguments
            );
          })),
        ze =
          ((i._strlen = function () {
            return (i._strlen = i.asm.strlen).apply(null, arguments);
          }),
          (i.stackSave = function () {
            return (ze = i.stackSave = i.asm.stackSave).apply(null, arguments);
          })),
        Ge = (i.stackRestore = function () {
          return (Ge = i.stackRestore = i.asm.stackRestore).apply(
            null,
            arguments
          );
        }),
        Ve = (i.stackAlloc = function () {
          return (Ve = i.stackAlloc = i.asm.stackAlloc).apply(null, arguments);
        }),
        We = (i._setThrew = function () {
          return (We = i._setThrew = i.asm.setThrew).apply(null, arguments);
        });
      function Ke(e) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + e + ")";
        this.status = e;
      }
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm =
        function () {
          return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm =
            i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(
            null,
            arguments
          );
        };
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev =
        function () {
          return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev =
            i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(
            null,
            arguments
          );
        };
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm =
        function () {
          return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm =
            i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(
            null,
            arguments
          );
        };
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm =
        function () {
          return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm =
            i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(
            null,
            arguments
          );
        };
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc =
        function () {
          return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc =
            i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(
            null,
            arguments
          );
        };
      i.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm =
        function () {
          return (i.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm =
            i.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(
            null,
            arguments
          );
        };
      i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev =
        function () {
          return (i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev =
            i.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(
            null,
            arguments
          );
        };
      i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw =
        function () {
          return (i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw =
            i.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(
            null,
            arguments
          );
        };
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ =
        function () {
          return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ =
            i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_).apply(
            null,
            arguments
          );
        };
      i.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv =
        function () {
          return (i.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv =
            i.asm._ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv).apply(
            null,
            arguments
          );
        };
      i.__Znwm = function () {
        return (i.__Znwm = i.asm._Znwm).apply(null, arguments);
      };
      i.__ZdlPv = function () {
        return (i.__ZdlPv = i.asm._ZdlPv).apply(null, arguments);
      };
      i._orig$ts_parser_timeout_micros = function () {
        return (i._orig$ts_parser_timeout_micros =
          i.asm.orig$ts_parser_timeout_micros).apply(null, arguments);
      };
      i._orig$ts_parser_set_timeout_micros = function () {
        return (i._orig$ts_parser_set_timeout_micros =
          i.asm.orig$ts_parser_set_timeout_micros).apply(null, arguments);
      };
      i._TRANSFER_BUFFER = 7296;
      i.___THREW__ = 7932;
      i.___threwValue = 7936;
      i.___cxa_new_handler = 7928;
      i.allocate = function (e, t) {
        var n;
        n = t == j ? Ve(e.length) : Ue(e.length);
        if (e.subarray || e.slice) {
          M.set(e, n);
        } else {
          M.set(new Uint8Array(e), n);
        }
        return n;
      };
      re = function e() {
        if (qe) {
          Xe();
        }
        if (qe) {
          re = e;
        }
      };
      var Je = !1;
      function Xe(e) {
        function t() {
          if (qe) {
            qe = !0;
            i.calledRun = !0;
            if (A) {
              ee = !0;
              _e(Q);
              _e(Y);
              if (i.onRuntimeInitialized) {
                i.onRuntimeInitialized();
              }
              if (Ye) {
                (function (e) {
                  var t = i._main;
                  if (t) {
                    var n = (e = e || []).length + 1,
                      r = Ve(4 * (n + 1));
                    $[r >> 2] = V(c);
                    for (var o = 1; o < n; o++) $[(r >> 2) + o] = V(e[o - 1]);
                    $[(r >> 2) + n] = 0;
                    try {
                      Qe(t(n, r), !0);
                    } catch (e) {
                      if (e instanceof Ke) return;
                      if ("unwind" == e) return;
                      var s = e;
                      if (e && "object" == typeof e && e.stack) {
                        s = [e, e.stack];
                      }
                      y("exception thrown: " + s);
                      l(1, e);
                    }
                  }
                })(e);
              }
              (function () {
                if (i.postRun)
                  for (
                    "function" == typeof i.postRun && (i.postRun = [i.postRun]);
                    i.postRun.length;

                  ) {
                    e = i.postRun.shift();
                    Z.unshift(e);
                  }
                var e;
                _e(Z);
              })();
            }
          }
        }
        e = e || a;
        if (
          te > 0 ||
          (!Je &&
            ((function () {
              if (S.length) {
                if (!f) {
                  oe();
                  return void S.reduce(function (e, t) {
                    return e.then(function () {
                      return Ae(t, {
                        loadAsync: !0,
                        global: !0,
                        nodelete: !0,
                        allowUndefined: !0,
                      });
                    });
                  }, Promise.resolve()).then(function () {
                    ie();
                    Oe();
                  });
                }
                S.forEach(function (e) {
                  Ae(e, {
                    global: !0,
                    nodelete: !0,
                    allowUndefined: !0,
                  });
                });
                Oe();
              } else Oe();
            })(),
            (Je = !0),
            te > 0))
        ) {
          (function () {
            if (i.preRun)
              for (
                "function" == typeof i.preRun && (i.preRun = [i.preRun]);
                i.preRun.length;

              ) {
                e = i.preRun.shift();
                X.unshift(e);
              }
            var e;
            _e(X);
          })();
          if (te > 0) {
            if (i.setStatus) {
              i.setStatus("Running...");
              setTimeout(function () {
                setTimeout(function () {
                  i.setStatus("");
                }, 1);
                t();
              }, 1);
            } else {
              t();
            }
          }
        }
      }
      function Qe(e, t) {
        if (t && be() && 0 === e) {
          if (be()) {
            if (i.onExit) {
              i.onExit(e);
            }
            A = !0;
          }
          l(e, new Ke(e));
        }
      }
      i.run = Xe;
      if (i.preInit)
        for (
          "function" == typeof i.preInit && (i.preInit = [i.preInit]);
          i.preInit.length > 0;

        )
          i.preInit.pop()();
      var Ye = !0;
      if (i.noInitialRun) {
        Ye = !1;
      }
      Xe();
      const Ze = i,
        et = {},
        tt = 4,
        nt = 5 * tt,
        rt = 2 * tt,
        ot = 2 * tt + 2 * rt,
        it = {
          row: 0,
          column: 0,
        },
        st = /[\w-.]*/g,
        at = 1,
        ct = 2,
        lt = /^_?tree_sitter_\w+/;
      var ut,
        dt,
        pt,
        ht,
        ft,
        mt = new Promise((e) => {
          i.onRuntimeInitialized = e;
        }).then(() => {
          pt = Ze._ts_init();
          ut = P(pt, "i32");
          dt = P(pt + tt, "i32");
        });
      class gt {
        static init() {
          return mt;
        }
        constructor() {
          if (null == pt)
            throw new Error(
              "You must first call Parser.init() and wait for it to resolve."
            );
          Ze._ts_parser_new_wasm();
          this[0] = P(pt, "i32");
          this[1] = P(pt + tt, "i32");
        }
        delete() {
          Ze._ts_parser_delete(this[0]);
          Ze._free(this[1]);
          this[0] = 0;
          this[1] = 0;
        }
        setLanguage(e) {
          let t;
          if (e) {
            if (e.constructor !== bt)
              throw new Error("Argument must be a Language");
            {
              t = e[0];
              const n = Ze._ts_language_version(t);
              if (n < dt || ut < n)
                throw new Error(
                  `Incompatible language version ${n}. Compatibility range ${dt} through ${ut}.`
                );
            }
          } else {
            t = 0;
            e = null;
          }
          this.language = e;
          Ze._ts_parser_set_language(this[0], t);
          return this;
        }
        getLanguage() {
          return this.language;
        }
        parse(e, t, n) {
          if ("string" == typeof e) ht = (t, n, r) => e.slice(t, r);
          else {
            if ("function" != typeof e)
              throw new Error("Argument must be a string or a function");
            ht = e;
          }
          if (this.logCallback) {
            ft = this.logCallback;
            Ze._ts_parser_enable_logger_wasm(this[0], 1);
          } else {
            ft = null;
            Ze._ts_parser_enable_logger_wasm(this[0], 0);
          }
          let r = 0,
            o = 0;
          if (n && n.includedRanges) {
            r = n.includedRanges.length;
            let e = (o = Ze._calloc(r, ot));
            for (let t = 0; t < r; t++) {
              Nt(e, n.includedRanges[t]);
              e += ot;
            }
          }
          const i = Ze._ts_parser_parse_wasm(
            this[0],
            this[1],
            t ? t[0] : 0,
            o,
            r
          );
          if (!i) throw ((ht = null), (ft = null), new Error("Parsing failed"));
          const s = new _t(et, i, this.language, ht);
          ht = null;
          ft = null;
          return s;
        }
        reset() {
          Ze._ts_parser_reset(this[0]);
        }
        setTimeoutMicros(e) {
          Ze._ts_parser_set_timeout_micros(this[0], e);
        }
        getTimeoutMicros() {
          return Ze._ts_parser_timeout_micros(this[0]);
        }
        setLogger(e) {
          if (e) {
            if ("function" != typeof e)
              throw new Error("Logger callback must be a function");
          } else e = null;
          this.logCallback = e;
          return this;
        }
        getLogger() {
          return this.logCallback;
        }
      }
      class _t {
        constructor(e, t, n, r) {
          Ct(e);
          this[0] = t;
          this.language = n;
          this.textCallback = r;
        }
        copy() {
          const e = Ze._ts_tree_copy(this[0]);
          return new _t(et, e, this.language, this.textCallback);
        }
        delete() {
          Ze._ts_tree_delete(this[0]);
          this[0] = 0;
        }
        edit(e) {
          !(function (e) {
            let t = pt;
            At(t, e.startPosition);
            At((t += rt), e.oldEndPosition);
            At((t += rt), e.newEndPosition);
            I((t += rt), e.startIndex, "i32");
            I((t += tt), e.oldEndIndex, "i32");
            I((t += tt), e.newEndIndex, "i32");
            t += tt;
          })(e);
          Ze._ts_tree_edit_wasm(this[0]);
        }
        get rootNode() {
          Ze._ts_tree_root_node_wasm(this[0]);
          return kt(this);
        }
        getLanguage() {
          return this.language;
        }
        walk() {
          return this.rootNode.walk();
        }
        getChangedRanges(e) {
          if (e.constructor !== _t)
            throw new TypeError("Argument must be a Tree");
          Ze._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
          const t = P(pt, "i32"),
            n = P(pt + tt, "i32"),
            r = new Array(t);
          if (t > 0) {
            let e = n;
            for (let n = 0; n < t; n++) {
              r[n] = Rt(e);
              e += ot;
            }
            Ze._free(n);
          }
          return r;
        }
      }
      class yt {
        constructor(e, t) {
          Ct(e);
          this.tree = t;
        }
        get typeId() {
          Tt(this);
          return Ze._ts_node_symbol_wasm(this.tree[0]);
        }
        get type() {
          return this.tree.language.types[this.typeId] || "ERROR";
        }
        get endPosition() {
          Tt(this);
          Ze._ts_node_end_point_wasm(this.tree[0]);
          return Ot(pt);
        }
        get endIndex() {
          Tt(this);
          return Ze._ts_node_end_index_wasm(this.tree[0]);
        }
        get text() {
          return xt(this.tree, this.startIndex, this.endIndex);
        }
        isNamed() {
          Tt(this);
          return 1 === Ze._ts_node_is_named_wasm(this.tree[0]);
        }
        hasError() {
          Tt(this);
          return 1 === Ze._ts_node_has_error_wasm(this.tree[0]);
        }
        hasChanges() {
          Tt(this);
          return 1 === Ze._ts_node_has_changes_wasm(this.tree[0]);
        }
        isMissing() {
          Tt(this);
          return 1 === Ze._ts_node_is_missing_wasm(this.tree[0]);
        }
        equals(e) {
          return this.id === e.id;
        }
        child(e) {
          Tt(this);
          Ze._ts_node_child_wasm(this.tree[0], e);
          return kt(this.tree);
        }
        namedChild(e) {
          Tt(this);
          Ze._ts_node_named_child_wasm(this.tree[0], e);
          return kt(this.tree);
        }
        childForFieldId(e) {
          Tt(this);
          Ze._ts_node_child_by_field_id_wasm(this.tree[0], e);
          return kt(this.tree);
        }
        childForFieldName(e) {
          const t = this.tree.language.fields.indexOf(e);
          if (-1 !== t) return this.childForFieldId(t);
        }
        get childCount() {
          Tt(this);
          return Ze._ts_node_child_count_wasm(this.tree[0]);
        }
        get namedChildCount() {
          Tt(this);
          return Ze._ts_node_named_child_count_wasm(this.tree[0]);
        }
        get firstChild() {
          return this.child(0);
        }
        get firstNamedChild() {
          return this.namedChild(0);
        }
        get lastChild() {
          return this.child(this.childCount - 1);
        }
        get lastNamedChild() {
          return this.namedChild(this.namedChildCount - 1);
        }
        get children() {
          if (!this._children) {
            Tt(this);
            Ze._ts_node_children_wasm(this.tree[0]);
            const e = P(pt, "i32"),
              t = P(pt + tt, "i32");
            this._children = new Array(e);
            if (e > 0) {
              let n = t;
              for (let t = 0; t < e; t++)
                (this._children[t] = kt(this.tree, n)), (n += nt);
              Ze._free(t);
            }
          }
          return this._children;
        }
        get namedChildren() {
          if (!this._namedChildren) {
            Tt(this);
            Ze._ts_node_named_children_wasm(this.tree[0]);
            const e = P(pt, "i32"),
              t = P(pt + tt, "i32");
            this._namedChildren = new Array(e);
            if (e > 0) {
              let n = t;
              for (let t = 0; t < e; t++)
                (this._namedChildren[t] = kt(this.tree, n)), (n += nt);
              Ze._free(t);
            }
          }
          return this._namedChildren;
        }
        descendantsOfType(e, t, n) {
          if (Array.isArray(e)) {
            e = [e];
          }
          if (t) {
            t = it;
          }
          if (n) {
            n = it;
          }
          const r = [],
            o = this.tree.language.types;
          for (let t = 0, n = o.length; t < n; t++)
            if (e.includes(o[t])) {
              r.push(t);
            }
          const i = Ze._malloc(tt * r.length);
          for (let e = 0, t = r.length; e < t; e++) I(i + e * tt, r[e], "i32");
          Tt(this);
          Ze._ts_node_descendants_of_type_wasm(
            this.tree[0],
            i,
            r.length,
            t.row,
            t.column,
            n.row,
            n.column
          );
          const s = P(pt, "i32"),
            a = P(pt + tt, "i32"),
            c = new Array(s);
          if (s > 0) {
            let e = a;
            for (let t = 0; t < s; t++) {
              c[t] = kt(this.tree, e);
              e += nt;
            }
          }
          Ze._free(a);
          Ze._free(i);
          return c;
        }
        get nextSibling() {
          Tt(this);
          Ze._ts_node_next_sibling_wasm(this.tree[0]);
          return kt(this.tree);
        }
        get previousSibling() {
          Tt(this);
          Ze._ts_node_prev_sibling_wasm(this.tree[0]);
          return kt(this.tree);
        }
        get nextNamedSibling() {
          Tt(this);
          Ze._ts_node_next_named_sibling_wasm(this.tree[0]);
          return kt(this.tree);
        }
        get previousNamedSibling() {
          Tt(this);
          Ze._ts_node_prev_named_sibling_wasm(this.tree[0]);
          return kt(this.tree);
        }
        get parent() {
          Tt(this);
          Ze._ts_node_parent_wasm(this.tree[0]);
          return kt(this.tree);
        }
        descendantForIndex(e, t = e) {
          if ("number" != typeof e || "number" != typeof t)
            throw new Error("Arguments must be numbers");
          Tt(this);
          let n = pt + nt;
          I(n, e, "i32");
          I(n + tt, t, "i32");
          Ze._ts_node_descendant_for_index_wasm(this.tree[0]);
          return kt(this.tree);
        }
        namedDescendantForIndex(e, t = e) {
          if ("number" != typeof e || "number" != typeof t)
            throw new Error("Arguments must be numbers");
          Tt(this);
          let n = pt + nt;
          I(n, e, "i32");
          I(n + tt, t, "i32");
          Ze._ts_node_named_descendant_for_index_wasm(this.tree[0]);
          return kt(this.tree);
        }
        descendantForPosition(e, t = e) {
          if (!St(e) || !St(t))
            throw new Error("Arguments must be {row, column} objects");
          Tt(this);
          let n = pt + nt;
          At(n, e);
          At(n + rt, t);
          Ze._ts_node_descendant_for_position_wasm(this.tree[0]);
          return kt(this.tree);
        }
        namedDescendantForPosition(e, t = e) {
          if (!St(e) || !St(t))
            throw new Error("Arguments must be {row, column} objects");
          Tt(this);
          let n = pt + nt;
          At(n, e);
          At(n + rt, t);
          Ze._ts_node_named_descendant_for_position_wasm(this.tree[0]);
          return kt(this.tree);
        }
        walk() {
          Tt(this);
          Ze._ts_tree_cursor_new_wasm(this.tree[0]);
          return new vt(et, this.tree);
        }
        toString() {
          Tt(this);
          const e = Ze._ts_node_to_string_wasm(this.tree[0]),
            t = (function (e) {
              for (var t = ""; ; ) {
                var n = M[e++ >> 0];
                if (!n) return t;
                t += String.fromCharCode(n);
              }
            })(e);
          Ze._free(e);
          return t;
        }
      }
      class vt {
        constructor(e, t) {
          Ct(e);
          this.tree = t;
          Pt(this);
        }
        delete() {
          It(this);
          Ze._ts_tree_cursor_delete_wasm(this.tree[0]);
          this[0] = this[1] = this[2] = 0;
        }
        reset(e) {
          Tt(e);
          It(this, pt + nt);
          Ze._ts_tree_cursor_reset_wasm(this.tree[0]);
          Pt(this);
        }
        get nodeType() {
          return this.tree.language.types[this.nodeTypeId] || "ERROR";
        }
        get nodeTypeId() {
          It(this);
          return Ze._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
        }
        get nodeId() {
          It(this);
          return Ze._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
        }
        get nodeIsNamed() {
          It(this);
          return (
            1 === Ze._ts_tree_cursor_current_node_is_named_wasm(this.tree[0])
          );
        }
        get nodeIsMissing() {
          It(this);
          return (
            1 === Ze._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0])
          );
        }
        get nodeText() {
          It(this);
          const e = Ze._ts_tree_cursor_start_index_wasm(this.tree[0]),
            t = Ze._ts_tree_cursor_end_index_wasm(this.tree[0]);
          return xt(this.tree, e, t);
        }
        get startPosition() {
          It(this);
          Ze._ts_tree_cursor_start_position_wasm(this.tree[0]);
          return Ot(pt);
        }
        get endPosition() {
          It(this);
          Ze._ts_tree_cursor_end_position_wasm(this.tree[0]);
          return Ot(pt);
        }
        get startIndex() {
          It(this);
          return Ze._ts_tree_cursor_start_index_wasm(this.tree[0]);
        }
        get endIndex() {
          It(this);
          return Ze._ts_tree_cursor_end_index_wasm(this.tree[0]);
        }
        currentNode() {
          It(this);
          Ze._ts_tree_cursor_current_node_wasm(this.tree[0]);
          return kt(this.tree);
        }
        currentFieldId() {
          It(this);
          return Ze._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
        }
        currentFieldName() {
          return this.tree.language.fields[this.currentFieldId()];
        }
        gotoFirstChild() {
          It(this);
          const e = Ze._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
          Pt(this);
          return 1 === e;
        }
        gotoNextSibling() {
          It(this);
          const e = Ze._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
          Pt(this);
          return 1 === e;
        }
        gotoParent() {
          It(this);
          const e = Ze._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
          Pt(this);
          return 1 === e;
        }
      }
      class bt {
        constructor(e, t) {
          Ct(e);
          this[0] = t;
          this.types = new Array(Ze._ts_language_symbol_count(this[0]));
          for (let e = 0, t = this.types.length; e < t; e++)
            if (Ze._ts_language_symbol_type(this[0], e) < 2) {
              this.types[e] = U(Ze._ts_language_symbol_name(this[0], e));
            }
          this.fields = new Array(Ze._ts_language_field_count(this[0]) + 1);
          for (let e = 0, t = this.fields.length; e < t; e++) {
            const t = Ze._ts_language_field_name_for_id(this[0], e);
            this.fields[e] = 0 !== t ? U(t) : null;
          }
        }
        get version() {
          return Ze._ts_language_version(this[0]);
        }
        get fieldCount() {
          return this.fields.length - 1;
        }
        fieldIdForName(e) {
          const t = this.fields.indexOf(e);
          return -1 !== t ? t : null;
        }
        fieldNameForId(e) {
          return this.fields[e] || null;
        }
        idForNodeType(e, t) {
          const n = G(e),
            r = Ze._malloc(n + 1);
          z(e, r, n + 1);
          const o = Ze._ts_language_symbol_for_name(this[0], r, n, t);
          Ze._free(r);
          return o || null;
        }
        get nodeTypeCount() {
          return Ze._ts_language_symbol_count(this[0]);
        }
        nodeTypeForId(e) {
          const t = Ze._ts_language_symbol_name(this[0], e);
          return t ? U(t) : null;
        }
        nodeTypeIsNamed(e) {
          return !!Ze._ts_language_type_is_named_wasm(this[0], e);
        }
        nodeTypeIsVisible(e) {
          return !!Ze._ts_language_type_is_visible_wasm(this[0], e);
        }
        query(e) {
          const t = G(e),
            n = Ze._malloc(t + 1);
          z(e, n, t + 1);
          const r = Ze._ts_query_new(this[0], n, t, pt, pt + tt);
          if (!r) {
            const t = P(pt + tt, "i32"),
              r = U(n, P(pt, "i32")).length,
              o = e.substr(r, 100).split("\n")[0];
            let i,
              s = o.match(st)[0];
            switch (t) {
              case 2:
                i = new RangeError(`Bad node name '${s}'`);
                break;
              case 3:
                i = new RangeError(`Bad field name '${s}'`);
                break;
              case 4:
                i = new RangeError(`Bad capture name @${s}`);
                break;
              case 5:
                i = new TypeError(
                  `Bad pattern structure at offset ${r}: '${o}'...`
                );
                s = "";
                break;
              default:
                i = new SyntaxError(`Bad syntax at offset ${r}: '${o}'...`);
                s = "";
            }
            throw ((i.index = r), (i.length = s.length), Ze._free(n), i);
          }
          const o = Ze._ts_query_string_count(r),
            i = Ze._ts_query_capture_count(r),
            s = Ze._ts_query_pattern_count(r),
            a = new Array(i),
            c = new Array(o);
          for (let e = 0; e < i; e++) {
            const t = Ze._ts_query_capture_name_for_id(r, e, pt),
              n = P(pt, "i32");
            a[e] = U(t, n);
          }
          for (let e = 0; e < o; e++) {
            const t = Ze._ts_query_string_value_for_id(r, e, pt),
              n = P(pt, "i32");
            c[e] = U(t, n);
          }
          const l = new Array(s),
            u = new Array(s),
            d = new Array(s),
            p = new Array(s),
            h = new Array(s);
          for (let e = 0; e < s; e++) {
            const t = Ze._ts_query_predicates_for_pattern(r, e, pt),
              n = P(pt, "i32");
            p[e] = [];
            h[e] = [];
            const o = [];
            let i = t;
            for (let t = 0; t < n; t++) {
              const t = P(i, "i32"),
                n = P((i += tt), "i32");
              i += tt;
              if (t === at)
                o.push({
                  type: "capture",
                  name: a[n],
                });
              else if (t === ct)
                o.push({
                  type: "string",
                  value: c[n],
                });
              else if (o.length > 0) {
                if ("string" !== o[0].type)
                  throw new Error("Predicates must begin with a literal value");
                const t = o[0].value;
                let n = !0;
                switch (t) {
                  case "not-eq?":
                    n = !1;
                  case "eq?":
                    if (3 !== o.length)
                      throw new Error(
                        "Wrong number of arguments to `#eq?` predicate. Expected 2, got " +
                          (o.length - 1)
                      );
                    if ("capture" !== o[1].type)
                      throw new Error(
                        `First argument of \`#eq?\` predicate must be a capture. Got "${o[1].value}"`
                      );
                    if ("capture" === o[2].type) {
                      const t = o[1].name,
                        r = o[2].name;
                      h[e].push(function (e) {
                        let o, i;
                        for (const n of e)
                          n.name === t && (o = n.node),
                            n.name === r && (i = n.node);
                        return (o.text === i.text) === n;
                      });
                    } else {
                      const t = o[1].name,
                        r = o[2].value;
                      h[e].push(function (e) {
                        for (const o of e)
                          if (o.name === t) return (o.node.text === r) === n;
                        return !1;
                      });
                    }
                    break;
                  case "not-match?":
                    n = !1;
                  case "match?":
                    if (3 !== o.length)
                      throw new Error(
                        `Wrong number of arguments to \`#match?\` predicate. Expected 2, got ${
                          o.length - 1
                        }.`
                      );
                    if ("capture" !== o[1].type)
                      throw new Error(
                        `First argument of \`#match?\` predicate must be a capture. Got "${o[1].value}".`
                      );
                    if ("string" !== o[2].type)
                      throw new Error(
                        `Second argument of \`#match?\` predicate must be a string. Got @${o[2].value}.`
                      );
                    const r = o[1].name,
                      i = new RegExp(o[2].value);
                    h[e].push(function (e) {
                      for (const t of e)
                        if (t.name === r) return i.test(t.node.text) === n;
                      return !1;
                    });
                    break;
                  case "set!":
                    if (o.length < 2 || o.length > 3)
                      throw new Error(
                        `Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${
                          o.length - 1
                        }.`
                      );
                    if (o.some((e) => "string" !== e.type))
                      throw new Error(
                        'Arguments to `#set!` predicate must be a strings.".'
                      );
                    l[e] || (l[e] = {}),
                      (l[e][o[1].value] = o[2] ? o[2].value : null);
                    break;
                  case "is?":
                  case "is-not?":
                    if (o.length < 2 || o.length > 3)
                      throw new Error(
                        `Wrong number of arguments to \`#${t}\` predicate. Expected 1 or 2. Got ${
                          o.length - 1
                        }.`
                      );
                    if (o.some((e) => "string" !== e.type))
                      throw new Error(
                        `Arguments to \`#${t}\` predicate must be a strings.".`
                      );
                    const s = "is?" === t ? u : d;
                    s[e] || (s[e] = {}),
                      (s[e][o[1].value] = o[2] ? o[2].value : null);
                    break;
                  default:
                    p[e].push({
                      operator: t,
                      operands: o.slice(1),
                    });
                }
                o.length = 0;
              }
            }
            Object.freeze(l[e]);
            Object.freeze(u[e]);
            Object.freeze(d[e]);
          }
          Ze._free(n);
          return new wt(
            et,
            r,
            a,
            h,
            p,
            Object.freeze(l),
            Object.freeze(u),
            Object.freeze(d)
          );
        }
        static load(e) {
          let t;
          if (e instanceof Uint8Array) t = Promise.resolve(e);
          else {
            const r = e;
            if (
              "undefined" != typeof process &&
              process.versions &&
              process.versions.node
            ) {
              const e = require(3055_747);
              t = Promise.resolve(e.readFileSync(r));
            } else
              t = fetch(r).then((e) =>
                e.arrayBuffer().then((t) => {
                  if (e.ok) return new Uint8Array(t);
                  {
                    const n = new TextDecoder("utf-8").decode(t);
                    throw new Error(
                      `Language.load failed with status ${e.status}.\n\n${n}`
                    );
                  }
                })
              );
          }
          const r = "function" == typeof loadSideModule ? loadSideModule : Ie;
          return t
            .then((e) =>
              r(e, {
                loadAsync: !0,
              })
            )
            .then((e) => {
              const t = Object.keys(e),
                n = t.find(
                  (e) => lt.test(e) && !e.includes("external_scanner_")
                );
              if (n) {
                console.log(
                  `Couldn't find language function in WASM file. Symbols:\n${JSON.stringify(
                    t,
                    null,
                    2
                  )}`
                );
              }
              const r = e[n]();
              return new bt(et, r);
            });
        }
      }
      class wt {
        constructor(e, t, n, r, o, i, s, a) {
          Ct(e);
          this[0] = t;
          this.captureNames = n;
          this.textPredicates = r;
          this.predicates = o;
          this.setProperties = i;
          this.assertedProperties = s;
          this.refutedProperties = a;
          this.exceededMatchLimit = !1;
        }
        delete() {
          Ze._ts_query_delete(this[0]);
          this[0] = 0;
        }
        matches(e, t, n) {
          if (t) {
            t = it;
          }
          if (n) {
            n = it;
          }
          Tt(e);
          Ze._ts_query_matches_wasm(
            this[0],
            e.tree[0],
            t.row,
            t.column,
            n.row,
            n.column
          );
          const r = P(pt, "i32"),
            o = P(pt + tt, "i32"),
            i = P(pt + 2 * tt, "i32"),
            s = new Array(r);
          this.exceededMatchLimit = !!i;
          let a = 0,
            c = o;
          for (let t = 0; t < r; t++) {
            const n = P(c, "i32"),
              r = P((c += tt), "i32");
            c += tt;
            const o = new Array(r);
            c = Et(this, e.tree, c, o);
            if (this.textPredicates[n].every((e) => e(o))) {
              s[a++] = {
                pattern: n,
                captures: o,
              };
              const e = this.setProperties[n];
              e && (s[t].setProperties = e);
              const r = this.assertedProperties[n];
              r && (s[t].assertedProperties = r);
              const i = this.refutedProperties[n];
              i && (s[t].refutedProperties = i);
            }
          }
          s.length = a;
          Ze._free(o);
          return s;
        }
        captures(e, t, n) {
          if (t) {
            t = it;
          }
          if (n) {
            n = it;
          }
          Tt(e);
          Ze._ts_query_captures_wasm(
            this[0],
            e.tree[0],
            t.row,
            t.column,
            n.row,
            n.column
          );
          const r = P(pt, "i32"),
            o = P(pt + tt, "i32"),
            i = P(pt + 2 * tt, "i32"),
            s = [];
          this.exceededMatchLimit = !!i;
          const a = [];
          let c = o;
          for (let t = 0; t < r; t++) {
            const t = P(c, "i32"),
              n = P((c += tt), "i32"),
              r = P((c += tt), "i32");
            c += tt;
            a.length = n;
            c = Et(this, e.tree, c, a);
            if (this.textPredicates[t].every((e) => e(a))) {
              const e = a[r],
                n = this.setProperties[t];
              n && (e.setProperties = n);
              const o = this.assertedProperties[t];
              o && (e.assertedProperties = o);
              const i = this.refutedProperties[t];
              i && (e.refutedProperties = i), s.push(e);
            }
          }
          Ze._free(o);
          return s;
        }
        predicatesForPattern(e) {
          return this.predicates[e];
        }
        didExceedMatchLimit() {
          return this.exceededMatchLimit;
        }
      }
      function xt(e, t, n) {
        const r = n - t;
        let o = e.textCallback(t, null, n);
        for (t += o.length; t < n; ) {
          const r = e.textCallback(t, null, n);
          if (!(r && r.length > 0)) break;
          t += r.length;
          o += r;
        }
        if (t > n) {
          o = o.slice(0, r);
        }
        return o;
      }
      function Et(e, t, n, r) {
        for (let o = 0, i = r.length; o < i; o++) {
          const i = P(n, "i32"),
            s = kt(t, (n += tt));
          n += nt;
          r[o] = {
            name: e.captureNames[i],
            node: s,
          };
        }
        return n;
      }
      function Ct(e) {
        if (e !== et) throw new Error("Illegal constructor");
      }
      function St(e) {
        return e && "number" == typeof e.row && "number" == typeof e.column;
      }
      function Tt(e) {
        let t = pt;
        I(t, e.id, "i32");
        I((t += tt), e.startIndex, "i32");
        I((t += tt), e.startPosition.row, "i32");
        I((t += tt), e.startPosition.column, "i32");
        I((t += tt), e[0], "i32");
      }
      function kt(e, t = pt) {
        const n = P(t, "i32");
        if (0 === n) return null;
        const r = P((t += tt), "i32"),
          o = P((t += tt), "i32"),
          i = P((t += tt), "i32"),
          s = P((t += tt), "i32"),
          a = new yt(et, e);
        a.id = n;
        a.startIndex = r;
        a.startPosition = {
          row: o,
          column: i,
        };
        a[0] = s;
        return a;
      }
      function It(e, t = pt) {
        I(t + 0 * tt, e[0], "i32");
        I(t + 1 * tt, e[1], "i32");
        I(t + 2 * tt, e[2], "i32");
      }
      function Pt(e) {
        e[0] = P(pt + 0 * tt, "i32");
        e[1] = P(pt + 1 * tt, "i32");
        e[2] = P(pt + 2 * tt, "i32");
      }
      function At(e, t) {
        I(e, t.row, "i32");
        I(e + tt, t.column, "i32");
      }
      function Ot(e) {
        return {
          row: P(e, "i32"),
          column: P(e + tt, "i32"),
        };
      }
      function Nt(e, t) {
        At(e, t.startPosition);
        At((e += rt), t.endPosition);
        I((e += rt), t.startIndex, "i32");
        I((e += tt), t.endIndex, "i32");
        e += tt;
      }
      function Rt(e) {
        const t = {};
        t.startPosition = Ot(e);
        e += rt;
        t.endPosition = Ot(e);
        e += rt;
        t.startIndex = P(e, "i32");
        e += tt;
        t.endIndex = P(e, "i32");
        return t;
      }
      gt.Language = bt;
      gt.Parser = gt;
      return gt;
    })
      ? r.apply(exports, [])
      : r)
) {
  module.exports = o;
}
