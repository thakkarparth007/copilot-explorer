Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getFunctionPositions =
  exports.getFirstPrecedingComment =
  exports.isFunctionDefinition =
  exports.isFunction =
  exports.getAncestorWithSiblingFunctions =
  exports.queryPythonIsDocstring =
  exports.queryGlobalVars =
  exports.queryExports =
  exports.queryImports =
  exports.queryFunctions =
  exports.getBlockCloseToken =
  exports.parsesWithoutError =
  exports.parseTree =
  exports.getLanguage =
  exports.languageIdToWasmLanguage =
  exports.isSupportedLanguageId =
  exports.WASMLanguage =
    undefined;
const r = require("path"),
  o = require(305587),
  i = require(305587);
var s;
!(function (e) {
  e.Python = "python";
  e.JavaScript = "javascript";
  e.TypeScript = "typescript";
  e.Go = "go";
  e.Ruby = "ruby";
})((s = exports.WASMLanguage || (exports.WASMLanguage = {})));
const a = {
  python: s.Python,
  javascript: s.JavaScript,
  javascriptreact: s.JavaScript,
  jsx: s.JavaScript,
  typescript: s.TypeScript,
  typescriptreact: s.TypeScript,
  go: s.Go,
  ruby: s.Ruby,
};
function languageIdToWasmLanguage(e) {
  if (!(e in a)) throw new Error(`Unrecognized language: ${e}`);
  return a[e];
}
exports.isSupportedLanguageId = function (e) {
  return e in a;
};
exports.languageIdToWasmLanguage = languageIdToWasmLanguage;
const l = {
    python: [
      [
        "(function_definition body: (block\n             (expression_statement (string))? @docstring) @body) @function",
      ],
      ['(ERROR ("def" (identifier) (parameters))) @function'],
    ],
    javascript: [
      [
        "[\n            (function body: (statement_block) @body)\n            (function_declaration body: (statement_block) @body)\n            (generator_function body: (statement_block) @body)\n            (generator_function_declaration body: (statement_block) @body)\n            (method_definition body: (statement_block) @body)\n          ] @function",
      ],
    ],
    typescript: [
      [
        "[\n            (function body: (statement_block) @body)\n            (function_declaration body: (statement_block) @body)\n            (generator_function body: (statement_block) @body)\n            (generator_function_declaration body: (statement_block) @body)\n            (method_definition body: (statement_block) @body)\n          ] @function",
      ],
    ],
    go: [
      [
        "[\n            (function_declaration body: (block) @body)\n            (method_declaration body: (block) @body)\n          ] @function",
      ],
    ],
    ruby: [
      [
        '[\n            (method name: (_) parameters: (method_parameters)? @params [(_)+ "end"] @body)\n            (singleton_method name: (_) parameters: (method_parameters)? @params [(_)+ "end"] @body)\n          ] @function',
      ],
    ],
  },
  u =
    '(variable_declarator value: (call_expression function: ((identifier) @req (#eq? @req "require"))))',
  d = `\n    (lexical_declaration ${u}+)\n    (variable_declaration ${u}+)\n`,
  p = {
    python: [
      ["(module (future_import_statement) @import)"],
      ["(module (import_statement) @import)"],
      ["(module (import_from_statement) @import)"],
    ],
    javascript: [
      [`(program [ ${d} ] @import)`],
      ["(program [ (import_statement) ] @import)"],
    ],
    typescript: [
      [`(program [ ${d} ] @import)`],
      ["(program [ (import_statement) (import_alias) ] @import)"],
    ],
    go: [],
    ruby: [],
  },
  h = {
    python: [],
    javascript: [["(program (export_statement) @export)"]],
    typescript: [["(program (export_statement) @export)"]],
    go: [],
    ruby: [],
  },
  f = {
    python: [
      ["(module (global_statement) @globalVar)"],
      ["(module (expression_statement) @globalVar)"],
    ],
    javascript: [],
    typescript: [],
    go: [],
    ruby: [],
  },
  m = {
    python: new Set(["function_definition"]),
    javascript: new Set([
      "function",
      "function_declaration",
      "generator_function",
      "generator_function_declaration",
      "method_definition",
      "arrow_function",
    ]),
    typescript: new Set([
      "function",
      "function_declaration",
      "generator_function",
      "generator_function_declaration",
      "method_definition",
      "arrow_function",
    ]),
    go: new Set(["function_declaration", "method_declaration"]),
    ruby: new Set(["method", "singleton_method"]),
  },
  g = {
    python: (e) => {
      var t;
      return (
        "module" === e.type ||
        ("block" === e.type &&
          "class_definition" ===
            (null === (t = e.parent) || undefined === t ? undefined : t.type))
      );
    },
    javascript: (e) => "program" === e.type || "class_body" === e.type,
    typescript: (e) => "program" === e.type || "class_body" === e.type,
    go: (e) => "source_file" === e.type,
    ruby: (e) => "program" === e.type || "class" === e.type,
  },
  _ = new Map();
async function getLanguage(e) {
  const t = languageIdToWasmLanguage(e);
  if (!_.has(t)) {
    const e = await (async function (e) {
      await o.init();
      const t = r.resolve(__dirname, "..", "dist", `tree-sitter-${e}.wasm`);
      return i.Language.load(t);
    })(t);
    _.set(t, e);
  }
  return _.get(t);
}
async function parseTree(e, t) {
  let n = await getLanguage(e);
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
function queryFunctions(e, t) {
  return b(l[languageIdToWasmLanguage(e)], t);
}
exports.getLanguage = getLanguage;
exports.parseTree = parseTree;
exports.parsesWithoutError = async function (e, t) {
  const n = await parseTree(e, t),
    r = !n.rootNode.hasError();
  n.delete();
  return r;
};
exports.getBlockCloseToken = function (e) {
  switch (languageIdToWasmLanguage(e)) {
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
exports.queryFunctions = queryFunctions;
exports.queryImports = function (e, t) {
  return b(p[languageIdToWasmLanguage(e)], t);
};
exports.queryExports = function (e, t) {
  return b(h[languageIdToWasmLanguage(e)], t);
};
exports.queryGlobalVars = function (e, t) {
  return b(f[languageIdToWasmLanguage(e)], t);
};
const x = [
  "[\n    (class_definition (block (expression_statement (string))))\n    (function_definition (block (expression_statement (string))))\n]",
];
function isFunction(e, t) {
  return m[languageIdToWasmLanguage(e)].has(t.type);
}
exports.queryPythonIsDocstring = function (e) {
  return 1 == b([x], e).length;
};
exports.getAncestorWithSiblingFunctions = function (e, t) {
  const n = g[languageIdToWasmLanguage(e)];
  for (; t.parent; ) {
    if (n(t.parent)) return t;
    t = t.parent;
  }
  return t.parent ? t : null;
};
exports.isFunction = isFunction;
exports.isFunctionDefinition = function (e, t) {
  switch (languageIdToWasmLanguage(e)) {
    case s.Python:
    case s.Go:
    case s.Ruby:
      return isFunction(e, t);
    case s.JavaScript:
    case s.TypeScript:
      if (
        "function_declaration" === t.type ||
        "generator_function_declaration" === t.type ||
        "method_definition" === t.type
      )
        return !0;
      if (
        "lexical_declaration" === t.type ||
        "variable_declaration" === t.type
      ) {
        if (t.namedChildCount > 1) return !1;
        let n = t.namedChild(0);
        if (null == n) return !1;
        let r = n.namedChild(1);
        return null !== r && isFunction(e, r);
      }
      if ("expression_statement" === t.type) {
        let n = t.namedChild(0);
        if ("assignment_expression" === (null == n ? undefined : n.type)) {
          let t = n.namedChild(1);
          return null !== t && isFunction(e, t);
        }
      }
      return !1;
  }
};
exports.getFirstPrecedingComment = function (e) {
  var t;
  let n = e;
  for (
    ;
    "comment" ===
    (null === (t = n.previousSibling) || undefined === t ? undefined : t.type);

  ) {
    let e = n.previousSibling;
    if (e.endPosition.row < n.startPosition.row - 1) break;
    n = e;
  }
  return "comment" === (null == n ? undefined : n.type) ? n : null;
};
exports.getFunctionPositions = async function (e, t) {
  return queryFunctions(e, (await parseTree(e, t)).rootNode).map((e) => {
    const t = e.captures.find((e) => "function" === e.name).node;
    return {
      startIndex: t.startIndex,
      endIndex: t.endIndex,
    };
  });
};