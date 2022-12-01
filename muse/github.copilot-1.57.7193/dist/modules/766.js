Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.ComputationStatus =
  exports.getRepoUrlFromConfigText =
  exports.parseRepoUrl =
  exports.extractRepoInfoForTesting =
  exports.extractRepoInfoInBackground =
  exports.tryGetGitHubNWO =
  exports.getDogFood =
  exports.Dogfood =
  exports.getUserKind =
  exports.isNotRepo =
  exports.isRepoInfo =
    undefined;
const r = require(3055563),
  o = require(3458),
  i = require("path"),
  s = require(362),
  a = require(3076);
var c;
function tryGetGitHubNWO(e) {
  if (undefined !== e && e !== f.PENDING)
    return "github.com" === e.hostname ? e.owner + "/" + e.repo : undefined;
}
exports.isRepoInfo = function (e) {
  return undefined !== e && e !== f.PENDING;
};
exports.isNotRepo = function (e) {
  return undefined === e;
};
exports.getUserKind = async function (e) {
  var t, n;
  const r =
    null !==
      (t = (await e.get(s.CopilotTokenManager).getCopilotToken(e, !1))
        .organization_list) && undefined !== t
      ? t
      : [];
  return null !==
    (n = [
      "a5db0bcaae94032fe715fb34a5e4bce2",
      "4535c7beffc844b46bb1ed4aa04d759a",
    ].find((e) => r.includes(e))) && undefined !== n
    ? n
    : "";
};
(function (e) {
  e.GITHUB = "github";
  e.MICROSOFT = "microsoft";
  e.UNKNOWN = "";
})((c = exports.Dogfood || (exports.Dogfood = {})));
exports.getDogFood = function (e) {
  return undefined === e || e === f.PENDING
    ? c.UNKNOWN
    : "github/github" === tryGetGitHubNWO(e)
    ? c.GITHUB
    : "ssh.dev.azure.com" === e.hostname ||
      "vs-ssh.visualstudio.com" === e.hostname ||
      "dev.azure.com" === e.hostname ||
      "domoreexp.visualstudio.com" === e.hostname ||
      "office.visualstudio.com" === e.hostname
    ? c.MICROSOFT
    : c.UNKNOWN;
};
exports.tryGetGitHubNWO = tryGetGitHubNWO;
exports.extractRepoInfoInBackground = function (e, t) {
  if (!t) return;
  const n = i.dirname(t);
  return u(e, n);
};
const u = (function (e, t) {
  const n = new a.LRUCache(1e4),
    r = new Set();
  return (t, ...o) => {
    const i = JSON.stringify(o),
      s = n.get(i);
    if (s) return s.result;
    if (r.has(i)) return f.PENDING;
    const a = e(t, ...o);
    r.add(i);
    a.then((e) => {
      n.put(i, new m(e));
      r.delete(i);
    });
    return f.PENDING;
  };
})(d);
async function d(e, t) {
  var n;
  const o = await (async function (e, t) {
    let n = t + "_add_to_make_longer";
    const o = e.get(r.FileSystem);
    for (; t.length > 1 && t.length < n.length; ) {
      const e = i.join(t, ".git", "config");
      let r = !1;
      try {
        await o.stat(e);
        r = !0;
      } catch (e) {
        r = !1;
      }
      if (r) return t;
      n = t;
      t = i.dirname(t);
    }
  })(e, t);
  if (!o) return;
  const s = e.get(r.FileSystem),
    a = i.join(o, ".git", "config"),
    c =
      null !==
        (n = getRepoUrlFromConfigText((await s.readFile(a)).toString())) &&
      undefined !== n
        ? n
        : "",
    l = parseRepoUrl(c);
  return undefined === l
    ? {
        baseFolder: o,
        url: c,
        hostname: "",
        owner: "",
        repo: "",
        pathname: "",
      }
    : {
        baseFolder: o,
        url: c,
        ...l,
      };
}
function parseRepoUrl(e) {
  let t = {};
  try {
    t = o(e);
    if ("" == t.host || "" == t.owner || "" == t.name || "" == t.pathname)
      return;
  } catch (e) {
    return;
  }
  return {
    hostname: t.host,
    owner: t.owner,
    repo: t.name,
    pathname: t.pathname,
  };
}
function getRepoUrlFromConfigText(e) {
  var t;
  const n = /^\s*\[\s*remote\s+"((\\\\|\\"|[^\\"])+)"/,
    r = /^\s*\[remote.([^"\s]+)/,
    o = /^\s*url\s*=\s*([^\s#;]+)/,
    i = /^\s*\[/;
  let s,
    a,
    c = !1;
  for (const l of e.split("\n"))
    if (c && undefined !== s) {
      s += l;
      if (l.endsWith("\\")) s = s.substring(0, s.length - 1);
      else if (((c = !1), "origin" === a)) return s;
    } else {
      const e = null !== (t = l.match(n)) && undefined !== t ? t : l.match(r);
      if (e) a = e[1];
      else if (l.match(i)) a = undefined;
      else {
        if (s && "origin" !== a) continue;
        {
          const e = l.match(o);
          if (e) {
            s = e[1];
            if (s.endsWith("\\")) {
              s = s.substring(0, s.length - 1);
              c = !0;
            } else if ("origin" === a) return s;
          }
        }
      }
    }
  return s;
}
var f;
exports.extractRepoInfoForTesting = async function (e, t) {
  return d(e, t);
};
exports.parseRepoUrl = parseRepoUrl;
exports.getRepoUrlFromConfigText = getRepoUrlFromConfigText;
(function (e) {
  e[(e.PENDING = 0)] = "PENDING";
})((f = exports.ComputationStatus || (exports.ComputationStatus = {})));
class m {
  constructor(e) {
    this.result = e;
  }
}