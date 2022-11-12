Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.extensionFileSystem = undefined;
const r = require(9496);
exports.extensionFileSystem = {
  readFile: async function (e) {
    return await r.workspace.fs.readFile(r.Uri.file(e));
  },
  mtime: async function (e) {
    return (await r.workspace.fs.stat(r.Uri.file(e))).mtime;
  },
  stat: async function (e) {
    return await r.workspace.fs.stat(r.Uri.file(e));
  }
};