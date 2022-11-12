const r = require(7147);
let o;
module.exports = () => (undefined === o && (o = function () {
  try {
    r.statSync("/.dockerenv");
    return !0;
  } catch (e) {
    return !1;
  }
}() || function () {
  try {
    return r.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
  } catch (e) {
    return !1;
  }
}()), o);