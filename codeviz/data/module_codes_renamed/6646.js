Object.defineProperty(exports, "__esModule", {
  value: !0,
});
const M_schema_ref_utils_maybe = require("schema-ref-utils");
class o extends Error {
  constructor(e, t, n) {
    super(n || `can't resolve reference ${t} from id ${e}`);
    this.missingRef = M_schema_ref_utils_maybe.resolveUrl(e, t);
    this.missingSchema = M_schema_ref_utils_maybe.normalizeId(
      M_schema_ref_utils_maybe.getFullPath(this.missingRef)
    );
  }
}
exports.default = o;
