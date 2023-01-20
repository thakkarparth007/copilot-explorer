Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(3487);
const o = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: true,
  error: {
    message: ({ schemaCode: e }) => r.str`must match format "${e}"`,
    params: ({ schemaCode: e }) => r._`{format: ${e}}`,
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
          const s = n.const("fDef", r._`${i}[${a}]`);
          const c = n.let("fType");
          const u = n.let("format");
          n.if(
            r._`typeof ${s} == "object" && !(${s} instanceof RegExp)`,
            () =>
              n
                .assign(c, r._`${s}.type || "string"`)
                .assign(u, r._`${s}.validate`),
            () => n.assign(c, r._`"string"`).assign(u, s)
          );
          e.fail$data(
            r.or(
              false === l.strictSchema ? r.nil : r._`${a} && !${u}`,
              (function () {
                const e = d.$async
                  ? r._`(${s}.async ? await ${u}(${o}) : ${u}(${o}))`
                  : r._`${u}(${o})`;
                const n = r._`(typeof ${u} == "function" ? ${e} : ${u}.test(${o}))`;
                return r._`${u} && ${u} !== true && ${c} === ${t} && !${n}`;
              })()
            )
          );
        })();
      } else {
        (function () {
          const i = p.formats[s];
          if (!i)
            return void (function () {
              if (false !== l.strictSchema) throw new Error(e());
              function e() {
                return `unknown format "${s}" ignored in schema at path "${u}"`;
              }
              p.logger.warn(e());
            })();
          if (true === i) return;
          const [a, c, h] = (function (e) {
            const t =
              e instanceof RegExp
                ? r.regexpCode(e)
                : l.code.formats
                ? r._`${l.code.formats}${r.getProperty(s)}`
                : undefined;
            const o = n.scopeValue("formats", {
              key: s,
              ref: e,
              code: t,
            });
            return "object" != typeof e || e instanceof RegExp
              ? ["string", e, o]
              : [e.type || "string", e.validate, r._`${o}.validate`];
          })(i);
          if (a === t) {
            e.pass(
              (function () {
                if ("object" == typeof i && !(i instanceof RegExp) && i.async) {
                  if (!d.$async) throw new Error("async format in sync schema");
                  return r._`await ${h}(${o})`;
                }
                return "function" == typeof c
                  ? r._`${h}(${o})`
                  : r._`${h}.test(${o})`;
              })()
            );
          }
        })();
      }
    }
  },
};
exports.default = o;