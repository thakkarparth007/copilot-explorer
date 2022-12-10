Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_data_type_checker_NOTSURE = require("data-type-checker"),
  M_codegen_NOTSURE = require("codegen"),
  M_ajv_utils_NOTSURE = require("ajv-utils"),
  M_ajv_runtime_equal_NOTSURE = require("ajv-runtime-equal"),
  a = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: e, j: t } }) =>
        M_codegen_NOTSURE.str`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
      params: ({ params: { i: e, j: t } }) =>
        M_codegen_NOTSURE._`{i: ${e}, j: ${t}}`,
    },
    code(e) {
      const {
        gen: t,
        data: n,
        $data: a,
        schema: c,
        parentSchema: l,
        schemaCode: u,
        it: d,
      } = e;
      if (!a && !c) return;
      const p = t.let("valid"),
        h = l.items ? M_data_type_checker_NOTSURE.getSchemaTypes(l.items) : [];
      function f(i, s) {
        const a = t.name("item"),
          c = M_data_type_checker_NOTSURE.checkDataTypes(
            h,
            a,
            d.opts.strictNumbers,
            M_data_type_checker_NOTSURE.DataType.Wrong
          ),
          l = t.const("indices", M_codegen_NOTSURE._`{}`);
        t.for(M_codegen_NOTSURE._`;${i}--;`, () => {
          t.let(a, M_codegen_NOTSURE._`${n}[${i}]`);
          t.if(c, M_codegen_NOTSURE._`continue`);
          if (h.length > 1) {
            t.if(
              M_codegen_NOTSURE._`typeof ${a} == "string"`,
              M_codegen_NOTSURE._`${a} += "_"`
            );
          }
          t.if(M_codegen_NOTSURE._`typeof ${l}[${a}] == "number"`, () => {
            t.assign(s, M_codegen_NOTSURE._`${l}[${a}]`);
            e.error();
            t.assign(p, !1).break();
          }).code(M_codegen_NOTSURE._`${l}[${a}] = ${i}`);
        });
      }
      function m(r, a) {
        const c = M_ajv_utils_NOTSURE.useFunc(
            t,
            M_ajv_runtime_equal_NOTSURE.default
          ),
          l = t.name("outer");
        t.label(l).for(M_codegen_NOTSURE._`;${r}--;`, () =>
          t.for(M_codegen_NOTSURE._`${a} = ${r}; ${a}--;`, () =>
            t.if(M_codegen_NOTSURE._`${c}(${n}[${r}], ${n}[${a}])`, () => {
              e.error();
              t.assign(p, !1).break(l);
            })
          )
        );
      }
      e.block$data(
        p,
        function () {
          const r = t.let("i", M_codegen_NOTSURE._`${n}.length`),
            i = t.let("j");
          e.setParams({
            i: r,
            j: i,
          });
          t.assign(p, !0);
          t.if(M_codegen_NOTSURE._`${r} > 1`, () =>
            (h.length > 0 && !h.some((e) => "object" === e || "array" === e)
              ? f
              : m)(r, i)
          );
        },
        M_codegen_NOTSURE._`${u} === false`
      );
      e.ok(p);
    },
  };
exports.default = a;
