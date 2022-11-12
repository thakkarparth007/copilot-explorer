var r = require(2337);
module.exports = function e(t) {
  if (Array.isArray(t)) return -1 !== t.indexOf("ssh") || -1 !== t.indexOf("rsync");
  if ("string" != typeof t) return !1;
  var n = r(t);
  t = t.substring(t.indexOf("://") + 3);
  if (e(n)) return !0;
  var o = new RegExp(".([a-zA-Z\\d]+):(\\d+)/");
  return !t.match(o) && t.indexOf("@") < t.indexOf(":");
};