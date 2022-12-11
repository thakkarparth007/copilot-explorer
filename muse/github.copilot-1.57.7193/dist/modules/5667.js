Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = undefined;
const r = require(4181);
const o = require(3487);
const i = require(2141);
const s = {
  message: "boolean schema is false",
};
function a(e, t) {
  const { gen: n, data: o } = e;
  const i = {
    gen: n,
    keyword: "false schema",
    data: o,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e,
  };
  r.reportError(i, s, undefined, t);
}
exports.topBoolOrEmptySchema = function (e) {
  const { gen: t, schema: n, validateName: r } = e;
  if (!1 === n) {
    a(e, !1);
  } else {
    if ("object" == typeof n && !0 === n.$async) {
      t.return(i.default.data);
    } else {
      t.assign(o._`${r}.errors`, null);
      t.return(!0);
    }
  }
};
exports.boolOrEmptySchema = function (e, t) {
  const { gen: n, schema: r } = e;
  if (!1 === r) {
    n.var(t, !1);
    a(e);
  } else {
    n.var(t, !0);
  }
};