const r = require("os"),
  o = require("fs"),
  i = require(1595),
  s = () => {
    if ("linux" !== process.platform) return !1;
    if (r.release().toLowerCase().includes("microsoft")) return !i();
    try {
      return (
        !!o
          .readFileSync("/proc/version", "utf8")
          .toLowerCase()
          .includes("microsoft") && !i()
      );
    } catch (e) {
      return !1;
    }
  };
if (process.env.__IS_WSL_TEST__) {
  module.exports = s;
} else {
  module.exports = s();
}