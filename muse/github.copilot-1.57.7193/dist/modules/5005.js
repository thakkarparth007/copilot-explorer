Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = undefined;
const r = require(3487),
  o = require(2141),
  i = require(412),
  s = require(4181);
function a(e) {
  const {
    gen: t,
    data: n,
    it: o
  } = e;
  t.if(o.parentData, () => t.assign(n, r._`${o.parentData}[${o.parentDataProperty}]`));
}
function c(e, t, n) {
  if (undefined === n) throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", "function" == typeof n ? {
    ref: n
  } : {
    ref: n,
    code: r.stringify(n)
  });
}
exports.macroKeywordCode = function (e, t) {
  const {
      gen: n,
      keyword: o,
      schema: i,
      parentSchema: s,
      it: a
    } = e,
    l = t.macro.call(a.self, i, s, a),
    u = c(n, o, l);
  !1 !== a.opts.validateSchema && a.self.validateSchema(l, !0);
  const d = n.name("valid");
  e.subschema({
    schema: l,
    schemaPath: r.nil,
    errSchemaPath: `${a.errSchemaPath}/${o}`,
    topSchemaRef: u,
    compositeRule: !0
  }, d);
  e.pass(d, () => e.error(!0));
};
exports.funcKeywordCode = function (e, t) {
  var n;
  const {
    gen: l,
    keyword: u,
    schema: d,
    parentSchema: p,
    $data: h,
    it: f
  } = e;
  !function ({
    schemaEnv: e
  }, t) {
    if (t.async && !e.$async) throw new Error("async keyword in sync schema");
  }(f, t);
  const m = !h && t.compile ? t.compile.call(f.self, d, p, f) : t.validate,
    g = c(l, u, m),
    _ = l.let("valid");
  function y(n = t.async ? r._`await ` : r.nil) {
    const s = f.opts.passContext ? o.default.this : o.default.self,
      a = !("compile" in t && !h || !1 === t.schema);
    l.assign(_, r._`${n}${i.callValidateCode(e, g, s, a)}`, t.modifying);
  }
  function v(e) {
    var n;
    l.if(r.not(null !== (n = t.valid) && undefined !== n ? n : _), e);
  }
  e.block$data(_, function () {
    if (!1 === t.errors) {
      y();
      t.modifying && a(e);
      v(() => e.error());
    } else {
      const n = t.async ? function () {
        const e = l.let("ruleErrs", null);
        l.try(() => y(r._`await `), t => l.assign(_, !1).if(r._`${t} instanceof ${f.ValidationError}`, () => l.assign(e, r._`${t}.errors`), () => l.throw(t)));
        return e;
      }() : function () {
        const e = r._`${g}.errors`;
        l.assign(e, null);
        y(r.nil);
        return e;
      }();
      t.modifying && a(e);
      v(() => function (e, t) {
        const {
          gen: n
        } = e;
        n.if(r._`Array.isArray(${t})`, () => {
          n.assign(o.default.vErrors, r._`${o.default.vErrors} === null ? ${t} : ${o.default.vErrors}.concat(${t})`).assign(o.default.errors, r._`${o.default.vErrors}.length`);
          s.extendErrors(e);
        }, () => e.error());
      }(e, n));
    }
  });
  e.ok(null !== (n = t.valid) && undefined !== n ? n : _);
};
exports.validSchemaType = function (e, t, n = !1) {
  return !t.length || t.some(t => "array" === t ? Array.isArray(e) : "object" === t ? e && "object" == typeof e && !Array.isArray(e) : typeof e == t || n && undefined === e);
};
exports.validateKeywordUsage = function ({
  schema: e,
  opts: t,
  self: n,
  errSchemaPath: r
}, o, i) {
  if (Array.isArray(o.keyword) ? !o.keyword.includes(i) : o.keyword !== i) throw new Error("ajv implementation error");
  const s = o.dependencies;
  if (null == s ? undefined : s.some(t => !Object.prototype.hasOwnProperty.call(e, t))) throw new Error(`parent schema must have dependencies of ${i}: ${s.join(",")}`);
  if (o.validateSchema && !o.validateSchema(e[i])) {
    const e = `keyword "${i}" value is invalid at path "${r}": ` + n.errorsText(o.validateSchema.errors);
    if ("log" !== t.validateSchema) throw new Error(e);
    n.logger.error(e);
  }
};