function n(e) {
  const t = e.length;
  let n,
    r = 0,
    o = 0;
  for (; o < t; ) {
    r++;
    n = e.charCodeAt(o++);
    if (n >= 55296 && n <= 56319 && o < t) {
      n = e.charCodeAt(o);
      if (56320 == (64512 & n)) {
        o++;
      }
    }
  }
  return r;
}
Object.defineProperty(exports, "__esModule", {
  value: !0,
});
exports.default = n;
n.code = 'require("ajv/dist/runtime/ucs2length").default';
