ChatGPT decompiled the following code:

```js
function s(e) {
    var t;
    var n;
    var r;
    var o;
    var i;
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
```

Into the following code:

```js
function getNamedImports(node) {
  let namedImportsNode;
  let importSpecifierNode;
  let nameNode;
  let aliasNode;
  let namedChildren;
  let namedImportList = [];
  if (node.namedChild(0)?.type === "import_clause") {
    const importClauseNode = node.namedChild(0);
    if (importClauseNode.namedChild(0)?.type === "named_imports") {
      const namedImportsNode = importClauseNode.namedChild(0);
      for (const importSpecifierNode of namedImportsNode.namedChildren || []) {
        if (importSpecifierNode.type === "import_specifier") {
          const name = importSpecifierNode.childForFieldName("name")?.text;
          if (name) {
            const alias = importSpecifierNode.childForFieldName("alias")?.text;
            namedImportList.push({
              name: name,
              alias: alias,
            });
          }
        }
      }
    }
  }
  return namedImportList;
}
```

How can you be sure that they're doing the same thing? That's the goal of this project -- to identify if the decompiled code is correct or not automatically. I'd also like to handle automated fixes for simple cases, but that's a stretch goal.