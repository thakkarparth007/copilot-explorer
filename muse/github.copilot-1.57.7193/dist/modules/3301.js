Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(412),
  o = require(3487),
  i = require(6776),
  s = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: e } }) =>
        o.str`must have required property '${e}'`,
      params: ({ params: { missingProperty: e } }) =>
        o._`{missingProperty: ${e}}`,
    },
    code(e) {
      const { gen: t, schema: n, schemaCode: s, data: a, $data: c, it: l } = e,
        { opts: u } = l;
      if (!c && 0 === n.length) return;
      const d = n.length >= u.loopRequired;
      if (l.allErrors) {
        (function () {
          if (d || c) e.block$data(o.nil, p);
          else for (const t of n) r.checkReportMissingProp(e, t);
        })();
      } else {
        (function () {
          const i = t.let("missing");
          if (d || c) {
            const n = t.let("valid", !0);
            e.block$data(n, () =>
              (function (n, i) {
                e.setParams({
                  missingProperty: n,
                });
                t.forOf(
                  n,
                  s,
                  () => {
                    t.assign(i, r.propertyInData(t, a, n, u.ownProperties));
                    t.if(o.not(i), () => {
                      e.error();
                      t.break();
                    });
                  },
                  o.nil
                );
              })(i, n)
            );
            e.ok(n);
          } else {
            t.if(r.checkMissingProp(e, n, i));
            r.reportMissingProp(e, i);
            t.else();
          }
        })();
      }
      if (u.strictRequired) {
        const t = e.parentSchema.properties,
          { definedProperties: r } = e.it;
        for (const e of n)
          if (void 0 === (null == t ? void 0 : t[e]) && !r.has(e)) {
            const t = `required property "${e}" is not defined at "${
              l.schemaEnv.baseId + l.errSchemaPath
            }" (strictRequired)`;
            (0, i.checkStrictMode)(l, t, l.opts.strictRequired);
          }
      }
      function p() {
        t.forOf("prop", s, (n) => {
          e.setParams({
            missingProperty: n,
          });
          t.if(r.noPropertyInData(t, a, n, u.ownProperties), () => e.error());
        });
      }
    },
  };
exports.default = s;