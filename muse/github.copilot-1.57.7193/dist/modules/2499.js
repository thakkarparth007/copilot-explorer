Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.redactPaths = undefined;
exports.redactPaths = function (e) {
  return e
    .replace(/([\s|(]|file:\/\/)(\/[^\s]+)/g, "$1[redacted]")
    .replace(
      /([\s|(]|file:\/\/)([a-zA-Z]:[(\\|/){1,2}][^\s]+)/gi,
      "$1[redacted]"
    )
    .replace(/([\s|(]|file:\/\/)(\\[^\s]+)/gi, "$1[redacted]");
};