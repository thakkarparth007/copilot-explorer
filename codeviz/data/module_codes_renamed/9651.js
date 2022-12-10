Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_codegen_NOTSURE = require("codegen"),
  o = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: e }) =>
        M_codegen_NOTSURE.str`must match format "${e}"`,
      params: ({ schemaCode: e }) => M_codegen_NOTSURE._`{format: ${e}}`,
    },
    code(e, t) {
      const { gen: n, data: o, $data: i, schema: s, schemaCode: a, it: c } = e,
        { opts: l, errSchemaPath: u, schemaEnv: d, self: p } = c;
      if (l.validateFormats) {
        if (i) {
          (function () {
            const i = n.scopeValue("formats", {
                ref: p.formats,
                code: l.code.formats,
              }),
              s = n.const("fDef", M_codegen_NOTSURE._`${i}[${a}]`),
              c = n.let("fType"),
              u = n.let("format");
            n.if(
              M_codegen_NOTSURE._`typeof ${s} == "object" && !(${s} instanceof RegExp)`,
              () =>
                n
                  .assign(c, M_codegen_NOTSURE._`${s}.type || "string"`)
                  .assign(u, M_codegen_NOTSURE._`${s}.validate`),
              () => n.assign(c, M_codegen_NOTSURE._`"string"`).assign(u, s)
            );
            e.fail$data(
              M_codegen_NOTSURE.or(
                !1 === l.strictSchema
                  ? M_codegen_NOTSURE.nil
                  : M_codegen_NOTSURE._`${a} && !${u}`,
                (function () {
                  const e = d.$async
                      ? M_codegen_NOTSURE._`(${s}.async ? await ${u}(${o}) : ${u}(${o}))`
                      : M_codegen_NOTSURE._`${u}(${o})`,
                    n = M_codegen_NOTSURE._`(typeof ${u} == "function" ? ${e} : ${u}.test(${o}))`;
                  return M_codegen_NOTSURE._`${u} && ${u} !== true && ${c} === ${t} && !${n}`;
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
                    ? M_codegen_NOTSURE.regexpCode(e)
                    : l.code.formats
                    ? M_codegen_NOTSURE._`${
                        l.code.formats
                      }${M_codegen_NOTSURE.getProperty(s)}`
                    : undefined,
                o = n.scopeValue("formats", {
                  key: s,
                  ref: e,
                  code: t,
                });
              return "object" != typeof e || e instanceof RegExp
                ? ["string", e, o]
                : [
                    e.type || "string",
                    e.validate,
                    M_codegen_NOTSURE._`${o}.validate`,
                  ];
            })(i);
            if (a === t) {
              e.pass(
                (function () {
                  if (
                    "object" == typeof i &&
                    !(i instanceof RegExp) &&
                    i.async
                  ) {
                    if (!d.$async)
                      throw new Error("async format in sync schema");
                    return M_codegen_NOTSURE._`await ${h}(${o})`;
                  }
                  return "function" == typeof c
                    ? M_codegen_NOTSURE._`${h}(${o})`
                    : M_codegen_NOTSURE._`${h}.test(${o})`;
                })()
              );
            }
          })();
        }
      }
    },
  };
exports.default = o;
