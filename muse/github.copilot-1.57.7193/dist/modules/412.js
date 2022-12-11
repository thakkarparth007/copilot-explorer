Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.validateUnion =
  exports.validateArray =
  exports.usePattern =
  exports.callValidateCode =
  exports.schemaProperties =
  exports.allSchemaProperties =
  exports.noPropertyInData =
  exports.propertyInData =
  exports.isOwnProperty =
  exports.hasPropFunc =
  exports.reportMissingProp =
  exports.checkMissingProp =
  exports.checkReportMissingProp =
    undefined;
const r = require(3487);
const o = require(6776);
const i = require(2141);
function hasPropFunc(e) {
  return e.scopeValue("func", {
    ref: Object.prototype.hasOwnProperty,
    code: r._`Object.prototype.hasOwnProperty`,
  });
}
function isOwnProperty(e, t, n) {
  return r._`${hasPropFunc(e)}.call(${t}, ${n})`;
}
function noPropertyInData(e, t, n, o) {
  const i = r._`${t}${r.getProperty(n)} === undefined`;
  return o ? r.or(i, r.not(isOwnProperty(e, t, n))) : i;
}
function allSchemaProperties(e) {
  return e ? Object.keys(e).filter((e) => "__proto__" !== e) : [];
}
exports.checkReportMissingProp = function (e, t) {
  const { gen: n, data: o, it: i } = e;
  n.if(noPropertyInData(n, o, t, i.opts.ownProperties), () => {
    e.setParams(
      {
        missingProperty: r._`${t}`,
      },
      !0
    );
    e.error();
  });
};
exports.checkMissingProp = function (
  { gen: e, data: t, it: { opts: n } },
  o,
  i
) {
  return r.or(
    ...o.map((o) =>
      r.and(noPropertyInData(e, t, o, n.ownProperties), r._`${i} = ${o}`)
    )
  );
};
exports.reportMissingProp = function (e, t) {
  e.setParams(
    {
      missingProperty: t,
    },
    !0
  );
  e.error();
};
exports.hasPropFunc = hasPropFunc;
exports.isOwnProperty = isOwnProperty;
exports.propertyInData = function (e, t, n, o) {
  const i = r._`${t}${r.getProperty(n)} !== undefined`;
  return o ? r._`${i} && ${isOwnProperty(e, t, n)}` : i;
};
exports.noPropertyInData = noPropertyInData;
exports.allSchemaProperties = allSchemaProperties;
exports.schemaProperties = function (e, t) {
  return allSchemaProperties(t).filter((n) => !o.alwaysValidSchema(e, t[n]));
};
exports.callValidateCode = function (
  {
    schemaCode: e,
    data: t,
    it: { gen: n, topSchemaRef: o, schemaPath: s, errorPath: a },
    it: c,
  },
  l,
  u,
  d
) {
  const p = d ? r._`${e}, ${t}, ${o}${s}` : t;
  const h = [
    [i.default.instancePath, r.strConcat(i.default.instancePath, a)],
    [i.default.parentData, c.parentData],
    [i.default.parentDataProperty, c.parentDataProperty],
    [i.default.rootData, i.default.rootData],
  ];
  if (c.opts.dynamicRef) {
    h.push([i.default.dynamicAnchors, i.default.dynamicAnchors]);
  }
  const f = r._`${p}, ${n.object(...h)}`;
  return u !== r.nil ? r._`${l}.call(${u}, ${f})` : r._`${l}(${f})`;
};
exports.usePattern = function ({ gen: e, it: { opts: t } }, n) {
  const o = t.unicodeRegExp ? "u" : "";
  return e.scopeValue("pattern", {
    key: n,
    ref: new RegExp(n, o),
    code: r._`new RegExp(${n}, ${o})`,
  });
};
exports.validateArray = function (e) {
  const { gen: t, data: n, keyword: i, it: s } = e;
  const a = t.name("valid");
  if (s.allErrors) {
    const e = t.let("valid", !0);
    c(() => t.assign(e, !1));
    return e;
  }
  t.var(a, !0);
  c(() => t.break());
  return a;
  function c(s) {
    const c = t.const("len", r._`${n}.length`);
    t.forRange("i", 0, c, (n) => {
      e.subschema(
        {
          keyword: i,
          dataProp: n,
          dataPropType: o.Type.Num,
        },
        a
      );
      t.if(r.not(a), s);
    });
  }
};
exports.validateUnion = function (e) {
  const { gen: t, schema: n, keyword: i, it: s } = e;
  if (!Array.isArray(n)) throw new Error("ajv implementation error");
  if (n.some((e) => o.alwaysValidSchema(s, e)) && !s.opts.unevaluated) return;
  const a = t.let("valid", !1);
  const c = t.name("_valid");
  t.block(() =>
    n.forEach((n, o) => {
      const s = e.subschema(
        {
          keyword: i,
          schemaProp: o,
          compositeRule: !0,
        },
        c
      );
      t.assign(a, r._`${a} || ${c}`);
      if (e.mergeValidEvaluated(s, c)) {
        t.if(r.not(a));
      }
    })
  );
  e.result(
    a,
    () => e.reset(),
    () => e.error(!0)
  );
};