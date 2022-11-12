const r = require(2037),
  o = require(7147),
  i = require(1595),
  s = () => {
    if ("linux" !== process.platform) return !1;
    if (r.release().toLowerCase().includes("microsoft")) return !i();
    try {
      return !!o.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") && !i();
    } catch (e) {
      return !1;
    }
  };
process.env.__IS_WSL_TEST__ ? module.exports = s : module.exports = s();