Object.defineProperty(exports, "__esModule", {
  value: true,
});
const r = require(3487);
const o = require(6776);
const i = require(3510);
const s = {
  keyword: "const",
  $data: true,
  error: {
    message: "must be equal to constant",
    params: ({ schemaCode: e }) => r._`{allowedValue: ${e}}`,
  },
  code(e) {
    const { gen: t, data: n, $data: s, schemaCode: a, schema: c } = e;
    if (s || (c && "object" == typeof c)) {
      e.fail$data(r._`!${o.useFunc(t, i.default)}(${n}, ${a})`);
    } else {
      e.fail(r._`${c} !== ${n}`);
    }
  },
};
exports.default = s;