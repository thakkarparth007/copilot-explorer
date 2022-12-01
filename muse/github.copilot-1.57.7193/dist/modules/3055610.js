Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getNodeStart =
  exports.isBlockBodyFinished =
  exports.isEmptyBlockStart =
  exports.getBlockParser =
    undefined;
const r = require(3055306);
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
      for (; e; ) {
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
    return this.getNodeMatchAtPosition(e, t, (e) => {
      let t = e.children
        .reverse()
        .find((t) => t.type == this.nodeMatch[e.type]);
      if (t) {
        if ("python" == this.languageId && t.parent) {
          const e = ":" == t.parent.type ? t.parent.parent : t.parent;
          let n = null == e ? undefined : e.nextSibling;
          for (; n && "comment" == n.type; ) {
            const r =
                n.startPosition.row == t.endPosition.row &&
                n.startPosition.column >= t.endPosition.column,
              o =
                n.startPosition.row > e.endPosition.row &&
                n.startPosition.column > e.startPosition.column;
            if (!r && !o) break;
            t = n;
            n = n.nextSibling;
          }
        }
        if (
          !(
            t.endIndex >= t.tree.rootNode.endIndex - 1 &&
            (t.hasError() || t.parent.hasError())
          )
        )
          return n(t);
      }
    });
  }
  async isBlockBodyFinished(e, t, n) {
    const r = (e + t).trimEnd(),
      o = await this.getNextBlockAtPosition(r, n, (e) => e.endIndex);
    if (undefined !== o && o < r.length) {
      const t = o - e.length;
      return t > 0 ? t : undefined;
    }
  }
  getNodeStart(e, t) {
    const n = e.trimEnd();
    return this.getNodeMatchAtPosition(n, t, (e) => e.startIndex);
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
    const n = await this.getNextBlockAtPosition(e, t, (n) => {
      if (n.startIndex < t) {
        t = n.startIndex;
      }
      let r = e.substring(t, n.endIndex).trim();
      return "" == r || r.replace(/\s/g, "") == this.blockEmptyMatch;
    });
    return undefined === n || n;
  }
  async isEmptyBlockStart(e, t) {
    t = s(e, t);
    return (
      this.isBlockStart(
        (function (e, t) {
          const n = e.lastIndexOf("\n", t - 1);
          let r = e.indexOf("\n", t);
          if (r < 0) {
            r = e.length;
          }
          return e.slice(n + 1, r);
        })(e, t)
      ) && this.isBlockBodyEmpty(e, t)
    );
  }
}
function s(e, t) {
  let n = t;
  for (; n > 0 && /\s/.test(e.charAt(n - 1)); ) n--;
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
    if (this.curlyBraceLanguage) {
      if (i.startsWith("{")) {
        i = i.slice(1);
      }
      if (i.endsWith("}")) {
        i = i.slice(0, -1);
      }
      i = i.trim();
    }
    return (
      0 == i.length ||
      !(
        "python" != this.languageId ||
        ("class_definition" !=
          (null === (n = e.parent) || undefined === n ? undefined : n.type) &&
          "function_definition" !=
            (null === (o = e.parent) || undefined === o
              ? undefined
              : o.type)) ||
        1 != e.children.length ||
        !r.queryPythonIsDocstring(e.parent)
      )
    );
  }
  async isEmptyBlockStart(e, t) {
    var n, o, i;
    if (t > e.length) throw new RangeError("Invalid offset");
    for (let n = t; n < e.length && "\n" != e.charAt(n); n++)
      if (/\S/.test(e.charAt(n))) return !1;
    t = s(e, t);
    const a = await r.parseTree(this.languageId, e);
    try {
      const r = a.rootNode.descendantForIndex(t - 1);
      if (null == r) return !1;
      if (this.curlyBraceLanguage && "}" == r.type) return !1;
      if (
        ("javascript" == this.languageId || "typescript" == this.languageId) &&
        r.parent &&
        "object" == r.parent.type &&
        "{" == r.parent.text.trim()
      )
        return !0;
      if ("typescript" == this.languageId) {
        let n = r;
        for (; n.parent; ) {
          if ("function_signature" == n.type || "method_signature" == n.type) {
            const o = r.nextSibling;
            return (
              !!(o && n.hasError() && c(n, o, e)) ||
              (!n.children.find((e) => ";" == e.type) && n.endIndex <= t)
            );
          }
          n = n.parent;
        }
      }
      let s = null,
        l = null,
        u = null,
        d = r;
      for (; null != d; ) {
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
          if (
            null != e &&
            e.hasError() &&
            (e.text.startsWith('"""') || e.text.startsWith("'''"))
          )
            return !0;
        }
        return this.isBlockEmpty(l, t);
      }
      if (null != s) {
        if (
          "module" ==
            (null === (n = s.previousSibling) || undefined === n
              ? undefined
              : n.type) ||
          "internal_module" ==
            (null === (o = s.previousSibling) || undefined === o
              ? undefined
              : o.type)
        )
          return !0;
        const e = [...s.children].reverse(),
          a = e.find((e) => this.startKeywords.includes(e.type));
        let c = e.find((e) => e.type == this.blockNodeType);
        if (a) {
          switch (this.languageId) {
            case "python": {
              if (
                "try" == a.type &&
                "identifier" == r.type &&
                r.text.length > 4
              ) {
                c =
                  null === (i = e.find((e) => e.hasError())) || undefined === i
                    ? undefined
                    : i.children.find((e) => "block" == e.type);
              }
              const t = e.find((e) => ":" == e.type);
              if (t && a.endIndex <= t.startIndex && t.nextSibling) {
                if ("def" == a.type) {
                  const e = t.nextSibling;
                  if ('"' == e.type || "'" == e.type) return !0;
                  if ("ERROR" == e.type && ('"""' == e.text || "'''" == e.text))
                    return !0;
                }
                return !1;
              }
              break;
            }
            case "javascript": {
              const t = e.find((e) => "formal_parameters" == e.type);
              if ("class" == a.type && t) return !0;
              const n = e.find((e) => "{" == e.type);
              if (n && n.startIndex > a.endIndex && null != n.nextSibling)
                return !1;
              if (e.find((e) => "do" == e.type) && "while" == a.type) return !1;
              if ("=>" == a.type && a.nextSibling && "{" != a.nextSibling.type)
                return !1;
              break;
            }
            case "typescript": {
              const t = e.find((e) => "{" == e.type);
              if (t && t.startIndex > a.endIndex && null != t.nextSibling)
                return !1;
              if (e.find((e) => "do" == e.type) && "while" == a.type) return !1;
              if ("=>" == a.type && a.nextSibling && "{" != a.nextSibling.type)
                return !1;
              break;
            }
          }
          return !(c && c.startIndex > a.endIndex) || this.isBlockEmpty(c, t);
        }
      }
      if (null != u) {
        const e = this.nodeMatch[u.type],
          n = u.children
            .slice()
            .reverse()
            .find((t) => t.type == e);
        if (n) return this.isBlockEmpty(n, t);
        if (this.nodeTypesWithBlockOrStmtChild.has(u.type)) {
          const e = this.nodeTypesWithBlockOrStmtChild.get(u.type),
            t = "" == e ? u.children[0] : u.childForFieldName(e);
          if (
            t &&
            t.type != this.blockNodeType &&
            t.type != this.emptyStatementType
          )
            return !1;
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
  python: new l(
    "python",
    {
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
      with_statement: "block",
    },
    new Map(),
    [
      "def",
      "class",
      "if",
      "elif",
      "else",
      "for",
      "while",
      "try",
      "except",
      "finally",
      "with",
    ],
    "block",
    null,
    !1
  ),
  javascript: new l(
    "javascript",
    {
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
      class_declaration: "class_body",
    },
    new Map([
      ["arrow_function", "body"],
      ["do_statement", "body"],
      ["else_clause", ""],
      ["for_in_statement", "body"],
      ["for_statement", "body"],
      ["if_statement", "consequence"],
      ["while_statement", "body"],
      ["with_statement", "body"],
    ]),
    [
      "=>",
      "try",
      "catch",
      "finally",
      "do",
      "for",
      "if",
      "else",
      "while",
      "with",
      "function",
      "function*",
      "class",
    ],
    "statement_block",
    "empty_statement",
    !0
  ),
  typescript: new l(
    "typescript",
    {
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
      class_declaration: "class_body",
    },
    new Map([
      ["arrow_function", "body"],
      ["do_statement", "body"],
      ["else_clause", ""],
      ["for_in_statement", "body"],
      ["for_statement", "body"],
      ["if_statement", "consequence"],
      ["while_statement", "body"],
      ["with_statement", "body"],
    ]),
    [
      "declare",
      "=>",
      "try",
      "catch",
      "finally",
      "do",
      "for",
      "if",
      "else",
      "while",
      "with",
      "function",
      "function*",
      "class",
    ],
    "statement_block",
    "empty_statement",
    !0
  ),
  go: new i(
    "go",
    "{}",
    /\b(func|if|else|for)\b/,
    {
      communication_case: "block",
      default_case: "block",
      expression_case: "block",
      for_statement: "block",
      func_literal: "block",
      function_declaration: "block",
      if_statement: "block",
      labeled_statement: "block",
      method_declaration: "block",
      type_case: "block",
    },
    new Map()
  ),
  ruby: new i(
    "ruby",
    "end",
    /\b(BEGIN|END|case|class|def|do|else|elsif|for|if|module|unless|until|while)\b|->/,
    {
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
      do_block: "end",
    },
    new Map()
  ),
};
function getBlockParser(e) {
  return u[r.languageIdToWasmLanguage(e)];
}
exports.getBlockParser = getBlockParser;
exports.isEmptyBlockStart = async function (e, t, n) {
  return (
    !!r.isSupportedLanguageId(e) && getBlockParser(e).isEmptyBlockStart(t, n)
  );
};
exports.isBlockBodyFinished = async function (e, t, n, o) {
  if (r.isSupportedLanguageId(e))
    return getBlockParser(e).isBlockBodyFinished(t, n, o);
};
exports.getNodeStart = async function (e, t, n) {
  if (r.isSupportedLanguageId(e)) return getBlockParser(e).getNodeStart(t, n);
};