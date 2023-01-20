Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.initProxyEnvironment = undefined;
const r = require("net");
const o = require("url");
const i = require("vscode");
exports.initProxyEnvironment = function (e, t) {
  let n =
    i.workspace.getConfiguration("http").get("proxy") ||
    (function (e) {
      return (
        e.HTTPS_PROXY || e.https_proxy || e.HTTP_PROXY || e.http_proxy || null
      );
    })(t);
  if (n) {
    const t = {};
    const s = i.workspace.getConfiguration("http").get("proxyAuthorization");
    const a = i.workspace.getConfiguration("http").get("proxyStrictSSL", true);
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
    const u = r.isIP(c);
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
        return new o.URL(e);
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