Object.defineProperty(exports, "__esModule", {
  value: true,
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
    schema: false,
    schemaCode: false,
    schemaValue: false,
    params: {},
    it: e,
  };
  r.reportError(i, s, undefined, t);
}
exports.topBoolOrEmptySchema = function (e) {
  const { gen: t, schema: n, validateName: r } = e;
  if (false === n) {
    a(e, false);
  } else {
    if ("object" == typeof n && true === n.$async) {
      t.return(i.default.data);
    } else {
      t.assign(o._`${r}.errors`, null);
      t.return(true);
    }
  }
};
exports.boolOrEmptySchema = function (e, t) {
  const { gen: n, schema: r } = e;
  if (false === r) {
    n.var(t, false);
    a(e);
  } else {
    n.var(t, true);
  }
};