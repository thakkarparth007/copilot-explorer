Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.RealUrlOpener = exports.UrlOpener = undefined;
const M_open_maybe = require("open");
exports.UrlOpener = class {};
exports.RealUrlOpener = class {
  async open(e) {
    await M_open_maybe(e);
  }
};
