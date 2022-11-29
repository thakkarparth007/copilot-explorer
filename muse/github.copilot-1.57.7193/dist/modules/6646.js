Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const r = require(2531);
class o extends Error {
  constructor(e, t, n) {
    super(n || `can't resolve reference ${t} from id ${e}`);
    this.missingRef = r.resolveUrl(e, t);
    this.missingSchema = r.normalizeId(r.getFullPath(this.missingRef));
  }
}
exports.default = o;
