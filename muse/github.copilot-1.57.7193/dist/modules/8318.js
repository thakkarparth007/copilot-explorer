const r = require(1017),
  o = require(2081),
  {
    promises: i,
    constants: s
  } = require(7147),
  a = require(2818),
  c = require(1595),
  l = require(1906),
  u = r.join(__dirname, "xdg-open"),
  {
    platform: d,
    arch: p
  } = process,
  h = (() => {
    const e = "/mnt/";
    let t;
    return async function () {
      if (t) return t;
      const n = "/etc/wsl.conf";
      let r = !1;
      try {
        await i.access(n, s.F_OK);
        r = !0;
      } catch {}
      if (!r) return e;
      const o = await i.readFile(n, {
          encoding: "utf8"
        }),
        a = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(o);
      return a ? (t = a.groups.mountPoint.trim(), t = t.endsWith("/") ? t : `${t}/`, t) : e;
    };
  })(),
  f = async (e, t) => {
    let n;
    for (const r of e) try {
      return await t(r);
    } catch (e) {
      n = e;
    }
    throw n;
  },
  m = async e => {
    e = {
      wait: !1,
      background: !1,
      newInstance: !1,
      allowNonzeroExitCode: !1,
      ...e
    };
    if (Array.isArray(e.app)) return f(e.app, t => m({
      ...e,
      app: t
    }));
    let t,
      {
        name: n,
        arguments: r = []
      } = e.app || {};
    r = [...r];
    if (Array.isArray(n)) return f(n, t => m({
      ...e,
      app: {
        name: t,
        arguments: r
      }
    }));
    const l = [],
      p = {};
    if ("darwin" === d) {
      t = "open";
      e.wait && l.push("--wait-apps");
      e.background && l.push("--background");
      e.newInstance && l.push("--new");
      n && l.push("-a", n);
    } else if ("win32" === d || a && !c()) {
      const o = await h();
      t = a ? `${o}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` : `${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`;
      l.push("-NoProfile", "-NonInteractive", "–ExecutionPolicy", "Bypass", "-EncodedCommand");
      a || (p.windowsVerbatimArguments = !0);
      const i = ["Start"];
      e.wait && i.push("-Wait");
      n ? (i.push(`"\`"${n}\`""`, "-ArgumentList"), e.target && r.unshift(e.target)) : e.target && i.push(`"${e.target}"`);
      r.length > 0 && (r = r.map(e => `"\`"${e}\`""`), i.push(r.join(",")));
      e.target = Buffer.from(i.join(" "), "utf16le").toString("base64");
    } else {
      if (n) t = n;else {
        const e = "/" === __dirname;
        let n = !1;
        try {
          await i.access(u, s.X_OK);
          n = !0;
        } catch {}
        t = process.versions.electron || "android" === d || e || !n ? "xdg-open" : u;
      }
      r.length > 0 && l.push(...r);
      e.wait || (p.stdio = "ignore", p.detached = !0);
    }
    e.target && l.push(e.target);
    "darwin" === d && r.length > 0 && l.push("--args", ...r);
    const g = o.spawn(t, l, p);
    return e.wait ? new Promise((t, n) => {
      g.once("error", n);
      g.once("close", r => {
        e.allowNonzeroExitCode && r > 0 ? n(new Error(`Exited with code ${r}`)) : t(g);
      });
    }) : (g.unref(), g);
  },
  g = (e, t) => {
    if ("string" != typeof e) throw new TypeError("Expected a `target`");
    return m({
      ...t,
      target: e
    });
  };
function _(e) {
  if ("string" == typeof e || Array.isArray(e)) return e;
  const {
    [p]: t
  } = e;
  if (!t) throw new Error(`${p} is not supported`);
  return t;
}
function y({
  [d]: e
}, {
  wsl: t
}) {
  if (t && a) return _(t);
  if (!e) throw new Error(`${d} is not supported`);
  return _(e);
}
const v = {};
l(v, "chrome", () => y({
  darwin: "google chrome",
  win32: "chrome",
  linux: ["google-chrome", "google-chrome-stable", "chromium"]
}, {
  wsl: {
    ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
  }
}));
l(v, "firefox", () => y({
  darwin: "firefox",
  win32: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
  linux: "firefox"
}, {
  wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
}));
l(v, "edge", () => y({
  darwin: "microsoft edge",
  win32: "msedge",
  linux: ["microsoft-edge", "microsoft-edge-dev"]
}, {
  wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
}));
g.apps = v;
g.openApp = (e, t) => {
  if ("string" != typeof e) throw new TypeError("Expected a `name`");
  const {
    arguments: n = []
  } = t || {};
  if (null != n && !Array.isArray(n)) throw new TypeError("Expected `appArguments` as Array type");
  return m({
    ...t,
    app: {
      name: e,
      arguments: n
    }
  });
};
module.exports = g;