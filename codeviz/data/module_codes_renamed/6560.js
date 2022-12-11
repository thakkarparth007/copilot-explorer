module.exports = (e, t) => {
  t = t || process.argv;
  const n = e.startsWith("-") ? "" : 1 === e.length ? "-" : "--";
  const r = t.indexOf(n + e);
  const o = t.indexOf("--");
  return -1 !== r && (-1 === o || r < o);
};
