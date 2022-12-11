Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_validate_properties_maybe = require("validate-properties");
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
const s = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: {
    message: ({ params: { missingProperty: e } }) =>
      M_codegen_maybe.str`must have required property '${e}'`,
    params: ({ params: { missingProperty: e } }) =>
      M_codegen_maybe._`{missingProperty: ${e}}`,
  },
  code(e) {
    const { gen: t, schema: n, schemaCode: s, data: a, $data: c, it: l } = e;
    const { opts: u } = l;
    if (!c && 0 === n.length) return;
    const d = n.length >= u.loopRequired;
    if (l.allErrors) {
      (function () {
        if (d || c) e.block$data(M_codegen_maybe.nil, p);
        else
          for (const t of n)
            M_validate_properties_maybe.checkReportMissingProp(e, t);
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
                  t.assign(
                    i,
                    M_validate_properties_maybe.propertyInData(
                      t,
                      a,
                      n,
                      u.ownProperties
                    )
                  );
                  t.if(M_codegen_maybe.not(i), () => {
                    e.error();
                    t.break();
                  });
                },
                M_codegen_maybe.nil
              );
            })(i, n)
          );
          e.ok(n);
        } else {
          t.if(M_validate_properties_maybe.checkMissingProp(e, n, i));
          M_validate_properties_maybe.reportMissingProp(e, i);
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
          (0, M_ajv_utils_maybe.checkStrictMode)(l, t, l.opts.strictRequired);
        }
    }
    function p() {
      t.forOf("prop", s, (n) => {
        e.setParams({
          missingProperty: n,
        });
        t.if(
          M_validate_properties_maybe.noPropertyInData(
            t,
            a,
            n,
            u.ownProperties
          ),
          () => e.error()
        );
      });
    }
  },
};
exports.default = s;
