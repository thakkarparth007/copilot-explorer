Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.parseTree =
  exports.registerLanguageSpecificParser =
  exports.flattenVirtual =
  exports.groupBlocks =
  exports.combineClosersAndOpeners =
  exports.buildLabelRules =
  exports.labelVirtualInherited =
  exports.labelLines =
  exports.parseRaw =
    undefined;
const r = require(3055876);
const o = require(3055617);
function parseRaw(e) {
  const t = e.split("\n");
  const n = t.map((e) => e.match(/^\s*/)[0].length);
  const o = t.map((e) => e.trimLeft());
  function i(e) {
    const [t, i] = s(e + 1, n[e]);
    return [r.lineNode(n[e], e, o[e], t), i];
  }
  function s(e, t) {
    let s;
    const a = [];
    let c;
    let l = e;
    for (; l < o.length && ("" === o[l] || n[l] > t); )
      if ("" === o[l]) {
        if (undefined === c) {
          c = l;
        }
        l += 1;
      } else {
        if (undefined !== c) {
          for (let e = c; e < l; e++) a.push(r.blankNode(e));
          c = undefined;
        }
        [s, l] = i(l);
        a.push(s);
      }
    if (undefined !== c) {
      l = c;
    }
    return [a, l];
  }
  const [a, c] = s(0, -1);
  let l = c;
  for (; l < o.length && "" === o[l]; ) {
    a.push(r.blankNode(l));
    l += 1;
  }
  if (l < o.length)
    throw new Error(
      `Parsing did not go to end of file. Ended at ${l} out of ${o.length}`
    );
  return r.topNode(a);
}
function labelLines(e, t) {
  o.visitTree(
    e,
    function (e) {
      if (r.isLine(e)) {
        const n = t.find((t) => t.matches(e.sourceLine));
        if (n) {
          e.label = n.label;
        }
      }
    },
    "bottomUp"
  );
}
function buildLabelRules(e) {
  return Object.keys(e).map((t) => {
    let n;
    n = e[t].test ? (n) => e[t].test(n) : e[t];
    return {
      matches: n,
      label: t,
    };
  });
}
function combineClosersAndOpeners(e) {
  const t = o.rebuildTree(e, function (e) {
    if (
      0 === e.subs.length ||
      -1 ===
        e.subs.findIndex((e) => "closer" === e.label || "opener" === e.label)
    )
      return e;
    const t = [];
    let n;
    for (let o = 0; o < e.subs.length; o++) {
      const i = e.subs[o];
      const s = e.subs[o - 1];
      if ("opener" === i.label && undefined !== s && r.isLine(s)) {
        s.subs.push(i);
        i.subs.forEach((e) => s.subs.push(e));
        i.subs = [];
      } else if (
        "closer" === i.label &&
        undefined !== n &&
        (r.isLine(i) || r.isVirtual(i)) &&
        i.indentation >= n.indentation
      ) {
        let e = t.length - 1;
        for (; e > 0 && r.isBlank(t[e]); ) e -= 1;
        n.subs.push(...t.splice(e + 1));
        if (i.subs.length > 0) {
          const e = n.subs.findIndex((e) => "newVirtual" !== e.label),
            t = n.subs.slice(0, e),
            o = n.subs.slice(e),
            s =
              o.length > 0
                ? [r.virtualNode(i.indentation, o, "newVirtual")]
                : [];
          n.subs = [...t, ...s, i];
        } else n.subs.push(i);
      } else {
        t.push(i);
        if (r.isBlank(i)) {
          n = i;
        }
      }
    }
    e.subs = t;
    return e;
  });
  o.clearLabelsIf(e, (e) => "newVirtual" === e);
  return t;
}
exports.parseRaw = parseRaw;
exports.labelLines = labelLines;
exports.labelVirtualInherited = function (e) {
  o.visitTree(
    e,
    function (e) {
      if (r.isVirtual(e) && undefined === e.label) {
        const t = e.subs.filter((e) => !r.isBlank(e));
        if (1 === t.length) {
          e.label = t[0].label;
        }
      }
    },
    "bottomUp"
  );
};
exports.buildLabelRules = buildLabelRules;
exports.combineClosersAndOpeners = combineClosersAndOpeners;
exports.groupBlocks = function (e, t = r.isBlank, n) {
  return o.rebuildTree(e, function (e) {
    if (e.subs.length <= 1) return e;
    const o = [];
    let i;
    let s = [];
    let a = !1;
    function c(e = !1) {
      if (undefined !== i && (o.length > 0 || !e)) {
        const e = r.virtualNode(i, s, n);
        o.push(e);
      } else s.forEach((e) => o.push(e));
    }
    for (let n = 0; n < e.subs.length; n++) {
      const o = e.subs[n];
      const l = t(o);
      if (!l && a) {
        c();
        s = [];
      }
      a = l;
      s.push(o);
      if (r.isBlank(o)) {
        i = null != i ? i : o.indentation;
      }
    }
    c(!0);
    e.subs = o;
    return e;
  });
};
exports.flattenVirtual = function (e) {
  return o.rebuildTree(e, function (e) {
    return r.isVirtual(e) && undefined === e.label && e.subs.length <= 1
      ? 0 === e.subs.length
        ? undefined
        : e.subs[0]
      : (1 === e.subs.length &&
          r.isVirtual(e.subs[0]) &&
          undefined === e.subs[0].label &&
          (e.subs = e.subs[0].subs),
        e);
  });
};
const l = buildLabelRules({
  opener: /^[\[({]/,
  closer: /^[\])}]/,
});
const u = {};
exports.registerLanguageSpecificParser = function (e, t) {
  u[e] = t;
};
exports.parseTree = function (e, t) {
  const n = parseRaw(e);
  const r = u[null != t ? t : ""];
  return r ? r(n) : (labelLines(n, l), combineClosersAndOpeners(n));
};