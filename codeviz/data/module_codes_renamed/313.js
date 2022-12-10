Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.assignDefaults = undefined;
const M_codegen_NOTSURE = require("codegen"),
  M_ajv_utils_NOTSURE = require("ajv-utils");
function i(e, t, n) {
  const { gen: i, compositeRule: s, data: a, opts: c } = e;
  if (undefined === n) return;
  const l = M_codegen_NOTSURE._`${a}${M_codegen_NOTSURE.getProperty(t)}`;
  if (s)
    return void M_ajv_utils_NOTSURE.checkStrictMode(
      e,
      `default is ignored for: ${l}`
    );
  let u = M_codegen_NOTSURE._`${l} === undefined`;
  if ("empty" === c.useDefaults) {
    u = M_codegen_NOTSURE._`${u} || ${l} === null || ${l} === ""`;
  }
  i.if(u, M_codegen_NOTSURE._`${l} = ${M_codegen_NOTSURE.stringify(n)}`);
}
exports.assignDefaults = function (e, t) {
  const { properties: n, items: r } = e.schema;
  if ("object" === t && n) for (const t in n) i(e, t, n[t].default);
  else if ("array" === t && Array.isArray(r)) {
    r.forEach((t, n) => i(e, n, t.default));
  }
};
