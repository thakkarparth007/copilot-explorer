const r = require("fs");
let o;
module.exports = () => (
  undefined === o &&
    (o =
      (function () {
        try {
          r.statSync("/.dockerenv");
          return true;
        } catch (e) {
          return false;
        }
      })() ||
      (function () {
        try {
          return r.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
        } catch (e) {
          return false;
        }
      })()),
  o
);