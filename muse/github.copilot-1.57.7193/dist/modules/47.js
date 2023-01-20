Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getGithubAccount = exports.getSession = undefined;
const r = require("vscode");
const o = ["read:user"];
let i;
let s = false;
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
  return r.authentication.getSession("github", o, {
    createIfNone: e,
  });
}
exports.getSession = async function () {
  let e = await a(false);
  if (e || s) {
    s = true;
    if (
      "Sign in to GitHub" ===
      (await r.window.showInformationMessage(
        "Sign in to access GitHub Copilot.",
        "Sign in to GitHub"
      ))
    ) {
      e = await a(true);
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