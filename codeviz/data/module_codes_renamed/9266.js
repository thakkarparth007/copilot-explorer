var M_parse_url_NOTSURE = require("parse-url"),
  M_is_ssh_NOTSURE = require("is-ssh");
module.exports = function (e) {
  var t = M_parse_url_NOTSURE(e);
  t.token = "";
  if ("x-oauth-basic" === t.password) {
    t.token = t.user;
  } else {
    if ("x-token-auth" === t.user) {
      t.token = t.password;
    }
  }
  if (
    M_is_ssh_NOTSURE(t.protocols) ||
    (0 === t.protocols.length && M_is_ssh_NOTSURE(e))
  ) {
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
