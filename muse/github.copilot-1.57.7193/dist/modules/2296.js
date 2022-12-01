Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(412),
  o = require(3487),
  i = require(6776),
  s = require(6776),
  a = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(e) {
      const { gen: t, schema: n, data: a, parentSchema: c, it: l } = e,
        { opts: u } = l,
        d = r.allSchemaProperties(n),
        p = d.filter((e) => i.alwaysValidSchema(l, n[e]));
      if (
        0 === d.length ||
        (p.length === d.length && (!l.opts.unevaluated || !0 === l.props))
      )
        return;
      const h = u.strictSchema && !u.allowMatchingProperties && c.properties,
        f = t.name("valid");
      if (!0 === l.props || l.props instanceof o.Name) {
        l.props = s.evaluatedPropsToName(t, l.props);
      }
      const { props: m } = l;
      function g(e) {
        for (const t in h)
          if (new RegExp(e).test(t)) {
            i.checkStrictMode(
              l,
              `property ${t} matches pattern ${e} (use allowMatchingProperties)`
            );
          }
      }
      function _(n) {
        t.forIn("key", a, (i) => {
          t.if(o._`${r.usePattern(e, n)}.test(${i})`, () => {
            const r = p.includes(n);
            if (r) {
              e.subschema(
                {
                  keyword: "patternProperties",
                  schemaProp: n,
                  dataProp: i,
                  dataPropType: s.Type.Str,
                },
                f
              );
            }
            if (l.opts.unevaluated && !0 !== m) {
              t.assign(o._`${m}[${i}]`, !0);
            } else {
              if (r || l.allErrors) {
                t.if(o.not(f), () => t.break());
              }
            }
          });
        });
      }
      !(function () {
        for (const e of d) {
          if (h) {
            g(e);
          }
          if (l.allErrors) {
            _(e);
          } else {
            t.var(f, !0);
            _(e);
            t.if(f);
          }
        }
      })();
    },
  };
exports.default = a;