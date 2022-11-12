Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.getGithubAccount = exports.getSession = undefined;
const r = require(9496),
  o = ["read:user"];
let i,
  s = !1;
function a(e) {
  if ("true" === process.env.CODESPACES && process.env.GITHUB_TOKEN) {
    const e = process.env.GITHUB_USER || "codespace-user",
      t = {
        accessToken: process.env.GITHUB_TOKEN,
        account: {
          label: e
        }
      };
    return Promise.resolve(t);
  }
  return r.authentication.getSession("github", o, {
    createIfNone: e
  });
}
exports.getSession = async function () {
  let e = await a(!1);
  e || s || (s = !0, "Sign in to GitHub" === (await r.window.showInformationMessage("Sign in to access GitHub Copilot.", "Sign in to GitHub")) && (e = await a(!0)));
  e && (i = e.account);
  return e;
};
exports.getGithubAccount = function () {
  return i;
};