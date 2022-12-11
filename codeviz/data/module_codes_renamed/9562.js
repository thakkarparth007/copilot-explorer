const M_semver_maybe = require("semver");
if (process && M_semver_maybe.gte(process.versions.node, "8.0.0")) {
  module.exports = require("cls-hooked");
} else {
  module.exports = require("cls-hooked");
}
