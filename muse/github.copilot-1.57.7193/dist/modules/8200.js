Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(4783);
const o = require(2924);
const i = require(4665);
const s = require(1119);
const a = require(9864);
const c = require(7772);
const l = require(3708);
const u = require(9351);
const d = require(6239);
const p = require(2296);
const h = require(5697);
const f = require(19);
const m = require(4200);
const g = require(1125);
const _ = require(9434);
const y = require(6552);
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