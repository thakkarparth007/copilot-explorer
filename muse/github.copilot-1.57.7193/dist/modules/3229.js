Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(3487);
const o = require(6776);
const i = require(4499);
const s = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: true,
  error: {
    message({ keyword: e, schemaCode: t }) {
      const n = "maxLength" === e ? "more" : "fewer";
      return r.str`must NOT have ${n} than ${t} characters`;
    },
    params: ({ schemaCode: e }) => r._`{limit: ${e}}`,
  },
  code(e) {
    const { keyword: t, data: n, schemaCode: s, it: a } = e;
    const c = "maxLength" === t ? r.operators.GT : r.operators.LT;
    const l =
      false === a.opts.unicode
        ? r._`${n}.length`
        : r._`${o.useFunc(e.gen, i.default)}(${n})`;
    e.fail$data(r._`${l} ${c} ${s}`);
  },
};
exports.default = s;