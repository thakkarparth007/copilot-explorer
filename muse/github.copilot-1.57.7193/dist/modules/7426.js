Object.defineProperty(exports, "__esModule", {
  value: true,
});
class n extends Error {
  constructor(e) {
    super("validation failed");
    this.errors = e;
    this.ajv = this.validation = true;
  }
}
exports.default = n;