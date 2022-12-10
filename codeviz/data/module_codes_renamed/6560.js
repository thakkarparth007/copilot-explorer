module.exports = (e, t) => {
  t = t || process.argv;
  const n = e.startsWith("-") ? "" : 1 === e.length ? "-" : "--",
    r = t.indexOf(n + e),
    o = t.indexOf("--");
  return -1 !== r && (-1 === o || r < o);
};
