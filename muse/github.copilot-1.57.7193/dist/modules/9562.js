const r = require(9012);
if (process && r.gte(process.versions.node, "8.0.0")) {
  module.exports = require(3964);
} else {
  module.exports = require(4046);
}