function shouldUseGroup(e, t) {
  return t.rules.some((t) => shouldUseRule(e, t));
}
function shouldUseRule(e, t) {
  var n;
  return (
    undefined !== e[t.keyword] ||
    (null === (n = t.definition.implements) || undefined === n
      ? undefined
      : n.some((t) => undefined !== e[t]))
  );
}
Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.shouldUseRule =
  exports.shouldUseGroup =
  exports.schemaHasRulesForType =
    undefined;
exports.schemaHasRulesForType = function ({ schema: e, self: t }, r) {
  const o = t.RULES.types[r];
  return o && true !== o && shouldUseGroup(e, o);
};
exports.shouldUseGroup = shouldUseGroup;
exports.shouldUseRule = shouldUseRule;