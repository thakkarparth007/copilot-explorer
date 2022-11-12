function n(e, t) {
  return t.rules.some(t => r(e, t));
}
function r(e, t) {
  var n;
  return undefined !== e[t.keyword] || (null === (n = t.definition.implements) || undefined === n ? undefined : n.some(t => undefined !== e[t]));
}
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = undefined;
exports.schemaHasRulesForType = function ({
  schema: e,
  self: t
}, r) {
  const o = t.RULES.types[r];
  return o && !0 !== o && n(e, o);
};
exports.shouldUseGroup = n;
exports.shouldUseRule = r;