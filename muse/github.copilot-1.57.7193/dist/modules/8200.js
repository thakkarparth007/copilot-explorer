Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(4783),
  o = require(2924),
  i = require(4665),
  s = require(1119),
  a = require(9864),
  c = require(7772),
  l = require(3708),
  u = require(9351),
  d = require(6239),
  p = require(2296),
  h = require(5697),
  f = require(19),
  m = require(4200),
  g = require(1125),
  _ = require(9434),
  y = require(6552);
exports.default = function (e = !1) {
  const t = [
    h.default,
    f.default,
    m.default,
    g.default,
    _.default,
    y.default,
    l.default,
    u.default,
    c.default,
    d.default,
    p.default,
  ];
  if (e) {
    t.push(o.default, s.default);
  } else {
    t.push(r.default, i.default);
  }
  t.push(a.default);
  return t;
};