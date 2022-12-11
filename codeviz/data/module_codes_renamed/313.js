Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.assignDefaults = undefined;
const M_codegen_maybe = require("codegen");
const M_ajv_utils_maybe = require("ajv-utils");
function i(e, t, n) {
  const { gen: i, compositeRule: s, data: a, opts: c } = e;
  if (undefined === n) return;
  const l = M_codegen_maybe._`${a}${M_codegen_maybe.getProperty(t)}`;
  if (s)
    return void M_ajv_utils_maybe.checkStrictMode(
      e,
      `default is ignored for: ${l}`
    );
  let u = M_codegen_maybe._`${l} === undefined`;
  if ("empty" === c.useDefaults) {
    u = M_codegen_maybe._`${u} || ${l} === null || ${l} === ""`;
  }
  i.if(u, M_codegen_maybe._`${l} = ${M_codegen_maybe.stringify(n)}`);
}
exports.assignDefaults = function (e, t) {
  const { properties: n, items: r } = e.schema;
  if ("object" === t && n) for (const t in n) i(e, t, n[t].default);
  else if ("array" === t && Array.isArray(r)) {
    r.forEach((t, n) => i(e, n, t.default));
  }
};
