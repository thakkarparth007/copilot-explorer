Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(3487),
  o = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({
        keyword: e,
        schemaCode: t
      }) {
        const n = "maxProperties" === e ? "more" : "fewer";
        return r.str`must NOT have ${n} than ${t} items`;
      },
      params: ({
        schemaCode: e
      }) => r._`{limit: ${e}}`
    },
    code(e) {
      const {
          keyword: t,
          data: n,
          schemaCode: o
        } = e,
        i = "maxProperties" === t ? r.operators.GT : r.operators.LT;
      e.fail$data(r._`Object.keys(${n}).length ${i} ${o}`);
    }
  };
exports.default = o;