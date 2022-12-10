Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.checkStrictMode =
  exports.getErrorPath =
  exports.Type =
  exports.useFunc =
  exports.setEvaluated =
  exports.evaluatedPropsToName =
  exports.mergeEvaluated =
  exports.eachItem =
  exports.unescapeJsonPointer =
  exports.escapeJsonPointer =
  exports.escapeFragment =
  exports.unescapeFragment =
  exports.schemaRefOrVal =
  exports.schemaHasRulesButRef =
  exports.schemaHasRules =
  exports.checkUnknownRules =
  exports.alwaysValidSchema =
  exports.toHash =
    undefined;
const M_codegen_NOTSURE = require("codegen"),
  M_codegen_NOTSURE = require("codegen");
function checkUnknownRules(e, t = e.schema) {
  const { opts: n, self: r } = e;
  if (!n.strictSchema) return;
  if ("boolean" == typeof t) return;
  const o = r.RULES.keywords;
  for (const n in t)
    if (o[n]) {
      checkStrictMode(e, `unknown keyword: "${n}"`);
    }
}
function schemaHasRules(e, t) {
  if ("boolean" == typeof e) return !e;
  for (const n in e) if (t[n]) return !0;
  return !1;
}
function escapeJsonPointer(e) {
  return "number" == typeof e
    ? `${e}`
    : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
function unescapeJsonPointer(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
function l({ mergeNames: e, mergeToName: t, mergeValues: n, resultToName: o }) {
  return (i, s, a, c) => {
    const l =
      undefined === a
        ? s
        : a instanceof M_codegen_NOTSURE.Name
        ? (s instanceof M_codegen_NOTSURE.Name ? e(i, s, a) : t(i, s, a), a)
        : s instanceof M_codegen_NOTSURE.Name
        ? (t(i, a, s), s)
        : n(s, a);
    return c !== M_codegen_NOTSURE.Name || l instanceof M_codegen_NOTSURE.Name
      ? l
      : o(i, l);
  };
}
function evaluatedPropsToName(e, t) {
  if (!0 === t) return e.var("props", !0);
  const n = e.var("props", M_codegen_NOTSURE._`{}`);
  if (undefined !== t) {
    setEvaluated(e, n, t);
  }
  return n;
}
function setEvaluated(e, t, n) {
  Object.keys(n).forEach((n) =>
    e.assign(M_codegen_NOTSURE._`${t}${M_codegen_NOTSURE.getProperty(n)}`, !0)
  );
}
exports.toHash = function (e) {
  const t = {};
  for (const n of e) t[n] = !0;
  return t;
};
exports.alwaysValidSchema = function (e, t) {
  return "boolean" == typeof t
    ? t
    : 0 === Object.keys(t).length ||
        (checkUnknownRules(e, t), !schemaHasRules(t, e.self.RULES.all));
};
exports.checkUnknownRules = checkUnknownRules;
exports.schemaHasRules = schemaHasRules;
exports.schemaHasRulesButRef = function (e, t) {
  if ("boolean" == typeof e) return !e;
  for (const n in e) if ("$ref" !== n && t.all[n]) return !0;
  return !1;
};
exports.schemaRefOrVal = function (
  { topSchemaRef: e, schemaPath: t },
  n,
  o,
  i
) {
  if (!i) {
    if ("number" == typeof n || "boolean" == typeof n) return n;
    if ("string" == typeof n) return M_codegen_NOTSURE._`${n}`;
  }
  return M_codegen_NOTSURE._`${e}${t}${M_codegen_NOTSURE.getProperty(o)}`;
};
exports.unescapeFragment = function (e) {
  return unescapeJsonPointer(decodeURIComponent(e));
};
exports.escapeFragment = function (e) {
  return encodeURIComponent(escapeJsonPointer(e));
};
exports.escapeJsonPointer = escapeJsonPointer;
exports.unescapeJsonPointer = unescapeJsonPointer;
exports.eachItem = function (e, t) {
  if (Array.isArray(e)) for (const n of e) t(n);
  else t(e);
};
exports.mergeEvaluated = {
  props: l({
    mergeNames: (e, t, n) =>
      e.if(M_codegen_NOTSURE._`${n} !== true && ${t} !== undefined`, () => {
        e.if(
          M_codegen_NOTSURE._`${t} === true`,
          () => e.assign(n, !0),
          () =>
            e
              .assign(n, M_codegen_NOTSURE._`${n} || {}`)
              .code(M_codegen_NOTSURE._`Object.assign(${n}, ${t})`)
        );
      }),
    mergeToName: (e, t, n) =>
      e.if(M_codegen_NOTSURE._`${n} !== true`, () => {
        if (!0 === t) {
          e.assign(n, !0);
        } else {
          e.assign(n, M_codegen_NOTSURE._`${n} || {}`);
          setEvaluated(e, n, t);
        }
      }),
    mergeValues: (e, t) =>
      !0 === e || {
        ...e,
        ...t,
      },
    resultToName: evaluatedPropsToName,
  }),
  items: l({
    mergeNames: (e, t, n) =>
      e.if(M_codegen_NOTSURE._`${n} !== true && ${t} !== undefined`, () =>
        e.assign(
          n,
          M_codegen_NOTSURE._`${t} === true ? true : ${n} > ${t} ? ${n} : ${t}`
        )
      ),
    mergeToName: (e, t, n) =>
      e.if(M_codegen_NOTSURE._`${n} !== true`, () =>
        e.assign(n, !0 === t || M_codegen_NOTSURE._`${n} > ${t} ? ${n} : ${t}`)
      ),
    mergeValues: (e, t) => !0 === e || Math.max(e, t),
    resultToName: (e, t) => e.var("items", t),
  }),
};
exports.evaluatedPropsToName = evaluatedPropsToName;
exports.setEvaluated = setEvaluated;
const p = {};
var h;
function checkStrictMode(e, t, n = e.opts.strictSchema) {
  if (n) {
    t = `strict mode: ${t}`;
    if (!0 === n) throw new Error(t);
    e.self.logger.warn(t);
  }
}
exports.useFunc = function (e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: p[t.code] || (p[t.code] = new M_codegen_NOTSURE._Code(t.code)),
  });
};
(function (e) {
  e[(e.Num = 0)] = "Num";
  e[(e.Str = 1)] = "Str";
})((h = exports.Type || (exports.Type = {})));
exports.getErrorPath = function (e, t, n) {
  if (e instanceof M_codegen_NOTSURE.Name) {
    const o = t === h.Num;
    return n
      ? o
        ? M_codegen_NOTSURE._`"[" + ${e} + "]"`
        : M_codegen_NOTSURE._`"['" + ${e} + "']"`
      : o
      ? M_codegen_NOTSURE._`"/" + ${e}`
      : M_codegen_NOTSURE._`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return n
    ? M_codegen_NOTSURE.getProperty(e).toString()
    : "/" + escapeJsonPointer(e);
};
exports.checkStrictMode = checkStrictMode;
