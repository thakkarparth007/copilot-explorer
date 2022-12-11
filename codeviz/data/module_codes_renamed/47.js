Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getGithubAccount = exports.getSession = undefined;
const M_vscode = require("vscode");
const o = ["read:user"];
let i;
let s = !1;
function a(e) {
  if ("true" === process.env.CODESPACES && process.env.GITHUB_TOKEN) {
    const e = process.env.GITHUB_USER || "codespace-user";
    const t = {
      accessToken: process.env.GITHUB_TOKEN,
      account: {
        label: e,
      },
    };
    return Promise.resolve(t);
  }
  return M_vscode.authentication.getSession("github", o, {
    createIfNone: e,
  });
}
exports.getSession = async function () {
  let e = await a(!1);
  if (e || s) {
    s = !0;
    if (
      "Sign in to GitHub" ===
      (await M_vscode.window.showInformationMessage(
        "Sign in to access GitHub Copilot.",
        "Sign in to GitHub"
      ))
    ) {
      e = await a(!0);
    }
  }
  if (e) {
    i = e.account;
  }
  return e;
};
exports.getGithubAccount = function () {
  return i;
};
