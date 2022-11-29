Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getData = exports.KeywordCxt = exports.validateFunctionCode = undefined;
const r = require(5667),
  o = require(453),
  i = require(8876),
  s = require(453),
  a = require(313),
  c = require(5005),
  l = require(3099),
  u = require(3487),
  d = require(2141),
  p = require(2531),
  h = require(6776),
  f = require(4181);
function m({ gen: e, validateName: t, schema: n, schemaEnv: r, opts: o }, i) {
  if (o.code.es5) {
    e.func(t, u._`${d.default.data}, ${d.default.valCxt}`, r.$async, () => {
      e.code(u._`"use strict"; ${g(n, o)}`);
      (function (e, t) {
        e.if(
          d.default.valCxt,
          () => {
            e.var(
              d.default.instancePath,
              u._`${d.default.valCxt}.${d.default.instancePath}`
            );
            e.var(
              d.default.parentData,
              u._`${d.default.valCxt}.${d.default.parentData}`
            );
            e.var(
              d.default.parentDataProperty,
              u._`${d.default.valCxt}.${d.default.parentDataProperty}`
            );
            e.var(
              d.default.rootData,
              u._`${d.default.valCxt}.${d.default.rootData}`
            );
            if (t.dynamicRef) {
              e.var(
                d.default.dynamicAnchors,
                u._`${d.default.valCxt}.${d.default.dynamicAnchors}`
              );
            }
          },
          () => {
            e.var(d.default.instancePath, u._`""`);
            e.var(d.default.parentData, u._`undefined`);
            e.var(d.default.parentDataProperty, u._`undefined`);
            e.var(d.default.rootData, d.default.data);
            if (t.dynamicRef) {
              e.var(d.default.dynamicAnchors, u._`{}`);
            }
          }
        );
      })(e, o);
      e.code(i);
    });
  } else {
    e.func(
      t,
      u._`${d.default.data}, ${(function (e) {
        return u._`{${d.default.instancePath}="", ${d.default.parentData}, ${
          d.default.parentDataProperty
        }, ${d.default.rootData}=${d.default.data}${
          e.dynamicRef ? u._`, ${d.default.dynamicAnchors}={}` : u.nil
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
    ? u._`/*# sourceURL=${n} */`
    : u.nil;
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
  h.checkUnknownRules(e);
  (function (e) {
    const { schema: t, errSchemaPath: n, opts: r, self: o } = e;
    if (
      t.$ref &&
      r.ignoreKeywordsWithRef &&
      h.schemaHasRulesButRef(t, o.RULES)
    ) {
      o.logger.warn(`$ref: keywords ignored in schema at path "${n}"`);
    }
  })(e);
}
function b(e, t) {
  if (e.opts.jtd) return x(e, [], !1, t);
  const n = o.getSchemaTypes(e.schema);
  x(e, n, !o.coerceAndCheckDataType(e, n), t);
}
function w({ gen: e, schemaEnv: t, schema: n, errSchemaPath: r, opts: o }) {
  const i = n.$comment;
  if (!0 === o.$comment) e.code(u._`${d.default.self}.logger.log(${i})`);
  else if ("function" == typeof o.$comment) {
    const n = u.str`${r}/$comment`,
      o = e.scopeValue("root", {
        ref: t.root,
      });
    e.code(u._`${d.default.self}.opts.$comment(${i}, ${n}, ${o}.schema)`);
  }
}
function x(e, t, n, r) {
  const { gen: o, schema: a, data: c, allErrors: l, opts: p, self: f } = e,
    { RULES: m } = f;
  function g(h) {
    if (i.shouldUseGroup(a, h)) {
      if (h.type) {
        o.if(s.checkDataType(h.type, c, p.strictNumbers));
        E(e, h);
        if (1 === t.length && t[0] === h.type && n) {
          o.else();
          s.reportTypeError(e);
        }
        o.endIf();
      } else {
        E(e, h);
      }
      if (l) {
        o.if(u._`${d.default.errors} === ${r || 0}`);
      }
    }
  }
  if (!a.$ref || (!p.ignoreKeywordsWithRef && h.schemaHasRulesButRef(a, m))) {
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
              if ("object" == typeof o && i.shouldUseRule(e.schema, o)) {
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
    a.assignDefaults(e, t.type);
  }
  n.block(() => {
    for (const n of t.rules)
      if (i.shouldUseRule(r, n)) {
        k(e, n.keyword, n.definition, t.type);
      }
  });
}
function C(e, t) {
  return e.includes(t) || ("integer" === t && e.includes("number"));
}
function S(e, t) {
  t += ` at "${e.schemaEnv.baseId + e.errSchemaPath}" (strictTypes)`;
  h.checkStrictMode(e, t, e.opts.strictTypes);
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
            h.checkStrictMode(e, "default is ignored in the schema root");
          }
        })(e);
        r.let(d.default.vErrors, null);
        r.let(d.default.errors, 0);
        if (n.unevaluated) {
          (function (e) {
            const { gen: t, validateName: n } = e;
            e.evaluated = t.const("evaluated", u._`${n}.evaluated`);
            t.if(u._`${e.evaluated}.dynamicProps`, () =>
              t.assign(u._`${e.evaluated}.props`, u._`undefined`)
            );
            t.if(u._`${e.evaluated}.dynamicItems`, () =>
              t.assign(u._`${e.evaluated}.items`, u._`undefined`)
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
              u._`${d.default.errors} === 0`,
              () => t.return(d.default.data),
              () => t.throw(u._`new ${o}(${d.default.vErrors})`)
            );
          } else {
            t.assign(u._`${r}.errors`, d.default.vErrors);
            if (i.unevaluated) {
              (function ({ gen: e, evaluated: t, props: n, items: r }) {
                if (n instanceof u.Name) {
                  e.assign(u._`${t}.props`, n);
                }
                if (r instanceof u.Name) {
                  e.assign(u._`${t}.items`, r);
                }
              })(e);
            }
            t.return(u._`${d.default.errors} === 0`);
          }
        })(e);
      });
    })(e);
  } else {
    m(e, () => r.topBoolOrEmptySchema(e));
  }
};
class KeywordCxt {
  constructor(e, t, n) {
    c.validateKeywordUsage(e, t, n);
    this.gen = e.gen;
    this.allErrors = e.allErrors;
    this.keyword = n;
    this.data = e.data;
    this.schema = e.schema[n];
    this.$data = t.$data && e.opts.$data && this.schema && this.schema.$data;
    this.schemaValue = h.schemaRefOrVal(e, this.schema, n, this.$data);
    this.schemaType = t.schemaType;
    this.parentSchema = e.schema;
    this.params = {};
    this.it = e;
    this.def = t;
    if (this.$data)
      this.schemaCode = e.gen.const("vSchema", getData(this.$data, e));
    else if (
      ((this.schemaCode = this.schemaValue),
      !(0, c.validSchemaType)(this.schema, t.schemaType, t.allowUndefined))
    )
      throw new Error(`${n} value must be ${JSON.stringify(t.schemaType)}`);
    if ("code" in t ? t.trackErrors : !1 !== t.errors) {
      this.errsCount = e.gen.const("_errs", d.default.errors);
    }
  }
  result(e, t, n) {
    this.failResult(u.not(e), t, n);
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
    this.failResult(u.not(e), undefined, t);
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
    this.fail(u._`${t} !== undefined && (${u.or(this.invalid$data(), e)})`);
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
    (e ? f.reportExtraError : f.reportError)(this, this.def.error, t);
  }
  $dataError() {
    f.reportError(this, this.def.$dataError || f.keyword$DataError);
  }
  reset() {
    if (undefined === this.errsCount)
      throw new Error('add "trackErrors" to keyword definition');
    f.resetErrorsCount(this.gen, this.errsCount);
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
  block$data(e, t, n = u.nil) {
    this.gen.block(() => {
      this.check$data(e, n);
      t();
    });
  }
  check$data(e = u.nil, t = u.nil) {
    if (!this.$data) return;
    const { gen: n, schemaCode: r, schemaType: o, def: i } = this;
    n.if(u.or(u._`${r} === undefined`, t));
    if (e !== u.nil) {
      n.assign(e, !0);
    }
    if (o.length || i.validateSchema) {
      n.elseIf(this.invalid$data());
      this.$dataError();
      if (e !== u.nil) {
        n.assign(e, !1);
      }
    }
    n.else();
  }
  invalid$data() {
    const { gen: e, schemaCode: t, schemaType: n, def: r, it: o } = this;
    return u.or(
      (function () {
        if (n.length) {
          if (!(t instanceof u.Name))
            throw new Error("ajv implementation error");
          const e = Array.isArray(n) ? n : [n];
          return u._`${s.checkDataTypes(
            e,
            t,
            o.opts.strictNumbers,
            s.DataType.Wrong
          )}`;
        }
        return u.nil;
      })(),
      (function () {
        if (r.validateSchema) {
          const n = e.scopeValue("validate$data", {
            ref: r.validateSchema,
          });
          return u._`!${n}(${t})`;
        }
        return u.nil;
      })()
    );
  }
  subschema(e, t) {
    const n = l.getSubschema(this.it, e);
    l.extendSubschemaData(n, this.it, e);
    l.extendSubschemaMode(n, e);
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
              e.baseId = p.resolveUrl(e.baseId, t);
            }
          })(e);
          (function (e) {
            if (e.schema.$async && !e.schemaEnv.$async)
              throw new Error("async schema in sync schema");
          })(e);
          const i = r.const("_errs", d.default.errors);
          b(e, i);
          r.var(t, u._`${i} === ${d.default.errors}`);
        })(e, t);
      } else {
        r.boolOrEmptySchema(e, t);
      }
    })(o, t);
    return o;
  }
  mergeEvaluated(e, t) {
    const { it: n, gen: r } = this;
    if (n.opts.unevaluated) {
      if (!0 !== n.props && undefined !== e.props) {
        n.props = h.mergeEvaluated.props(r, e.props, n.props, t);
      }
      if (!0 !== n.items && undefined !== e.items) {
        n.items = h.mergeEvaluated.items(r, e.items, n.items, t);
      }
    }
  }
  mergeValidEvaluated(e, t) {
    const { it: n, gen: r } = this;
    if (n.opts.unevaluated && (!0 !== n.props || !0 !== n.items)) {
      r.if(t, () => this.mergeEvaluated(e, u.Name));
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
      c.funcKeywordCode(o, n);
    } else {
      if ("macro" in n) {
        c.macroKeywordCode(o, n);
      } else {
        if (n.compile || n.validate) {
          c.funcKeywordCode(o, n);
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
  if ("" === e) return d.default.rootData;
  if ("/" === e[0]) {
    if (!I.test(e)) throw new Error(`Invalid JSON-pointer: ${e}`);
    o = e;
    i = d.default.rootData;
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
      i = u._`${i}${u.getProperty(h.unescapeJsonPointer(e))}`;
      s = u._`${s} && ${i}`;
    }
  return s;
  function c(e, n) {
    return `Cannot access ${e} ${n} levels up, current level is ${t}`;
  }
}
exports.getData = getData;
