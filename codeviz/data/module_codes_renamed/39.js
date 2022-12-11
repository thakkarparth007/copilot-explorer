const M_tty = require("tty");
const M_util = require("util");
exports.init = function (e) {
  e.inspectOpts = {};
  const n = Object.keys(exports.inspectOpts);
  for (let r = 0; r < n.length; r++)
    e.inspectOpts[n[r]] = exports.inspectOpts[n[r]];
};
exports.log = function (...e) {
  return process.stderr.write(M_util.format(...e) + "\n");
};
exports.formatArgs = function (n) {
  const { namespace: r, useColors: o } = this;
  if (o) {
    const t = this.color;
    const o = "[3" + (t < 8 ? t : "8;5;" + t);
    const i = `  ${o};1m${r} [0m`;
    n[0] = i + n[0].split("\n").join("\n" + i);
    n.push(o + "m+" + module.exports.humanize(this.diff) + "[0m");
  } else
    n[0] =
      (exports.inspectOpts.hideDate ? "" : new Date().toISOString() + " ") +
      r +
      " " +
      n[0];
};
exports.save = function (e) {
  if (e) {
    process.env.DEBUG = e;
  } else {
    delete process.env.DEBUG;
  }
};
exports.load = function () {
  return process.env.DEBUG;
};
exports.useColors = function () {
  return "colors" in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : M_tty.isatty(process.stderr.fd);
};
exports.destroy = M_util.deprecate(() => {},
"Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
exports.colors = [6, 2, 3, 4, 5, 1];
try {
  const M_color_support_maybe = require("color-support");
  if (
    M_color_support_maybe &&
    (M_color_support_maybe.stderr || M_color_support_maybe).level >= 2
  ) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63,
      68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128,
      129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169,
      170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202,
      203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221,
    ];
  }
} catch (e) {}
exports.inspectOpts = Object.keys(process.env)
  .filter((e) => /^debug_/i.test(e))
  .reduce((e, t) => {
    const n = t
      .substring(6)
      .toLowerCase()
      .replace(/_([a-z])/g, (e, t) => t.toUpperCase());
    let r = process.env[t];
    r =
      !!/^(yes|on|true|enabled)$/i.test(r) ||
      (!/^(no|off|false|disabled)$/i.test(r) &&
        ("null" === r ? null : Number(r)));
    e[n] = r;
    return e;
  }, {});
module.exports = require("debug")(exports);
const { formatters: i } = module.exports;
i.o = function (e) {
  this.inspectOpts.colors = this.useColors;
  return M_util.inspect(e, this.inspectOpts)
    .split("\n")
    .map((e) => e.trim())
    .join(" ");
};
i.O = function (e) {
  this.inspectOpts.colors = this.useColors;
  return M_util.inspect(e, this.inspectOpts);
};
