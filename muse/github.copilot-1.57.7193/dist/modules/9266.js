var r = require(3905),
  o = require(9073);
module.exports = function (e) {
  var t = r(e);
  t.token = "";
  if ("x-oauth-basic" === t.password) {
    t.token = t.user;
  } else {
    if ("x-token-auth" === t.user) {
      t.token = t.password;
    }
  }
  if (o(t.protocols) || (0 === t.protocols.length && o(e))) {
    t.protocol = "ssh";
  } else {
    if (t.protocols.length) {
      t.protocol = t.protocols[0];
    } else {
      t.protocol = "file";
      t.protocols = ["file"];
    }
  }
  t.href = t.href.replace(/\/$/, "");
  return t;
};
