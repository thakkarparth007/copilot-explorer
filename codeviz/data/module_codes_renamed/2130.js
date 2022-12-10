const r = require("os"),
  M_has_flag_NOTSURE = require("has-flag"),
  i = process.env;
let s;
function a(e) {
  const t = (function (e) {
    if (!1 === s) return 0;
    if (
      M_has_flag_NOTSURE("color=16m") ||
      M_has_flag_NOTSURE("color=full") ||
      M_has_flag_NOTSURE("color=truecolor")
    )
      return 3;
    if (M_has_flag_NOTSURE("color=256")) return 2;
    if (e && !e.isTTY && !0 !== s) return 0;
    const t = s ? 1 : 0;
    if ("win32" === process.platform) {
      const e = r.release().split(".");
      return Number(process.versions.node.split(".")[0]) >= 8 &&
        Number(e[0]) >= 10 &&
        Number(e[2]) >= 10586
        ? Number(e[2]) >= 14931
          ? 3
          : 2
        : 1;
    }
    if ("CI" in i)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some(
        (e) => e in i
      ) || "codeship" === i.CI_NAME
        ? 1
        : t;
    if ("TEAMCITY_VERSION" in i)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(i.TEAMCITY_VERSION) ? 1 : 0;
    if ("truecolor" === i.COLORTERM) return 3;
    if ("TERM_PROGRAM" in i) {
      const e = parseInt((i.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (i.TERM_PROGRAM) {
        case "iTerm.app":
          return e >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(i.TERM)
      ? 2
      : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
          i.TERM
        ) || "COLORTERM" in i
      ? 1
      : (i.TERM, t);
  })(e);
  return (function (e) {
    return (
      0 !== e && {
        level: e,
        hasBasic: !0,
        has256: e >= 2,
        has16m: e >= 3,
      }
    );
  })(t);
}
if (
  M_has_flag_NOTSURE("no-color") ||
  M_has_flag_NOTSURE("no-colors") ||
  M_has_flag_NOTSURE("color=false")
) {
  s = !1;
} else {
  if (
    M_has_flag_NOTSURE("color") ||
    M_has_flag_NOTSURE("colors") ||
    M_has_flag_NOTSURE("color=true") ||
    M_has_flag_NOTSURE("color=always")
  ) {
    s = !0;
  }
}
if ("FORCE_COLOR" in i) {
  s = 0 === i.FORCE_COLOR.length || 0 !== parseInt(i.FORCE_COLOR, 10);
}
module.exports = {
  supportsColor: a,
  stdout: a(process.stdout),
  stderr: a(process.stderr),
};
