Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.rebuildTree =
  exports.foldTree =
  exports.visitTreeConditionally =
  exports.visitTree =
  exports.resetLineNumbers =
  exports.mapLabels =
  exports.clearLabelsIf =
  exports.clearLabels =
    undefined;
const r = require(9608);
function visitTree(e, t, n) {
  !(function e(r) {
    if ("topDown" === n) {
      t(r);
    }
    r.subs.forEach((t) => {
      e(t);
    });
    if ("bottomUp" === n) {
      t(r);
    }
  })(e);
}
exports.clearLabels = function (e) {
  visitTree(
    e,
    (e) => {
      e.label = undefined;
    },
    "bottomUp"
  );
  return e;
};
exports.clearLabelsIf = function (e, t) {
  visitTree(
    e,
    (e) => {
      e.label = e.label ? (t(e.label) ? undefined : e.label) : undefined;
    },
    "bottomUp"
  );
  return e;
};
exports.mapLabels = function e(t, n) {
  switch (t.type) {
    case "line":
    case "virtual":
      const r = t.subs.map((t) => e(t, n));
      return {
        ...t,
        subs: r,
        label: t.label ? n(t.label) : undefined,
      };
    case "blank":
      return {
        ...t,
        label: t.label ? n(t.label) : undefined,
      };
    case "top":
      return {
        ...t,
        subs: t.subs.map((t) => e(t, n)),
        label: t.label ? n(t.label) : undefined,
      };
  }
};
exports.resetLineNumbers = function (e) {
  let t = 0;
  visitTree(
    e,
    function (e) {
      if (r.isVirtual(e) || r.isTop(e)) {
        e.lineNumber = t;
        t++;
      }
    },
    "topDown"
  );
};
exports.visitTree = visitTree;
exports.visitTreeConditionally = function (e, t, n) {
  !(function e(r) {
    if ("topDown" === n && !t(r)) return false;
    let o = true;
    r.subs.forEach((t) => {
      o = o && e(t);
    });
    if ("bottomUp" === n) {
      o = o && t(r);
    }
    return o;
  })(e);
};
exports.foldTree = function (e, t, n, r) {
  let i = t;
  visitTree(
    e,
    function (e) {
      i = n(e, i);
    },
    r
  );
  return i;
};
exports.rebuildTree = function (e, t, n) {
  const o = (e) => {
    if (undefined !== n && n(e)) return e;
    {
      const n = e.subs.map(o).filter((e) => undefined !== e);
      e.subs = n;
      return t(e);
    }
  };
  const i = o(e);
  return undefined !== i ? i : r.topNode();
};