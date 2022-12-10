const M_async_hook_jl_NOTSURE = require("async-hook-jl");
if (global._asyncHook) {
  if (global._asyncHook.version !== require("version").i8)
    throw new Error("Conflicting version of async-hook-jl found");
  module.exports = global._asyncHook;
} else {
  require("stack-chain").filter.attach(function (e, t) {
    return t.filter(function (e) {
      const t = e.getFileName();
      return !(t && t.slice(0, __dirname.length) === __dirname);
    });
  });
  module.exports = global._asyncHook = new M_async_hook_jl_NOTSURE();
}
