module.exports = function (e, t) {
  var n = [];
  n.push(
    (function (e) {
      try {
        return Error.prototype.toString.call(e);
      } catch (e) {
        try {
          return "<error: " + e + ">";
        } catch (e) {
          return "<error>";
        }
      }
    })(e)
  );
  for (var r = 0; r < t.length; r++) {
    var o,
      i = t[r];
    try {
      o = i.toString();
    } catch (e) {
      try {
        o = "<error: " + e + ">";
      } catch (e) {
        o = "<error>";
      }
    }
    n.push("    at " + o);
  }
  return n.join("\n");
};