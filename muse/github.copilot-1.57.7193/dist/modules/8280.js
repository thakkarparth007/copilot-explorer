Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.callRef = exports.getValidate = undefined;
const r = require(6646);
const o = require(412);
const i = require(3487);
const s = require(2141);
const a = require(5173);
const c = require(6776);
const l = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: n, it: o } = e;
    const { baseId: s, schemaEnv: c, validateName: l, opts: p, self: h } = o;
    const { root: f } = c;
    if (("#" === n || "#/" === n) && s === f.baseId)
      return (function () {
        if (c === f) return callRef(e, l, c, c.$async);
        const n = t.scopeValue("root", {
          ref: f,
        });
        return callRef(e, i._`${n}.validate`, f, f.$async);
      })();
    const m = a.resolveRef.call(h, f, s, n);
    if (undefined === m) throw new r.default(s, n);
    return m instanceof a.SchemaEnv
      ? (function (t) {
          const n = getValidate(e, t);
          callRef(e, n, t, t.$async);
        })(m)
      : (function (r) {
          const o = t.scopeValue(
            "schema",
            true === p.code.source
              ? {
                  ref: r,
                  code: i.stringify(r),
                }
              : {
                  ref: r,
                }
          );
          const s = t.name("valid");
          const a = e.subschema(
            {
              schema: r,
              dataTypes: [],
              schemaPath: i.nil,
              topSchemaRef: o,
              errSchemaPath: n,
            },
            s
          );
          e.mergeEvaluated(a);
          e.ok(s);
        })(m);
  },
};
function getValidate(e, t) {
  const { gen: n } = e;
  return t.validate
    ? n.scopeValue("validate", {
        ref: t.validate,
      })
    : i._`${n.scopeValue("wrapper", {
        ref: t,
      })}.validate`;
}
function callRef(e, t, n, r) {
  const { gen: a, it: l } = e;
  const { allErrors: u, schemaEnv: d, opts: p } = l;
  const h = p.passContext ? s.default.this : i.nil;
  function f(e) {
    const t = i._`${e}.errors`;
    a.assign(
      s.default.vErrors,
      i._`${s.default.vErrors} === null ? ${t} : ${s.default.vErrors}.concat(${t})`
    );
    a.assign(s.default.errors, i._`${s.default.vErrors}.length`);
  }
  function m(e) {
    var t;
    if (!l.opts.unevaluated) return;
    const r =
      null === (t = null == n ? undefined : n.validate) || undefined === t
        ? undefined
        : t.evaluated;
    if (true !== l.props)
      if (r && !r.dynamicProps) {
        if (undefined !== r.props) {
          l.props = c.mergeEvaluated.props(a, r.props, l.props);
        }
      } else {
        const t = a.var("props", i._`${e}.evaluated.props`);
        l.props = c.mergeEvaluated.props(a, t, l.props, i.Name);
      }
    if (true !== l.items)
      if (r && !r.dynamicItems) {
        if (undefined !== r.items) {
          l.items = c.mergeEvaluated.items(a, r.items, l.items);
        }
      } else {
        const t = a.var("items", i._`${e}.evaluated.items`);
        l.items = c.mergeEvaluated.items(a, t, l.items, i.Name);
      }
  }
  if (r) {
    (function () {
      if (!d.$async) throw new Error("async schema referenced by sync schema");
      const n = a.let("valid");
      a.try(
        () => {
          a.code(i._`await ${o.callValidateCode(e, t, h)}`);
          m(t);
          if (u) {
            a.assign(n, true);
          }
        },
        (e) => {
          a.if(i._`!(${e} instanceof ${l.ValidationError})`, () => a.throw(e));
          f(e);
          if (u) {
            a.assign(n, false);
          }
        }
      );
      e.ok(n);
    })();
  } else {
    e.result(
      o.callValidateCode(e, t, h),
      () => m(t),
      () => f(t)
    );
  }
}
exports.getValidate = getValidate;
exports.callRef = callRef;
exports.default = l;