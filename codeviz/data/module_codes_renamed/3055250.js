Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.getWindowsDelineations = undefined;
const M_parser_utils = require("parser-utils");
const M_parse_tree_utils2 = require("parse-tree-utils2");
exports.getWindowsDelineations = function (e, t, n, i) {
  if (e.length < n || 0 == i) return [];
  const s = [];
  const a = M_parse_tree_utils2.clearLabels(
    M_parser_utils.parseTree(e.join("\n"), t)
  );
  M_parse_tree_utils2.visitTree(
    a,
    (e) => {
      if ("blank" === e.type)
        return void (e.label = {
          totalLength: 1,
          firstLineAfter: e.lineNumber + 1,
        });
      let t = "line" === e.type ? 1 : 0;
      let r = "line" === e.type ? e.lineNumber + 1 : NaN;
      function o(n) {
        return -1 == n
          ? r - t
          : e.subs[n].label.firstLineAfter - e.subs[n].label.totalLength;
      }
      function a(t, n) {
        return 0 == t ? n + 1 : e.subs[t - 1].label.firstLineAfter;
      }
      let c = "line" === e.type ? -1 : 0;
      let l = "line" === e.type ? 1 : 0;
      let u = 0;
      for (let d = 0; d < e.subs.length; d++) {
        for (; c >= 0 && c < e.subs.length && "blank" === e.subs[c].type; ) {
          l -= e.subs[c].label.totalLength;
          c++;
        }
        if ("blank" !== e.subs[d].type) {
          u = d;
        }
        r = e.subs[d].label.firstLineAfter;
        t += e.subs[d].label.totalLength;
        l += e.subs[d].label.totalLength;
        if (l > i) {
          const t = o(c),
            r = a(d, t),
            p = u == d ? r : a(u, t);
          for (n <= r - t && s.push([t, p]); l > i; )
            (l -=
              -1 == c
                ? "line" == e.type
                  ? 1
                  : 0
                : e.subs[c].label.totalLength),
              c++;
        }
      }
      if (c < e.subs.length) {
        const t = o(c);
        const i = r;
        const a = -1 == c ? i : e.subs[u].label.firstLineAfter;
        if (n <= i - t) {
          s.push([t, a]);
        }
      }
      e.label = {
        totalLength: t,
        firstLineAfter: r,
      };
    },
    "bottomUp"
  );
  return s
    .sort((e, t) => e[0] - t[0] || e[1] - t[1])
    .filter((e, t, n) => 0 == t || e[0] != n[t - 1][0] || e[1] != n[t - 1][1]);
};
