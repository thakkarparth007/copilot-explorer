Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.assignDefaults = undefined;
const r = require(3487),
  o = require(6776);
function i(e, t, n) {
  const {
    gen: i,
    compositeRule: s,
    data: a,
    opts: c
  } = e;
  if (undefined === n) return;
  const l = r._`${a}${r.getProperty(t)}`;
  if (s) return void o.checkStrictMode(e, `default is ignored for: ${l}`);
  let u = r._`${l} === undefined`;
  "empty" === c.useDefaults && (u = r._`${u} || ${l} === null || ${l} === ""`);
  i.if(u, r._`${l} = ${r.stringify(n)}`);
}
exports.assignDefaults = function (e, t) {
  const {
    properties: n,
    items: r
  } = e.schema;
  if ("object" === t && n) for (const t in n) i(e, t, n[t].default);else "array" === t && Array.isArray(r) && r.forEach((t, n) => i(e, n, t.default));
};