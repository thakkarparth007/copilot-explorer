Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.parsesWithoutError = exports.getPrompt = exports.getNodeStart = exports.getFunctionPositions = exports.getBlockCloseToken = exports.isSupportedLanguageId = exports.isBlockBodyFinished = exports.isEmptyBlockStart = exports.terminate = exports.init = undefined;
const r = require(3055);
let o = null;
const i = new Map();
let s = 0;
exports.init = function (t, u, d) {
  if (!u) {
    const t = require(4723);
    for (const n of [...a, ...c]) module.exports[n] = t[n];
    return;
  }
  for (const n of a) module.exports[n] = l(t, d, n);
  module.exports.getPrompt = function (e, t) {
    return function (n, ...r) {
      const a = s++;
      return new Promise((n, s) => {
        i.set(a, {
          resolve: n,
          reject: s
        });
        t.debug(e, `Proxy getPrompt - ${a}`);
        null == o || o.postMessage({
          id: a,
          fn: "getPrompt",
          args: r
        });
      });
    };
  }(t, d);
  o = r.createWorker();
  i.clear();
  s = 0;
  const p = t.get(r.FileSystem);
  function h(e) {
    d.error(t, e);
    for (const t of i.values()) t.reject(e);
    i.clear();
  }
  o.on("message", ({
    id: e,
    err: n,
    res: r
  }) => {
    const o = i.get(e);
    d.debug(t, `Response ${e} - ${r}, ${n}`);
    o && (i.delete(e), n ? o.reject(n) : o.resolve(r));
  });
  o.on("error", h);
  o.on("exit", e => {
    0 !== e && h(new Error(`Worker thread exited with code ${e}.`));
  });
  o.on("readFileReq", e => {
    d.debug(t, `READ_FILE_REQ - ${e}`);
    p.readFile(e).then(e => {
      null == o || o.emit("readFileRes", e);
    }).catch(h);
  });
  o.on("mtimeRes", e => {
    d.debug(t, `mTime_REQ - ${e}`);
    p.mtime(e).then(e => {
      null == o || o.emit("mtimeRes", e);
    }).catch(h);
  });
};
exports.terminate = function () {
  o && (o.removeAllListeners(), o.terminate(), o = null, i.clear());
};
const a = ["getFunctionPositions", "isEmptyBlockStart", "isBlockBodyFinished", "getNodeStart", "parsesWithoutError"],
  c = ["isSupportedLanguageId", "getBlockCloseToken"];
function l(e, t, n) {
  return function (...r) {
    const a = s++;
    return new Promise((s, c) => {
      i.set(a, {
        resolve: s,
        reject: c
      });
      t.debug(e, `Proxy ${n}`);
      null == o || o.postMessage({
        id: a,
        fn: n,
        args: r
      });
    });
  };
}
exports.isEmptyBlockStart = r.isEmptyBlockStart;
exports.isBlockBodyFinished = r.isBlockBodyFinished;
exports.isSupportedLanguageId = r.isSupportedLanguageId;
exports.getBlockCloseToken = r.getBlockCloseToken;
exports.getFunctionPositions = r.getFunctionPositions;
exports.getNodeStart = r.getNodeStart;
exports.getPrompt = r.getPrompt;
exports.parsesWithoutError = r.parsesWithoutError;