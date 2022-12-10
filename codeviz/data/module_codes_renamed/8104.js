if (
  "undefined" == typeof process ||
  "renderer" === process.type ||
  !0 === process.browser ||
  process.__nwjs
) {
  module.exports = require("debug");
} else {
  module.exports = require("debug");
}
