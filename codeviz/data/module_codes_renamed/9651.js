Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_maybe = require("codegen");
const o = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: {
    message: ({ schemaCode: e }) =>
      M_codegen_maybe.str`must match format "${e}"`,
    params: ({ schemaCode: e }) => M_codegen_maybe._`{format: ${e}}`,
  },
  code(e, t) {
    const { gen: n, data: o, $data: i, schema: s, schemaCode: a, it: c } = e;
    const { opts: l, errSchemaPath: u, schemaEnv: d, self: p } = c;
    if (l.validateFormats) {
      if (i) {
        (function () {
          const i = n.scopeValue("formats", {
            ref: p.formats,
            code: l.code.formats,
          });
          const s = n.const("fDef", M_codegen_maybe._`${i}[${a}]`);
          const c = n.let("fType");
          const u = n.let("format");
          n.if(
            M_codegen_maybe._`typeof ${s} == "object" && !(${s} instanceof RegExp)`,
            () =>
              n
                .assign(c, M_codegen_maybe._`${s}.type || "string"`)
                .assign(u, M_codegen_maybe._`${s}.validate`),
            () => n.assign(c, M_codegen_maybe._`"string"`).assign(u, s)
          );
          e.fail$data(
            M_codegen_maybe.or(
              !1 === l.strictSchema
                ? M_codegen_maybe.nil
                : M_codegen_maybe._`${a} && !${u}`,
              (function () {
                const e = d.$async
                  ? M_codegen_maybe._`(${s}.async ? await ${u}(${o}) : ${u}(${o}))`
                  : M_codegen_maybe._`${u}(${o})`;
                const n = M_codegen_maybe._`(typeof ${u} == "function" ? ${e} : ${u}.test(${o}))`;
                return M_codegen_maybe._`${u} && ${u} !== true && ${c} === ${t} && !${n}`;
              })()
            )
          );
        })();
      } else {
        (function () {
          const i = p.formats[s];
          if (!i)
            return void (function () {
              if (!1 !== l.strictSchema) throw new Error(e());
              function e() {
                return `unknown format "${s}" ignored in schema at path "${u}"`;
              }
              p.logger.warn(e());
            })();
          if (!0 === i) return;
          const [a, c, h] = (function (e) {
            const t =
              e instanceof RegExp
                ? M_codegen_maybe.regexpCode(e)
                : l.code.formats
                ? M_codegen_maybe._`${
                    l.code.formats
                  }${M_codegen_maybe.getProperty(s)}`
                : undefined;
            const o = n.scopeValue("formats", {
              key: s,
              ref: e,
              code: t,
            });
            return "object" != typeof e || e instanceof RegExp
              ? ["string", e, o]
              : [
                  e.type || "string",
                  e.validate,
                  M_codegen_maybe._`${o}.validate`,
                ];
          })(i);
          if (a === t) {
            e.pass(
              (function () {
                if ("object" == typeof i && !(i instanceof RegExp) && i.async) {
                  if (!d.$async) throw new Error("async format in sync schema");
                  return M_codegen_maybe._`await ${h}(${o})`;
                }
                return "function" == typeof c
                  ? M_codegen_maybe._`${h}(${o})`
                  : M_codegen_maybe._`${h}.test(${o})`;
              })()
            );
          }
        })();
      }
    }
  },
};
exports.default = o;
