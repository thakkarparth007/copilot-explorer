var r = require(3905),
  o = require(9073);
module.exports = function (e) {
  var t = r(e);
  t.token = "";
  "x-oauth-basic" === t.password ? t.token = t.user : "x-token-auth" === t.user && (t.token = t.password);
  o(t.protocols) || 0 === t.protocols.length && o(e) ? t.protocol = "ssh" : t.protocols.length ? t.protocol = t.protocols[0] : (t.protocol = "file", t.protocols = ["file"]);
  t.href = t.href.replace(/\/$/, "");
  return t;
};