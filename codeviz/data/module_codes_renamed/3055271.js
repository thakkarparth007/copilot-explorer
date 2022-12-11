Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.defaultFileSystem = exports.FileSystem = undefined;
const M_fs = require("fs");
exports.FileSystem = class {};
exports.defaultFileSystem = {
  readFile: (e) => M_fs.promises.readFile(e),
  mtime: async (e) => (await M_fs.promises.stat(e)).mtimeMs,
  async stat(e) {
    const t = await M_fs.promises.stat(e);
    return {
      ctime: t.ctimeMs,
      mtime: t.mtimeMs,
      size: t.size,
    };
  },
};
