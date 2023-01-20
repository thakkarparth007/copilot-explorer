if (
  "undefined" == typeof process ||
  "renderer" === process.type ||
  true === process.browser ||
  process.__nwjs
) {
  module.exports = require(1758);
} else {
  module.exports = require(39);
}