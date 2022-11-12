Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(412),
  o = require(3487),
  i = require(2141),
  s = require(6776),
  a = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({
        params: e
      }) => o._`{additionalProperty: ${e.additionalProperty}}`
    },
    code(e) {
      const {
        gen: t,
        schema: n,
        parentSchema: a,
        data: c,
        errsCount: l,
        it: u
      } = e;
      if (!l) throw new Error("ajv implementation error");
      const {
        allErrors: d,
        opts: p
      } = u;
      u.props = !0;
      if ("all" !== p.removeAdditional && (0, s.alwaysValidSchema)(u, n)) return;
      const h = r.allSchemaProperties(a.properties),
        f = r.allSchemaProperties(a.patternProperties);
      function m(e) {
        t.code(o._`delete ${c}[${e}]`);
      }
      function g(r) {
        if ("all" === p.removeAdditional || p.removeAdditional && !1 === n) m(r);else {
          if (!1 === n) {
            e.setParams({
              additionalProperty: r
            });
            e.error();
            return void (d || t.break());
          }
          if ("object" == typeof n && !s.alwaysValidSchema(u, n)) {
            const n = t.name("valid");
            "failing" === p.removeAdditional ? (_(r, n, !1), t.if(o.not(n), () => {
              e.reset();
              m(r);
            })) : (_(r, n), d || t.if(o.not(n), () => t.break()));
          }
        }
      }
      function _(t, n, r) {
        const o = {
          keyword: "additionalProperties",
          dataProp: t,
          dataPropType: s.Type.Str
        };
        !1 === r && Object.assign(o, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        });
        e.subschema(o, n);
      }
      t.forIn("key", c, n => {
        h.length || f.length ? t.if(function (n) {
          let i;
          if (h.length > 8) {
            const e = s.schemaRefOrVal(u, a.properties, "properties");
            i = r.isOwnProperty(t, e, n);
          } else i = h.length ? o.or(...h.map(e => o._`${n} === ${e}`)) : o.nil;
          f.length && (i = o.or(i, ...f.map(t => o._`${r.usePattern(e, t)}.test(${n})`)));
          return o.not(i);
        }(n), () => g(n)) : g(n);
      });
      e.ok(o._`${l} === ${i.default.errors}`);
    }
  };
exports.default = a;