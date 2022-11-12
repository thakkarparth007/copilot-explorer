Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = undefined;
const r = require(4181),
  o = require(3487),
  i = require(2141),
  s = {
    message: "boolean schema is false"
  };
function a(e, t) {
  const {
      gen: n,
      data: o
    } = e,
    i = {
      gen: n,
      keyword: "false schema",
      data: o,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: e
    };
  r.reportError(i, s, undefined, t);
}
exports.topBoolOrEmptySchema = function (e) {
  const {
    gen: t,
    schema: n,
    validateName: r
  } = e;
  !1 === n ? a(e, !1) : "object" == typeof n && !0 === n.$async ? t.return(i.default.data) : (t.assign(o._`${r}.errors`, null), t.return(!0));
};
exports.boolOrEmptySchema = function (e, t) {
  const {
    gen: n,
    schema: r
  } = e;
  !1 === r ? (n.var(t, !1), a(e)) : n.var(t, !0);
};