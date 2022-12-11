Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getData = exports.KeywordCxt = exports.validateFunctionCode = undefined;
const M_bool_or_empty_schema_maybe = require("bool-or-empty-schema");
const M_data_type_checker_maybe = require("data-type-checker");
const M_schema_rule_filter_maybe = require("schema-rule-filter");
const M_data_type_checker_maybe = require("data-type-checker");
const M_assign_defaults_maybe = require("assign-defaults");
const M_keyword_macro_maybe = require("keyword-macro");
const M_extend_subschema_maybe = require("extend-subschema");
const M_codegen_maybe = require("codegen");
const M_json_schema_default_names_maybe = require("json-schema-default-names");
const M_schema_ref_utils_maybe = require("schema-ref-utils");
const M_ajv_utils_maybe = require("ajv-utils");
const M_ajv_error_stuff_maybe = require("ajv-error-stuff");
function m({ gen: e, validateName: t, schema: n, schemaEnv: r, opts: o }, i) {
  if (o.code.es5) {
    e.func(
      t,
      M_codegen_maybe._`${M_json_schema_default_names_maybe.default.data}, ${M_json_schema_default_names_maybe.default.valCxt}`,
      r.$async,
      () => {
        e.code(M_codegen_maybe._`"use strict"; ${g(n, o)}`);
        (function (e, t) {
          e.if(
            M_json_schema_default_names_maybe.default.valCxt,
            () => {
              e.var(
                M_json_schema_default_names_maybe.default.instancePath,
                M_codegen_maybe._`${M_json_schema_default_names_maybe.default.valCxt}.${M_json_schema_default_names_maybe.default.instancePath}`
              );
              e.var(
                M_json_schema_default_names_maybe.default.parentData,
                M_codegen_maybe._`${M_json_schema_default_names_maybe.default.valCxt}.${M_json_schema_default_names_maybe.default.parentData}`
              );
              e.var(
                M_json_schema_default_names_maybe.default.parentDataProperty,
                M_codegen_maybe._`${M_json_schema_default_names_maybe.default.valCxt}.${M_json_schema_default_names_maybe.default.parentDataProperty}`
              );
              e.var(
                M_json_schema_default_names_maybe.default.rootData,
                M_codegen_maybe._`${M_json_schema_default_names_maybe.default.valCxt}.${M_json_schema_default_names_maybe.default.rootData}`
              );
              if (t.dynamicRef) {
                e.var(
                  M_json_schema_default_names_maybe.default.dynamicAnchors,
                  M_codegen_maybe._`${M_json_schema_default_names_maybe.default.valCxt}.${M_json_schema_default_names_maybe.default.dynamicAnchors}`
                );
              }
            },
            () => {
              e.var(
                M_json_schema_default_names_maybe.default.instancePath,
                M_codegen_maybe._`""`
              );
              e.var(
                M_json_schema_default_names_maybe.default.parentData,
                M_codegen_maybe._`undefined`
              );
              e.var(
                M_json_schema_default_names_maybe.default.parentDataProperty,
                M_codegen_maybe._`undefined`
              );
              e.var(
                M_json_schema_default_names_maybe.default.rootData,
                M_json_schema_default_names_maybe.default.data
              );
              if (t.dynamicRef) {
                e.var(
                  M_json_schema_default_names_maybe.default.dynamicAnchors,
                  M_codegen_maybe._`{}`
                );
              }
            }
          );
        })(e, o);
        e.code(i);
      }
    );
  } else {
    e.func(
      t,
      M_codegen_maybe._`${
        M_json_schema_default_names_maybe.default.data
      }, ${(function (e) {
        return M_codegen_maybe._`{${
          M_json_schema_default_names_maybe.default.instancePath
        }="", ${M_json_schema_default_names_maybe.default.parentData}, ${
          M_json_schema_default_names_maybe.default.parentDataProperty
        }, ${M_json_schema_default_names_maybe.default.rootData}=${
          M_json_schema_default_names_maybe.default.data
        }${
          e.dynamicRef
            ? M_codegen_maybe._`, ${M_json_schema_default_names_maybe.default.dynamicAnchors}={}`
            : M_codegen_maybe.nil
        }}={}`;
      })(o)}`,
      r.$async,
      () => e.code(g(n, o)).code(i)
    );
  }
}
function g(e, t) {
  const n = "object" == typeof e && e[t.schemaId];
  return n && (t.code.source || t.code.process)
    ? M_codegen_maybe._`/*# sourceURL=${n} */`
    : M_codegen_maybe.nil;
}
function _({ schema: e, self: t }) {
  if ("boolean" == typeof e) return !e;
  for (const n in e) if (t.RULES.all[n]) return !0;
  return !1;
}
function y(e) {
  return "boolean" != typeof e.schema;
}
function v(e) {
  M_ajv_utils_maybe.checkUnknownRules(e);
  (function (e) {
    const { schema: t, errSchemaPath: n, opts: r, self: o } = e;
    if (
      t.$ref &&
      r.ignoreKeywordsWithRef &&
      M_ajv_utils_maybe.schemaHasRulesButRef(t, o.RULES)
    ) {
      o.logger.warn(`$ref: keywords ignored in schema at path "${n}"`);
    }
  })(e);
}
function b(e, t) {
  if (e.opts.jtd) return x(e, [], !1, t);
  const n = M_data_type_checker_maybe.getSchemaTypes(e.schema);
  x(e, n, !M_data_type_checker_maybe.coerceAndCheckDataType(e, n), t);
}
function w({ gen: e, schemaEnv: t, schema: n, errSchemaPath: r, opts: o }) {
  const i = n.$comment;
  if (!0 === o.$comment)
    e.code(
      M_codegen_maybe._`${M_json_schema_default_names_maybe.default.self}.logger.log(${i})`
    );
  else if ("function" == typeof o.$comment) {
    const n = M_codegen_maybe.str`${r}/$comment`;
    const o = e.scopeValue("root", {
      ref: t.root,
    });
    e.code(
      M_codegen_maybe._`${M_json_schema_default_names_maybe.default.self}.opts.$comment(${i}, ${n}, ${o}.schema)`
    );
  }
}
function x(e, t, n, r) {
  const { gen: o, schema: a, data: c, allErrors: l, opts: p, self: f } = e;
  const { RULES: m } = f;
  function g(h) {
    if (M_schema_rule_filter_maybe.shouldUseGroup(a, h)) {
      if (h.type) {
        o.if(
          M_data_type_checker_maybe.checkDataType(h.type, c, p.strictNumbers)
        );
        E(e, h);
        if (1 === t.length && t[0] === h.type && n) {
          o.else();
          M_data_type_checker_maybe.reportTypeError(e);
        }
        o.endIf();
      } else {
        E(e, h);
      }
      if (l) {
        o.if(
          M_codegen_maybe._`${
            M_json_schema_default_names_maybe.default.errors
          } === ${r || 0}`
        );
      }
    }
  }
  if (
    !a.$ref ||
    (!p.ignoreKeywordsWithRef && M_ajv_utils_maybe.schemaHasRulesButRef(a, m))
  ) {
    if (p.jtd) {
      (function (e, t) {
        if (!e.schemaEnv.meta && e.opts.strictTypes) {
          (function (e, t) {
            if (t.length) {
              if (e.dataTypes.length) {
                t.forEach((t) => {
                  if (C(e.dataTypes, t)) {
                    S(
                      e,
                      `type "${t}" not allowed by context "${e.dataTypes.join(
                        ","
                      )}"`
                    );
                  }
                });
                e.dataTypes = e.dataTypes.filter((e) => C(t, e));
              } else {
                e.dataTypes = t;
              }
            }
          })(e, t);
          if (e.opts.allowUnionTypes) {
            (function (e, t) {
              if (t.length > 1 && (2 !== t.length || !t.includes("null"))) {
                S(e, "use allowUnionTypes to allow union type keyword");
              }
            })(e, t);
          }
          (function (e, t) {
            const n = e.self.RULES.all;
            for (const r in n) {
              const o = n[r];
              if (
                "object" == typeof o &&
                M_schema_rule_filter_maybe.shouldUseRule(e.schema, o)
              ) {
                const { type: n } = o.definition;
                if (
                  n.length &&
                  !n.some((e) => {
                    r = e;
                    return (
                      (n = t).includes(r) ||
                      ("number" === r && n.includes("integer"))
                    );
                    var n;
                    var r;
                  })
                ) {
                  S(e, `missing type "${n.join(",")}" for keyword "${r}"`);
                }
              }
            }
          })(e, e.dataTypes);
        }
      })(e, t);
    }
    o.block(() => {
      for (const e of m.rules) g(e);
      g(m.post);
    });
  } else {
    o.block(() => k(e, "$ref", m.all.$ref.definition));
  }
}
function E(e, t) {
  const {
    gen: n,
    schema: r,
    opts: { useDefaults: o },
  } = e;
  if (o) {
    M_assign_defaults_maybe.assignDefaults(e, t.type);
  }
  n.block(() => {
    for (const n of t.rules)
      if (M_schema_rule_filter_maybe.shouldUseRule(r, n)) {
        k(e, n.keyword, n.definition, t.type);
      }
  });
}
function C(e, t) {
  return e.includes(t) || ("integer" === t && e.includes("number"));
}
function S(e, t) {
  t += ` at "${e.schemaEnv.baseId + e.errSchemaPath}" (strictTypes)`;
  M_ajv_utils_maybe.checkStrictMode(e, t, e.opts.strictTypes);
}
exports.validateFunctionCode = function (e) {
  if (y(e) && (v(e), _(e))) {
    (function (e) {
      const { schema: t, opts: n, gen: r } = e;
      m(e, () => {
        if (n.$comment && t.$comment) {
          w(e);
        }
        (function (e) {
          const { schema: t, opts: n } = e;
          if (undefined !== t.default && n.useDefaults && n.strictSchema) {
            M_ajv_utils_maybe.checkStrictMode(
              e,
              "default is ignored in the schema root"
            );
          }
        })(e);
        r.let(M_json_schema_default_names_maybe.default.vErrors, null);
        r.let(M_json_schema_default_names_maybe.default.errors, 0);
        if (n.unevaluated) {
          (function (e) {
            const { gen: t, validateName: n } = e;
            e.evaluated = t.const(
              "evaluated",
              M_codegen_maybe._`${n}.evaluated`
            );
            t.if(M_codegen_maybe._`${e.evaluated}.dynamicProps`, () =>
              t.assign(
                M_codegen_maybe._`${e.evaluated}.props`,
                M_codegen_maybe._`undefined`
              )
            );
            t.if(M_codegen_maybe._`${e.evaluated}.dynamicItems`, () =>
              t.assign(
                M_codegen_maybe._`${e.evaluated}.items`,
                M_codegen_maybe._`undefined`
              )
            );
          })(e);
        }
        b(e);
        (function (e) {
          const {
            gen: t,
            schemaEnv: n,
            validateName: r,
            ValidationError: o,
            opts: i,
          } = e;
          if (n.$async) {
            t.if(
              M_codegen_maybe._`${M_json_schema_default_names_maybe.default.errors} === 0`,
              () => t.return(M_json_schema_default_names_maybe.default.data),
              () =>
                t.throw(
                  M_codegen_maybe._`new ${o}(${M_json_schema_default_names_maybe.default.vErrors})`
                )
            );
          } else {
            t.assign(
              M_codegen_maybe._`${r}.errors`,
              M_json_schema_default_names_maybe.default.vErrors
            );
            if (i.unevaluated) {
              (function ({ gen: e, evaluated: t, props: n, items: r }) {
                if (n instanceof M_codegen_maybe.Name) {
                  e.assign(M_codegen_maybe._`${t}.props`, n);
                }
                if (r instanceof M_codegen_maybe.Name) {
                  e.assign(M_codegen_maybe._`${t}.items`, r);
                }
              })(e);
            }
            t.return(
              M_codegen_maybe._`${M_json_schema_default_names_maybe.default.errors} === 0`
            );
          }
        })(e);
      });
    })(e);
  } else {
    m(e, () => M_bool_or_empty_schema_maybe.topBoolOrEmptySchema(e));
  }
};
class KeywordCxt {
  constructor(e, t, n) {
    M_keyword_macro_maybe.validateKeywordUsage(e, t, n);
    this.gen = e.gen;
    this.allErrors = e.allErrors;
    this.keyword = n;
    this.data = e.data;
    this.schema = e.schema[n];
    this.$data = t.$data && e.opts.$data && this.schema && this.schema.$data;
    this.schemaValue = M_ajv_utils_maybe.schemaRefOrVal(
      e,
      this.schema,
      n,
      this.$data
    );
    this.schemaType = t.schemaType;
    this.parentSchema = e.schema;
    this.params = {};
    this.it = e;
    this.def = t;
    if (this.$data)
      this.schemaCode = e.gen.const("vSchema", getData(this.$data, e));
    else if (
      ((this.schemaCode = this.schemaValue),
      !(0, M_keyword_macro_maybe.validSchemaType)(
        this.schema,
        t.schemaType,
        t.allowUndefined
      ))
    )
      throw new Error(`${n} value must be ${JSON.stringify(t.schemaType)}`);
    if ("code" in t ? t.trackErrors : !1 !== t.errors) {
      this.errsCount = e.gen.const(
        "_errs",
        M_json_schema_default_names_maybe.default.errors
      );
    }
  }
  result(e, t, n) {
    this.failResult(M_codegen_maybe.not(e), t, n);
  }
  failResult(e, t, n) {
    this.gen.if(e);
    if (n) {
      n();
    } else {
      this.error();
    }
    if (t) {
      this.gen.else();
      t();
      if (this.allErrors) {
        this.gen.endIf();
      }
    } else {
      if (this.allErrors) {
        this.gen.endIf();
      } else {
        this.gen.else();
      }
    }
  }
  pass(e, t) {
    this.failResult(M_codegen_maybe.not(e), undefined, t);
  }
  fail(e) {
    if (undefined === e) {
      this.error();
      return void (this.allErrors || this.gen.if(!1));
    }
    this.gen.if(e);
    this.error();
    if (this.allErrors) {
      this.gen.endIf();
    } else {
      this.gen.else();
    }
  }
  fail$data(e) {
    if (!this.$data) return this.fail(e);
    const { schemaCode: t } = this;
    this.fail(
      M_codegen_maybe._`${t} !== undefined && (${M_codegen_maybe.or(
        this.invalid$data(),
        e
      )})`
    );
  }
  error(e, t, n) {
    if (t) {
      this.setParams(t);
      this._error(e, n);
      return void this.setParams({});
    }
    this._error(e, n);
  }
  _error(e, t) {
    (e
      ? M_ajv_error_stuff_maybe.reportExtraError
      : M_ajv_error_stuff_maybe.reportError)(this, this.def.error, t);
  }
  $dataError() {
    M_ajv_error_stuff_maybe.reportError(
      this,
      this.def.$dataError || M_ajv_error_stuff_maybe.keyword$DataError
    );
  }
  reset() {
    if (undefined === this.errsCount)
      throw new Error('add "trackErrors" to keyword definition');
    M_ajv_error_stuff_maybe.resetErrorsCount(this.gen, this.errsCount);
  }
  ok(e) {
    if (this.allErrors) {
      this.gen.if(e);
    }
  }
  setParams(e, t) {
    if (t) {
      Object.assign(this.params, e);
    } else {
      this.params = e;
    }
  }
  block$data(e, t, n = M_codegen_maybe.nil) {
    this.gen.block(() => {
      this.check$data(e, n);
      t();
    });
  }
  check$data(e = M_codegen_maybe.nil, t = M_codegen_maybe.nil) {
    if (!this.$data) return;
    const { gen: n, schemaCode: r, schemaType: o, def: i } = this;
    n.if(M_codegen_maybe.or(M_codegen_maybe._`${r} === undefined`, t));
    if (e !== M_codegen_maybe.nil) {
      n.assign(e, !0);
    }
    if (o.length || i.validateSchema) {
      n.elseIf(this.invalid$data());
      this.$dataError();
      if (e !== M_codegen_maybe.nil) {
        n.assign(e, !1);
      }
    }
    n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: t, schemaType: n, def: r, it: o } = this;
    return M_codegen_maybe.or(
      (function () {
        if (n.length) {
          if (!(t instanceof M_codegen_maybe.Name))
            throw new Error("ajv implementation error");
          const e = Array.isArray(n) ? n : [n];
          return M_codegen_maybe._`${M_data_type_checker_maybe.checkDataTypes(
            e,
            t,
            o.opts.strictNumbers,
            M_data_type_checker_maybe.DataType.Wrong
          )}`;
        }
        return M_codegen_maybe.nil;
      })(),
      (function () {
        if (r.validateSchema) {
          const n = e.scopeValue("validate$data", {
            ref: r.validateSchema,
          });
          return M_codegen_maybe._`!${n}(${t})`;
        }
        return M_codegen_maybe.nil;
      })()
    );
  }
  subschema(e, t) {
    const n = M_extend_subschema_maybe.getSubschema(this.it, e);
    M_extend_subschema_maybe.extendSubschemaData(n, this.it, e);
    M_extend_subschema_maybe.extendSubschemaMode(n, e);
    const o = {
      ...this.it,
      ...n,
      items: undefined,
      props: undefined,
    };
    (function (e, t) {
      if (y(e) && (v(e), _(e))) {
        (function (e, t) {
          const { schema: n, gen: r, opts: o } = e;
          if (o.$comment && n.$comment) {
            w(e);
          }
          (function (e) {
            const t = e.schema[e.opts.schemaId];
            if (t) {
              e.baseId = M_schema_ref_utils_maybe.resolveUrl(e.baseId, t);
            }
          })(e);
          (function (e) {
            if (e.schema.$async && !e.schemaEnv.$async)
              throw new Error("async schema in sync schema");
          })(e);
          const i = r.const(
            "_errs",
            M_json_schema_default_names_maybe.default.errors
          );
          b(e, i);
          r.var(
            t,
            M_codegen_maybe._`${i} === ${M_json_schema_default_names_maybe.default.errors}`
          );
        })(e, t);
      } else {
        M_bool_or_empty_schema_maybe.boolOrEmptySchema(e, t);
      }
    })(o, t);
    return o;
  }
  mergeEvaluated(e, t) {
    const { it: n, gen: r } = this;
    if (n.opts.unevaluated) {
      if (!0 !== n.props && undefined !== e.props) {
        n.props = M_ajv_utils_maybe.mergeEvaluated.props(
          r,
          e.props,
          n.props,
          t
        );
      }
      if (!0 !== n.items && undefined !== e.items) {
        n.items = M_ajv_utils_maybe.mergeEvaluated.items(
          r,
          e.items,
          n.items,
          t
        );
      }
    }
  }
  mergeValidEvaluated(e, t) {
    const { it: n, gen: r } = this;
    if (n.opts.unevaluated && (!0 !== n.props || !0 !== n.items)) {
      r.if(t, () => this.mergeEvaluated(e, M_codegen_maybe.Name));
      return !0;
    }
  }
}
function k(e, t, n, r) {
  const o = new KeywordCxt(e, n, t);
  if ("code" in n) {
    n.code(o, r);
  } else {
    if (o.$data && n.validate) {
      M_keyword_macro_maybe.funcKeywordCode(o, n);
    } else {
      if ("macro" in n) {
        M_keyword_macro_maybe.macroKeywordCode(o, n);
      } else {
        if (n.compile || n.validate) {
          M_keyword_macro_maybe.funcKeywordCode(o, n);
        }
      }
    }
  }
}
exports.KeywordCxt = KeywordCxt;
const I = /^\/(?:[^~]|~0|~1)*$/;
const P = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function getData(e, { dataLevel: t, dataNames: n, dataPathArr: r }) {
  let o;
  let i;
  if ("" === e) return M_json_schema_default_names_maybe.default.rootData;
  if ("/" === e[0]) {
    if (!I.test(e)) throw new Error(`Invalid JSON-pointer: ${e}`);
    o = e;
    i = M_json_schema_default_names_maybe.default.rootData;
  } else {
    const s = P.exec(e);
    if (!s) throw new Error(`Invalid JSON-pointer: ${e}`);
    const a = +s[1];
    o = s[2];
    if ("#" === o) {
      if (a >= t) throw new Error(c("property/index", a));
      return r[t - a];
    }
    if (a > t) throw new Error(c("data", a));
    i = n[t - a];
    if (!o) return i;
  }
  let s = i;
  const a = o.split("/");
  for (const e of a)
    if (e) {
      i = M_codegen_maybe._`${i}${M_codegen_maybe.getProperty(
        M_ajv_utils_maybe.unescapeJsonPointer(e)
      )}`;
      s = M_codegen_maybe._`${s} && ${i}`;
    }
  return s;
  function c(e, n) {
    return `Cannot access ${e} ${n} levels up, current level is ${t}`;
  }
}
exports.getData = getData;
