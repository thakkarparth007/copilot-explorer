Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.parsesWithoutError =
  exports.getPrompt =
  exports.getNodeStart =
  exports.getFunctionPositions =
  exports.getBlockCloseToken =
  exports.isSupportedLanguageId =
  exports.isBlockBodyFinished =
  exports.isEmptyBlockStart =
  exports.terminate =
  exports.init =
    undefined;
const M_getPrompt_main_stuff = require("getPrompt-main-stuff");
let o = null;
const i = new Map();
let s = 0;
exports.init = function (t, u, d) {
  if (!u) {
    const M_worker_utils_and_other_prompt_collection_stuff = require("worker-utils-and-other-prompt-collection-stuff");
    for (const n of [...a, ...c])
      module.exports[n] = M_worker_utils_and_other_prompt_collection_stuff[n];
    return;
  }
  for (const n of a) module.exports[n] = l(t, d, n);
  module.exports.getPrompt = (function (e, t) {
    return function (n, ...r) {
      const a = s++;
      return new Promise((n, s) => {
        i.set(a, {
          resolve: n,
          reject: s,
        });
        t.debug(e, `Proxy getPrompt - ${a}`);
        if (null == o) {
          o.postMessage({
            id: a,
            fn: "getPrompt",
            args: r,
          });
        }
      });
    };
  })(t, d);
  o = M_getPrompt_main_stuff.createWorker();
  i.clear();
  s = 0;
  const p = t.get(M_getPrompt_main_stuff.FileSystem);
  function h(e) {
    d.error(t, e);
    for (const t of i.values()) t.reject(e);
    i.clear();
  }
  o.on("message", ({ id: e, err: n, res: r }) => {
    const o = i.get(e);
    d.debug(t, `Response ${e} - ${r}, ${n}`);
    if (o) {
      i.delete(e);
      if (n) {
        o.reject(n);
      } else {
        o.resolve(r);
      }
    }
  });
  o.on("error", h);
  o.on("exit", (e) => {
    if (0 !== e) {
      h(new Error(`Worker thread exited with code ${e}.`));
    }
  });
  o.on("readFileReq", (e) => {
    d.debug(t, `READ_FILE_REQ - ${e}`);
    p.readFile(e)
      .then((e) => {
        if (null == o) {
          o.emit("readFileRes", e);
        }
      })
      .catch(h);
  });
  o.on("mtimeRes", (e) => {
    d.debug(t, `mTime_REQ - ${e}`);
    p.mtime(e)
      .then((e) => {
        if (null == o) {
          o.emit("mtimeRes", e);
        }
      })
      .catch(h);
  });
};
exports.terminate = function () {
  if (o) {
    o.removeAllListeners();
    o.terminate();
    o = null;
    i.clear();
  }
};
const a = [
    "getFunctionPositions",
    "isEmptyBlockStart",
    "isBlockBodyFinished",
    "getNodeStart",
    "parsesWithoutError",
  ],
  c = ["isSupportedLanguageId", "getBlockCloseToken"];
function l(e, t, n) {
  return function (...r) {
    const a = s++;
    return new Promise((s, c) => {
      i.set(a, {
        resolve: s,
        reject: c,
      });
      t.debug(e, `Proxy ${n}`);
      if (null == o) {
        o.postMessage({
          id: a,
          fn: n,
          args: r,
        });
      }
    });
  };
}
exports.isEmptyBlockStart = M_getPrompt_main_stuff.isEmptyBlockStart;
exports.isBlockBodyFinished = M_getPrompt_main_stuff.isBlockBodyFinished;
exports.isSupportedLanguageId = M_getPrompt_main_stuff.isSupportedLanguageId;
exports.getBlockCloseToken = M_getPrompt_main_stuff.getBlockCloseToken;
exports.getFunctionPositions = M_getPrompt_main_stuff.getFunctionPositions;
exports.getNodeStart = M_getPrompt_main_stuff.getNodeStart;
exports.getPrompt = M_getPrompt_main_stuff.getPrompt;
exports.parsesWithoutError = M_getPrompt_main_stuff.parsesWithoutError;
