Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.extensionFileSystem = undefined;
const M_vscode = require("vscode");
exports.extensionFileSystem = {
  readFile: async function (e) {
    return await M_vscode.workspace.fs.readFile(M_vscode.Uri.file(e));
  },
  mtime: async function (e) {
    return (await M_vscode.workspace.fs.stat(M_vscode.Uri.file(e))).mtime;
  },
  stat: async function (e) {
    return await M_vscode.workspace.fs.stat(M_vscode.Uri.file(e));
  },
};
