const M_os = require("os");
const M_fs = require("fs");
const M_is_docker_maybe = require("is-docker");
const s = () => {
  if ("linux" !== process.platform) return !1;
  if (M_os.release().toLowerCase().includes("microsoft"))
    return !M_is_docker_maybe();
  try {
    return (
      !!M_fs.readFileSync("/proc/version", "utf8")
        .toLowerCase()
        .includes("microsoft") && !M_is_docker_maybe()
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
