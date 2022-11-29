Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.extractLocalImportContext = exports.getDocComment = undefined;
const r = require(1017),
  o = require(464);
function i(e, t) {
  var n;
  let o =
    null === (n = t.namedChild(1)) || undefined === n
      ? undefined
      : n.text.slice(1, -1);
  if (!o || !o.startsWith(".")) return null;
  if ("" === r.extname(o)) o += ".ts";
  else if (".ts" !== r.extname(o)) return null;
  return r.join(r.dirname(e), o);
}
function s(e) {
  var t, n, r, o, i;
  let s = [];
  if (
    "import_clause" ===
    (null === (t = e.namedChild(0)) || undefined === t ? undefined : t.type)
  ) {
    let t = e.namedChild(0);
    if (
      "named_imports" ===
      (null === (n = null == t ? undefined : t.namedChild(0)) || undefined === n
        ? undefined
        : n.type)
    ) {
      let e = t.namedChild(0);
      for (let t of null !== (r = null == e ? undefined : e.namedChildren) &&
      undefined !== r
        ? r
        : [])
        if ("import_specifier" === t.type) {
          const e =
            null === (o = t.childForFieldName("name")) || undefined === o
              ? undefined
              : o.text;
          if (e) {
            const n =
              null === (i = t.childForFieldName("alias")) || undefined === i
                ? undefined
                : i.text;
            s.push({
              name: e,
              alias: n,
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
  let o =
    null !==
      (r =
        null === (n = null == t ? undefined : t.childForFieldName("name")) ||
        undefined === n
          ? undefined
          : n.text) && undefined !== r
      ? r
      : "";
  switch (null == t ? undefined : t.type) {
    case "ambient_declaration":
      return c(e, t.namedChild(0));
    case "interface_declaration":
    case "enum_declaration":
    case "type_alias_declaration":
      return {
        name: o,
        decl: t.text,
      };
    case "function_declaration":
    case "function_signature":
      return {
        name: o,
        decl: l(e, t),
      };
    case "class_declaration": {
      let n = (function (e, t) {
          let n = t.childForFieldName("body");
          if (n) return n.namedChildren.map((t) => d(e, t)).filter((e) => e);
        })(e, t),
        r = "";
      if (n) {
        let o = t.childForFieldName("body");
        r = `declare ${e.substring(t.startIndex, o.startIndex + 1)}`;
        r += n.map((e) => "\n" + e).join("");
        r += "\n}";
      }
      return {
        name: o,
        decl: r,
      };
    }
  }
  return {
    name: o,
    decl: "",
  };
}
function l(e, t) {
  var n, r, o;
  const i =
    null !==
      (r =
        null === (n = t.childForFieldName("return_type")) || undefined === n
          ? undefined
          : n.endIndex) && undefined !== r
      ? r
      : null === (o = t.childForFieldName("parameters")) || undefined === o
      ? undefined
      : o.endIndex;
  if (undefined !== i) {
    let n = e.substring(t.startIndex, i) + ";";
    return "function_declaration" === t.type || "function_signature" === t.type
      ? "declare " + n
      : n;
  }
  return "";
}
function getDocComment(e, t) {
  const n = o.getFirstPrecedingComment(t);
  return n ? e.substring(n.startIndex, t.startIndex) : "";
}
function d(e, t) {
  var n, r, i, s, a;
  if (
    "accessibility_modifier" ===
      (null === (n = null == t ? undefined : t.firstChild) || undefined === n
        ? undefined
        : n.type) &&
    "private" === t.firstChild.text
  )
    return "";
  const c = o.getFirstPrecedingComment(t),
    p =
      null !==
        (r = (function (e, t) {
          let n = t.startIndex - 1;
          for (; n >= 0 && (" " === e[n] || "\t" === e[n]); ) n--;
          if (n < 0 || "\n" === e[n]) return e.substring(n + 1, t.startIndex);
        })(e, null != c ? c : t)) && undefined !== r
        ? r
        : "  ",
    h = getDocComment(e, t);
  switch (t.type) {
    case "ambient_declaration":
      const n = t.namedChild(0);
      return n ? p + h + d(e, n) : "";
    case "method_definition":
    case "method_signature":
      return p + h + l(e, t);
    case "public_field_definition": {
      let n =
        null !==
          (s =
            null === (i = t.childForFieldName("type")) || undefined === i
              ? undefined
              : i.endIndex) && undefined !== s
          ? s
          : null === (a = t.childForFieldName("name")) || undefined === a
          ? undefined
          : a.endIndex;
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
      for (let e of o.queryExports(t, i.rootNode))
        for (let t of e.captures) {
          let e = t.node;
          if ("export_statement" === e.type) {
            let t = e.childForFieldName("declaration");
            if (null == t ? undefined : t.hasError()) continue;
            let { name: n, decl: o } = c(s, t);
            if (n) {
              o = getDocComment(s, e) + o;
              let t = r.get(n);
              if (t) {
                t = [];
                r.set(n, t);
              }
              t.push(o);
            }
          }
        }
    } catch {
    } finally {
      if (i) {
        i.delete();
      }
    }
  }
  if (a.size > 2e3)
    for (let e of a.keys()) {
      a.delete(e);
      if (r.size <= 1e3) break;
    }
  a.set(e, {
    mtime: i,
    exports: r,
  });
  return r;
}
exports.getDocComment = getDocComment;
const h = /^\s*import\s*(type|)\s*\{[^}]*\}\s*from\s*['"]\./gm;
exports.extractLocalImportContext = async function (e, t) {
  let { source: n, uri: r, languageId: a } = e;
  return t && "typescript" === a
    ? (async function (e, t, n) {
        let r = "typescript",
          a = [];
        const c = (function (e) {
          let t,
            n = -1;
          h.lastIndex = -1;
          do {
            t = h.exec(e);
            if (t) {
              n = h.lastIndex + t.length;
            }
          } while (t);
          if (-1 === n) return -1;
          const r = e.indexOf("\n", n);
          return -1 !== r ? r : e.length;
        })(e);
        if (-1 === c) return a;
        e = e.substring(0, c);
        let l = await o.parseTree(r, e);
        try {
          for (let e of (function (e) {
            let t = [];
            for (let n of e.namedChildren)
              if ("import_statement" === n.type) {
                t.push(n);
              }
            return t;
          })(l.rootNode)) {
            let o = i(t, e);
            if (!o) continue;
            let c = s(e);
            if (0 === c.length) continue;
            let l = await p(o, r, n);
            for (let e of c)
              if (l.has(e.name)) {
                a.push(...l.get(e.name));
              }
          }
        } finally {
          l.delete();
        }
        return a;
      })(n, r, t)
    : [];
};
