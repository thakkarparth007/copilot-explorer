Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(3487),
  o = require(6776),
  i = require(4499),
  s = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({
        keyword: e,
        schemaCode: t
      }) {
        const n = "maxLength" === e ? "more" : "fewer";
        return r.str`must NOT have ${n} than ${t} characters`;
      },
      params: ({
        schemaCode: e
      }) => r._`{limit: ${e}}`
    },
    code(e) {
      const {
          keyword: t,
          data: n,
          schemaCode: s,
          it: a
        } = e,
        c = "maxLength" === t ? r.operators.GT : r.operators.LT,
        l = !1 === a.opts.unicode ? r._`${n}.length` : r._`${o.useFunc(e.gen, i.default)}(${n})`;
      e.fail$data(r._`${l} ${c} ${s}`);
    }
  };
exports.default = s;