var r, o, i;
r = {
  271: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.defaultFileSystem = t.FileSystem = undefined;
    const r = n(747);
    t.FileSystem = class {};
    t.defaultFileSystem = {
      readFile: e => r.promises.readFile(e),
      mtime: async e => (await r.promises.stat(e)).mtimeMs,
      async stat(e) {
        const t = await r.promises.stat(e);
        return {
          ctime: t.ctimeMs,
          mtime: t.mtimeMs,
          size: t.size
        };
      }
    };
  },
  876: (e, t) => {
    "use strict";

    function n(e) {
      return "virtual" === e.type;
    }
    function r(e) {
      return "top" === e.type;
    }
    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.duplicateTree = t.cutTreeAfterLine = t.isTop = t.isVirtual = t.isLine = t.isBlank = t.topNode = t.blankNode = t.lineNode = t.virtualNode = undefined;
    t.virtualNode = function (e, t, n) {
      return {
        type: "virtual",
        indentation: e,
        subs: t,
        label: n
      };
    };
    t.lineNode = function (e, t, n, r, o) {
      if ("" === n) throw new Error("Cannot create a line node with an empty source line");
      return {
        type: "line",
        indentation: e,
        lineNumber: t,
        sourceLine: n,
        subs: r,
        label: o
      };
    };
    t.blankNode = function (e) {
      return {
        type: "blank",
        lineNumber: e,
        subs: []
      };
    };
    t.topNode = function (e) {
      return {
        type: "top",
        indentation: -1,
        subs: null != e ? e : []
      };
    };
    t.isBlank = function (e) {
      return "blank" === e.type;
    };
    t.isLine = function (e) {
      return "line" === e.type;
    };
    t.isVirtual = n;
    t.isTop = r;
    t.cutTreeAfterLine = function (e, t) {
      !function e(o) {
        if (!n(o) && !r(o) && o.lineNumber === t) {
          o.subs = [];
          return !0;
        }
        for (let t = 0; t < o.subs.length; t++) if (e(o.subs[t])) {
          o.subs = o.subs.slice(0, t + 1);
          return !0;
        }
        return !1;
      }(e);
    };
    t.duplicateTree = function (e) {
      return JSON.parse(JSON.stringify(e));
    };
  },
  617: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.rebuildTree = t.foldTree = t.visitTreeConditionally = t.visitTree = t.resetLineNumbers = t.mapLabels = t.clearLabelsIf = t.clearLabels = undefined;
    const r = n(876);
    function o(e, t, n) {
      !function e(r) {
        "topDown" === n && t(r);
        r.subs.forEach(t => {
          e(t);
        });
        "bottomUp" === n && t(r);
      }(e);
    }
    t.clearLabels = function (e) {
      o(e, e => {
        e.label = undefined;
      }, "bottomUp");
      return e;
    };
    t.clearLabelsIf = function (e, t) {
      o(e, e => {
        e.label = e.label ? t(e.label) ? undefined : e.label : undefined;
      }, "bottomUp");
      return e;
    };
    t.mapLabels = function e(t, n) {
      switch (t.type) {
        case "line":
        case "virtual":
          const r = t.subs.map(t => e(t, n));
          return {
            ...t,
            subs: r,
            label: t.label ? n(t.label) : undefined
          };
        case "blank":
          return {
            ...t,
            label: t.label ? n(t.label) : undefined
          };
        case "top":
          return {
            ...t,
            subs: t.subs.map(t => e(t, n)),
            label: t.label ? n(t.label) : undefined
          };
      }
    };
    t.resetLineNumbers = function (e) {
      let t = 0;
      o(e, function (e) {
        r.isVirtual(e) || r.isTop(e) || (e.lineNumber = t, t++);
      }, "topDown");
    };
    t.visitTree = o;
    t.visitTreeConditionally = function (e, t, n) {
      !function e(r) {
        if ("topDown" === n && !t(r)) return !1;
        let o = !0;
        r.subs.forEach(t => {
          o = o && e(t);
        });
        "bottomUp" === n && (o = o && t(r));
        return o;
      }(e);
    };
    t.foldTree = function (e, t, n, r) {
      let i = t;
      o(e, function (e) {
        i = n(e, i);
      }, r);
      return i;
    };
    t.rebuildTree = function (e, t, n) {
      const o = e => {
          if (undefined !== n && n(e)) return e;
          {
            const n = e.subs.map(o).filter(e => undefined !== e);
            e.subs = n;
            return t(e);
          }
        },
        i = o(e);
      return undefined !== i ? i : r.topNode();
    };
  },
  469: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.parseTree = t.registerLanguageSpecificParser = t.flattenVirtual = t.groupBlocks = t.combineClosersAndOpeners = t.buildLabelRules = t.labelVirtualInherited = t.labelLines = t.parseRaw = undefined;
    const r = n(876),
      o = n(617);
    function i(e) {
      const t = e.split("\n"),
        n = t.map(e => e.match(/^\s*/)[0].length),
        o = t.map(e => e.trimLeft());
      function i(e) {
        const [t, i] = s(e + 1, n[e]);
        return [r.lineNode(n[e], e, o[e], t), i];
      }
      function s(e, t) {
        let s;
        const a = [];
        let c,
          l = e;
        for (; l < o.length && ("" === o[l] || n[l] > t);) if ("" === o[l]) {
          undefined === c && (c = l);
          l += 1;
        } else {
          if (undefined !== c) {
            for (let e = c; e < l; e++) a.push(r.blankNode(e));
            c = undefined;
          }
          [s, l] = i(l);
          a.push(s);
        }
        undefined !== c && (l = c);
        return [a, l];
      }
      const [a, c] = s(0, -1);
      let l = c;
      for (; l < o.length && "" === o[l];) {
        a.push(r.blankNode(l));
        l += 1;
      }
      if (l < o.length) throw new Error(`Parsing did not go to end of file. Ended at ${l} out of ${o.length}`);
      return r.topNode(a);
    }
    function s(e, t) {
      o.visitTree(e, function (e) {
        if (r.isLine(e)) {
          const n = t.find(t => t.matches(e.sourceLine));
          n && (e.label = n.label);
        }
      }, "bottomUp");
    }
    function a(e) {
      return Object.keys(e).map(t => {
        let n;
        n = e[t].test ? n => e[t].test(n) : e[t];
        return {
          matches: n,
          label: t
        };
      });
    }
    function c(e) {
      const t = o.rebuildTree(e, function (e) {
        if (0 === e.subs.length || -1 === e.subs.findIndex(e => "closer" === e.label || "opener" === e.label)) return e;
        const t = [];
        let n;
        for (let o = 0; o < e.subs.length; o++) {
          const i = e.subs[o],
            s = e.subs[o - 1];
          if ("opener" === i.label && undefined !== s && r.isLine(s)) {
            s.subs.push(i);
            i.subs.forEach(e => s.subs.push(e));
            i.subs = [];
          } else if ("closer" === i.label && undefined !== n && (r.isLine(i) || r.isVirtual(i)) && i.indentation >= n.indentation) {
            let e = t.length - 1;
            for (; e > 0 && r.isBlank(t[e]);) e -= 1;
            n.subs.push(...t.splice(e + 1));
            if (i.subs.length > 0) {
              const e = n.subs.findIndex(e => "newVirtual" !== e.label),
                t = n.subs.slice(0, e),
                o = n.subs.slice(e),
                s = o.length > 0 ? [r.virtualNode(i.indentation, o, "newVirtual")] : [];
              n.subs = [...t, ...s, i];
            } else n.subs.push(i);
          } else {
            t.push(i);
            r.isBlank(i) || (n = i);
          }
        }
        e.subs = t;
        return e;
      });
      o.clearLabelsIf(e, e => "newVirtual" === e);
      return t;
    }
    t.parseRaw = i;
    t.labelLines = s;
    t.labelVirtualInherited = function (e) {
      o.visitTree(e, function (e) {
        if (r.isVirtual(e) && undefined === e.label) {
          const t = e.subs.filter(e => !r.isBlank(e));
          1 === t.length && (e.label = t[0].label);
        }
      }, "bottomUp");
    };
    t.buildLabelRules = a;
    t.combineClosersAndOpeners = c;
    t.groupBlocks = function (e, t = r.isBlank, n) {
      return o.rebuildTree(e, function (e) {
        if (e.subs.length <= 1) return e;
        const o = [];
        let i,
          s = [],
          a = !1;
        function c(e = !1) {
          if (undefined !== i && (o.length > 0 || !e)) {
            const e = r.virtualNode(i, s, n);
            o.push(e);
          } else s.forEach(e => o.push(e));
        }
        for (let n = 0; n < e.subs.length; n++) {
          const o = e.subs[n],
            l = t(o);
          !l && a && (c(), s = []);
          a = l;
          s.push(o);
          r.isBlank(o) || (i = null != i ? i : o.indentation);
        }
        c(!0);
        e.subs = o;
        return e;
      });
    };
    t.flattenVirtual = function (e) {
      return o.rebuildTree(e, function (e) {
        return r.isVirtual(e) && undefined === e.label && e.subs.length <= 1 ? 0 === e.subs.length ? undefined : e.subs[0] : (1 === e.subs.length && r.isVirtual(e.subs[0]) && undefined === e.subs[0].label && (e.subs = e.subs[0].subs), e);
      });
    };
    const l = a({
        opener: /^[\[({]/,
        closer: /^[\])}]/
      }),
      u = {};
    t.registerLanguageSpecificParser = function (e, t) {
      u[e] = t;
    };
    t.parseTree = function (e, t) {
      const n = i(e),
        r = u[null != t ? t : ""];
      return r ? r(n) : (s(n, l), c(n));
    };
  },
  250: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.getWindowsDelineations = undefined;
    const r = n(469),
      o = n(617);
    t.getWindowsDelineations = function (e, t, n, i) {
      if (e.length < n || 0 == i) return [];
      const s = [],
        a = o.clearLabels(r.parseTree(e.join("\n"), t));
      o.visitTree(a, e => {
        if ("blank" === e.type) return void (e.label = {
          totalLength: 1,
          firstLineAfter: e.lineNumber + 1
        });
        let t = "line" === e.type ? 1 : 0,
          r = "line" === e.type ? e.lineNumber + 1 : NaN;
        function o(n) {
          return -1 == n ? r - t : e.subs[n].label.firstLineAfter - e.subs[n].label.totalLength;
        }
        function a(t, n) {
          return 0 == t ? n + 1 : e.subs[t - 1].label.firstLineAfter;
        }
        let c = "line" === e.type ? -1 : 0,
          l = "line" === e.type ? 1 : 0,
          u = 0;
        for (let d = 0; d < e.subs.length; d++) {
          for (; c >= 0 && c < e.subs.length && "blank" === e.subs[c].type;) {
            l -= e.subs[c].label.totalLength;
            c++;
          }
          "blank" !== e.subs[d].type && (u = d);
          r = e.subs[d].label.firstLineAfter;
          t += e.subs[d].label.totalLength;
          l += e.subs[d].label.totalLength;
          if (l > i) {
            const t = o(c),
              r = a(d, t),
              p = u == d ? r : a(u, t);
            for (n <= r - t && s.push([t, p]); l > i;) l -= -1 == c ? "line" == e.type ? 1 : 0 : e.subs[c].label.totalLength, c++;
          }
        }
        if (c < e.subs.length) {
          const t = o(c),
            i = r,
            a = -1 == c ? i : e.subs[u].label.firstLineAfter;
          n <= i - t && s.push([t, a]);
        }
        e.label = {
          totalLength: t,
          firstLineAfter: r
        };
      }, "bottomUp");
      return s.sort((e, t) => e[0] - t[0] || e[1] - t[1]).filter((e, t, n) => 0 == t || e[0] != n[t - 1][0] || e[1] != n[t - 1][1]);
    };
  },
  417: (e, t) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.getPathMarker = t.getLanguageMarker = t.comment = t.hasLanguageMarker = t.languageCommentMarkers = undefined;
    t.languageCommentMarkers = {
      abap: {
        start: '"',
        end: ""
      },
      bat: {
        start: "REM",
        end: ""
      },
      bibtex: {
        start: "%",
        end: ""
      },
      blade: {
        start: "#",
        end: ""
      },
      c: {
        start: "//",
        end: ""
      },
      clojure: {
        start: ";",
        end: ""
      },
      coffeescript: {
        start: "//",
        end: ""
      },
      cpp: {
        start: "//",
        end: ""
      },
      csharp: {
        start: "//",
        end: ""
      },
      css: {
        start: "/*",
        end: "*/"
      },
      dart: {
        start: "//",
        end: ""
      },
      dockerfile: {
        start: "#",
        end: ""
      },
      elixir: {
        start: "#",
        end: ""
      },
      erb: {
        start: "<%#",
        end: "%>"
      },
      erlang: {
        start: "%",
        end: ""
      },
      fsharp: {
        start: "//",
        end: ""
      },
      go: {
        start: "//",
        end: ""
      },
      groovy: {
        start: "//",
        end: ""
      },
      haml: {
        start: "-#",
        end: ""
      },
      handlebars: {
        start: "{{!",
        end: "}}"
      },
      haskell: {
        start: "--",
        end: ""
      },
      html: {
        start: "\x3c!--",
        end: "--\x3e"
      },
      ini: {
        start: ";",
        end: ""
      },
      java: {
        start: "//",
        end: ""
      },
      javascript: {
        start: "//",
        end: ""
      },
      javascriptreact: {
        start: "//",
        end: ""
      },
      jsonc: {
        start: "//",
        end: ""
      },
      jsx: {
        start: "//",
        end: ""
      },
      julia: {
        start: "#",
        end: ""
      },
      kotlin: {
        start: "//",
        end: ""
      },
      latex: {
        start: "%",
        end: ""
      },
      less: {
        start: "//",
        end: ""
      },
      lua: {
        start: "--",
        end: ""
      },
      makefile: {
        start: "#",
        end: ""
      },
      markdown: {
        start: "[]: #",
        end: ""
      },
      "objective-c": {
        start: "//",
        end: ""
      },
      "objective-cpp": {
        start: "//",
        end: ""
      },
      perl: {
        start: "#",
        end: ""
      },
      php: {
        start: "//",
        end: ""
      },
      powershell: {
        start: "#",
        end: ""
      },
      pug: {
        start: "//",
        end: ""
      },
      python: {
        start: "#",
        end: ""
      },
      ql: {
        start: "//",
        end: ""
      },
      r: {
        start: "#",
        end: ""
      },
      razor: {
        start: "\x3c!--",
        end: "--\x3e"
      },
      ruby: {
        start: "#",
        end: ""
      },
      rust: {
        start: "//",
        end: ""
      },
      sass: {
        start: "//",
        end: ""
      },
      scala: {
        start: "//",
        end: ""
      },
      scss: {
        start: "//",
        end: ""
      },
      shellscript: {
        start: "#",
        end: ""
      },
      slim: {
        start: "/",
        end: ""
      },
      solidity: {
        start: "//",
        end: ""
      },
      sql: {
        start: "--",
        end: ""
      },
      stylus: {
        start: "//",
        end: ""
      },
      svelte: {
        start: "\x3c!--",
        end: "--\x3e"
      },
      swift: {
        start: "//",
        end: ""
      },
      terraform: {
        start: "#",
        end: ""
      },
      tex: {
        start: "%",
        end: ""
      },
      typescript: {
        start: "//",
        end: ""
      },
      typescriptreact: {
        start: "//",
        end: ""
      },
      vb: {
        start: "'",
        end: ""
      },
      verilog: {
        start: "//",
        end: ""
      },
      "vue-html": {
        start: "\x3c!--",
        end: "--\x3e"
      },
      vue: {
        start: "//",
        end: ""
      },
      xml: {
        start: "\x3c!--",
        end: "--\x3e"
      },
      xsl: {
        start: "\x3c!--",
        end: "--\x3e"
      },
      yaml: {
        start: "#",
        end: ""
      }
    };
    const n = ["php", "plaintext"],
      r = {
        html: "<!DOCTYPE html>",
        python: "#!/usr/bin/env python3",
        ruby: "#!/usr/bin/env ruby",
        shellscript: "#!/bin/sh",
        yaml: "# YAML data"
      };
    function o({
      source: e
    }) {
      return e.startsWith("#!") || e.startsWith("<!DOCTYPE");
    }
    function i(e, n) {
      const r = t.languageCommentMarkers[n];
      if (r) {
        const t = "" == r.end ? "" : " " + r.end;
        return `${r.start} ${e}${t}`;
      }
      return "";
    }
    t.hasLanguageMarker = o;
    t.comment = i;
    t.getLanguageMarker = function (e) {
      const {
        languageId: t
      } = e;
      return -1 !== n.indexOf(t) || o(e) ? "" : t in r ? r[t] : i(`Language: ${t}`, t);
    };
    t.getPathMarker = function (e) {
      return e.relativePath ? i(`Path: ${e.relativePath}`, e.languageId) : "";
    };
  },
  563: function (e, t, n) {
    "use strict";

    var r = this && this.__createBinding || (Object.create ? function (e, t, n, r) {
        undefined === r && (r = n);
        Object.defineProperty(e, r, {
          enumerable: !0,
          get: function () {
            return t[n];
          }
        });
      } : function (e, t, n, r) {
        undefined === r && (r = n);
        e[r] = t[n];
      }),
      o = this && this.__exportStar || function (e, t) {
        for (var n in e) "default" === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n);
      };
    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.createWorker = t.FileSystem = t.comment = t.languageCommentMarkers = undefined;
    const i = n(622),
      s = n(13);
    o(n(306), t);
    o(n(610), t);
    o(n(312), t);
    o(n(94), t);
    var a = n(417);
    Object.defineProperty(t, "languageCommentMarkers", {
      enumerable: !0,
      get: function () {
        return a.languageCommentMarkers;
      }
    });
    Object.defineProperty(t, "comment", {
      enumerable: !0,
      get: function () {
        return a.comment;
      }
    });
    var c = n(271);
    Object.defineProperty(t, "FileSystem", {
      enumerable: !0,
      get: function () {
        return c.FileSystem;
      }
    });
    t.createWorker = function () {
      return new s.Worker(i.resolve(__dirname, "..", "dist", "worker.js"));
    };
  },
  179: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.extractLocalImportContext = t.getDocComment = undefined;
    const r = n(622),
      o = n(306);
    function i(e, t) {
      var n;
      let o = null === (n = t.namedChild(1)) || undefined === n ? undefined : n.text.slice(1, -1);
      if (!o || !o.startsWith(".")) return null;
      if ("" === r.extname(o)) o += ".ts";else if (".ts" !== r.extname(o)) return null;
      return r.join(r.dirname(e), o);
    }
    function s(e) {
      var t, n, r, o, i;
      let s = [];
      if ("import_clause" === (null === (t = e.namedChild(0)) || undefined === t ? undefined : t.type)) {
        let t = e.namedChild(0);
        if ("named_imports" === (null === (n = null == t ? undefined : t.namedChild(0)) || undefined === n ? undefined : n.type)) {
          let e = t.namedChild(0);
          for (let t of null !== (r = null == e ? undefined : e.namedChildren) && undefined !== r ? r : []) if ("import_specifier" === t.type) {
            const e = null === (o = t.childForFieldName("name")) || undefined === o ? undefined : o.text;
            if (e) {
              const n = null === (i = t.childForFieldName("alias")) || undefined === i ? undefined : i.text;
              s.push({
                name: e,
                alias: n
              });
            }
          }
        }
      }
      return s;
    }
    const a = new Map();
    function c(e, t) {
      var n, r;
      let o = null !== (r = null === (n = null == t ? undefined : t.childForFieldName("name")) || undefined === n ? undefined : n.text) && undefined !== r ? r : "";
      switch (null == t ? undefined : t.type) {
        case "ambient_declaration":
          return c(e, t.namedChild(0));
        case "interface_declaration":
        case "enum_declaration":
        case "type_alias_declaration":
          return {
            name: o,
            decl: t.text
          };
        case "function_declaration":
        case "function_signature":
          return {
            name: o,
            decl: l(e, t)
          };
        case "class_declaration":
          {
            let n = function (e, t) {
                let n = t.childForFieldName("body");
                if (n) return n.namedChildren.map(t => d(e, t)).filter(e => e);
              }(e, t),
              r = "";
            if (n) {
              let o = t.childForFieldName("body");
              r = `declare ${e.substring(t.startIndex, o.startIndex + 1)}`;
              r += n.map(e => "\n" + e).join("");
              r += "\n}";
            }
            return {
              name: o,
              decl: r
            };
          }
      }
      return {
        name: o,
        decl: ""
      };
    }
    function l(e, t) {
      var n, r, o;
      const i = null !== (r = null === (n = t.childForFieldName("return_type")) || undefined === n ? undefined : n.endIndex) && undefined !== r ? r : null === (o = t.childForFieldName("parameters")) || undefined === o ? undefined : o.endIndex;
      if (undefined !== i) {
        let n = e.substring(t.startIndex, i) + ";";
        return "function_declaration" === t.type || "function_signature" === t.type ? "declare " + n : n;
      }
      return "";
    }
    function u(e, t) {
      const n = o.getFirstPrecedingComment(t);
      return n ? e.substring(n.startIndex, t.startIndex) : "";
    }
    function d(e, t) {
      var n, r, i, s, a;
      if ("accessibility_modifier" === (null === (n = null == t ? undefined : t.firstChild) || undefined === n ? undefined : n.type) && "private" === t.firstChild.text) return "";
      const c = o.getFirstPrecedingComment(t),
        p = null !== (r = function (e, t) {
          let n = t.startIndex - 1;
          for (; n >= 0 && (" " === e[n] || "\t" === e[n]);) n--;
          if (n < 0 || "\n" === e[n]) return e.substring(n + 1, t.startIndex);
        }(e, null != c ? c : t)) && undefined !== r ? r : "  ",
        h = u(e, t);
      switch (t.type) {
        case "ambient_declaration":
          const n = t.namedChild(0);
          return n ? p + h + d(e, n) : "";
        case "method_definition":
        case "method_signature":
          return p + h + l(e, t);
        case "public_field_definition":
          {
            let n = null !== (s = null === (i = t.childForFieldName("type")) || undefined === i ? undefined : i.endIndex) && undefined !== s ? s : null === (a = t.childForFieldName("name")) || undefined === a ? undefined : a.endIndex;
            if (undefined !== n) return p + h + e.substring(t.startIndex, n) + ";";
          }
      }
      return "";
    }
    async function p(e, t, n) {
      let r = new Map(),
        i = -1;
      try {
        i = await n.mtime(e);
      } catch {
        return r;
      }
      let s = a.get(e);
      if (s && s.mtime === i) return s.exports;
      if ("typescript" === t) {
        let i = null;
        try {
          let s = (await n.readFile(e)).toString();
          i = await o.parseTree(t, s);
          for (let e of o.queryExports(t, i.rootNode)) for (let t of e.captures) {
            let e = t.node;
            if ("export_statement" === e.type) {
              let t = e.childForFieldName("declaration");
              if (null == t ? undefined : t.hasError()) continue;
              let {
                name: n,
                decl: o
              } = c(s, t);
              if (n) {
                o = u(s, e) + o;
                let t = r.get(n);
                t || (t = [], r.set(n, t));
                t.push(o);
              }
            }
          }
        } catch {} finally {
          i && i.delete();
        }
      }
      if (a.size > 2e3) for (let e of a.keys()) {
        a.delete(e);
        if (r.size <= 1e3) break;
      }
      a.set(e, {
        mtime: i,
        exports: r
      });
      return r;
    }
    t.getDocComment = u;
    const h = /^\s*import\s*(type|)\s*\{[^}]*\}\s*from\s*['"]\./gm;
    t.extractLocalImportContext = async function (e, t) {
      let {
        source: n,
        uri: r,
        languageId: a
      } = e;
      return t && "typescript" === a ? async function (e, t, n) {
        let r = "typescript",
          a = [];
        const c = function (e) {
          let t,
            n = -1;
          h.lastIndex = -1;
          do {
            t = h.exec(e);
            t && (n = h.lastIndex + t.length);
          } while (t);
          if (-1 === n) return -1;
          const r = e.indexOf("\n", n);
          return -1 !== r ? r : e.length;
        }(e);
        if (-1 === c) return a;
        e = e.substring(0, c);
        let l = await o.parseTree(r, e);
        try {
          for (let e of function (e) {
            let t = [];
            for (let n of e.namedChildren) "import_statement" === n.type && t.push(n);
            return t;
          }(l.rootNode)) {
            let o = i(t, e);
            if (!o) continue;
            let c = s(e);
            if (0 === c.length) continue;
            let l = await p(o, r, n);
            for (let e of c) l.has(e.name) && a.push(...l.get(e.name));
          }
        } finally {
          l.delete();
        }
        return a;
      }(n, r, t) : [];
    };
  },
  306: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.getFunctionPositions = t.getFirstPrecedingComment = t.isFunctionDefinition = t.isFunction = t.getAncestorWithSiblingFunctions = t.queryPythonIsDocstring = t.queryGlobalVars = t.queryExports = t.queryImports = t.queryFunctions = t.getBlockCloseToken = t.parsesWithoutError = t.parseTree = t.getLanguage = t.languageIdToWasmLanguage = t.isSupportedLanguageId = t.WASMLanguage = undefined;
    const r = n(622),
      o = n(87),
      i = n(87);
    var s;
    !function (e) {
      e.Python = "python";
      e.JavaScript = "javascript";
      e.TypeScript = "typescript";
      e.Go = "go";
      e.Ruby = "ruby";
    }(s = t.WASMLanguage || (t.WASMLanguage = {}));
    const a = {
      python: s.Python,
      javascript: s.JavaScript,
      javascriptreact: s.JavaScript,
      jsx: s.JavaScript,
      typescript: s.TypeScript,
      typescriptreact: s.TypeScript,
      go: s.Go,
      ruby: s.Ruby
    };
    function c(e) {
      if (!(e in a)) throw new Error(`Unrecognized language: ${e}`);
      return a[e];
    }
    t.isSupportedLanguageId = function (e) {
      return e in a;
    };
    t.languageIdToWasmLanguage = c;
    const l = {
        python: [["(function_definition body: (block\n             (expression_statement (string))? @docstring) @body) @function"], ['(ERROR ("def" (identifier) (parameters))) @function']],
        javascript: [["[\n            (function body: (statement_block) @body)\n            (function_declaration body: (statement_block) @body)\n            (generator_function body: (statement_block) @body)\n            (generator_function_declaration body: (statement_block) @body)\n            (method_definition body: (statement_block) @body)\n          ] @function"]],
        typescript: [["[\n            (function body: (statement_block) @body)\n            (function_declaration body: (statement_block) @body)\n            (generator_function body: (statement_block) @body)\n            (generator_function_declaration body: (statement_block) @body)\n            (method_definition body: (statement_block) @body)\n          ] @function"]],
        go: [["[\n            (function_declaration body: (block) @body)\n            (method_declaration body: (block) @body)\n          ] @function"]],
        ruby: [['[\n            (method name: (_) parameters: (method_parameters)? @params [(_)+ "end"] @body)\n            (singleton_method name: (_) parameters: (method_parameters)? @params [(_)+ "end"] @body)\n          ] @function']]
      },
      u = '(variable_declarator value: (call_expression function: ((identifier) @req (#eq? @req "require"))))',
      d = `\n    (lexical_declaration ${u}+)\n    (variable_declaration ${u}+)\n`,
      p = {
        python: [["(module (future_import_statement) @import)"], ["(module (import_statement) @import)"], ["(module (import_from_statement) @import)"]],
        javascript: [[`(program [ ${d} ] @import)`], ["(program [ (import_statement) ] @import)"]],
        typescript: [[`(program [ ${d} ] @import)`], ["(program [ (import_statement) (import_alias) ] @import)"]],
        go: [],
        ruby: []
      },
      h = {
        python: [],
        javascript: [["(program (export_statement) @export)"]],
        typescript: [["(program (export_statement) @export)"]],
        go: [],
        ruby: []
      },
      f = {
        python: [["(module (global_statement) @globalVar)"], ["(module (expression_statement) @globalVar)"]],
        javascript: [],
        typescript: [],
        go: [],
        ruby: []
      },
      m = {
        python: new Set(["function_definition"]),
        javascript: new Set(["function", "function_declaration", "generator_function", "generator_function_declaration", "method_definition", "arrow_function"]),
        typescript: new Set(["function", "function_declaration", "generator_function", "generator_function_declaration", "method_definition", "arrow_function"]),
        go: new Set(["function_declaration", "method_declaration"]),
        ruby: new Set(["method", "singleton_method"])
      },
      g = {
        python: e => {
          var t;
          return "module" === e.type || "block" === e.type && "class_definition" === (null === (t = e.parent) || undefined === t ? undefined : t.type);
        },
        javascript: e => "program" === e.type || "class_body" === e.type,
        typescript: e => "program" === e.type || "class_body" === e.type,
        go: e => "source_file" === e.type,
        ruby: e => "program" === e.type || "class" === e.type
      },
      _ = new Map();
    async function y(e) {
      const t = c(e);
      if (!_.has(t)) {
        const e = await async function (e) {
          await o.init();
          const t = r.resolve(__dirname, "..", "dist", `tree-sitter-${e}.wasm`);
          return i.Language.load(t);
        }(t);
        _.set(t, e);
      }
      return _.get(t);
    }
    async function v(e, t) {
      let n = await y(e);
      const r = new o();
      r.setLanguage(n);
      const i = r.parse(t);
      r.delete();
      return i;
    }
    function b(e, t) {
      const n = [];
      for (const r of e) {
        if (!r[1]) {
          const e = t.tree.getLanguage();
          r[1] = e.query(r[0]);
        }
        n.push(...r[1].matches(t));
      }
      return n;
    }
    function w(e, t) {
      return b(l[c(e)], t);
    }
    t.getLanguage = y;
    t.parseTree = v;
    t.parsesWithoutError = async function (e, t) {
      const n = await v(e, t),
        r = !n.rootNode.hasError();
      n.delete();
      return r;
    };
    t.getBlockCloseToken = function (e) {
      switch (c(e)) {
        case s.Python:
          return null;
        case s.JavaScript:
        case s.TypeScript:
        case s.Go:
          return "}";
        case s.Ruby:
          return "end";
      }
    };
    t.queryFunctions = w;
    t.queryImports = function (e, t) {
      return b(p[c(e)], t);
    };
    t.queryExports = function (e, t) {
      return b(h[c(e)], t);
    };
    t.queryGlobalVars = function (e, t) {
      return b(f[c(e)], t);
    };
    const x = ["[\n    (class_definition (block (expression_statement (string))))\n    (function_definition (block (expression_statement (string))))\n]"];
    function E(e, t) {
      return m[c(e)].has(t.type);
    }
    t.queryPythonIsDocstring = function (e) {
      return 1 == b([x], e).length;
    };
    t.getAncestorWithSiblingFunctions = function (e, t) {
      const n = g[c(e)];
      for (; t.parent;) {
        if (n(t.parent)) return t;
        t = t.parent;
      }
      return t.parent ? t : null;
    };
    t.isFunction = E;
    t.isFunctionDefinition = function (e, t) {
      switch (c(e)) {
        case s.Python:
        case s.Go:
        case s.Ruby:
          return E(e, t);
        case s.JavaScript:
        case s.TypeScript:
          if ("function_declaration" === t.type || "generator_function_declaration" === t.type || "method_definition" === t.type) return !0;
          if ("lexical_declaration" === t.type || "variable_declaration" === t.type) {
            if (t.namedChildCount > 1) return !1;
            let n = t.namedChild(0);
            if (null == n) return !1;
            let r = n.namedChild(1);
            return null !== r && E(e, r);
          }
          if ("expression_statement" === t.type) {
            let n = t.namedChild(0);
            if ("assignment_expression" === (null == n ? undefined : n.type)) {
              let t = n.namedChild(1);
              return null !== t && E(e, t);
            }
          }
          return !1;
      }
    };
    t.getFirstPrecedingComment = function (e) {
      var t;
      let n = e;
      for (; "comment" === (null === (t = n.previousSibling) || undefined === t ? undefined : t.type);) {
        let e = n.previousSibling;
        if (e.endPosition.row < n.startPosition.row - 1) break;
        n = e;
      }
      return "comment" === (null == n ? undefined : n.type) ? n : null;
    };
    t.getFunctionPositions = async function (e, t) {
      return w(e, (await v(e, t)).rootNode).map(e => {
        const t = e.captures.find(e => "function" === e.name).node;
        return {
          startIndex: t.startIndex,
          endIndex: t.endIndex
        };
      });
    };
  },
  610: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.getNodeStart = t.isBlockBodyFinished = t.isEmptyBlockStart = t.getBlockParser = undefined;
    const r = n(306);
    class o {
      constructor(e, t, n) {
        this.languageId = e;
        this.nodeMatch = t;
        this.nodeTypesWithBlockOrStmtChild = n;
      }
      async getNodeMatchAtPosition(e, t, n) {
        const o = await r.parseTree(this.languageId, e);
        try {
          let e = o.rootNode.descendantForIndex(t);
          for (; e;) {
            const t = this.nodeMatch[e.type];
            if (t) {
              if (!this.nodeTypesWithBlockOrStmtChild.has(e.type)) break;
              const n = this.nodeTypesWithBlockOrStmtChild.get(e.type),
                r = "" == n ? e.namedChildren[0] : e.childForFieldName(n);
              if ((null == r ? undefined : r.type) == t) break;
            }
            e = e.parent;
          }
          if (!e) return;
          return n(e);
        } finally {
          o.delete();
        }
      }
      getNextBlockAtPosition(e, t, n) {
        return this.getNodeMatchAtPosition(e, t, e => {
          let t = e.children.reverse().find(t => t.type == this.nodeMatch[e.type]);
          if (t) {
            if ("python" == this.languageId && t.parent) {
              const e = ":" == t.parent.type ? t.parent.parent : t.parent;
              let n = null == e ? undefined : e.nextSibling;
              for (; n && "comment" == n.type;) {
                const r = n.startPosition.row == t.endPosition.row && n.startPosition.column >= t.endPosition.column,
                  o = n.startPosition.row > e.endPosition.row && n.startPosition.column > e.startPosition.column;
                if (!r && !o) break;
                t = n;
                n = n.nextSibling;
              }
            }
            if (!(t.endIndex >= t.tree.rootNode.endIndex - 1 && (t.hasError() || t.parent.hasError()))) return n(t);
          }
        });
      }
      async isBlockBodyFinished(e, t, n) {
        const r = (e + t).trimEnd(),
          o = await this.getNextBlockAtPosition(r, n, e => e.endIndex);
        if (undefined !== o && o < r.length) {
          const t = o - e.length;
          return t > 0 ? t : undefined;
        }
      }
      getNodeStart(e, t) {
        const n = e.trimEnd();
        return this.getNodeMatchAtPosition(n, t, e => e.startIndex);
      }
    }
    class i extends o {
      constructor(e, t, n, r, o) {
        super(e, r, o);
        this.blockEmptyMatch = t;
        this.lineMatch = n;
      }
      isBlockStart(e) {
        return this.lineMatch.test(e.trimStart());
      }
      async isBlockBodyEmpty(e, t) {
        const n = await this.getNextBlockAtPosition(e, t, n => {
          n.startIndex < t && (t = n.startIndex);
          let r = e.substring(t, n.endIndex).trim();
          return "" == r || r.replace(/\s/g, "") == this.blockEmptyMatch;
        });
        return undefined === n || n;
      }
      async isEmptyBlockStart(e, t) {
        t = s(e, t);
        return this.isBlockStart(function (e, t) {
          const n = e.lastIndexOf("\n", t - 1);
          let r = e.indexOf("\n", t);
          r < 0 && (r = e.length);
          return e.slice(n + 1, r);
        }(e, t)) && this.isBlockBodyEmpty(e, t);
      }
    }
    function s(e, t) {
      let n = t;
      for (; n > 0 && /\s/.test(e.charAt(n - 1));) n--;
      return n;
    }
    function a(e, t) {
      const n = e.startIndex,
        r = e.startIndex - e.startPosition.column,
        o = t.substring(r, n);
      if (/^\s*$/.test(o)) return o;
    }
    function c(e, t, n) {
      if (t.startPosition.row <= e.startPosition.row) return !1;
      const r = a(e, n),
        o = a(t, n);
      return undefined !== r && undefined !== o && r.startsWith(o);
    }
    class l extends o {
      constructor(e, t, n, r, o, i, s) {
        super(e, t, n);
        this.startKeywords = r;
        this.blockNodeType = o;
        this.emptyStatementType = i;
        this.curlyBraceLanguage = s;
      }
      isBlockEmpty(e, t) {
        var n, o;
        let i = e.text.trim();
        this.curlyBraceLanguage && (i.startsWith("{") && (i = i.slice(1)), i.endsWith("}") && (i = i.slice(0, -1)), i = i.trim());
        return 0 == i.length || !("python" != this.languageId || "class_definition" != (null === (n = e.parent) || undefined === n ? undefined : n.type) && "function_definition" != (null === (o = e.parent) || undefined === o ? undefined : o.type) || 1 != e.children.length || !r.queryPythonIsDocstring(e.parent));
      }
      async isEmptyBlockStart(e, t) {
        var n, o, i;
        if (t > e.length) throw new RangeError("Invalid offset");
        for (let n = t; n < e.length && "\n" != e.charAt(n); n++) if (/\S/.test(e.charAt(n))) return !1;
        t = s(e, t);
        const a = await r.parseTree(this.languageId, e);
        try {
          const r = a.rootNode.descendantForIndex(t - 1);
          if (null == r) return !1;
          if (this.curlyBraceLanguage && "}" == r.type) return !1;
          if (("javascript" == this.languageId || "typescript" == this.languageId) && r.parent && "object" == r.parent.type && "{" == r.parent.text.trim()) return !0;
          if ("typescript" == this.languageId) {
            let n = r;
            for (; n.parent;) {
              if ("function_signature" == n.type || "method_signature" == n.type) {
                const o = r.nextSibling;
                return !!(o && n.hasError() && c(n, o, e)) || !n.children.find(e => ";" == e.type) && n.endIndex <= t;
              }
              n = n.parent;
            }
          }
          let s = null,
            l = null,
            u = null,
            d = r;
          for (; null != d;) {
            if (d.type == this.blockNodeType) {
              l = d;
              break;
            }
            if (this.nodeMatch[d.type]) {
              u = d;
              break;
            }
            if ("ERROR" == d.type) {
              s = d;
              break;
            }
            d = d.parent;
          }
          if (null != l) {
            if (!l.parent || !this.nodeMatch[l.parent.type]) return !1;
            if ("python" == this.languageId) {
              const e = l.previousSibling;
              if (null != e && e.hasError() && (e.text.startsWith('"""') || e.text.startsWith("'''"))) return !0;
            }
            return this.isBlockEmpty(l, t);
          }
          if (null != s) {
            if ("module" == (null === (n = s.previousSibling) || undefined === n ? undefined : n.type) || "internal_module" == (null === (o = s.previousSibling) || undefined === o ? undefined : o.type)) return !0;
            const e = [...s.children].reverse(),
              a = e.find(e => this.startKeywords.includes(e.type));
            let c = e.find(e => e.type == this.blockNodeType);
            if (a) {
              switch (this.languageId) {
                case "python":
                  {
                    "try" == a.type && "identifier" == r.type && r.text.length > 4 && (c = null === (i = e.find(e => e.hasError())) || undefined === i ? undefined : i.children.find(e => "block" == e.type));
                    const t = e.find(e => ":" == e.type);
                    if (t && a.endIndex <= t.startIndex && t.nextSibling) {
                      if ("def" == a.type) {
                        const e = t.nextSibling;
                        if ('"' == e.type || "'" == e.type) return !0;
                        if ("ERROR" == e.type && ('"""' == e.text || "'''" == e.text)) return !0;
                      }
                      return !1;
                    }
                    break;
                  }
                case "javascript":
                  {
                    const t = e.find(e => "formal_parameters" == e.type);
                    if ("class" == a.type && t) return !0;
                    const n = e.find(e => "{" == e.type);
                    if (n && n.startIndex > a.endIndex && null != n.nextSibling) return !1;
                    if (e.find(e => "do" == e.type) && "while" == a.type) return !1;
                    if ("=>" == a.type && a.nextSibling && "{" != a.nextSibling.type) return !1;
                    break;
                  }
                case "typescript":
                  {
                    const t = e.find(e => "{" == e.type);
                    if (t && t.startIndex > a.endIndex && null != t.nextSibling) return !1;
                    if (e.find(e => "do" == e.type) && "while" == a.type) return !1;
                    if ("=>" == a.type && a.nextSibling && "{" != a.nextSibling.type) return !1;
                    break;
                  }
              }
              return !(c && c.startIndex > a.endIndex) || this.isBlockEmpty(c, t);
            }
          }
          if (null != u) {
            const e = this.nodeMatch[u.type],
              n = u.children.slice().reverse().find(t => t.type == e);
            if (n) return this.isBlockEmpty(n, t);
            if (this.nodeTypesWithBlockOrStmtChild.has(u.type)) {
              const e = this.nodeTypesWithBlockOrStmtChild.get(u.type),
                t = "" == e ? u.children[0] : u.childForFieldName(e);
              if (t && t.type != this.blockNodeType && t.type != this.emptyStatementType) return !1;
            }
            return !0;
          }
          return !1;
        } finally {
          a.delete();
        }
      }
    }
    const u = {
      python: new l("python", {
        class_definition: "block",
        elif_clause: "block",
        else_clause: "block",
        except_clause: "block",
        finally_clause: "block",
        for_statement: "block",
        function_definition: "block",
        if_statement: "block",
        try_statement: "block",
        while_statement: "block",
        with_statement: "block"
      }, new Map(), ["def", "class", "if", "elif", "else", "for", "while", "try", "except", "finally", "with"], "block", null, !1),
      javascript: new l("javascript", {
        arrow_function: "statement_block",
        catch_clause: "statement_block",
        do_statement: "statement_block",
        else_clause: "statement_block",
        finally_clause: "statement_block",
        for_in_statement: "statement_block",
        for_statement: "statement_block",
        function: "statement_block",
        function_declaration: "statement_block",
        generator_function: "statement_block",
        generator_function_declaration: "statement_block",
        if_statement: "statement_block",
        method_definition: "statement_block",
        try_statement: "statement_block",
        while_statement: "statement_block",
        with_statement: "statement_block",
        class: "class_body",
        class_declaration: "class_body"
      }, new Map([["arrow_function", "body"], ["do_statement", "body"], ["else_clause", ""], ["for_in_statement", "body"], ["for_statement", "body"], ["if_statement", "consequence"], ["while_statement", "body"], ["with_statement", "body"]]), ["=>", "try", "catch", "finally", "do", "for", "if", "else", "while", "with", "function", "function*", "class"], "statement_block", "empty_statement", !0),
      typescript: new l("typescript", {
        ambient_declaration: "statement_block",
        arrow_function: "statement_block",
        catch_clause: "statement_block",
        do_statement: "statement_block",
        else_clause: "statement_block",
        finally_clause: "statement_block",
        for_in_statement: "statement_block",
        for_statement: "statement_block",
        function: "statement_block",
        function_declaration: "statement_block",
        generator_function: "statement_block",
        generator_function_declaration: "statement_block",
        if_statement: "statement_block",
        internal_module: "statement_block",
        method_definition: "statement_block",
        module: "statement_block",
        try_statement: "statement_block",
        while_statement: "statement_block",
        abstract_class_declaration: "class_body",
        class: "class_body",
        class_declaration: "class_body"
      }, new Map([["arrow_function", "body"], ["do_statement", "body"], ["else_clause", ""], ["for_in_statement", "body"], ["for_statement", "body"], ["if_statement", "consequence"], ["while_statement", "body"], ["with_statement", "body"]]), ["declare", "=>", "try", "catch", "finally", "do", "for", "if", "else", "while", "with", "function", "function*", "class"], "statement_block", "empty_statement", !0),
      go: new i("go", "{}", /\b(func|if|else|for)\b/, {
        communication_case: "block",
        default_case: "block",
        expression_case: "block",
        for_statement: "block",
        func_literal: "block",
        function_declaration: "block",
        if_statement: "block",
        labeled_statement: "block",
        method_declaration: "block",
        type_case: "block"
      }, new Map()),
      ruby: new i("ruby", "end", /\b(BEGIN|END|case|class|def|do|else|elsif|for|if|module|unless|until|while)\b|->/, {
        begin_block: "}",
        block: "}",
        end_block: "}",
        lambda: "block",
        for: "do",
        until: "do",
        while: "do",
        case: "end",
        do: "end",
        if: "end",
        method: "end",
        module: "end",
        unless: "end",
        do_block: "end"
      }, new Map())
    };
    function d(e) {
      return u[r.languageIdToWasmLanguage(e)];
    }
    t.getBlockParser = d;
    t.isEmptyBlockStart = async function (e, t, n) {
      return !!r.isSupportedLanguageId(e) && d(e).isEmptyBlockStart(t, n);
    };
    t.isBlockBodyFinished = async function (e, t, n, o) {
      if (r.isSupportedLanguageId(e)) return d(e).isBlockBodyFinished(t, n, o);
    };
    t.getNodeStart = async function (e, t, n) {
      if (r.isSupportedLanguageId(e)) return d(e).getNodeStart(t, n);
    };
  },
  312: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.getPrompt = t.newLineEnded = t.normalizeLanguageId = t.PromptOptions = t.SuffixStartMode = t.SuffixMatchOption = t.SuffixOption = t.LineEndingOptions = t.LocalImportContextOption = t.SnippetSelectionOption = t.NeighboringTabsPositionOption = t.NeighboringTabsOption = t.SiblingOption = t.PathMarkerOption = t.LanguageMarkerOption = t.TOKENS_RESERVED_FOR_SUFFIX_ENCODING = t.MAX_EDIT_DISTANCE_LENGTH = t.MAX_PROMPT_LENGTH = undefined;
    const r = n(417),
      o = n(179),
      i = n(125),
      s = n(670),
      a = n(94),
      c = n(456),
      l = n(395);
    let u = {
      text: "",
      tokens: []
    };
    var d, p, h, f, m, g, _, y, v, b, w;
    t.MAX_PROMPT_LENGTH = 1500;
    t.MAX_EDIT_DISTANCE_LENGTH = 50;
    t.TOKENS_RESERVED_FOR_SUFFIX_ENCODING = 5;
    (function (e) {
      e.NoMarker = "nomarker";
      e.Top = "top";
      e.Always = "always";
    })(d = t.LanguageMarkerOption || (t.LanguageMarkerOption = {}));
    (function (e) {
      e.NoMarker = "nomarker";
      e.Top = "top";
      e.Always = "always";
    })(p = t.PathMarkerOption || (t.PathMarkerOption = {}));
    (function (e) {
      e.NoSiblings = "nosiblings";
      e.SiblingsOverContext = "siblingabove";
      e.ContextOverSiblings = "contextabove";
    })(h = t.SiblingOption || (t.SiblingOption = {}));
    (function (e) {
      e.None = "none";
      e.Conservative = "conservative";
      e.Medium = "medium";
      e.Eager = "eager";
      e.EagerButLittle = "eagerButLittle";
    })(f = t.NeighboringTabsOption || (t.NeighboringTabsOption = {}));
    (function (e) {
      e.TopOfText = "top";
      e.DirectlyAboveCursor = "aboveCursor";
      e.AfterSiblings = "afterSiblings";
    })(m = t.NeighboringTabsPositionOption || (t.NeighboringTabsPositionOption = {}));
    (function (e) {
      e.BestMatch = "bestMatch";
      e.TopK = "topK";
    })(g = t.SnippetSelectionOption || (t.SnippetSelectionOption = {}));
    (function (e) {
      e.NoContext = "nocontext";
      e.Declarations = "declarations";
    })(_ = t.LocalImportContextOption || (t.LocalImportContextOption = {}));
    (function (e) {
      e.ConvertToUnix = "unix";
      e.KeepOriginal = "keep";
    })(y = t.LineEndingOptions || (t.LineEndingOptions = {}));
    (w = t.SuffixOption || (t.SuffixOption = {})).None = "none";
    w.FifteenPercent = "fifteenPercent";
    (function (e) {
      e.Equal = "equal";
      e.Levenshtein = "levenshteineditdistance";
    })(v = t.SuffixMatchOption || (t.SuffixMatchOption = {}));
    (function (e) {
      e.Cursor = "cursor";
      e.CursorTrimStart = "cursortrimstart";
      e.SiblingBlock = "siblingblock";
      e.SiblingBlockTrimStart = "siblingblocktrimstart";
    })(b = t.SuffixStartMode || (t.SuffixStartMode = {}));
    class x {
      constructor(e, n) {
        this.fs = e;
        this.maxPromptLength = t.MAX_PROMPT_LENGTH;
        this.languageMarker = d.Top;
        this.pathMarker = p.Top;
        this.includeSiblingFunctions = h.ContextOverSiblings;
        this.localImportContext = _.Declarations;
        this.neighboringTabs = f.Eager;
        this.neighboringTabsPosition = m.TopOfText;
        this.lineEnding = y.ConvertToUnix;
        this.suffixPercent = 0;
        this.suffixStartMode = b.Cursor;
        this.suffixMatchThreshold = 0;
        this.suffixMatchCriteria = v.Levenshtein;
        this.fimSuffixLengthThreshold = 0;
        if (n) for (const e in n) this[e] = n[e];
        if (this.suffixPercent < 0 || this.suffixPercent > 100) throw new Error(`suffixPercent must be between 0 and 100, but was ${this.suffixPercent}`);
        if (this.suffixPercent > 0 && this.includeSiblingFunctions != h.NoSiblings) throw new Error(`Invalid option combination. Cannot set suffixPercent > 0 (${this.suffixPercent}) and includeSiblingFunctions ${this.includeSiblingFunctions}`);
        if (this.suffixMatchThreshold < 0 || this.suffixMatchThreshold > 100) throw new Error(`suffixMatchThreshold must be at between 0 and 100, but was ${this.suffixMatchThreshold}`);
        if (this.fimSuffixLengthThreshold < -1) throw new Error(`fimSuffixLengthThreshold must be at least -1, but was ${this.fimSuffixLengthThreshold}`);
        if (null != this.indentationMinLength && null != this.indentationMaxLength && this.indentationMinLength > this.indentationMaxLength) throw new Error(`indentationMinLength must be less than or equal to indentationMaxLength, but was ${this.indentationMinLength} and ${this.indentationMaxLength}`);
        if (this.snippetSelection === g.TopK && undefined === this.snippetSelectionK) throw new Error("snippetSelectionK must be defined.");
        if (this.snippetSelection === g.TopK && this.snippetSelectionK && this.snippetSelectionK <= 0) throw new Error(`snippetSelectionK must be greater than 0, but was ${this.snippetSelectionK}`);
      }
    }
    t.PromptOptions = x;
    const E = {
      javascriptreact: "javascript",
      jsx: "javascript",
      typescriptreact: "typescript",
      jade: "pug",
      cshtml: "razor"
    };
    function C(e) {
      var t;
      e = e.toLowerCase();
      return null !== (t = E[e]) && undefined !== t ? t : e;
    }
    function S(e) {
      return "" == e || e.endsWith("\n") ? e : e + "\n";
    }
    t.normalizeLanguageId = C;
    t.newLineEnded = S;
    t.getPrompt = async function (e, n, g = {}, y = []) {
      var w;
      const E = new x(e, g);
      let T = !1;
      const {
        source: k,
        offset: I
      } = n;
      if (I < 0 || I > k.length) throw new Error(`Offset ${I} is out of range.`);
      n.languageId = C(n.languageId);
      const P = new c.Priorities(),
        A = P.justBelow(c.Priorities.TOP),
        O = E.languageMarker == d.Always ? P.justBelow(c.Priorities.TOP) : P.justBelow(A),
        N = E.pathMarker == p.Always ? P.justBelow(c.Priorities.TOP) : P.justBelow(A),
        R = E.includeSiblingFunctions == h.ContextOverSiblings ? P.justBelow(A) : P.justAbove(A),
        M = P.justBelow(A, R),
        L = P.justBelow(M),
        $ = new c.PromptWishlist(E.lineEnding);
      let D, F;
      if (E.languageMarker != d.NoMarker) {
        const e = S(r.getLanguageMarker(n));
        D = $.append(e, c.PromptElementKind.LanguageMarker, O);
      }
      if (E.pathMarker != p.NoMarker) {
        const e = S(r.getPathMarker(n));
        e.length > 0 && (F = $.append(e, c.PromptElementKind.PathMarker, N));
      }
      if (E.localImportContext != _.NoContext) for (const e of await o.extractLocalImportContext(n, E.fs)) $.append(S(e), c.PromptElementKind.ImportedFile, M);
      const j = E.neighboringTabs == f.None || 0 == y.length ? [] : await i.getNeighborSnippets(n, y, E.neighboringTabs, E.indentationMinLength, E.indentationMaxLength, E.snippetSelectionOption, E.snippetSelectionK);
      function q() {
        j.forEach(e => $.append(e.snippet, c.PromptElementKind.SimilarFile, L, a.tokenLength(e.snippet), e.score));
      }
      E.neighboringTabsPosition == m.TopOfText && q();
      const B = [];
      let U;
      if (E.includeSiblingFunctions == h.NoSiblings) U = k.substring(0, I);else {
        const {
          siblings: e,
          beforeInsertion: t,
          afterInsertion: r
        } = await s.getSiblingFunctions(n);
        $.appendLineForLine(t, c.PromptElementKind.BeforeCursor, A).forEach(e => B.push(e));
        let o = R;
        e.forEach(e => {
          $.append(e, c.PromptElementKind.AfterCursor, o);
          o = P.justBelow(o);
        });
        E.neighboringTabsPosition == m.AfterSiblings && q();
        U = r;
      }
      if (E.neighboringTabsPosition == m.DirectlyAboveCursor) {
        const e = U.lastIndexOf("\n") + 1,
          t = U.substring(0, e),
          n = U.substring(e);
        $.appendLineForLine(t, c.PromptElementKind.BeforeCursor, A).forEach(e => B.push(e));
        q();
        n.length > 0 && (B.push($.append(n, c.PromptElementKind.AfterCursor, A)), B.length > 1 && $.require(B[B.length - 2], B[B.length - 1]));
      } else $.appendLineForLine(U, c.PromptElementKind.BeforeCursor, A).forEach(e => B.push(e));
      d.Top == E.languageMarker && B.length > 0 && undefined !== D && $.require(D, B[0]);
      p.Top == E.pathMarker && B.length > 0 && undefined !== F && (D ? $.require(F, D) : $.require(F, B[0]));
      undefined !== D && undefined !== F && $.exclude(F, D);
      let H = k.slice(I);
      if (0 == E.suffixPercent || H.length <= E.fimSuffixLengthThreshold) return $.fulfill(E.maxPromptLength);
      {
        let e = n.offset;
        E.suffixStartMode !== b.Cursor && E.suffixStartMode !== b.CursorTrimStart && (e = await s.getSiblingFunctionStart(n));
        const r = E.maxPromptLength - t.TOKENS_RESERVED_FOR_SUFFIX_ENCODING;
        let o = Math.floor(r * (100 - E.suffixPercent) / 100),
          i = $.fulfill(o);
        const c = r - i.prefixLength;
        let d = k.slice(e);
        E.suffixStartMode != b.SiblingBlockTrimStart && E.suffixStartMode != b.CursorTrimStart || (d = d.trimStart());
        const p = a.takeFirstTokens(d, c);
        p.tokens.length <= c - 3 && (o = r - p.tokens.length, i = $.fulfill(o));
        E.suffixMatchCriteria == v.Equal ? p.tokens.length === u.tokens.length && p.tokens.every((e, t) => e === u.tokens[t]) && (T = !0) : E.suffixMatchCriteria == v.Levenshtein && p.tokens.length > 0 && E.suffixMatchThreshold > 0 && 100 * (null === (w = l.findEditDistanceScore(p.tokens.slice(0, t.MAX_EDIT_DISTANCE_LENGTH), u.tokens.slice(0, t.MAX_EDIT_DISTANCE_LENGTH))) || undefined === w ? undefined : w.score) < E.suffixMatchThreshold * Math.min(t.MAX_EDIT_DISTANCE_LENGTH, p.tokens.length) && (T = !0);
        !0 === T && u.tokens.length <= c ? (u.tokens.length <= c - 3 && (o = r - u.tokens.length, i = $.fulfill(o)), i.suffix = u.text, i.suffixLength = u.tokens.length) : (i.suffix = p.text, i.suffixLength = p.tokens.length, u = p);
        return i;
      }
    };
  },
  670: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.getSiblingFunctionStart = t.getSiblingFunctions = undefined;
    const r = n(312),
      o = n(306);
    t.getSiblingFunctions = async function ({
      source: e,
      offset: t,
      languageId: n
    }) {
      var i, s;
      const a = [];
      let c = "",
        l = e.substring(0, t);
      if (o.isSupportedLanguageId(n)) {
        const u = await o.parseTree(n, e);
        try {
          let d = t;
          for (; d >= 0 && /\s/.test(e[d]);) d--;
          const p = u.rootNode.descendantForIndex(d),
            h = o.getAncestorWithSiblingFunctions(n, p);
          if (h) {
            const u = o.getFirstPrecedingComment(h),
              d = null !== (i = null == u ? undefined : u.startIndex) && undefined !== i ? i : h.startIndex;
            let p,
              f = 0;
            for (; " " == (p = e[d - f - 1]) || "\t" == p;) f++;
            const m = e.substring(d - f, d);
            for (let i = h.nextSibling; i; i = i.nextSibling) if (o.isFunctionDefinition(n, i)) {
              const n = o.getFirstPrecedingComment(i),
                c = null !== (s = null == n ? undefined : n.startIndex) && undefined !== s ? s : i.startIndex;
              if (c < t) continue;
              const l = e.substring(c, i.endIndex),
                u = r.newLineEnded(l) + "\n" + m;
              a.push(u);
            }
            c = e.substring(0, d);
            l = e.substring(d, t);
          }
        } finally {
          u.delete();
        }
      }
      return {
        siblings: a,
        beforeInsertion: c,
        afterInsertion: l
      };
    };
    t.getSiblingFunctionStart = async function ({
      source: e,
      offset: t,
      languageId: n
    }) {
      var r;
      if (o.isSupportedLanguageId(n)) {
        const i = await o.parseTree(n, e);
        try {
          let s = t;
          for (; s >= 0 && /\s/.test(e[s]);) s--;
          const a = i.rootNode.descendantForIndex(s),
            c = o.getAncestorWithSiblingFunctions(n, a);
          if (c) {
            for (let e = c.nextSibling; e; e = e.nextSibling) if (o.isFunctionDefinition(n, e)) {
              const n = o.getFirstPrecedingComment(e),
                i = null !== (r = null == n ? undefined : n.startIndex) && undefined !== r ? r : e.startIndex;
              if (i < t) continue;
              return i;
            }
            if (c.endIndex >= t) return c.endIndex;
          }
        } finally {
          i.delete();
        }
      }
      return t;
    };
  },
  404: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.computeScore = t.IndentationBasedJaccardMatcher = t.FixedWindowSizeJaccardMatcher = undefined;
    const r = n(250),
      o = n(467);
    class i extends o.WindowedMatcher {
      constructor(e, t) {
        super(e);
        this.windowLength = t;
      }
      id() {
        return "fixed:" + this.windowLength;
      }
      getWindowsDelineations(e) {
        const t = [],
          n = e.length;
        for (let e = 0; 0 == e || e < n - this.windowLength; e++) {
          const r = Math.min(e + this.windowLength, n);
          t.push([e, r]);
        }
        return t;
      }
      trimDocument(e) {
        return e.source.slice(0, e.offset).split("\n").slice(-this.windowLength).join("\n");
      }
      similarityScore(e, t) {
        return a(e, t);
      }
    }
    t.FixedWindowSizeJaccardMatcher = i;
    i.FACTORY = e => ({
      to: t => new i(t, e)
    });
    class s extends o.WindowedMatcher {
      constructor(e, t, n) {
        super(e);
        this.indentationMinLength = t;
        this.indentationMaxLength = n;
        this.languageId = e.languageId;
      }
      id() {
        return `indent:${this.indentationMinLength}:${this.indentationMaxLength}:${this.languageId}`;
      }
      getWindowsDelineations(e) {
        return r.getWindowsDelineations(e, this.languageId, this.indentationMinLength, this.indentationMaxLength);
      }
      trimDocument(e) {
        return e.source.slice(0, e.offset).split("\n").slice(-this.indentationMaxLength).join("\n");
      }
      similarityScore(e, t) {
        return a(e, t);
      }
    }
    function a(e, t) {
      const n = new Set();
      e.forEach(e => {
        t.has(e) && n.add(e);
      });
      return n.size / (e.size + t.size - n.size);
    }
    t.IndentationBasedJaccardMatcher = s;
    s.FACTORY = (e, t) => ({
      to: n => new s(n, e, t)
    });
    t.computeScore = a;
  },
  125: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.getNeighborSnippets = t.neighborOptionToSelection = undefined;
    const r = n(417),
      o = n(404);
    function i(e) {
      return [e.relativePath ? "Compare this snippet from " + e.relativePath + ":" : "Compare this snippet:"].concat(e.snippet.split("\n"));
    }
    t.neighborOptionToSelection = {
      none: {
        matcherFactory: o.FixedWindowSizeJaccardMatcher.FACTORY(1),
        threshold: -1,
        numberOfSnippets: 0
      },
      conservative: {
        matcherFactory: o.FixedWindowSizeJaccardMatcher.FACTORY(10),
        threshold: .3,
        numberOfSnippets: 1
      },
      medium: {
        matcherFactory: o.FixedWindowSizeJaccardMatcher.FACTORY(20),
        threshold: .1,
        numberOfSnippets: 2
      },
      eager: {
        matcherFactory: o.FixedWindowSizeJaccardMatcher.FACTORY(60),
        threshold: 0,
        numberOfSnippets: 4
      },
      eagerButLittle: {
        matcherFactory: o.FixedWindowSizeJaccardMatcher.FACTORY(10),
        threshold: 0,
        numberOfSnippets: 1
      }
    };
    t.getNeighborSnippets = async function (e, n, s, a, c, l, u) {
      const d = t.neighborOptionToSelection[s],
        p = function (e, n, r, i) {
          const s = {
            ...t.neighborOptionToSelection[n]
          };
          undefined !== r && undefined !== i && (s.matcherFactory = o.IndentationBasedJaccardMatcher.FACTORY(r, i));
          return s.matcherFactory.to(e);
        }(e, s, a, c);
      return n.filter(e => e.source.length < 1e4 && e.source.length > 0).slice(0, 20).reduce((e, t) => e.concat(p.findMatches(t, l, u).map(e => ({
        relativePath: t.relativePath,
        ...e
      }))), []).filter(e => e.score && e.snippet && e.score > d.threshold).sort((e, t) => e.score - t.score).slice(-d.numberOfSnippets).map(t => ({
        score: t.score,
        snippet: i(t).map(t => r.comment(t, e.languageId) + "\n").join(""),
        startLine: t.startLine,
        endLine: t.endLine
      }));
    };
  },
  467: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.splitIntoWords = t.WindowedMatcher = t.SortOptions = undefined;
    const r = n(312);
    var o;
    !function (e) {
      e.Ascending = "ascending";
      e.Descending = "descending";
      e.None = "none";
    }(o = t.SortOptions || (t.SortOptions = {}));
    class i {
      constructor(e) {
        var t;
        this.stopsForLanguage = null !== (t = u.get(e.languageId)) && undefined !== t ? t : l;
      }
      tokenize(e) {
        return new Set(a(e).filter(e => !this.stopsForLanguage.has(e)));
      }
    }
    const s = new class {
      constructor(e) {
        this.keys = [];
        this.cache = {};
        this.size = e;
      }
      put(e, t) {
        var n;
        this.cache[e] = t;
        if (this.keys.length > this.size) {
          this.keys.push(e);
          const t = null !== (n = this.keys.shift()) && void 0 !== n ? n : "";
          delete this.cache[t];
        }
      }
      get(e) {
        return this.cache[e];
      }
    }(20);
    function a(e) {
      return e.split(/[^a-zA-Z0-9]/).filter(e => e.length > 0);
    }
    t.WindowedMatcher = class {
      constructor(e) {
        this.tokenizer = new i(e);
        this.referenceTokens = this.tokenizer.tokenize(this.trimDocument(e));
      }
      sortScoredSnippets(e, t = o.Descending) {
        return t == o.Ascending ? e.sort((e, t) => e.score > t.score ? 1 : -1) : t == o.Descending ? e.sort((e, t) => e.score > t.score ? -1 : 1) : e;
      }
      retrieveAllSnippets(e, t = o.Descending) {
        var n;
        const r = [];
        if (0 === e.source.length || 0 === this.referenceTokens.size) return r;
        const i = e.source.split("\n"),
          a = this.id() + ":" + e.source,
          c = null !== (n = s.get(a)) && undefined !== n ? n : [],
          l = 0 == c.length,
          u = l ? i.map(this.tokenizer.tokenize, this.tokenizer) : [];
        for (const [e, [t, n]] of this.getWindowsDelineations(i).entries()) {
          if (l) {
            const e = new Set();
            u.slice(t, n).forEach(t => t.forEach(e.add, e));
            c.push(e);
          }
          const o = c[e],
            i = this.similarityScore(o, this.referenceTokens);
          r.push({
            score: i,
            startLine: t,
            endLine: n
          });
        }
        l && s.put(a, c);
        return this.sortScoredSnippets(r, t);
      }
      findMatches(e, t = r.SnippetSelectionOption.BestMatch, n) {
        if (t == r.SnippetSelectionOption.BestMatch) {
          const t = this.findBestMatch(e);
          return t ? [t] : [];
        }
        return t == r.SnippetSelectionOption.TopK && this.findTopKMatches(e, n) || [];
      }
      findBestMatch(e) {
        if (0 === e.source.length || 0 === this.referenceTokens.size) return;
        const t = e.source.split("\n"),
          n = this.retrieveAllSnippets(e, o.Descending);
        return 0 !== n.length && 0 !== n[0].score ? {
          snippet: t.slice(n[0].startLine, n[0].endLine).join("\n"),
          ...n[0]
        } : undefined;
      }
      findTopKMatches(e, t = 1) {
        if (0 === e.source.length || 0 === this.referenceTokens.size || t < 1) return;
        const n = e.source.split("\n"),
          r = this.retrieveAllSnippets(e, o.Descending);
        if (0 === r.length || 0 === r[0].score) return;
        const i = [r[0]];
        for (let e = 1; e < r.length && i.length < t; e++) -1 == i.findIndex(t => r[e].startLine < t.endLine && r[e].endLine > t.startLine) && i.push(r[e]);
        return i.map(e => ({
          snippet: n.slice(e.startLine, e.endLine).join("\n"),
          ...e
        }));
      }
    };
    t.splitIntoWords = a;
    const c = new Set(["we", "our", "you", "it", "its", "they", "them", "their", "this", "that", "these", "those", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "can", "don", "t", "s", "will", "would", "should", "what", "which", "who", "when", "where", "why", "how", "a", "an", "the", "and", "or", "not", "no", "but", "because", "as", "until", "again", "further", "then", "once", "here", "there", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "above", "below", "to", "during", "before", "after", "of", "at", "by", "about", "between", "into", "through", "from", "up", "down", "in", "out", "on", "off", "over", "under", "only", "own", "same", "so", "than", "too", "very", "just", "now"]),
      l = new Set(["if", "then", "else", "for", "while", "with", "def", "function", "return", "TODO", "import", "try", "catch", "raise", "finally", "repeat", "switch", "case", "match", "assert", "continue", "break", "const", "class", "enum", "struct", "static", "new", "super", "this", "var", ...c]),
      u = new Map([]);
  },
  395: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.findEditDistanceScore = undefined;
    const r = n(94);
    t.findEditDistanceScore = function (e, t) {
      "string" == typeof e && (e = r.tokenize(e));
      "string" == typeof t && (t = r.tokenize(t));
      if (0 === e.length || 0 === t.length) return {
        score: e.length + t.length
      };
      const n = Array.from({
        length: e.length
      }).map(() => Array.from({
        length: t.length
      }).map(() => 0));
      for (let t = 0; t < e.length; t++) n[t][0] = t;
      for (let e = 0; e < t.length; e++) n[0][e] = e;
      for (let r = 0; r < t.length; r++) for (let o = 0; o < e.length; o++) n[o][r] = Math.min((0 == o ? r : n[o - 1][r]) + 1, (0 == r ? o : n[o][r - 1]) + 1, (0 == o || 0 == r ? Math.max(o, r) : n[o - 1][r - 1]) + (e[o] == t[r] ? 0 : 1));
      return {
        score: n[e.length - 1][t.length - 1]
      };
    };
  },
  456: (e, t, n) => {
    "use strict";

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    t.Priorities = t.PromptWishlist = t.PromptElementRanges = t.PromptChoices = t.PromptBackground = t.PromptElementKind = undefined;
    const r = n(312),
      o = n(94);
    var i;
    !function (e) {
      e.BeforeCursor = "BeforeCursor";
      e.AfterCursor = "AfterCursor";
      e.SimilarFile = "SimilarFile";
      e.ImportedFile = "ImportedFile";
      e.LanguageMarker = "LanguageMarker";
      e.PathMarker = "PathMarker";
    }(i = t.PromptElementKind || (t.PromptElementKind = {}));
    class s {
      constructor() {
        this.used = new Map();
        this.unused = new Map();
      }
      markUsed(e) {
        this.IsNeighboringTab(e) && this.used.set(e.id, this.convert(e));
      }
      undoMarkUsed(e) {
        this.IsNeighboringTab(e) && this.used.delete(e.id);
      }
      markUnused(e) {
        this.IsNeighboringTab(e) && this.unused.set(e.id, this.convert(e));
      }
      convert(e) {
        return {
          score: e.score.toFixed(4),
          length: e.text.length
        };
      }
      IsNeighboringTab(e) {
        return e.kind == i.SimilarFile;
      }
    }
    t.PromptBackground = s;
    class a {
      constructor() {
        this.used = new Map();
        this.unused = new Map();
      }
      markUsed(e) {
        this.used.set(e.kind, (this.used.get(e.kind) || 0) + e.tokens);
      }
      undoMarkUsed(e) {
        this.used.set(e.kind, (this.used.get(e.kind) || 0) - e.tokens);
      }
      markUnused(e) {
        this.unused.set(e.kind, (this.used.get(e.kind) || 0) + e.tokens);
      }
    }
    t.PromptChoices = a;
    class c {
      constructor(e) {
        this.ranges = new Array();
        let t,
          n = 0;
        for (const {
          element: r
        } of e) 0 !== r.text.length && (t === i.BeforeCursor && r.kind === i.BeforeCursor ? this.ranges[this.ranges.length - 1].end += r.text.length : this.ranges.push({
          kind: r.kind,
          start: n,
          end: n + r.text.length
        }), t = r.kind, n += r.text.length);
      }
    }
    t.PromptElementRanges = c;
    t.PromptWishlist = class {
      constructor(e) {
        this.content = [];
        this.lineEndingOption = e;
      }
      getContent() {
        return [...this.content];
      }
      convertLineEndings(e) {
        this.lineEndingOption === r.LineEndingOptions.ConvertToUnix && (e = e.replace(/\r\n/g, "\n").replace(/\r/g, "\n"));
        return e;
      }
      append(e, t, n, r = o.tokenLength(e), i = NaN) {
        e = this.convertLineEndings(e);
        const s = this.content.length;
        this.content.push({
          id: s,
          text: e,
          kind: t,
          priority: n,
          tokens: r,
          requires: [],
          excludes: [],
          score: i
        });
        return s;
      }
      appendLineForLine(e, t, n) {
        const r = (e = this.convertLineEndings(e)).split("\n");
        for (let e = 0; e < r.length - 1; e++) r[e] += "\n";
        const o = [];
        r.forEach((e, t) => {
          "\n" === e && o.length > 0 && !o[o.length - 1].endsWith("\n\n") ? o[o.length - 1] += "\n" : o.push(e);
        });
        const i = [];
        o.forEach((e, r) => {
          "" !== e && (i.push(this.append(e, t, n)), r > 0 && (this.content[this.content.length - 2].requires = [this.content[this.content.length - 1]]));
        });
        return i;
      }
      require(e, t) {
        const n = this.content.find(t => t.id === e),
          r = this.content.find(e => e.id === t);
        n && r && n.requires.push(r);
      }
      exclude(e, t) {
        const n = this.content.find(t => t.id === e),
          r = this.content.find(e => e.id === t);
        n && r && n.excludes.push(r);
      }
      fulfill(e) {
        const t = new a(),
          n = new s(),
          r = this.content.map((e, t) => ({
            element: e,
            index: t
          }));
        r.sort((e, t) => e.element.priority === t.element.priority ? t.index - e.index : t.element.priority - e.element.priority);
        const i = new Set(),
          l = new Set();
        let u;
        const d = [];
        let p = e;
        r.forEach(e => {
          var r;
          const o = e.element,
            s = e.index;
          if (p >= 0 && (p > 0 || undefined === u) && o.requires.every(e => i.has(e.id)) && !l.has(o.id)) {
            let a = o.tokens;
            const c = null === (r = function (e, t) {
              let n,
                r = 1 / 0;
              for (const o of e) o.index > t && o.index < r && (n = o, r = o.index);
              return n;
            }(d, s)) || undefined === r ? undefined : r.element;
            o.text.endsWith("\n\n") && c && !c.text.match(/^\s/) && a++;
            p >= a ? (p -= a, i.add(o.id), o.excludes.forEach(e => l.add(e.id)), t.markUsed(o), n.markUsed(o), d.push(e)) : u = null != u ? u : e;
          } else {
            t.markUnused(o);
            n.markUnused(o);
          }
        });
        d.sort((e, t) => e.index - t.index);
        let h = d.reduce((e, t) => e + t.element.text, ""),
          f = o.tokenLength(h);
        for (; f > e;) {
          d.sort((e, t) => t.element.priority === e.element.priority ? t.index - e.index : t.element.priority - e.element.priority);
          const e = d.pop();
          e && (t.undoMarkUsed(e.element), t.markUnused(e.element), n.undoMarkUsed(e.element), n.markUnused(e.element), u = undefined);
          d.sort((e, t) => e.index - t.index);
          h = d.reduce((e, t) => e + t.element.text, "");
          f = o.tokenLength(h);
        }
        const m = [...d];
        if (undefined !== u) {
          m.push(u);
          m.sort((e, t) => e.index - t.index);
          const r = m.reduce((e, t) => e + t.element.text, ""),
            i = o.tokenLength(r);
          if (i <= e) {
            t.markUsed(u.element);
            n.markUsed(u.element);
            const e = new c(m);
            return {
              prefix: r,
              suffix: "",
              prefixLength: i,
              suffixLength: 0,
              promptChoices: t,
              promptBackground: n,
              promptElementRanges: e
            };
          }
          t.markUnused(u.element);
          n.markUnused(u.element);
        }
        const g = new c(d);
        return {
          prefix: h,
          suffix: "",
          prefixLength: f,
          suffixLength: 0,
          promptChoices: t,
          promptBackground: n,
          promptElementRanges: g
        };
      }
    };
    class l {
      constructor() {
        this.registeredPriorities = [0, 1];
      }
      register(e) {
        if (e > l.TOP || e < l.BOTTOM) throw new Error("Priority must be between 0 and 1");
        this.registeredPriorities.push(e);
        return e;
      }
      justAbove(...e) {
        const t = Math.max(...e),
          n = Math.min(...this.registeredPriorities.filter(e => e > t));
        return this.register((n + t) / 2);
      }
      justBelow(...e) {
        const t = Math.min(...e),
          n = Math.max(...this.registeredPriorities.filter(e => e < t));
        return this.register((n + t) / 2);
      }
      between(e, t) {
        if (this.registeredPriorities.some(n => n > e && n < t) || !this.registeredPriorities.includes(e) || !this.registeredPriorities.includes(t)) throw new Error("Priorities must be adjacent in the list of priorities");
        return this.register((e + t) / 2);
      }
    }
    t.Priorities = l;
    l.TOP = 1;
    l.BOTTOM = 0;
  },
  87: (e, t, n) => {
    var r,
      o,
      i = undefined !== i ? i : {};
    undefined === (o = "function" == typeof (r = function () {
      var t,
        r = {};
      for (t in i) i.hasOwnProperty(t) && (r[t] = i[t]);
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
      o = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node;
      s = !u && !o && !d;
      var p,
        h,
        f,
        m,
        g,
        _ = "";
      o ? (_ = d ? n(622).dirname(_) + "/" : __dirname + "/", p = function (e, t) {
        m || (m = n(747));
        g || (g = n(622));
        e = g.normalize(e);
        return m.readFileSync(e, t ? null : "utf8");
      }, f = function (e) {
        var t = p(e, !0);
        t.buffer || (t = new Uint8Array(t));
        O(t.buffer);
        return t;
      }, process.argv.length > 1 && (c = process.argv[1].replace(/\\/g, "/")), a = process.argv.slice(2), e.exports = i, l = function (e) {
        process.exit(e);
      }, i.inspect = function () {
        return "[Emscripten Module object]";
      }) : s ? ("undefined" != typeof read && (p = function (e) {
        return read(e);
      }), f = function (e) {
        var t;
        return "function" == typeof readbuffer ? new Uint8Array(readbuffer(e)) : (O("object" == typeof (t = read(e, "binary"))), t);
      }, "undefined" != typeof scriptArgs ? a = scriptArgs : undefined !== arguments && (a = arguments), "function" == typeof quit && (l = function (e) {
        quit(e);
      }), "undefined" != typeof print && ("undefined" == typeof console && (console = {}), console.log = print, console.warn = console.error = "undefined" != typeof printErr ? printErr : print)) : (u || d) && (d ? _ = self.location.href : "undefined" != typeof document && document.currentScript && (_ = document.currentScript.src), _ = 0 !== _.indexOf("blob:") ? _.substr(0, _.lastIndexOf("/") + 1) : "", p = function (e) {
        var t = new XMLHttpRequest();
        t.open("GET", e, !1);
        t.send(null);
        return t.responseText;
      }, d && (f = function (e) {
        var t = new XMLHttpRequest();
        t.open("GET", e, !1);
        t.responseType = "arraybuffer";
        t.send(null);
        return new Uint8Array(t.response);
      }), h = function (e, t, n) {
        var r = new XMLHttpRequest();
        r.open("GET", e, !0);
        r.responseType = "arraybuffer";
        r.onload = function () {
          200 == r.status || 0 == r.status && r.response ? t(r.response) : n();
        };
        r.onerror = n;
        r.send(null);
      });
      i.print || console.log.bind(console);
      var y = i.printErr || console.warn.bind(console);
      for (t in r) r.hasOwnProperty(t) && (i[t] = r[t]);
      r = null;
      i.arguments && (a = i.arguments);
      i.thisProgram && (c = i.thisProgram);
      i.quit && (l = i.quit);
      var v,
        b = 16,
        w = [];
      function x(e, t) {
        if (!v) {
          v = new WeakMap();
          for (var n = 0; n < J.length; n++) {
            var r = J.get(n);
            r && v.set(r, n);
          }
        }
        if (v.has(e)) return v.get(e);
        var o = function () {
          if (w.length) return w.pop();
          try {
            J.grow(1);
          } catch (e) {
            if (!(e instanceof RangeError)) throw e;
            throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
          }
          return J.length - 1;
        }();
        try {
          J.set(o, e);
        } catch (n) {
          if (!(n instanceof TypeError)) throw n;
          var i = function (e, t) {
            if ("function" == typeof WebAssembly.Function) {
              for (var n = {
                  i: "i32",
                  j: "i64",
                  f: "f32",
                  d: "f64"
                }, r = {
                  parameters: [],
                  results: "v" == t[0] ? [] : [n[t[0]]]
                }, o = 1; o < t.length; ++o) r.parameters.push(n[t[o]]);
              return new WebAssembly.Function(r, e);
            }
            var i = [1, 0, 1, 96],
              s = t.slice(0, 1),
              a = t.slice(1),
              c = {
                i: 127,
                j: 126,
                f: 125,
                d: 124
              };
            for (i.push(a.length), o = 0; o < a.length; ++o) i.push(c[a[o]]);
            "v" == s ? i.push(0) : i = i.concat([1, c[s]]);
            i[1] = i.length - 2;
            var l = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(i, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0])),
              u = new WebAssembly.Module(l);
            return new WebAssembly.Instance(u, {
              e: {
                f: e
              }
            }).exports.f;
          }(e, t);
          J.set(o, i);
        }
        v.set(e, o);
        return o;
      }
      var E,
        C = function (e) {},
        S = i.dynamicLibraries || [];
      i.wasmBinary && (E = i.wasmBinary);
      var T,
        k = i.noExitRuntime || !0;
      function I(e, t, n, r) {
        switch ("*" === (n = n || "i8").charAt(n.length - 1) && (n = "i32"), n) {
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
            pe = [t >>> 0, (de = t, +Math.abs(de) >= 1 ? de > 0 ? (0 | Math.min(+Math.floor(de / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((de - +(~~de >>> 0)) / 4294967296) >>> 0 : 0)];
            $[e >> 2] = pe[0];
            $[e + 4 >> 2] = pe[1];
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
        switch ("*" === (t = t || "i8").charAt(t.length - 1) && (t = "i32"), t) {
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
      "object" != typeof WebAssembly && se("no native wasm support detected");
      var A = !1;
      function O(e, t) {
        e || se("Assertion failed: " + t);
      }
      var N,
        R,
        M,
        L,
        $,
        D,
        F,
        j = 1,
        q = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : undefined;
      function B(e, t, n) {
        for (var r = t + n, o = t; e[o] && !(o >= r);) ++o;
        if (o - t > 16 && e.subarray && q) return q.decode(e.subarray(t, o));
        for (var i = ""; t < o;) {
          var s = e[t++];
          if (128 & s) {
            var a = 63 & e[t++];
            if (192 != (224 & s)) {
              var c = 63 & e[t++];
              if ((s = 224 == (240 & s) ? (15 & s) << 12 | a << 6 | c : (7 & s) << 18 | a << 12 | c << 6 | 63 & e[t++]) < 65536) i += String.fromCharCode(s);else {
                var l = s - 65536;
                i += String.fromCharCode(55296 | l >> 10, 56320 | 1023 & l);
              }
            } else i += String.fromCharCode((31 & s) << 6 | a);
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
          a >= 55296 && a <= 57343 && (a = 65536 + ((1023 & a) << 10) | 1023 & e.charCodeAt(++s));
          if (a <= 127) {
            if (n >= i) break;
            t[n++] = a;
          } else if (a <= 2047) {
            if (n + 1 >= i) break;
            t[n++] = 192 | a >> 6, t[n++] = 128 | 63 & a;
          } else if (a <= 65535) {
            if (n + 2 >= i) break;
            t[n++] = 224 | a >> 12, t[n++] = 128 | a >> 6 & 63, t[n++] = 128 | 63 & a;
          } else {
            if (n + 3 >= i) break;
            t[n++] = 240 | a >> 18, t[n++] = 128 | a >> 12 & 63, t[n++] = 128 | a >> 6 & 63, t[n++] = 128 | 63 & a;
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
          r >= 55296 && r <= 57343 && (r = 65536 + ((1023 & r) << 10) | 1023 & e.charCodeAt(++n));
          r <= 127 ? ++t : t += r <= 2047 ? 2 : r <= 65535 ? 3 : 4;
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
      (T = i.wasmMemory ? i.wasmMemory : new WebAssembly.Memory({
        initial: K / 65536,
        maximum: 32768
      })) && (N = T.buffer);
      K = N.byteLength;
      W(N);
      var J = new WebAssembly.Table({
          initial: 13,
          element: "anyfunc"
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
        i.monitorRunDependencies && i.monitorRunDependencies(te);
      }
      function ie(e) {
        te--;
        i.monitorRunDependencies && i.monitorRunDependencies(te);
        if (0 == te && (null !== ne && (clearInterval(ne), ne = null), re)) {
          var t = re;
          re = null, t();
        }
      }
      function se(e) {
        throw i.onAbort && i.onAbort(e), y(e += ""), A = !0, e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.", new WebAssembly.RuntimeError(e);
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
      ce(he) || (ue = he, he = i.locateFile ? i.locateFile(ue, _) : _ + ue);
      var me = {},
        ge = {
          get: function (e, t) {
            me[t] || (me[t] = new WebAssembly.Global({
              value: "i32",
              mutable: !0
            }));
            return me[t];
          }
        };
      function _e(e) {
        for (; e.length > 0;) {
          var t = e.shift();
          if ("function" != typeof t) {
            var n = t.func;
            "number" == typeof n ? undefined === t.arg ? J.get(n)() : J.get(n)(t.arg) : n(undefined === t.arg ? null : t.arg);
          } else t(i);
        }
      }
      function ye(e) {
        var t = 0;
        function n() {
          for (var n = 0, r = 1;;) {
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
          O(1836278016 == new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer)[0], "need to see wasm magic number");
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
        loadedLibNames: {}
      };
      function xe(e, t, n) {
        return e.includes("j") ? function (e, t, n) {
          var r = i["dynCall_" + e];
          return n && n.length ? r.apply(null, [t].concat(n)) : r.call(null, t);
        }(e, t, n) : J.get(t).apply(null, n);
      }
      var Ee = 5250832;
      function Ce(e) {
        return ["__cpp_exception", "__wasm_apply_data_relocs", "__dso_handle", "__set_stack_limits"].includes(e);
      }
      function Se(e, t) {
        var n = {};
        for (var r in e) {
          var o = e[r];
          "object" == typeof o && (o = o.value);
          "number" == typeof o && (o += t);
          n[r] = o;
        }
        (function (e) {
          for (var t in e) if (!Ce(t)) {
            var n = !1,
              r = e[t];
            t.startsWith("orig$") && (t = t.split("$")[1], n = !0);
            me[t] || (me[t] = new WebAssembly.Global({
              value: "i32",
              mutable: !0
            }));
            (n || 0 == me[t].value) && ("function" == typeof r ? me[t].value = x(r) : "number" == typeof r ? me[t].value = r : y("unhandled export type for `" + t + "`: " + typeof r));
          }
        })(n);
        return n;
      }
      function Te(e) {
        return 0 == e.indexOf("dynCall_") || ["stackAlloc", "stackSave", "stackRestore"].includes(e) ? e : "_" + e;
      }
      function ke(e, t) {
        var n, r;
        t && (n = i.asm["orig$" + e]);
        n || (n = i.asm[e]);
        !n && t && (n = i["_orig$" + e]);
        n || (n = i[Te(e)]);
        !n && e.startsWith("invoke_") && (r = e.split("_")[1], n = function () {
          var e = ze();
          try {
            return xe(r, arguments[0], Array.prototype.slice.call(arguments, 1));
          } catch (t) {
            Ge(e);
            if (t !== t + 0 && "longjmp" !== t) throw t;
            We(1, 0);
          }
        });
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
            a = (o = function (e) {
              if (ee) return Ue(e);
              var t = Ee,
                n = t + e + 15 & -16;
              Ee = n;
              me.__heap_base.value = n;
              return t;
            }(n.memorySize + r), (i = r) || (i = b), Math.ceil(o / i) * i),
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
                return t in e ? e[t] : e[t] = function () {
                  n || (n = function (e) {
                    var t = ke(e, !1);
                    t || (t = s[e]);
                    return t;
                  }(t));
                  return n.apply(null, arguments);
                };
                var n;
              }
            }),
            d = {
              "GOT.mem": new Proxy(Be, ge),
              "GOT.func": new Proxy(Be, ge),
              env: u,
              wasi_snapshot_preview1: u
            };
          function p(e) {
            for (var r = 0; r < n.tableSize; r++) {
              var o = J.get(c + r);
              o && v.set(o, c + r);
            }
            s = Se(e.exports, a);
            t.allowUndefined || Oe();
            var i = s.__wasm_call_ctors;
            i || (i = s.__post_instantiate);
            i && (ee ? i() : Q.push(i));
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
          var f = e instanceof WebAssembly.Module ? e : new WebAssembly.Module(e);
          return p(h = new WebAssembly.Instance(f, d));
        }
        return t.loadAsync ? n.neededDynlibs.reduce(function (e, n) {
          return e.then(function () {
            return Ae(n, t);
          });
        }, Promise.resolve()).then(function () {
          return r();
        }) : (n.neededDynlibs.forEach(function (e) {
          Ae(e, t);
        }), r());
      }
      function Pe(e, t) {
        for (var n in e) if (e.hasOwnProperty(n)) {
          Be.hasOwnProperty(n) || (Be[n] = e[n]);
          var r = Te(n);
          i.hasOwnProperty(r) || (i[r] = e[n]);
        }
      }
      function Ae(e, t) {
        "__main__" != e || we.loadedLibNames[e] || (we.loadedLibs[-1] = {
          refcount: 1 / 0,
          name: "__main__",
          module: i.asm,
          global: !0
        }, we.loadedLibNames.__main__ = -1);
        t = t || {
          global: !0,
          nodelete: !0
        };
        var n,
          r = we.loadedLibNames[e];
        if (r) {
          n = we.loadedLibs[r];
          t.global && !n.global && (n.global = !0, "loading" !== n.module && Pe(n.module));
          t.nodelete && n.refcount !== 1 / 0 && (n.refcount = 1 / 0);
          n.refcount++;
          return t.loadAsync ? Promise.resolve(r) : r;
        }
        function o(e) {
          if (t.fs) {
            var n = t.fs.readFile(e, {
              encoding: "binary"
            });
            n instanceof Uint8Array || (n = new Uint8Array(n));
            return t.loadAsync ? Promise.resolve(n) : n;
          }
          return t.loadAsync ? (r = e, fetch(r, {
            credentials: "same-origin"
          }).then(function (e) {
            if (!e.ok) throw "failed to load binary file at '" + r + "'";
            return e.arrayBuffer();
          }).then(function (e) {
            return new Uint8Array(e);
          })) : f(e);
          var r;
        }
        function s() {
          if (undefined !== i.preloadedWasm && undefined !== i.preloadedWasm[e]) {
            var n = i.preloadedWasm[e];
            return t.loadAsync ? Promise.resolve(n) : n;
          }
          return t.loadAsync ? o(e).then(function (e) {
            return Ie(e, t);
          }) : Ie(o(e), t);
        }
        function a(e) {
          n.global && Pe(e);
          n.module = e;
        }
        r = we.nextHandle++;
        n = {
          refcount: t.nodelete ? 1 / 0 : 1,
          name: e,
          module: "loading",
          global: t.global
        };
        we.loadedLibNames[e] = r;
        we.loadedLibs[r] = n;
        return t.loadAsync ? s().then(function (e) {
          a(e);
          return r;
        }) : (a(s()), r);
      }
      function Oe() {
        for (var e in me) if (0 == me[e].value) {
          var t = ke(e, !0);
          "function" == typeof t ? me[e].value = x(t, t.sig) : "number" == typeof t ? me[e].value = t : O(!1, "bad export type for `" + e + "`: " + typeof t);
        }
      }
      i.___heap_base = Ee;
      var Ne,
        Re = new WebAssembly.Global({
          value: "i32",
          mutable: !0
        }, 5250832);
      function Me() {
        se();
      }
      i._abort = Me;
      Me.sig = "v";
      Ne = o ? function () {
        var e = process.hrtime();
        return 1e3 * e[0] + e[1] / 1e6;
      } : "undefined" != typeof dateNow ? dateNow : function () {
        return performance.now();
      };
      var Le = !0;
      function $e(e, t) {
        var n;
        if (0 === e) n = Date.now();else {
          if (1 !== e && 4 !== e || !Le) {
            $[He() >> 2] = 28;
            return -1;
          }
          n = Ne();
        }
        $[t >> 2] = n / 1e3 | 0;
        $[t + 4 >> 2] = n % 1e3 * 1e3 * 1e3 | 0;
        return 0;
      }
      function De(e) {
        try {
          T.grow(e - N.byteLength + 65535 >>> 16);
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
              var o = n * (1 + .2 / r);
              o = Math.min(o, e + 100663296);
              if (De(Math.min(2147483648, ((t = Math.max(e, o)) % 65536 > 0 && (t += 65536 - t % 65536), t)))) return !0;
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
              column: r
            });
            "string" == typeof i ? (I(o, i.length, "i32"), function (e, t, n) {
              undefined === n && (n = 2147483647);
              if (n < 2) return 0;
              for (var r = (n -= 2) < 2 * e.length ? n / 2 : e.length, o = 0; o < r; ++o) {
                var i = e.charCodeAt(o);
                L[t >> 1] = i;
                t += 2;
              }
              L[t >> 1] = 0;
            }(i, e, 10240)) : I(o, 0, "i32");
          }
        },
        Ue = (function () {
          var e = {
            env: Be,
            wasi_snapshot_preview1: Be,
            "GOT.mem": new Proxy(Be, ge),
            "GOT.func": new Proxy(Be, ge)
          };
          function t(e, t) {
            var n = e.exports;
            n = Se(n, 1024);
            i.asm = n;
            var r,
              o = ye(t);
            o.neededDynlibs && (S = o.neededDynlibs.concat(S));
            r = i.asm.__wasm_call_ctors;
            Q.unshift(r);
            ie();
          }
          function n(e) {
            t(e.instance, e.module);
          }
          function r(t) {
            return function () {
              if (!E && (u || d)) {
                if ("function" == typeof fetch && !le(he)) return fetch(he, {
                  credentials: "same-origin"
                }).then(function (e) {
                  if (!e.ok) throw "failed to load wasm binary file at '" + he + "'";
                  return e.arrayBuffer();
                }).catch(function () {
                  return fe(he);
                });
                if (h) return new Promise(function (e, t) {
                  h(he, function (t) {
                    e(new Uint8Array(t));
                  }, t);
                });
              }
              return Promise.resolve().then(function () {
                return fe(he);
              });
            }().then(function (t) {
              return WebAssembly.instantiate(t, e);
            }).then(t, function (e) {
              y("failed to asynchronously prepare wasm: " + e);
              se(e);
            });
          }
          oe();
          if (i.instantiateWasm) try {
            return i.instantiateWasm(e, t);
          } catch (e) {
            return y("Module.instantiateWasm callback failed with error: " + e), !1;
          }
          E || "function" != typeof WebAssembly.instantiateStreaming || ce(he) || le(he) || "function" != typeof fetch ? r(n) : fetch(he, {
            credentials: "same-origin"
          }).then(function (t) {
            return WebAssembly.instantiateStreaming(t, e).then(n, function (e) {
              y("wasm streaming compile failed: " + e);
              y("falling back to ArrayBuffer instantiation");
              return r(n);
            });
          });
        }(), i.___wasm_call_ctors = function () {
          return (i.___wasm_call_ctors = i.asm.__wasm_call_ctors).apply(null, arguments);
        }, i._malloc = function () {
          return (Ue = i._malloc = i.asm.malloc).apply(null, arguments);
        }),
        He = (i._ts_language_symbol_count = function () {
          return (i._ts_language_symbol_count = i.asm.ts_language_symbol_count).apply(null, arguments);
        }, i._ts_language_version = function () {
          return (i._ts_language_version = i.asm.ts_language_version).apply(null, arguments);
        }, i._ts_language_field_count = function () {
          return (i._ts_language_field_count = i.asm.ts_language_field_count).apply(null, arguments);
        }, i._ts_language_symbol_name = function () {
          return (i._ts_language_symbol_name = i.asm.ts_language_symbol_name).apply(null, arguments);
        }, i._ts_language_symbol_for_name = function () {
          return (i._ts_language_symbol_for_name = i.asm.ts_language_symbol_for_name).apply(null, arguments);
        }, i._ts_language_symbol_type = function () {
          return (i._ts_language_symbol_type = i.asm.ts_language_symbol_type).apply(null, arguments);
        }, i._ts_language_field_name_for_id = function () {
          return (i._ts_language_field_name_for_id = i.asm.ts_language_field_name_for_id).apply(null, arguments);
        }, i._memcpy = function () {
          return (i._memcpy = i.asm.memcpy).apply(null, arguments);
        }, i._free = function () {
          return (i._free = i.asm.free).apply(null, arguments);
        }, i._calloc = function () {
          return (i._calloc = i.asm.calloc).apply(null, arguments);
        }, i._ts_parser_delete = function () {
          return (i._ts_parser_delete = i.asm.ts_parser_delete).apply(null, arguments);
        }, i._ts_parser_reset = function () {
          return (i._ts_parser_reset = i.asm.ts_parser_reset).apply(null, arguments);
        }, i._ts_parser_set_language = function () {
          return (i._ts_parser_set_language = i.asm.ts_parser_set_language).apply(null, arguments);
        }, i._ts_parser_timeout_micros = function () {
          return (i._ts_parser_timeout_micros = i.asm.ts_parser_timeout_micros).apply(null, arguments);
        }, i._ts_parser_set_timeout_micros = function () {
          return (i._ts_parser_set_timeout_micros = i.asm.ts_parser_set_timeout_micros).apply(null, arguments);
        }, i._memcmp = function () {
          return (i._memcmp = i.asm.memcmp).apply(null, arguments);
        }, i._ts_query_new = function () {
          return (i._ts_query_new = i.asm.ts_query_new).apply(null, arguments);
        }, i._ts_query_delete = function () {
          return (i._ts_query_delete = i.asm.ts_query_delete).apply(null, arguments);
        }, i._iswspace = function () {
          return (i._iswspace = i.asm.iswspace).apply(null, arguments);
        }, i._iswalnum = function () {
          return (i._iswalnum = i.asm.iswalnum).apply(null, arguments);
        }, i._ts_query_pattern_count = function () {
          return (i._ts_query_pattern_count = i.asm.ts_query_pattern_count).apply(null, arguments);
        }, i._ts_query_capture_count = function () {
          return (i._ts_query_capture_count = i.asm.ts_query_capture_count).apply(null, arguments);
        }, i._ts_query_string_count = function () {
          return (i._ts_query_string_count = i.asm.ts_query_string_count).apply(null, arguments);
        }, i._ts_query_capture_name_for_id = function () {
          return (i._ts_query_capture_name_for_id = i.asm.ts_query_capture_name_for_id).apply(null, arguments);
        }, i._ts_query_string_value_for_id = function () {
          return (i._ts_query_string_value_for_id = i.asm.ts_query_string_value_for_id).apply(null, arguments);
        }, i._ts_query_predicates_for_pattern = function () {
          return (i._ts_query_predicates_for_pattern = i.asm.ts_query_predicates_for_pattern).apply(null, arguments);
        }, i._ts_tree_copy = function () {
          return (i._ts_tree_copy = i.asm.ts_tree_copy).apply(null, arguments);
        }, i._ts_tree_delete = function () {
          return (i._ts_tree_delete = i.asm.ts_tree_delete).apply(null, arguments);
        }, i._ts_init = function () {
          return (i._ts_init = i.asm.ts_init).apply(null, arguments);
        }, i._ts_parser_new_wasm = function () {
          return (i._ts_parser_new_wasm = i.asm.ts_parser_new_wasm).apply(null, arguments);
        }, i._ts_parser_enable_logger_wasm = function () {
          return (i._ts_parser_enable_logger_wasm = i.asm.ts_parser_enable_logger_wasm).apply(null, arguments);
        }, i._ts_parser_parse_wasm = function () {
          return (i._ts_parser_parse_wasm = i.asm.ts_parser_parse_wasm).apply(null, arguments);
        }, i._ts_language_type_is_named_wasm = function () {
          return (i._ts_language_type_is_named_wasm = i.asm.ts_language_type_is_named_wasm).apply(null, arguments);
        }, i._ts_language_type_is_visible_wasm = function () {
          return (i._ts_language_type_is_visible_wasm = i.asm.ts_language_type_is_visible_wasm).apply(null, arguments);
        }, i._ts_tree_root_node_wasm = function () {
          return (i._ts_tree_root_node_wasm = i.asm.ts_tree_root_node_wasm).apply(null, arguments);
        }, i._ts_tree_edit_wasm = function () {
          return (i._ts_tree_edit_wasm = i.asm.ts_tree_edit_wasm).apply(null, arguments);
        }, i._ts_tree_get_changed_ranges_wasm = function () {
          return (i._ts_tree_get_changed_ranges_wasm = i.asm.ts_tree_get_changed_ranges_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_new_wasm = function () {
          return (i._ts_tree_cursor_new_wasm = i.asm.ts_tree_cursor_new_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_delete_wasm = function () {
          return (i._ts_tree_cursor_delete_wasm = i.asm.ts_tree_cursor_delete_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_reset_wasm = function () {
          return (i._ts_tree_cursor_reset_wasm = i.asm.ts_tree_cursor_reset_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_goto_first_child_wasm = function () {
          return (i._ts_tree_cursor_goto_first_child_wasm = i.asm.ts_tree_cursor_goto_first_child_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_goto_next_sibling_wasm = function () {
          return (i._ts_tree_cursor_goto_next_sibling_wasm = i.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_goto_parent_wasm = function () {
          return (i._ts_tree_cursor_goto_parent_wasm = i.asm.ts_tree_cursor_goto_parent_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_current_node_type_id_wasm = function () {
          return (i._ts_tree_cursor_current_node_type_id_wasm = i.asm.ts_tree_cursor_current_node_type_id_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_current_node_is_named_wasm = function () {
          return (i._ts_tree_cursor_current_node_is_named_wasm = i.asm.ts_tree_cursor_current_node_is_named_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_current_node_is_missing_wasm = function () {
          return (i._ts_tree_cursor_current_node_is_missing_wasm = i.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_current_node_id_wasm = function () {
          return (i._ts_tree_cursor_current_node_id_wasm = i.asm.ts_tree_cursor_current_node_id_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_start_position_wasm = function () {
          return (i._ts_tree_cursor_start_position_wasm = i.asm.ts_tree_cursor_start_position_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_end_position_wasm = function () {
          return (i._ts_tree_cursor_end_position_wasm = i.asm.ts_tree_cursor_end_position_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_start_index_wasm = function () {
          return (i._ts_tree_cursor_start_index_wasm = i.asm.ts_tree_cursor_start_index_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_end_index_wasm = function () {
          return (i._ts_tree_cursor_end_index_wasm = i.asm.ts_tree_cursor_end_index_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_current_field_id_wasm = function () {
          return (i._ts_tree_cursor_current_field_id_wasm = i.asm.ts_tree_cursor_current_field_id_wasm).apply(null, arguments);
        }, i._ts_tree_cursor_current_node_wasm = function () {
          return (i._ts_tree_cursor_current_node_wasm = i.asm.ts_tree_cursor_current_node_wasm).apply(null, arguments);
        }, i._ts_node_symbol_wasm = function () {
          return (i._ts_node_symbol_wasm = i.asm.ts_node_symbol_wasm).apply(null, arguments);
        }, i._ts_node_child_count_wasm = function () {
          return (i._ts_node_child_count_wasm = i.asm.ts_node_child_count_wasm).apply(null, arguments);
        }, i._ts_node_named_child_count_wasm = function () {
          return (i._ts_node_named_child_count_wasm = i.asm.ts_node_named_child_count_wasm).apply(null, arguments);
        }, i._ts_node_child_wasm = function () {
          return (i._ts_node_child_wasm = i.asm.ts_node_child_wasm).apply(null, arguments);
        }, i._ts_node_named_child_wasm = function () {
          return (i._ts_node_named_child_wasm = i.asm.ts_node_named_child_wasm).apply(null, arguments);
        }, i._ts_node_child_by_field_id_wasm = function () {
          return (i._ts_node_child_by_field_id_wasm = i.asm.ts_node_child_by_field_id_wasm).apply(null, arguments);
        }, i._ts_node_next_sibling_wasm = function () {
          return (i._ts_node_next_sibling_wasm = i.asm.ts_node_next_sibling_wasm).apply(null, arguments);
        }, i._ts_node_prev_sibling_wasm = function () {
          return (i._ts_node_prev_sibling_wasm = i.asm.ts_node_prev_sibling_wasm).apply(null, arguments);
        }, i._ts_node_next_named_sibling_wasm = function () {
          return (i._ts_node_next_named_sibling_wasm = i.asm.ts_node_next_named_sibling_wasm).apply(null, arguments);
        }, i._ts_node_prev_named_sibling_wasm = function () {
          return (i._ts_node_prev_named_sibling_wasm = i.asm.ts_node_prev_named_sibling_wasm).apply(null, arguments);
        }, i._ts_node_parent_wasm = function () {
          return (i._ts_node_parent_wasm = i.asm.ts_node_parent_wasm).apply(null, arguments);
        }, i._ts_node_descendant_for_index_wasm = function () {
          return (i._ts_node_descendant_for_index_wasm = i.asm.ts_node_descendant_for_index_wasm).apply(null, arguments);
        }, i._ts_node_named_descendant_for_index_wasm = function () {
          return (i._ts_node_named_descendant_for_index_wasm = i.asm.ts_node_named_descendant_for_index_wasm).apply(null, arguments);
        }, i._ts_node_descendant_for_position_wasm = function () {
          return (i._ts_node_descendant_for_position_wasm = i.asm.ts_node_descendant_for_position_wasm).apply(null, arguments);
        }, i._ts_node_named_descendant_for_position_wasm = function () {
          return (i._ts_node_named_descendant_for_position_wasm = i.asm.ts_node_named_descendant_for_position_wasm).apply(null, arguments);
        }, i._ts_node_start_point_wasm = function () {
          return (i._ts_node_start_point_wasm = i.asm.ts_node_start_point_wasm).apply(null, arguments);
        }, i._ts_node_end_point_wasm = function () {
          return (i._ts_node_end_point_wasm = i.asm.ts_node_end_point_wasm).apply(null, arguments);
        }, i._ts_node_start_index_wasm = function () {
          return (i._ts_node_start_index_wasm = i.asm.ts_node_start_index_wasm).apply(null, arguments);
        }, i._ts_node_end_index_wasm = function () {
          return (i._ts_node_end_index_wasm = i.asm.ts_node_end_index_wasm).apply(null, arguments);
        }, i._ts_node_to_string_wasm = function () {
          return (i._ts_node_to_string_wasm = i.asm.ts_node_to_string_wasm).apply(null, arguments);
        }, i._ts_node_children_wasm = function () {
          return (i._ts_node_children_wasm = i.asm.ts_node_children_wasm).apply(null, arguments);
        }, i._ts_node_named_children_wasm = function () {
          return (i._ts_node_named_children_wasm = i.asm.ts_node_named_children_wasm).apply(null, arguments);
        }, i._ts_node_descendants_of_type_wasm = function () {
          return (i._ts_node_descendants_of_type_wasm = i.asm.ts_node_descendants_of_type_wasm).apply(null, arguments);
        }, i._ts_node_is_named_wasm = function () {
          return (i._ts_node_is_named_wasm = i.asm.ts_node_is_named_wasm).apply(null, arguments);
        }, i._ts_node_has_changes_wasm = function () {
          return (i._ts_node_has_changes_wasm = i.asm.ts_node_has_changes_wasm).apply(null, arguments);
        }, i._ts_node_has_error_wasm = function () {
          return (i._ts_node_has_error_wasm = i.asm.ts_node_has_error_wasm).apply(null, arguments);
        }, i._ts_node_is_missing_wasm = function () {
          return (i._ts_node_is_missing_wasm = i.asm.ts_node_is_missing_wasm).apply(null, arguments);
        }, i._ts_query_matches_wasm = function () {
          return (i._ts_query_matches_wasm = i.asm.ts_query_matches_wasm).apply(null, arguments);
        }, i._ts_query_captures_wasm = function () {
          return (i._ts_query_captures_wasm = i.asm.ts_query_captures_wasm).apply(null, arguments);
        }, i._iswalpha = function () {
          return (i._iswalpha = i.asm.iswalpha).apply(null, arguments);
        }, i._iswdigit = function () {
          return (i._iswdigit = i.asm.iswdigit).apply(null, arguments);
        }, i._iswlower = function () {
          return (i._iswlower = i.asm.iswlower).apply(null, arguments);
        }, i._towupper = function () {
          return (i._towupper = i.asm.towupper).apply(null, arguments);
        }, i._memchr = function () {
          return (i._memchr = i.asm.memchr).apply(null, arguments);
        }, i.___errno_location = function () {
          return (He = i.___errno_location = i.asm.__errno_location).apply(null, arguments);
        }),
        ze = (i._strlen = function () {
          return (i._strlen = i.asm.strlen).apply(null, arguments);
        }, i.stackSave = function () {
          return (ze = i.stackSave = i.asm.stackSave).apply(null, arguments);
        }),
        Ge = i.stackRestore = function () {
          return (Ge = i.stackRestore = i.asm.stackRestore).apply(null, arguments);
        },
        Ve = i.stackAlloc = function () {
          return (Ve = i.stackAlloc = i.asm.stackAlloc).apply(null, arguments);
        },
        We = i._setThrew = function () {
          return (We = i._setThrew = i.asm.setThrew).apply(null, arguments);
        };
      function Ke(e) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + e + ")";
        this.status = e;
      }
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = function () {
        return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(null, arguments);
      };
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = function () {
        return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(null, arguments);
      };
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = function () {
        return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(null, arguments);
      };
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = function () {
        return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(null, arguments);
      };
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = function () {
        return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(null, arguments);
      };
      i.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = function () {
        return (i.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = i.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(null, arguments);
      };
      i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = function () {
        return (i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = i.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(null, arguments);
      };
      i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = function () {
        return (i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = i.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(null, arguments);
      };
      i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ = function () {
        return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_).apply(null, arguments);
      };
      i.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = function () {
        return (i.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = i.asm._ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv).apply(null, arguments);
      };
      i.__Znwm = function () {
        return (i.__Znwm = i.asm._Znwm).apply(null, arguments);
      };
      i.__ZdlPv = function () {
        return (i.__ZdlPv = i.asm._ZdlPv).apply(null, arguments);
      };
      i._orig$ts_parser_timeout_micros = function () {
        return (i._orig$ts_parser_timeout_micros = i.asm.orig$ts_parser_timeout_micros).apply(null, arguments);
      };
      i._orig$ts_parser_set_timeout_micros = function () {
        return (i._orig$ts_parser_set_timeout_micros = i.asm.orig$ts_parser_set_timeout_micros).apply(null, arguments);
      };
      i._TRANSFER_BUFFER = 7296;
      i.___THREW__ = 7932;
      i.___threwValue = 7936;
      i.___cxa_new_handler = 7928;
      i.allocate = function (e, t) {
        var n;
        n = t == j ? Ve(e.length) : Ue(e.length);
        e.subarray || e.slice ? M.set(e, n) : M.set(new Uint8Array(e), n);
        return n;
      };
      re = function e() {
        qe || Xe();
        qe || (re = e);
      };
      var Je = !1;
      function Xe(e) {
        function t() {
          qe || (qe = !0, i.calledRun = !0, A || (ee = !0, _e(Q), _e(Y), i.onRuntimeInitialized && i.onRuntimeInitialized(), Ye && function (e) {
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
                e && "object" == typeof e && e.stack && (s = [e, e.stack]);
                y("exception thrown: " + s);
                l(1, e);
              }
            }
          }(e), function () {
            if (i.postRun) for ("function" == typeof i.postRun && (i.postRun = [i.postRun]); i.postRun.length;) {
              e = i.postRun.shift();
              Z.unshift(e);
            }
            var e;
            _e(Z);
          }()));
        }
        e = e || a;
        te > 0 || !Je && (function () {
          if (S.length) {
            if (!f) {
              oe();
              return void S.reduce(function (e, t) {
                return e.then(function () {
                  return Ae(t, {
                    loadAsync: !0,
                    global: !0,
                    nodelete: !0,
                    allowUndefined: !0
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
                allowUndefined: !0
              });
            });
            Oe();
          } else Oe();
        }(), Je = !0, te > 0) || (function () {
          if (i.preRun) for ("function" == typeof i.preRun && (i.preRun = [i.preRun]); i.preRun.length;) {
            e = i.preRun.shift();
            X.unshift(e);
          }
          var e;
          _e(X);
        }(), te > 0 || (i.setStatus ? (i.setStatus("Running..."), setTimeout(function () {
          setTimeout(function () {
            i.setStatus("");
          }, 1);
          t();
        }, 1)) : t()));
      }
      function Qe(e, t) {
        t && be() && 0 === e || (be() || (i.onExit && i.onExit(e), A = !0), l(e, new Ke(e)));
      }
      i.run = Xe;
      if (i.preInit) for ("function" == typeof i.preInit && (i.preInit = [i.preInit]); i.preInit.length > 0;) i.preInit.pop()();
      var Ye = !0;
      i.noInitialRun && (Ye = !1);
      Xe();
      const Ze = i,
        et = {},
        tt = 4,
        nt = 5 * tt,
        rt = 2 * tt,
        ot = 2 * tt + 2 * rt,
        it = {
          row: 0,
          column: 0
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
        mt = new Promise(e => {
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
          if (null == pt) throw new Error("You must first call Parser.init() and wait for it to resolve.");
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
            if (e.constructor !== bt) throw new Error("Argument must be a Language");
            {
              t = e[0];
              const n = Ze._ts_language_version(t);
              if (n < dt || ut < n) throw new Error(`Incompatible language version ${n}. Compatibility range ${dt} through ${ut}.`);
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
          if ("string" == typeof e) ht = (t, n, r) => e.slice(t, r);else {
            if ("function" != typeof e) throw new Error("Argument must be a string or a function");
            ht = e;
          }
          this.logCallback ? (ft = this.logCallback, Ze._ts_parser_enable_logger_wasm(this[0], 1)) : (ft = null, Ze._ts_parser_enable_logger_wasm(this[0], 0));
          let r = 0,
            o = 0;
          if (n && n.includedRanges) {
            r = n.includedRanges.length;
            let e = o = Ze._calloc(r, ot);
            for (let t = 0; t < r; t++) {
              Nt(e, n.includedRanges[t]);
              e += ot;
            }
          }
          const i = Ze._ts_parser_parse_wasm(this[0], this[1], t ? t[0] : 0, o, r);
          if (!i) throw ht = null, ft = null, new Error("Parsing failed");
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
            if ("function" != typeof e) throw new Error("Logger callback must be a function");
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
          !function (e) {
            let t = pt;
            At(t, e.startPosition);
            At(t += rt, e.oldEndPosition);
            At(t += rt, e.newEndPosition);
            I(t += rt, e.startIndex, "i32");
            I(t += tt, e.oldEndIndex, "i32");
            I(t += tt, e.newEndIndex, "i32");
            t += tt;
          }(e);
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
          if (e.constructor !== _t) throw new TypeError("Argument must be a Tree");
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
              for (let t = 0; t < e; t++) this._children[t] = kt(this.tree, n), n += nt;
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
              for (let t = 0; t < e; t++) this._namedChildren[t] = kt(this.tree, n), n += nt;
              Ze._free(t);
            }
          }
          return this._namedChildren;
        }
        descendantsOfType(e, t, n) {
          Array.isArray(e) || (e = [e]);
          t || (t = it);
          n || (n = it);
          const r = [],
            o = this.tree.language.types;
          for (let t = 0, n = o.length; t < n; t++) e.includes(o[t]) && r.push(t);
          const i = Ze._malloc(tt * r.length);
          for (let e = 0, t = r.length; e < t; e++) I(i + e * tt, r[e], "i32");
          Tt(this);
          Ze._ts_node_descendants_of_type_wasm(this.tree[0], i, r.length, t.row, t.column, n.row, n.column);
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
          if ("number" != typeof e || "number" != typeof t) throw new Error("Arguments must be numbers");
          Tt(this);
          let n = pt + nt;
          I(n, e, "i32");
          I(n + tt, t, "i32");
          Ze._ts_node_descendant_for_index_wasm(this.tree[0]);
          return kt(this.tree);
        }
        namedDescendantForIndex(e, t = e) {
          if ("number" != typeof e || "number" != typeof t) throw new Error("Arguments must be numbers");
          Tt(this);
          let n = pt + nt;
          I(n, e, "i32");
          I(n + tt, t, "i32");
          Ze._ts_node_named_descendant_for_index_wasm(this.tree[0]);
          return kt(this.tree);
        }
        descendantForPosition(e, t = e) {
          if (!St(e) || !St(t)) throw new Error("Arguments must be {row, column} objects");
          Tt(this);
          let n = pt + nt;
          At(n, e);
          At(n + rt, t);
          Ze._ts_node_descendant_for_position_wasm(this.tree[0]);
          return kt(this.tree);
        }
        namedDescendantForPosition(e, t = e) {
          if (!St(e) || !St(t)) throw new Error("Arguments must be {row, column} objects");
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
            t = function (e) {
              for (var t = "";;) {
                var n = M[e++ >> 0];
                if (!n) return t;
                t += String.fromCharCode(n);
              }
            }(e);
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
          return 1 === Ze._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]);
        }
        get nodeIsMissing() {
          It(this);
          return 1 === Ze._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]);
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
          for (let e = 0, t = this.types.length; e < t; e++) Ze._ts_language_symbol_type(this[0], e) < 2 && (this.types[e] = U(Ze._ts_language_symbol_name(this[0], e)));
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
                i = new TypeError(`Bad pattern structure at offset ${r}: '${o}'...`);
                s = "";
                break;
              default:
                i = new SyntaxError(`Bad syntax at offset ${r}: '${o}'...`);
                s = "";
            }
            throw i.index = r, i.length = s.length, Ze._free(n), i;
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
                n = P(i += tt, "i32");
              i += tt;
              if (t === at) o.push({
                type: "capture",
                name: a[n]
              });else if (t === ct) o.push({
                type: "string",
                value: c[n]
              });else if (o.length > 0) {
                if ("string" !== o[0].type) throw new Error("Predicates must begin with a literal value");
                const t = o[0].value;
                let n = !0;
                switch (t) {
                  case "not-eq?":
                    n = !1;
                  case "eq?":
                    if (3 !== o.length) throw new Error("Wrong number of arguments to `#eq?` predicate. Expected 2, got " + (o.length - 1));
                    if ("capture" !== o[1].type) throw new Error(`First argument of \`#eq?\` predicate must be a capture. Got "${o[1].value}"`);
                    if ("capture" === o[2].type) {
                      const t = o[1].name,
                        r = o[2].name;
                      h[e].push(function (e) {
                        let o, i;
                        for (const n of e) n.name === t && (o = n.node), n.name === r && (i = n.node);
                        return o.text === i.text === n;
                      });
                    } else {
                      const t = o[1].name,
                        r = o[2].value;
                      h[e].push(function (e) {
                        for (const o of e) if (o.name === t) return o.node.text === r === n;
                        return !1;
                      });
                    }
                    break;
                  case "not-match?":
                    n = !1;
                  case "match?":
                    if (3 !== o.length) throw new Error(`Wrong number of arguments to \`#match?\` predicate. Expected 2, got ${o.length - 1}.`);
                    if ("capture" !== o[1].type) throw new Error(`First argument of \`#match?\` predicate must be a capture. Got "${o[1].value}".`);
                    if ("string" !== o[2].type) throw new Error(`Second argument of \`#match?\` predicate must be a string. Got @${o[2].value}.`);
                    const r = o[1].name,
                      i = new RegExp(o[2].value);
                    h[e].push(function (e) {
                      for (const t of e) if (t.name === r) return i.test(t.node.text) === n;
                      return !1;
                    });
                    break;
                  case "set!":
                    if (o.length < 2 || o.length > 3) throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${o.length - 1}.`);
                    if (o.some(e => "string" !== e.type)) throw new Error('Arguments to `#set!` predicate must be a strings.".');
                    l[e] || (l[e] = {}), l[e][o[1].value] = o[2] ? o[2].value : null;
                    break;
                  case "is?":
                  case "is-not?":
                    if (o.length < 2 || o.length > 3) throw new Error(`Wrong number of arguments to \`#${t}\` predicate. Expected 1 or 2. Got ${o.length - 1}.`);
                    if (o.some(e => "string" !== e.type)) throw new Error(`Arguments to \`#${t}\` predicate must be a strings.".`);
                    const s = "is?" === t ? u : d;
                    s[e] || (s[e] = {}), s[e][o[1].value] = o[2] ? o[2].value : null;
                    break;
                  default:
                    p[e].push({
                      operator: t,
                      operands: o.slice(1)
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
          return new wt(et, r, a, h, p, Object.freeze(l), Object.freeze(u), Object.freeze(d));
        }
        static load(e) {
          let t;
          if (e instanceof Uint8Array) t = Promise.resolve(e);else {
            const r = e;
            if ("undefined" != typeof process && process.versions && process.versions.node) {
              const e = n(747);
              t = Promise.resolve(e.readFileSync(r));
            } else t = fetch(r).then(e => e.arrayBuffer().then(t => {
              if (e.ok) return new Uint8Array(t);
              {
                const n = new TextDecoder("utf-8").decode(t);
                throw new Error(`Language.load failed with status ${e.status}.\n\n${n}`);
              }
            }));
          }
          const r = "function" == typeof loadSideModule ? loadSideModule : Ie;
          return t.then(e => r(e, {
            loadAsync: !0
          })).then(e => {
            const t = Object.keys(e),
              n = t.find(e => lt.test(e) && !e.includes("external_scanner_"));
            n || console.log(`Couldn't find language function in WASM file. Symbols:\n${JSON.stringify(t, null, 2)}`);
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
          t || (t = it);
          n || (n = it);
          Tt(e);
          Ze._ts_query_matches_wasm(this[0], e.tree[0], t.row, t.column, n.row, n.column);
          const r = P(pt, "i32"),
            o = P(pt + tt, "i32"),
            i = P(pt + 2 * tt, "i32"),
            s = new Array(r);
          this.exceededMatchLimit = !!i;
          let a = 0,
            c = o;
          for (let t = 0; t < r; t++) {
            const n = P(c, "i32"),
              r = P(c += tt, "i32");
            c += tt;
            const o = new Array(r);
            c = Et(this, e.tree, c, o);
            if (this.textPredicates[n].every(e => e(o))) {
              s[a++] = {
                pattern: n,
                captures: o
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
          t || (t = it);
          n || (n = it);
          Tt(e);
          Ze._ts_query_captures_wasm(this[0], e.tree[0], t.row, t.column, n.row, n.column);
          const r = P(pt, "i32"),
            o = P(pt + tt, "i32"),
            i = P(pt + 2 * tt, "i32"),
            s = [];
          this.exceededMatchLimit = !!i;
          const a = [];
          let c = o;
          for (let t = 0; t < r; t++) {
            const t = P(c, "i32"),
              n = P(c += tt, "i32"),
              r = P(c += tt, "i32");
            c += tt;
            a.length = n;
            c = Et(this, e.tree, c, a);
            if (this.textPredicates[t].every(e => e(a))) {
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
        for (t += o.length; t < n;) {
          const r = e.textCallback(t, null, n);
          if (!(r && r.length > 0)) break;
          t += r.length;
          o += r;
        }
        t > n && (o = o.slice(0, r));
        return o;
      }
      function Et(e, t, n, r) {
        for (let o = 0, i = r.length; o < i; o++) {
          const i = P(n, "i32"),
            s = kt(t, n += tt);
          n += nt;
          r[o] = {
            name: e.captureNames[i],
            node: s
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
        I(t += tt, e.startIndex, "i32");
        I(t += tt, e.startPosition.row, "i32");
        I(t += tt, e.startPosition.column, "i32");
        I(t += tt, e[0], "i32");
      }
      function kt(e, t = pt) {
        const n = P(t, "i32");
        if (0 === n) return null;
        const r = P(t += tt, "i32"),
          o = P(t += tt, "i32"),
          i = P(t += tt, "i32"),
          s = P(t += tt, "i32"),
          a = new yt(et, e);
        a.id = n;
        a.startIndex = r;
        a.startPosition = {
          row: o,
          column: i
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
          column: P(e + tt, "i32")
        };
      }
      function Nt(e, t) {
        At(e, t.startPosition);
        At(e += rt, t.endPosition);
        I(e += rt, t.startIndex, "i32");
        I(e += tt, t.endIndex, "i32");
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
    }) ? r.apply(t, []) : r) || (e.exports = o);
  },
  94: (e, t, n) => {
    const r = n(747),
      o = n(622),
      i = (e, t) => Array.from(Array(t).keys()).slice(e),
      s = e => e.charCodeAt(0),
      a = new TextDecoder("utf-8"),
      c = e => a.decode(new Uint8Array(e));
    function l(e) {
      const t = new Set();
      let n = e[0];
      for (let r = 1; r < e.length; r++) {
        const o = e[r];
        t.add([n, o]);
        n = o;
      }
      return t;
    }
    const u = new TextEncoder("utf-8"),
      d = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
    let p = !1;
    const h = {};
    let f,
      m = {},
      g = new Map(),
      _ = new Map();
    const y = new Map();
    function v() {
      if (p) return;
      m = JSON.parse(r.readFileSync(o.resolve(__dirname, "..", "dist", "tokenizer.json")));
      Object.keys(m).map(e => {
        h[m[e]] = e;
      });
      const e = r.readFileSync(o.resolve(__dirname, "..", "dist", "vocab.bpe"), "utf-8").split("\n"),
        t = e.slice(1, e.length - 1).map(e => e.split(/(\s+)/).filter(function (e) {
          return e.trim().length > 0;
        }));
      f = ((e, t) => {
        const n = {};
        e.map((r, o) => {
          n[e[o]] = t[o];
        });
        return n;
      })(t, i(0, t.length));
      (function (e) {
        const t = i(s("!"), s("~") + 1).concat(i(s("¡"), s("¬") + 1), i(s("®"), s("ÿ") + 1));
        let n = t.slice(),
          r = 0;
        for (let e = 0; e < 256; e++) t.includes(e) || (t.push(e), n.push(256 + r), r += 1);
        n = n.map(e => (e => String.fromCharCode(e))(e));
        for (let r = 0; r < t.length; r++) e.set(t[r], n[r]);
      })(g);
      g.forEach(function (e, t, n) {
        _.set(e, t);
      });
      p = !0;
    }
    function b(e) {
      if (y.has(e)) return y.get(e);
      let t = (r = e, Array.from(u.encode(r))).map(e => g.get(e)),
        n = l(t);
      var r;
      if (!n) return t.map(e => m[e]);
      for (;;) {
        const e = {};
        Array.from(n).map(t => {
          const n = f[t];
          e[isNaN(n) ? 1e11 : n] = t;
        });
        const r = e[Math.min(...Object.keys(e).map(e => parseInt(e)))];
        if (!(r in f)) break;
        const o = r[0],
          i = r[1];
        let s = [],
          a = 0;
        for (; a < t.length;) {
          const e = t.indexOf(o, a);
          if (-1 === e) {
            Array.prototype.push.apply(s, t.slice(a));
            break;
          }
          Array.prototype.push.apply(s, t.slice(a, e));
          a = e;
          t[a] === o && a < t.length - 1 && t[a + 1] === i ? (s.push(o + i), a += 2) : (s.push(t[a]), a += 1);
        }
        t = s;
        if (1 === t.length) break;
        n = l(t);
      }
      tokens = t.map(e => m[e]);
      y.set(e, tokens);
      return tokens;
    }
    function w(e) {
      v();
      let t = [];
      const n = Array.from(e.matchAll(d)).map(e => e[0]);
      for (let e of n) {
        const n = b(e);
        Array.prototype.push.apply(t, n);
      }
      return t;
    }
    function x(e, t) {
      if (t <= 0) return "";
      let n = Math.min(e.length, 4 * t),
        r = e.slice(-n),
        o = w(r);
      for (; o.length < t + 2 && n < e.length;) {
        n = Math.min(e.length, n + 1 * t);
        r = e.slice(-n);
        o = w(r);
      }
      return o.length < t ? e : (o = o.slice(-t), E(o));
    }
    function E(e) {
      v();
      let t = e.map(e => h[e]).join("");
      t = c(t.split("").map(e => _.get(e)));
      return t;
    }
    e.exports = {
      prepareTokenizer: v,
      tokenize: w,
      tokenize_strings: function (e) {
        return w(e).map(e => c(h[e].split("").map(e => _.get(e))));
      },
      tokenLength: function (e) {
        return w(e).length;
      },
      takeLastTokens: x,
      takeLastLinesTokens: function (e, t) {
        const n = x(e, t);
        if (n.length === e.length || "\n" === e[e.length - n.length - 1]) return n;
        let r = n.indexOf("\n");
        return n.substring(r + 1);
      },
      takeFirstTokens: function (e, t) {
        if (t <= 0) return {
          text: "",
          tokens: []
        };
        let n = Math.min(e.length, 4 * t),
          r = e.slice(0, n),
          o = w(r);
        for (; o.length < t + 2 && n < e.length;) {
          n = Math.min(e.length, n + 1 * t);
          r = e.slice(0, n);
          o = w(r);
        }
        return o.length < t ? {
          text: e,
          tokens: o
        } : (o = o.slice(0, t), {
          text: E(o),
          tokens: o
        });
      },
      detokenize: E
    };
  },
  747: e => {
    "use strict";

    e.exports = require(7147);
  },
  622: e => {
    "use strict";

    e.exports = require(1017);
  },
  13: e => {
    "use strict";

    e.exports = require(1267);
  }
};
o = {};
i = function e(t) {
  var n = o[t];
  if (undefined !== n) return n.exports;
  var i = o[t] = {
    exports: {}
  };
  r[t].call(i.exports, i, i.exports, e);
  return i.exports;
}(563);
module.exports = i;