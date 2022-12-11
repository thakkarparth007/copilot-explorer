Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.initProxyEnvironment = undefined;
const M_net = require("net");
const M_url = require("url");
const M_vscode = require("vscode");
exports.initProxyEnvironment = function (e, t) {
  let n =
    M_vscode.workspace.getConfiguration("http").get("proxy") ||
    (function (e) {
      return (
        e.HTTPS_PROXY || e.https_proxy || e.HTTP_PROXY || e.http_proxy || null
      );
    })(t);
  if (n) {
    const t = {};
    const s = M_vscode.workspace
      .getConfiguration("http")
      .get("proxyAuthorization");
    const a = M_vscode.workspace
      .getConfiguration("http")
      .get("proxyStrictSSL", !0);
    if (s) {
      t["Proxy-Authorization"] = s;
    }
    let c = n;
    const l = n.split(":");
    if (l.length > 2) {
      if (n.includes("[")) {
        const e = n.indexOf("[");
        const t = n.indexOf("]");
        c = n.substring(e + 1, t);
      }
    } else c = l[0];
    const u = M_net.isIP(c);
    if (4 === u) {
      n = `https://${n}`;
    } else {
      if (6 === u) {
        if (n.includes("[")) {
          if (n.startsWith("https://")) {
            n = `https://${n}`;
          }
        } else {
          n = `https://[${n}]`;
        }
      }
    }
    const {
      hostname: d,
      port: p,
      username: h,
      password: f,
    } = (function (e) {
      try {
        return new M_url.URL(e);
      } catch (t) {
        throw new Error(`Invalid proxy URL: '${e}'`);
      }
    })(n);
    const m = h && f && `${h}:${f}`;
    e.proxySettings = {
      host: d,
      port: parseInt(p),
      proxyAuth: m,
      headers: t,
      rejectUnauthorized: a,
    };
  }
};
