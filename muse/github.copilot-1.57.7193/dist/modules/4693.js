Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(3487),
  o = require(6776),
  i = require(3510),
  s = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({
        schemaCode: e
      }) => r._`{allowedValue: ${e}}`
    },
    code(e) {
      const {
        gen: t,
        data: n,
        $data: s,
        schemaCode: a,
        schema: c
      } = e;
      s || c && "object" == typeof c ? e.fail$data(r._`!${o.useFunc(t, i.default)}(${n}, ${a})`) : e.fail(r._`${c} !== ${n}`);
    }
  };
exports.default = s;