Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(3487),
  o = require(9306),
  i = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: e, tagName: t } }) =>
        e === o.DiscrError.Tag
          ? `tag "${t}" must be string`
          : `value of tag "${t}" must be in oneOf`,
      params: ({ params: { discrError: e, tag: t, tagName: n } }) =>
        r._`{error: ${e}, tag: ${n}, tagValue: ${t}}`,
    },
    code(e) {
      const { gen: t, data: n, schema: i, parentSchema: s, it: a } = e,
        { oneOf: c } = s;
      if (!a.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const l = i.propertyName;
      if ("string" != typeof l)
        throw new Error("discriminator: requires propertyName");
      if (i.mapping) throw new Error("discriminator: mapping is not supported");
      if (!c) throw new Error("discriminator: requires oneOf keyword");
      const u = t.let("valid", !1),
        d = t.const("tag", r._`${n}${r.getProperty(l)}`);
      function p(n) {
        const o = t.name("valid"),
          i = e.subschema(
            {
              keyword: "oneOf",
              schemaProp: n,
            },
            o
          );
        e.mergeEvaluated(i, r.Name);
        return o;
      }
      t.if(
        r._`typeof ${d} == "string"`,
        () =>
          (function () {
            const n = (function () {
              var e;
              const t = {},
                n = o(s);
              let r = !0;
              for (let t = 0; t < c.length; t++) {
                const s = c[t],
                  a =
                    null === (e = s.properties) || undefined === e
                      ? undefined
                      : e[l];
                if ("object" != typeof a)
                  throw new Error(
                    `discriminator: oneOf schemas must have "properties/${l}"`
                  );
                r = r && (n || o(s));
                i(a, t);
              }
              if (!r) throw new Error(`discriminator: "${l}" must be required`);
              return t;
              function o({ required: e }) {
                return Array.isArray(e) && e.includes(l);
              }
              function i(e, t) {
                if (e.const) a(e.const, t);
                else {
                  if (!e.enum)
                    throw new Error(
                      `discriminator: "properties/${l}" must have "const" or "enum"`
                    );
                  for (const n of e.enum) a(n, t);
                }
              }
              function a(e, n) {
                if ("string" != typeof e || e in t)
                  throw new Error(
                    `discriminator: "${l}" values must be unique strings`
                  );
                t[e] = n;
              }
            })();
            t.if(!1);
            for (const e in n) {
              t.elseIf(r._`${d} === ${e}`);
              t.assign(u, p(n[e]));
            }
            t.else();
            e.error(!1, {
              discrError: o.DiscrError.Mapping,
              tag: d,
              tagName: l,
            });
            t.endIf();
          })(),
        () =>
          e.error(!1, {
            discrError: o.DiscrError.Tag,
            tag: d,
            tagName: l,
          })
      );
      e.ok(u);
    },
  };
exports.default = i;
