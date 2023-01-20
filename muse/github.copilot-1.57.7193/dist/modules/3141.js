Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.getRules = exports.isJSONType = undefined;
const n = new Set([
  "string",
  "number",
  "integer",
  "boolean",
  "null",
  "object",
  "array",
]);
exports.isJSONType = function (e) {
  return "string" == typeof e && n.has(e);
};
exports.getRules = function () {
  const e = {
    number: {
      type: "number",
      rules: [],
    },
    string: {
      type: "string",
      rules: [],
    },
    array: {
      type: "array",
      rules: [],
    },
    object: {
      type: "object",
      rules: [],
    },
  };
  return {
    types: {
      ...e,
      integer: true,
      boolean: true,
      null: true,
    },
    rules: [
      {
        rules: [],
      },
      e.number,
      e.string,
      e.array,
      e.object,
    ],
    post: {
      rules: [],
    },
    all: {},
    keywords: {},
  };
};