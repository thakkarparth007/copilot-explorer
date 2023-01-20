var t = (module.exports = function (e, t, r) {
  if ("function" == typeof t) {
    r = t;
    t = {};
  }
  n(
    t,
    "function" == typeof (r = t.cb || r) ? r : r.pre || function () {},
    r.post || function () {},
    e,
    "",
    e
  );
});
function n(e, r, o, i, s, a, c, l, u, d) {
  if (i && "object" == typeof i && !Array.isArray(i)) {
    for (var p in (r(i, s, a, c, l, u, d), i)) {
      var h = i[p];
      if (Array.isArray(h)) {
        if (p in t.arrayKeywords)
          for (var f = 0; f < h.length; f++)
            n(e, r, o, h[f], s + "/" + p + "/" + f, a, s, p, i, f);
      } else if (p in t.propsKeywords) {
        if (h && "object" == typeof h)
          for (var m in h)
            n(
              e,
              r,
              o,
              h[m],
              s + "/" + p + "/" + m.replace(/~/g, "~0").replace(/\//g, "~1"),
              a,
              s,
              p,
              i,
              m
            );
      } else if (p in t.keywords || (e.allKeys && !(p in t.skipKeywords))) {
        n(e, r, o, h, s + "/" + p, a, s, p, i);
      }
    }
    o(i, s, a, c, l, u, d);
  }
}
t.keywords = {
  additionalItems: true,
  items: true,
  contains: true,
  additionalProperties: true,
  propertyNames: true,
  not: true,
  if: true,
  then: true,
  else: true,
};
t.arrayKeywords = {
  items: true,
  allOf: true,
  anyOf: true,
  oneOf: true,
};
t.propsKeywords = {
  $defs: true,
  definitions: true,
  properties: true,
  patternProperties: true,
  dependencies: true,
};
t.skipKeywords = {
  default: true,
  enum: true,
  const: true,
  required: true,
  maximum: true,
  minimum: true,
  exclusiveMaximum: true,
  exclusiveMinimum: true,
  multipleOf: true,
  maxLength: true,
  minLength: true,
  pattern: true,
  format: true,
  maxItems: true,
  minItems: true,
  uniqueItems: true,
  maxProperties: true,
  minProperties: true,
};