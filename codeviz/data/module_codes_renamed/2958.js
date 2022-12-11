Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_data_type_checker_maybe = require("data-type-checker");
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
const M_ajv_runtime_equal_maybe = require("ajv-runtime-equal");
const a = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: {
    message: ({ params: { i: e, j: t } }) =>
      M_codegen_maybe.str`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
    params: ({ params: { i: e, j: t } }) =>
      M_codegen_maybe._`{i: ${e}, j: ${t}}`,
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
    const p = t.let("valid");
    const h = l.items ? M_data_type_checker_maybe.getSchemaTypes(l.items) : [];
    function f(i, s) {
      const a = t.name("item");
      const c = M_data_type_checker_maybe.checkDataTypes(
        h,
        a,
        d.opts.strictNumbers,
        M_data_type_checker_maybe.DataType.Wrong
      );
      const l = t.const("indices", M_codegen_maybe._`{}`);
      t.for(M_codegen_maybe._`;${i}--;`, () => {
        t.let(a, M_codegen_maybe._`${n}[${i}]`);
        t.if(c, M_codegen_maybe._`continue`);
        if (h.length > 1) {
          t.if(
            M_codegen_maybe._`typeof ${a} == "string"`,
            M_codegen_maybe._`${a} += "_"`
          );
        }
        t.if(M_codegen_maybe._`typeof ${l}[${a}] == "number"`, () => {
          t.assign(s, M_codegen_maybe._`${l}[${a}]`);
          e.error();
          t.assign(p, !1).break();
        }).code(M_codegen_maybe._`${l}[${a}] = ${i}`);
      });
    }
    function m(r, a) {
      const c = M_ajv_utils_maybe.useFunc(t, M_ajv_runtime_equal_maybe.default);
      const l = t.name("outer");
      t.label(l).for(M_codegen_maybe._`;${r}--;`, () =>
        t.for(M_codegen_maybe._`${a} = ${r}; ${a}--;`, () =>
          t.if(M_codegen_maybe._`${c}(${n}[${r}], ${n}[${a}])`, () => {
            e.error();
            t.assign(p, !1).break(l);
          })
        )
      );
    }
    e.block$data(
      p,
      function () {
        const r = t.let("i", M_codegen_maybe._`${n}.length`);
        const i = t.let("j");
        e.setParams({
          i: r,
          j: i,
        });
        t.assign(p, !0);
        t.if(M_codegen_maybe._`${r} > 1`, () =>
          (h.length > 0 && !h.some((e) => "object" === e || "array" === e)
            ? f
            : m)(r, i)
        );
      },
      M_codegen_maybe._`${u} === false`
    );
    e.ok(p);
  },
};
exports.default = a;
