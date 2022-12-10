Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ExtensionLocationFactory = undefined;
const r = require("vscode"),
  M_location_factory = require("location-factory");
class ExtensionLocationFactory extends M_location_factory.LocationFactory {
  range(e, t, n, o) {
    return undefined !== n && undefined !== o
      ? new r.Range(e, t, n, o)
      : new r.Range(e, t);
  }
  position(e, t) {
    return new r.Position(e, t);
  }
}
exports.ExtensionLocationFactory = ExtensionLocationFactory;
