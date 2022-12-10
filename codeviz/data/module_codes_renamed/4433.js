var M_vlq_NOTSURE = require("vlq"),
  M_url_utils_NOTSURE = require("url-utils"),
  i = require("ordered-set").I,
  s = require("sorted_array").H;
function h(e) {
  if (e) {
    e = {};
  }
  this._file = M_url_utils_NOTSURE.getArg(e, "file", null);
  this._sourceRoot = M_url_utils_NOTSURE.getArg(e, "sourceRoot", null);
  this._skipValidation = M_url_utils_NOTSURE.getArg(e, "skipValidation", !1);
  this._sources = new i();
  this._names = new i();
  this._mappings = new s();
  this._sourcesContents = null;
}
h.prototype._version = 3;
h.fromSourceMap = function (e) {
  var t = e.sourceRoot,
    n = new h({
      file: e.file,
      sourceRoot: t,
    });
  e.eachMapping(function (e) {
    var r = {
      generated: {
        line: e.generatedLine,
        column: e.generatedColumn,
      },
    };
    if (null != e.source) {
      r.source = e.source;
      if (null != t) {
        r.source = M_url_utils_NOTSURE.relative(t, r.source);
      }
      r.original = {
        line: e.originalLine,
        column: e.originalColumn,
      };
      if (null != e.name) {
        r.name = e.name;
      }
    }
    n.addMapping(r);
  });
  e.sources.forEach(function (r) {
    var i = r;
    if (null !== t) {
      i = M_url_utils_NOTSURE.relative(t, r);
    }
    if (n._sources.has(i)) {
      n._sources.add(i);
    }
    var s = e.sourceContentFor(r);
    if (null != s) {
      n.setSourceContent(r, s);
    }
  });
  return n;
};
h.prototype.addMapping = function (e) {
  var t = M_url_utils_NOTSURE.getArg(e, "generated"),
    n = M_url_utils_NOTSURE.getArg(e, "original", null),
    r = M_url_utils_NOTSURE.getArg(e, "source", null),
    i = M_url_utils_NOTSURE.getArg(e, "name", null);
  if (this._skipValidation) {
    this._validateMapping(t, n, r, i);
  }
  if (null != r) {
    r = String(r);
    if (this._sources.has(r)) {
      this._sources.add(r);
    }
  }
  if (null != i) {
    i = String(i);
    if (this._names.has(i)) {
      this._names.add(i);
    }
  }
  this._mappings.add({
    generatedLine: t.line,
    generatedColumn: t.column,
    originalLine: null != n && n.line,
    originalColumn: null != n && n.column,
    source: r,
    name: i,
  });
};
h.prototype.setSourceContent = function (e, t) {
  var n = e;
  if (null != this._sourceRoot) {
    n = M_url_utils_NOTSURE.relative(this._sourceRoot, n);
  }
  if (null != t) {
    if (this._sourcesContents) {
      this._sourcesContents = Object.create(null);
    }
    this._sourcesContents[M_url_utils_NOTSURE.toSetString(n)] = t;
  } else {
    if (this._sourcesContents) {
      delete this._sourcesContents[M_url_utils_NOTSURE.toSetString(n)];
      if (0 === Object.keys(this._sourcesContents).length) {
        this._sourcesContents = null;
      }
    }
  }
};
h.prototype.applySourceMap = function (e, t, n) {
  var r = t;
  if (null == t) {
    if (null == e.file)
      throw new Error(
        'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.'
      );
    r = e.file;
  }
  var s = this._sourceRoot;
  if (null != s) {
    r = M_url_utils_NOTSURE.relative(s, r);
  }
  var a = new i(),
    c = new i();
  this._mappings.unsortedForEach(function (t) {
    if (t.source === r && null != t.originalLine) {
      var i = e.originalPositionFor({
        line: t.originalLine,
        column: t.originalColumn,
      });
      if (null != i.source) {
        t.source = i.source;
        if (null != n) {
          t.source = M_url_utils_NOTSURE.join(n, t.source);
        }
        if (null != s) {
          t.source = M_url_utils_NOTSURE.relative(s, t.source);
        }
        t.originalLine = i.line;
        t.originalColumn = i.column;
        if (null != i.name) {
          t.name = i.name;
        }
      }
    }
    var l = t.source;
    if (null == l || a.has(l)) {
      a.add(l);
    }
    var u = t.name;
    if (null == u || c.has(u)) {
      c.add(u);
    }
  }, this);
  this._sources = a;
  this._names = c;
  e.sources.forEach(function (t) {
    var r = e.sourceContentFor(t);
    if (null != r) {
      if (null != n) {
        t = M_url_utils_NOTSURE.join(n, t);
      }
      if (null != s) {
        t = M_url_utils_NOTSURE.relative(s, t);
      }
      this.setSourceContent(t, r);
    }
  }, this);
};
h.prototype._validateMapping = function (e, t, n, r) {
  if (t && "number" != typeof t.line && "number" != typeof t.column)
    throw new Error(
      "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values."
    );
  if (
    (!(e && "line" in e && "column" in e && e.line > 0 && e.column >= 0) ||
      t ||
      n ||
      r) &&
    !(
      e &&
      "line" in e &&
      "column" in e &&
      t &&
      "line" in t &&
      "column" in t &&
      e.line > 0 &&
      e.column >= 0 &&
      t.line > 0 &&
      t.column >= 0 &&
      n
    )
  )
    throw new Error(
      "Invalid mapping: " +
        JSON.stringify({
          generated: e,
          source: n,
          original: t,
          name: r,
        })
    );
};
h.prototype._serializeMappings = function () {
  for (
    var e,
      t,
      n,
      i,
      s = 0,
      a = 1,
      c = 0,
      l = 0,
      u = 0,
      d = 0,
      p = "",
      h = this._mappings.toArray(),
      f = 0,
      m = h.length;
    f < m;
    f++
  ) {
    e = "";
    if ((t = h[f]).generatedLine !== a)
      for (s = 0; t.generatedLine !== a; ) (e += ";"), a++;
    else if (f > 0) {
      if (!M_url_utils_NOTSURE.compareByGeneratedPositionsInflated(t, h[f - 1]))
        continue;
      e += ",";
    }
    e += M_vlq_NOTSURE.encode(t.generatedColumn - s);
    s = t.generatedColumn;
    if (null != t.source) {
      i = this._sources.indexOf(t.source);
      e += M_vlq_NOTSURE.encode(i - d);
      d = i;
      e += M_vlq_NOTSURE.encode(t.originalLine - 1 - l);
      l = t.originalLine - 1;
      e += M_vlq_NOTSURE.encode(t.originalColumn - c);
      c = t.originalColumn;
      if (null != t.name) {
        n = this._names.indexOf(t.name);
        e += M_vlq_NOTSURE.encode(n - u);
        u = n;
      }
    }
    p += e;
  }
  return p;
};
h.prototype._generateSourcesContent = function (e, t) {
  return e.map(function (e) {
    if (!this._sourcesContents) return null;
    if (null != t) {
      e = M_url_utils_NOTSURE.relative(t, e);
    }
    var n = M_url_utils_NOTSURE.toSetString(e);
    return Object.prototype.hasOwnProperty.call(this._sourcesContents, n)
      ? this._sourcesContents[n]
      : null;
  }, this);
};
h.prototype.toJSON = function () {
  var e = {
    version: this._version,
    sources: this._sources.toArray(),
    names: this._names.toArray(),
    mappings: this._serializeMappings(),
  };
  if (null != this._file) {
    e.file = this._file;
  }
  if (null != this._sourceRoot) {
    e.sourceRoot = this._sourceRoot;
  }
  if (this._sourcesContents) {
    e.sourcesContent = this._generateSourcesContent(e.sources, e.sourceRoot);
  }
  return e;
};
h.prototype.toString = function () {
  return JSON.stringify(this.toJSON());
};
exports.h = h;
