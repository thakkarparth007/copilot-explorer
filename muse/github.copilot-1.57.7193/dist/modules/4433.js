var r = require(6400),
  o = require(2728),
  i = require(8213).I,
  s = require(1188).H;
function a(e) {
  e || (e = {});
  this._file = o.getArg(e, "file", null);
  this._sourceRoot = o.getArg(e, "sourceRoot", null);
  this._skipValidation = o.getArg(e, "skipValidation", !1);
  this._sources = new i();
  this._names = new i();
  this._mappings = new s();
  this._sourcesContents = null;
}
a.prototype._version = 3;
a.fromSourceMap = function (e) {
  var t = e.sourceRoot,
    n = new a({
      file: e.file,
      sourceRoot: t
    });
  e.eachMapping(function (e) {
    var r = {
      generated: {
        line: e.generatedLine,
        column: e.generatedColumn
      }
    };
    null != e.source && (r.source = e.source, null != t && (r.source = o.relative(t, r.source)), r.original = {
      line: e.originalLine,
      column: e.originalColumn
    }, null != e.name && (r.name = e.name));
    n.addMapping(r);
  });
  e.sources.forEach(function (r) {
    var i = r;
    null !== t && (i = o.relative(t, r));
    n._sources.has(i) || n._sources.add(i);
    var s = e.sourceContentFor(r);
    null != s && n.setSourceContent(r, s);
  });
  return n;
};
a.prototype.addMapping = function (e) {
  var t = o.getArg(e, "generated"),
    n = o.getArg(e, "original", null),
    r = o.getArg(e, "source", null),
    i = o.getArg(e, "name", null);
  this._skipValidation || this._validateMapping(t, n, r, i);
  null != r && (r = String(r), this._sources.has(r) || this._sources.add(r));
  null != i && (i = String(i), this._names.has(i) || this._names.add(i));
  this._mappings.add({
    generatedLine: t.line,
    generatedColumn: t.column,
    originalLine: null != n && n.line,
    originalColumn: null != n && n.column,
    source: r,
    name: i
  });
};
a.prototype.setSourceContent = function (e, t) {
  var n = e;
  null != this._sourceRoot && (n = o.relative(this._sourceRoot, n));
  null != t ? (this._sourcesContents || (this._sourcesContents = Object.create(null)), this._sourcesContents[o.toSetString(n)] = t) : this._sourcesContents && (delete this._sourcesContents[o.toSetString(n)], 0 === Object.keys(this._sourcesContents).length && (this._sourcesContents = null));
};
a.prototype.applySourceMap = function (e, t, n) {
  var r = t;
  if (null == t) {
    if (null == e.file) throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.');
    r = e.file;
  }
  var s = this._sourceRoot;
  null != s && (r = o.relative(s, r));
  var a = new i(),
    c = new i();
  this._mappings.unsortedForEach(function (t) {
    if (t.source === r && null != t.originalLine) {
      var i = e.originalPositionFor({
        line: t.originalLine,
        column: t.originalColumn
      });
      null != i.source && (t.source = i.source, null != n && (t.source = o.join(n, t.source)), null != s && (t.source = o.relative(s, t.source)), t.originalLine = i.line, t.originalColumn = i.column, null != i.name && (t.name = i.name));
    }
    var l = t.source;
    null == l || a.has(l) || a.add(l);
    var u = t.name;
    null == u || c.has(u) || c.add(u);
  }, this);
  this._sources = a;
  this._names = c;
  e.sources.forEach(function (t) {
    var r = e.sourceContentFor(t);
    null != r && (null != n && (t = o.join(n, t)), null != s && (t = o.relative(s, t)), this.setSourceContent(t, r));
  }, this);
};
a.prototype._validateMapping = function (e, t, n, r) {
  if (t && "number" != typeof t.line && "number" != typeof t.column) throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.");
  if ((!(e && "line" in e && "column" in e && e.line > 0 && e.column >= 0) || t || n || r) && !(e && "line" in e && "column" in e && t && "line" in t && "column" in t && e.line > 0 && e.column >= 0 && t.line > 0 && t.column >= 0 && n)) throw new Error("Invalid mapping: " + JSON.stringify({
    generated: e,
    source: n,
    original: t,
    name: r
  }));
};
a.prototype._serializeMappings = function () {
  for (var e, t, n, i, s = 0, a = 1, c = 0, l = 0, u = 0, d = 0, p = "", h = this._mappings.toArray(), f = 0, m = h.length; f < m; f++) {
    e = "";
    if ((t = h[f]).generatedLine !== a) for (s = 0; t.generatedLine !== a;) e += ";", a++;else if (f > 0) {
      if (!o.compareByGeneratedPositionsInflated(t, h[f - 1])) continue;
      e += ",";
    }
    e += r.encode(t.generatedColumn - s);
    s = t.generatedColumn;
    null != t.source && (i = this._sources.indexOf(t.source), e += r.encode(i - d), d = i, e += r.encode(t.originalLine - 1 - l), l = t.originalLine - 1, e += r.encode(t.originalColumn - c), c = t.originalColumn, null != t.name && (n = this._names.indexOf(t.name), e += r.encode(n - u), u = n));
    p += e;
  }
  return p;
};
a.prototype._generateSourcesContent = function (e, t) {
  return e.map(function (e) {
    if (!this._sourcesContents) return null;
    null != t && (e = o.relative(t, e));
    var n = o.toSetString(e);
    return Object.prototype.hasOwnProperty.call(this._sourcesContents, n) ? this._sourcesContents[n] : null;
  }, this);
};
a.prototype.toJSON = function () {
  var e = {
    version: this._version,
    sources: this._sources.toArray(),
    names: this._names.toArray(),
    mappings: this._serializeMappings()
  };
  null != this._file && (e.file = this._file);
  null != this._sourceRoot && (e.sourceRoot = this._sourceRoot);
  this._sourcesContents && (e.sourcesContent = this._generateSourcesContent(e.sources, e.sourceRoot));
  return e;
};
a.prototype.toString = function () {
  return JSON.stringify(this.toJSON());
};
exports.h = a;