Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.readTestingGitHubToken = exports.makeTestingCopilotTokenManager =
  undefined;
const r = require("fs"),
  M_copilot_github_auth_stuff = require("copilot-github-auth-stuff");
function readTestingGitHubToken() {
  const e = `${process.env.HOME}/.copilot-testing-gh-token`;
  if (r.existsSync(e)) return r.readFileSync(e).toString();
  throw new Error(
    `Tests: either GH_COPILOT_TOKEN, or GITHUB_TOKEN, must be set, or there must be a GitHub token from an app with access to Copilot in ${e}. Run "npm run get_token" to get one.`
  );
}
exports.makeTestingCopilotTokenManager = function () {
  if (process.env.GH_COPILOT_TOKEN)
    return new M_copilot_github_auth_stuff.FixedCopilotTokenManager({
      token: process.env.GH_COPILOT_TOKEN,
      telemetry: "enabled",
    });
  if (process.env.GITHUB_TOKEN)
    return new M_copilot_github_auth_stuff.CopilotTokenManagerFromGitHubToken({
      token: process.env.GITHUB_TOKEN,
    });
  const e = readTestingGitHubToken();
  process.env.GITHUB_TOKEN = e;
  return new M_copilot_github_auth_stuff.CopilotTokenManagerFromGitHubToken({
    token: e,
  });
};
exports.readTestingGitHubToken = readTestingGitHubToken;
