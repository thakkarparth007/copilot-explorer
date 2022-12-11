const M_fs = require("fs");
let o;
module.exports = () => (
  undefined === o &&
    (o =
      (function () {
        try {
          M_fs.statSync("/.dockerenv");
          return !0;
        } catch (e) {
          return !1;
        }
      })() ||
      (function () {
        try {
          return M_fs.readFileSync("/proc/self/cgroup", "utf8").includes(
            "docker"
          );
        } catch (e) {
          return !1;
        }
      })()),
  o
);
