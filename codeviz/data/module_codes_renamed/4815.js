Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getData = exports.KeywordCxt = exports.validateFunctionCode = undefined;
const M_bool_or_empty_schema_NOTSURE = require("bool-or-empty-schema"),
  M_data_type_checker_NOTSURE = require("data-type-checker"),
  M_schema_rule_filter_NOTSURE = require("schema-rule-filter"),
  M_data_type_checker_NOTSURE = require("data-type-checker"),
  M_assign_defaults_NOTSURE = require("assign-defaults"),
  M_keyword_macro_NOTSURE = require("keyword-macro"),
  M_extend_subschema_NOTSURE = require("extend-subschema"),
  M_codegen_NOTSURE = require("codegen"),
  M_json_schema_default_names_NOTSURE = require("json-schema-default-names"),
  M_schema_ref_utils_NOTSURE = require("schema-ref-utils"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  M_ajv_error_stuff_NOTSURE = require("ajv-error-stuff");
function m({ gen: e, validateName: t, schema: n, schemaEnv: r, opts: o }, i) {
  if (o.code.es5) {
    e.func(
      t,
      M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.data}, ${M_json_schema_default_names_NOTSURE.default.valCxt}`,
      r.$async,
      () => {
        e.code(M_codegen_NOTSURE._`"use strict"; ${g(n, o)}`);
        (function (e, t) {
          e.if(
            M_json_schema_default_names_NOTSURE.default.valCxt,
            () => {
              e.var(
                M_json_schema_default_names_NOTSURE.default.instancePath,
                M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.valCxt}.${M_json_schema_default_names_NOTSURE.default.instancePath}`
              );
              e.var(
                M_json_schema_default_names_NOTSURE.default.parentData,
                M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.valCxt}.${M_json_schema_default_names_NOTSURE.default.parentData}`
              );
              e.var(
                M_json_schema_default_names_NOTSURE.default.parentDataProperty,
                M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.valCxt}.${M_json_schema_default_names_NOTSURE.default.parentDataProperty}`
              );
              e.var(
                M_json_schema_default_names_NOTSURE.default.rootData,
                M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.valCxt}.${M_json_schema_default_names_NOTSURE.default.rootData}`
              );
              if (t.dynamicRef) {
                e.var(
                  M_json_schema_default_names_NOTSURE.default.dynamicAnchors,
                  M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.valCxt}.${M_json_schema_default_names_NOTSURE.default.dynamicAnchors}`
                );
              }
            },
            () => {
              e.var(
                M_json_schema_default_names_NOTSURE.default.instancePath,
                M_codegen_NOTSURE._`""`
              );
              e.var(
                M_json_schema_default_names_NOTSURE.default.parentData,
                M_codegen_NOTSURE._`undefined`
              );
              e.var(
                M_json_schema_default_names_NOTSURE.default.parentDataProperty,
                M_codegen_NOTSURE._`undefined`
              );
              e.var(
                M_json_schema_default_names_NOTSURE.default.rootData,
                M_json_schema_default_names_NOTSURE.default.data
              );
              if (t.dynamicRef) {
                e.var(
                  M_json_schema_default_names_NOTSURE.default.dynamicAnchors,
                  M_codegen_NOTSURE._`{}`
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
      M_codegen_NOTSURE._`${
        M_json_schema_default_names_NOTSURE.default.data
      }, ${(function (e) {
        return M_codegen_NOTSURE._`{${
          M_json_schema_default_names_NOTSURE.default.instancePath
        }="", ${M_json_schema_default_names_NOTSURE.default.parentData}, ${
          M_json_schema_default_names_NOTSURE.default.parentDataProperty
        }, ${M_json_schema_default_names_NOTSURE.default.rootData}=${
          M_json_schema_default_names_NOTSURE.default.data
        }${
          e.dynamicRef
            ? M_codegen_NOTSURE._`, ${M_json_schema_default_names_NOTSURE.default.dynamicAnchors}={}`
            : M_codegen_NOTSURE.nil
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
    ? M_codegen_NOTSURE._`/*# sourceURL=${n} */`
    : M_codegen_NOTSURE.nil;
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
  M_ajv_utils_NOTSURE.checkUnknownRules(e);
  (function (e) {
    const { schema: t, errSchemaPath: n, opts: r, self: o } = e;
    if (
      t.$ref &&
      r.ignoreKeywordsWithRef &&
      M_ajv_utils_NOTSURE.schemaHasRulesButRef(t, o.RULES)
    ) {
      o.logger.warn(`$ref: keywords ignored in schema at path "${n}"`);
    }
  })(e);
}
function b(e, t) {
  if (e.opts.jtd) return x(e, [], !1, t);
  const n = M_data_type_checker_NOTSURE.getSchemaTypes(e.schema);
  x(e, n, !M_data_type_checker_NOTSURE.coerceAndCheckDataType(e, n), t);
}
function w({ gen: e, schemaEnv: t, schema: n, errSchemaPath: r, opts: o }) {
  const i = n.$comment;
  if (!0 === o.$comment)
    e.code(
      M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.self}.logger.log(${i})`
    );
  else if ("function" == typeof o.$comment) {
    const n = M_codegen_NOTSURE.str`${r}/$comment`,
      o = e.scopeValue("root", {
        ref: t.root,
      });
    e.code(
      M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.self}.opts.$comment(${i}, ${n}, ${o}.schema)`
    );
  }
}
function x(e, t, n, r) {
  const { gen: o, schema: a, data: c, allErrors: l, opts: p, self: f } = e,
    { RULES: m } = f;
  function g(h) {
    if (M_schema_rule_filter_NOTSURE.shouldUseGroup(a, h)) {
      if (h.type) {
        o.if(
          M_data_type_checker_NOTSURE.checkDataType(h.type, c, p.strictNumbers)
        );
        E(e, h);
        if (1 === t.length && t[0] === h.type && n) {
          o.else();
          M_data_type_checker_NOTSURE.reportTypeError(e);
        }
        o.endIf();
      } else {
        E(e, h);
      }
      if (l) {
        o.if(
          M_codegen_NOTSURE._`${
            M_json_schema_default_names_NOTSURE.default.errors
          } === ${r || 0}`
        );
      }
    }
  }
  if (
    !a.$ref ||
    (!p.ignoreKeywordsWithRef && M_ajv_utils_NOTSURE.schemaHasRulesButRef(a, m))
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
                M_schema_rule_filter_NOTSURE.shouldUseRule(e.schema, o)
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
                    var n, r;
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
    M_assign_defaults_NOTSURE.assignDefaults(e, t.type);
  }
  n.block(() => {
    for (const n of t.rules)
      if (M_schema_rule_filter_NOTSURE.shouldUseRule(r, n)) {
        k(e, n.keyword, n.definition, t.type);
      }
  });
}
function C(e, t) {
  return e.includes(t) || ("integer" === t && e.includes("number"));
}
function S(e, t) {
  t += ` at "${e.schemaEnv.baseId + e.errSchemaPath}" (strictTypes)`;
  M_ajv_utils_NOTSURE.checkStrictMode(e, t, e.opts.strictTypes);
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
            M_ajv_utils_NOTSURE.checkStrictMode(
              e,
              "default is ignored in the schema root"
            );
          }
        })(e);
        r.let(M_json_schema_default_names_NOTSURE.default.vErrors, null);
        r.let(M_json_schema_default_names_NOTSURE.default.errors, 0);
        if (n.unevaluated) {
          (function (e) {
            const { gen: t, validateName: n } = e;
            e.evaluated = t.const(
              "evaluated",
              M_codegen_NOTSURE._`${n}.evaluated`
            );
            t.if(M_codegen_NOTSURE._`${e.evaluated}.dynamicProps`, () =>
              t.assign(
                M_codegen_NOTSURE._`${e.evaluated}.props`,
                M_codegen_NOTSURE._`undefined`
              )
            );
            t.if(M_codegen_NOTSURE._`${e.evaluated}.dynamicItems`, () =>
              t.assign(
                M_codegen_NOTSURE._`${e.evaluated}.items`,
                M_codegen_NOTSURE._`undefined`
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
              M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.errors} === 0`,
              () => t.return(M_json_schema_default_names_NOTSURE.default.data),
              () =>
                t.throw(
                  M_codegen_NOTSURE._`new ${o}(${M_json_schema_default_names_NOTSURE.default.vErrors})`
                )
            );
          } else {
            t.assign(
              M_codegen_NOTSURE._`${r}.errors`,
              M_json_schema_default_names_NOTSURE.default.vErrors
            );
            if (i.unevaluated) {
              (function ({ gen: e, evaluated: t, props: n, items: r }) {
                if (n instanceof M_codegen_NOTSURE.Name) {
                  e.assign(M_codegen_NOTSURE._`${t}.props`, n);
                }
                if (r instanceof M_codegen_NOTSURE.Name) {
                  e.assign(M_codegen_NOTSURE._`${t}.items`, r);
                }
              })(e);
            }
            t.return(
              M_codegen_NOTSURE._`${M_json_schema_default_names_NOTSURE.default.errors} === 0`
            );
          }
        })(e);
      });
    })(e);
  } else {
    m(e, () => M_bool_or_empty_schema_NOTSURE.topBoolOrEmptySchema(e));
  }
};
class KeywordCxt {
  constructor(e, t, n) {
    M_keyword_macro_NOTSURE.validateKeywordUsage(e, t, n);
    this.gen = e.gen;
    this.allErrors = e.allErrors;
    this.keyword = n;
    this.data = e.data;
    this.schema = e.schema[n];
    this.$data = t.$data && e.opts.$data && this.schema && this.schema.$data;
    this.schemaValue = M_ajv_utils_NOTSURE.schemaRefOrVal(
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
      !(0, M_keyword_macro_NOTSURE.validSchemaType)(
        this.schema,
        t.schemaType,
        t.allowUndefined
      ))
    )
      throw new Error(`${n} value must be ${JSON.stringify(t.schemaType)}`);
    if ("code" in t ? t.trackErrors : !1 !== t.errors) {
      this.errsCount = e.gen.const(
        "_errs",
        M_json_schema_default_names_NOTSURE.default.errors
      );
    }
  }
  result(e, t, n) {
    this.failResult(M_codegen_NOTSURE.not(e), t, n);
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
    this.failResult(M_codegen_NOTSURE.not(e), undefined, t);
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
      M_codegen_NOTSURE._`${t} !== undefined && (${M_codegen_NOTSURE.or(
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
      ? M_ajv_error_stuff_NOTSURE.reportExtraError
      : M_ajv_error_stuff_NOTSURE.reportError)(this, this.def.error, t);
  }
  $dataError() {
    M_ajv_error_stuff_NOTSURE.reportError(
      this,
      this.def.$dataError || M_ajv_error_stuff_NOTSURE.keyword$DataError
    );
  }
  reset() {
    if (undefined === this.errsCount)
      throw new Error('add "trackErrors" to keyword definition');
    M_ajv_error_stuff_NOTSURE.resetErrorsCount(this.gen, this.errsCount);
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
  block$data(e, t, n = M_codegen_NOTSURE.nil) {
    this.gen.block(() => {
      this.check$data(e, n);
      t();
    });
  }
  check$data(e = M_codegen_NOTSURE.nil, t = M_codegen_NOTSURE.nil) {
    if (!this.$data) return;
    const { gen: n, schemaCode: r, schemaType: o, def: i } = this;
    n.if(M_codegen_NOTSURE.or(M_codegen_NOTSURE._`${r} === undefined`, t));
    if (e !== M_codegen_NOTSURE.nil) {
      n.assign(e, !0);
    }
    if (o.length || i.validateSchema) {
      n.elseIf(this.invalid$data());
      this.$dataError();
      if (e !== M_codegen_NOTSURE.nil) {
        n.assign(e, !1);
      }
    }
    n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: t, schemaType: n, def: r, it: o } = this;
    return M_codegen_NOTSURE.or(
      (function () {
        if (n.length) {
          if (!(t instanceof M_codegen_NOTSURE.Name))
            throw new Error("ajv implementation error");
          const e = Array.isArray(n) ? n : [n];
          return M_codegen_NOTSURE._`${M_data_type_checker_NOTSURE.checkDataTypes(
            e,
            t,
            o.opts.strictNumbers,
            M_data_type_checker_NOTSURE.DataType.Wrong
          )}`;
        }
        return M_codegen_NOTSURE.nil;
      })(),
      (function () {
        if (r.validateSchema) {
          const n = e.scopeValue("validate$data", {
            ref: r.validateSchema,
          });
          return M_codegen_NOTSURE._`!${n}(${t})`;
        }
        return M_codegen_NOTSURE.nil;
      })()
    );
  }
  subschema(e, t) {
    const n = M_extend_subschema_NOTSURE.getSubschema(this.it, e);
    M_extend_subschema_NOTSURE.extendSubschemaData(n, this.it, e);
    M_extend_subschema_NOTSURE.extendSubschemaMode(n, e);
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
              e.baseId = M_schema_ref_utils_NOTSURE.resolveUrl(e.baseId, t);
            }
          })(e);
          (function (e) {
            if (e.schema.$async && !e.schemaEnv.$async)
              throw new Error("async schema in sync schema");
          })(e);
          const i = r.const(
            "_errs",
            M_json_schema_default_names_NOTSURE.default.errors
          );
          b(e, i);
          r.var(
            t,
            M_codegen_NOTSURE._`${i} === ${M_json_schema_default_names_NOTSURE.default.errors}`
          );
        })(e, t);
      } else {
        M_bool_or_empty_schema_NOTSURE.boolOrEmptySchema(e, t);
      }
    })(o, t);
    return o;
  }
  mergeEvaluated(e, t) {
    const { it: n, gen: r } = this;
    if (n.opts.unevaluated) {
      if (!0 !== n.props && undefined !== e.props) {
        n.props = M_ajv_utils_NOTSURE.mergeEvaluated.props(
          r,
          e.props,
          n.props,
          t
        );
      }
      if (!0 !== n.items && undefined !== e.items) {
        n.items = M_ajv_utils_NOTSURE.mergeEvaluated.items(
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
      r.if(t, () => this.mergeEvaluated(e, M_codegen_NOTSURE.Name));
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
      M_keyword_macro_NOTSURE.funcKeywordCode(o, n);
    } else {
      if ("macro" in n) {
        M_keyword_macro_NOTSURE.macroKeywordCode(o, n);
      } else {
        if (n.compile || n.validate) {
          M_keyword_macro_NOTSURE.funcKeywordCode(o, n);
        }
      }
    }
  }
}
exports.KeywordCxt = KeywordCxt;
const I = /^\/(?:[^~]|~0|~1)*$/,
  P = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function getData(e, { dataLevel: t, dataNames: n, dataPathArr: r }) {
  let o, i;
  if ("" === e) return M_json_schema_default_names_NOTSURE.default.rootData;
  if ("/" === e[0]) {
    if (!I.test(e)) throw new Error(`Invalid JSON-pointer: ${e}`);
    o = e;
    i = M_json_schema_default_names_NOTSURE.default.rootData;
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
      i = M_codegen_NOTSURE._`${i}${M_codegen_NOTSURE.getProperty(
        M_ajv_utils_NOTSURE.unescapeJsonPointer(e)
      )}`;
      s = M_codegen_NOTSURE._`${s} && ${i}`;
    }
  return s;
  function c(e, n) {
    return `Cannot access ${e} ${n} levels up, current level is ${t}`;
  }
}
exports.getData = getData;
