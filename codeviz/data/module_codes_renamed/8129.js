Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ExtensionLocationFactory = undefined;
const M_vscode = require("vscode");
const M_location_factory = require("location-factory");
class ExtensionLocationFactory extends M_location_factory.LocationFactory {
  range(e, t, n, o) {
    return undefined !== n && undefined !== o
      ? new M_vscode.Range(e, t, n, o)
      : new M_vscode.Range(e, t);
  }
  position(e, t) {
    return new M_vscode.Position(e, t);
  }
}
exports.ExtensionLocationFactory = ExtensionLocationFactory;
