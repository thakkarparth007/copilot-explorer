Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.RealUrlOpener = exports.UrlOpener = undefined;
const r = require(8318);
exports.UrlOpener = class {};
exports.RealUrlOpener = class {
  async open(e) {
    await r(e);
  }
};