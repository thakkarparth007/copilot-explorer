Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(453);
const o = require(3487);
const i = require(6776);
const s = require(3510);
const a = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: true,
  error: {
    message: ({ params: { i: e, j: t } }) =>
      o.str`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
    params: ({ params: { i: e, j: t } }) => o._`{i: ${e}, j: ${t}}`,
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
    const h = l.items ? r.getSchemaTypes(l.items) : [];
    function f(i, s) {
      const a = t.name("item");
      const c = r.checkDataTypes(h, a, d.opts.strictNumbers, r.DataType.Wrong);
      const l = t.const("indices", o._`{}`);
      t.for(o._`;${i}--;`, () => {
        t.let(a, o._`${n}[${i}]`);
        t.if(c, o._`continue`);
        if (h.length > 1) {
          t.if(o._`typeof ${a} == "string"`, o._`${a} += "_"`);
        }
        t.if(o._`typeof ${l}[${a}] == "number"`, () => {
          t.assign(s, o._`${l}[${a}]`);
          e.error();
          t.assign(p, false).break();
        }).code(o._`${l}[${a}] = ${i}`);
      });
    }
    function m(r, a) {
      const c = i.useFunc(t, s.default);
      const l = t.name("outer");
      t.label(l).for(o._`;${r}--;`, () =>
        t.for(o._`${a} = ${r}; ${a}--;`, () =>
          t.if(o._`${c}(${n}[${r}], ${n}[${a}])`, () => {
            e.error();
            t.assign(p, false).break(l);
          })
        )
      );
    }
    e.block$data(
      p,
      function () {
        const r = t.let("i", o._`${n}.length`);
        const i = t.let("j");
        e.setParams({
          i: r,
          j: i,
        });
        t.assign(p, true);
        t.if(o._`${r} > 1`, () =>
          (h.length > 0 && !h.some((e) => "object" === e || "array" === e)
            ? f
            : m)(r, i)
        );
      },
      o._`${u} === false`
    );
    e.ok(p);
  },
};
exports.default = a;