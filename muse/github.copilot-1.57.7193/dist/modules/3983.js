Object.defineProperty(exports, "__esModule", {
  value: !0
});
const r = require(3487),
  o = r.operators,
  i = {
    maximum: {
      okStr: "<=",
      ok: o.LTE,
      fail: o.GT
    },
    minimum: {
      okStr: ">=",
      ok: o.GTE,
      fail: o.LT
    },
    exclusiveMaximum: {
      okStr: "<",
      ok: o.LT,
      fail: o.GTE
    },
    exclusiveMinimum: {
      okStr: ">",
      ok: o.GT,
      fail: o.LTE
    }
  },
  s = {
    message: ({
      keyword: e,
      schemaCode: t
    }) => r.str`must be ${i[e].okStr} ${t}`,
    params: ({
      keyword: e,
      schemaCode: t
    }) => r._`{comparison: ${i[e].okStr}, limit: ${t}}`
  },
  a = {
    keyword: Object.keys(i),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: s,
    code(e) {
      const {
        keyword: t,
        data: n,
        schemaCode: o
      } = e;
      e.fail$data(r._`${n} ${i[t].fail} ${o} || isNaN(${n})`);
    }
  };
exports.default = a;