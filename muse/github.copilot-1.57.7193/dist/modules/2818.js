const r = require("os");
const o = require("fs");
const i = require(1595);
const s = () => {
  if ("linux" !== process.platform) return false;
  if (r.release().toLowerCase().includes("microsoft")) return !i();
  try {
    return (
      !!o
        .readFileSync("/proc/version", "utf8")
        .toLowerCase()
        .includes("microsoft") && !i()
    );
  } catch (e) {
    return false;
  }
};
if (process.env.__IS_WSL_TEST__) {
  module.exports = s;
} else {
  module.exports = s();
}