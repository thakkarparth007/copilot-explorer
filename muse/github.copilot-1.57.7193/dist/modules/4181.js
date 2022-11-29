Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.extendErrors =
  exports.resetErrorsCount =
  exports.reportExtraError =
  exports.reportError =
  exports.keyword$DataError =
  exports.keywordError =
    undefined;
const r = require(3487),
  o = require(6776),
  i = require(2141);
function s(e, t) {
  const n = e.const("err", t);
  e.if(
    r._`${i.default.vErrors} === null`,
    () => e.assign(i.default.vErrors, r._`[${n}]`),
    r._`${i.default.vErrors}.push(${n})`
  );
  e.code(r._`${i.default.errors}++`);
}
function a(e, t) {
  const { gen: n, validateName: o, schemaEnv: i } = e;
  if (i.$async) {
    n.throw(r._`new ${e.ValidationError}(${t})`);
  } else {
    n.assign(r._`${o}.errors`, t);
    n.return(!1);
  }
}
exports.keywordError = {
  message: ({ keyword: e }) => r.str`must pass "${e}" keyword validation`,
};
exports.keyword$DataError = {
  message: ({ keyword: e, schemaType: t }) =>
    t
      ? r.str`"${e}" keyword must be ${t} ($data)`
      : r.str`"${e}" keyword is invalid ($data)`,
};
exports.reportError = function (e, n = exports.keywordError, o, i) {
  const { it: c } = e,
    { gen: u, compositeRule: d, allErrors: p } = c,
    h = l(e, n, o);
  if (null != i ? i : d || p) {
    s(u, h);
  } else {
    a(c, r._`[${h}]`);
  }
};
exports.reportExtraError = function (e, n = exports.keywordError, r) {
  const { it: o } = e,
    { gen: c, compositeRule: u, allErrors: d } = o;
  s(c, l(e, n, r));
  if (u || d) {
    a(o, i.default.vErrors);
  }
};
exports.resetErrorsCount = function (e, t) {
  e.assign(i.default.errors, t);
  e.if(r._`${i.default.vErrors} !== null`, () =>
    e.if(
      t,
      () => e.assign(r._`${i.default.vErrors}.length`, t),
      () => e.assign(i.default.vErrors, null)
    )
  );
};
exports.extendErrors = function ({
  gen: e,
  keyword: t,
  schemaValue: n,
  data: o,
  errsCount: s,
  it: a,
}) {
  if (undefined === s) throw new Error("ajv implementation error");
  const c = e.name("err");
  e.forRange("i", s, i.default.errors, (s) => {
    e.const(c, r._`${i.default.vErrors}[${s}]`);
    e.if(r._`${c}.instancePath === undefined`, () =>
      e.assign(
        r._`${c}.instancePath`,
        r.strConcat(i.default.instancePath, a.errorPath)
      )
    );
    e.assign(r._`${c}.schemaPath`, r.str`${a.errSchemaPath}/${t}`);
    if (a.opts.verbose) {
      e.assign(r._`${c}.schema`, n);
      e.assign(r._`${c}.data`, o);
    }
  });
};
const c = {
  keyword: new r.Name("keyword"),
  schemaPath: new r.Name("schemaPath"),
  params: new r.Name("params"),
  propertyName: new r.Name("propertyName"),
  message: new r.Name("message"),
  schema: new r.Name("schema"),
  parentSchema: new r.Name("parentSchema"),
};
function l(e, t, n) {
  const { createErrors: o } = e.it;
  return !1 === o
    ? r._`{}`
    : (function (e, t, n = {}) {
        const { gen: o, it: s } = e,
          a = [u(s, n), d(e, n)];
        (function (e, { params: t, message: n }, o) {
          const { keyword: s, data: a, schemaValue: l, it: u } = e,
            { opts: d, propertyName: p, topSchemaRef: h, schemaPath: f } = u;
          o.push(
            [c.keyword, s],
            [c.params, "function" == typeof t ? t(e) : t || r._`{}`]
          );
          if (d.messages) {
            o.push([c.message, "function" == typeof n ? n(e) : n]);
          }
          if (d.verbose) {
            o.push(
              [c.schema, l],
              [c.parentSchema, r._`${h}${f}`],
              [i.default.data, a]
            );
          }
          if (p) {
            o.push([c.propertyName, p]);
          }
        })(e, t, a);
        return o.object(...a);
      })(e, t, n);
}
function u({ errorPath: e }, { instancePath: t }) {
  const n = t ? r.str`${e}${o.getErrorPath(t, o.Type.Str)}` : e;
  return [i.default.instancePath, r.strConcat(i.default.instancePath, n)];
}
function d(
  { keyword: e, it: { errSchemaPath: t } },
  { schemaPath: n, parentSchema: i }
) {
  let s = i ? t : r.str`${t}/${e}`;
  if (n) {
    s = r.str`${s}${o.getErrorPath(n, o.Type.Str)}`;
  }
  return [c.schemaPath, s];
}
