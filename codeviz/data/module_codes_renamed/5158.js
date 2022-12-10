var M_quickpulse_constants_NOTSURE = require("quickpulse-constants"),
  o = (function () {
    function e() {}
    e.parse = function (t) {
      if (!t) return {};
      var n = t.split(e._FIELDS_SEPARATOR).reduce(function (t, n) {
        var r = n.split(e._FIELD_KEY_VALUE_SEPARATOR);
        if (2 === r.length) {
          var o = r[0].toLowerCase(),
            i = r[1];
          t[o] = i;
        }
        return t;
      }, {});
      if (Object.keys(n).length > 0) {
        if (n.endpointsuffix) {
          var o = n.location ? n.location + "." : "";
          n.ingestionendpoint =
            n.ingestionendpoint || "https://" + o + "dc." + n.endpointsuffix;
          n.liveendpoint =
            n.liveendpoint || "https://" + o + "live." + n.endpointsuffix;
        }
        n.ingestionendpoint =
          n.ingestionendpoint ||
          M_quickpulse_constants_NOTSURE.DEFAULT_BREEZE_ENDPOINT;
        n.liveendpoint =
          n.liveendpoint ||
          M_quickpulse_constants_NOTSURE.DEFAULT_LIVEMETRICS_ENDPOINT;
      }
      return n;
    };
    e._FIELDS_SEPARATOR = ";";
    e._FIELD_KEY_VALUE_SEPARATOR = "=";
    return e;
  })();
module.exports = o;
