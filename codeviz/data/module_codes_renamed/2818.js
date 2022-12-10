const r = require("os"),
  o = require("fs"),
  M_is_docker_NOTSURE = require("is-docker"),
  s = () => {
    if ("linux" !== process.platform) return !1;
    if (r.release().toLowerCase().includes("microsoft"))
      return !M_is_docker_NOTSURE();
    try {
      return (
        !!o
          .readFileSync("/proc/version", "utf8")
          .toLowerCase()
          .includes("microsoft") && !M_is_docker_NOTSURE()
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
