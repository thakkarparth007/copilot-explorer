function isVirtual(e) {
  return "virtual" === e.type;
}
function isTop(e) {
  return "top" === e.type;
}
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.duplicateTree =
  exports.cutTreeAfterLine =
  exports.isTop =
  exports.isVirtual =
  exports.isLine =
  exports.isBlank =
  exports.topNode =
  exports.blankNode =
  exports.lineNode =
  exports.virtualNode =
    undefined;
exports.virtualNode = function (e, t, n) {
  return {
    type: "virtual",
    indentation: e,
    subs: t,
    label: n,
  };
};
exports.lineNode = function (e, t, n, r, o) {
  if ("" === n)
    throw new Error("Cannot create a line node with an empty source line");
  return {
    type: "line",
    indentation: e,
    lineNumber: t,
    sourceLine: n,
    subs: r,
    label: o,
  };
};
exports.blankNode = function (e) {
  return {
    type: "blank",
    lineNumber: e,
    subs: [],
  };
};
exports.topNode = function (e) {
  return {
    type: "top",
    indentation: -1,
    subs: null != e ? e : [],
  };
};
exports.isBlank = function (e) {
  return "blank" === e.type;
};
exports.isLine = function (e) {
  return "line" === e.type;
};
exports.isVirtual = isVirtual;
exports.isTop = isTop;
exports.cutTreeAfterLine = function (e, t) {
  !(function e(o) {
    if (!isVirtual(o) && !isTop(o) && o.lineNumber === t) {
      o.subs = [];
      return !0;
    }
    for (let t = 0; t < o.subs.length; t++)
      if (e(o.subs[t])) {
        o.subs = o.subs.slice(0, t + 1);
        return !0;
      }
    return !1;
  })(e);
};
exports.duplicateTree = function (e) {
  return JSON.parse(JSON.stringify(e));
};
