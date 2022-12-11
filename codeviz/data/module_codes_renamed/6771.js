var M_url_utils_maybe = require("url-utils");
var M_search_utils_maybe = require("search-utils");
var i = require("ordered-set").I;
var M_vlq_maybe = require("vlq");
var a = require("quicksort").U;
function SourceMapConsumer(e, t) {
  var n = e;
  if ("string" == typeof e) {
    n = M_url_utils_maybe.parseSourceMapInput(e);
  }
  return null != n.sections ? new d(n, t) : new l(n, t);
}
function l(e, t) {
  var n = e;
  if ("string" == typeof e) {
    n = M_url_utils_maybe.parseSourceMapInput(e);
  }
  var o = M_url_utils_maybe.getArg(n, "version");
  var s = M_url_utils_maybe.getArg(n, "sources");
  var a = M_url_utils_maybe.getArg(n, "names", []);
  var c = M_url_utils_maybe.getArg(n, "sourceRoot", null);
  var l = M_url_utils_maybe.getArg(n, "sourcesContent", null);
  var u = M_url_utils_maybe.getArg(n, "mappings");
  var d = M_url_utils_maybe.getArg(n, "file", null);
  if (o != this._version) throw new Error("Unsupported version: " + o);
  if (c) {
    c = M_url_utils_maybe.normalize(c);
  }
  s = s
    .map(String)
    .map(M_url_utils_maybe.normalize)
    .map(function (e) {
      return c &&
        M_url_utils_maybe.isAbsolute(c) &&
        M_url_utils_maybe.isAbsolute(e)
        ? M_url_utils_maybe.relative(c, e)
        : e;
    });
  this._names = i.fromArray(a.map(String), !0);
  this._sources = i.fromArray(s, !0);
  this._absoluteSources = this._sources.toArray().map(function (e) {
    return M_url_utils_maybe.computeSourceURL(c, e, t);
  });
  this.sourceRoot = c;
  this.sourcesContent = l;
  this._mappings = u;
  this._sourceMapURL = t;
  this.file = d;
}
function u() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}
function d(e, t) {
  var n = e;
  if ("string" == typeof e) {
    n = M_url_utils_maybe.parseSourceMapInput(e);
  }
  var o = M_url_utils_maybe.getArg(n, "version");
  var s = M_url_utils_maybe.getArg(n, "sections");
  if (o != this._version) throw new Error("Unsupported version: " + o);
  this._sources = new i();
  this._names = new i();
  var a = {
    line: -1,
    column: 0,
  };
  this._sections = s.map(function (e) {
    if (e.url)
      throw new Error("Support for url field in sections not implemented.");
    var n = M_url_utils_maybe.getArg(e, "offset");
    var o = M_url_utils_maybe.getArg(n, "line");
    var i = M_url_utils_maybe.getArg(n, "column");
    if (o < a.line || (o === a.line && i < a.column))
      throw new Error("Section offsets must be ordered and non-overlapping.");
    a = n;
    return {
      generatedOffset: {
        generatedLine: o + 1,
        generatedColumn: i + 1,
      },
      consumer: new SourceMapConsumer(M_url_utils_maybe.getArg(e, "map"), t),
    };
  });
}
SourceMapConsumer.fromSourceMap = function (e, t) {
  return l.fromSourceMap(e, t);
};
SourceMapConsumer.prototype._version = 3;
SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
  configurable: !0,
  enumerable: !0,
  get: function () {
    if (this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }
    return this.__generatedMappings;
  },
});
SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
  configurable: !0,
  enumerable: !0,
  get: function () {
    if (this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }
    return this.__originalMappings;
  },
});
SourceMapConsumer.prototype._charIsMappingSeparator = function (e, t) {
  var n = e.charAt(t);
  return ";" === n || "," === n;
};
SourceMapConsumer.prototype._parseMappings = function (e, t) {
  throw new Error("Subclasses must implement _parseMappings");
};
SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;
SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;
SourceMapConsumer.prototype.eachMapping = function (e, t, n) {
  var o;
  var i = t || null;
  switch (n || SourceMapConsumer.GENERATED_ORDER) {
    case SourceMapConsumer.GENERATED_ORDER:
      o = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      o = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
  }
  var s = this.sourceRoot;
  o.map(function (e) {
    var t = null === e.source ? null : this._sources.at(e.source);
    return {
      source: (t = M_url_utils_maybe.computeSourceURL(
        s,
        t,
        this._sourceMapURL
      )),
      generatedLine: e.generatedLine,
      generatedColumn: e.generatedColumn,
      originalLine: e.originalLine,
      originalColumn: e.originalColumn,
      name: null === e.name ? null : this._names.at(e.name),
    };
  }, this).forEach(e, i);
};
SourceMapConsumer.prototype.allGeneratedPositionsFor = function (e) {
  var t = M_url_utils_maybe.getArg(e, "line");
  var n = {
    source: M_url_utils_maybe.getArg(e, "source"),
    originalLine: t,
    originalColumn: M_url_utils_maybe.getArg(e, "column", 0),
  };
  n.source = this._findSourceIndex(n.source);
  if (n.source < 0) return [];
  var i = [];
  var s = this._findMapping(
    n,
    this._originalMappings,
    "originalLine",
    "originalColumn",
    M_url_utils_maybe.compareByOriginalPositions,
    M_search_utils_maybe.LEAST_UPPER_BOUND
  );
  if (s >= 0) {
    var a = this._originalMappings[s];
    if (undefined === e.column)
      for (var c = a.originalLine; a && a.originalLine === c; ) {
        i.push({
          line: M_url_utils_maybe.getArg(a, "generatedLine", null),
          column: M_url_utils_maybe.getArg(a, "generatedColumn", null),
          lastColumn: M_url_utils_maybe.getArg(a, "lastGeneratedColumn", null),
        });
        a = this._originalMappings[++s];
      }
    else
      for (
        var l = a.originalColumn;
        a && a.originalLine === t && a.originalColumn == l;

      ) {
        i.push({
          line: M_url_utils_maybe.getArg(a, "generatedLine", null),
          column: M_url_utils_maybe.getArg(a, "generatedColumn", null),
          lastColumn: M_url_utils_maybe.getArg(a, "lastGeneratedColumn", null),
        });
        a = this._originalMappings[++s];
      }
  }
  return i;
};
exports.SourceMapConsumer = SourceMapConsumer;
l.prototype = Object.create(SourceMapConsumer.prototype);
l.prototype.consumer = SourceMapConsumer;
l.prototype._findSourceIndex = function (e) {
  var t;
  var n = e;
  if (null != this.sourceRoot) {
    n = M_url_utils_maybe.relative(this.sourceRoot, n);
  }
  if (this._sources.has(n)) return this._sources.indexOf(n);
  for (t = 0; t < this._absoluteSources.length; ++t)
    if (this._absoluteSources[t] == e) return t;
  return -1;
};
l.fromSourceMap = function (e, t) {
  var n = Object.create(l.prototype);
  var o = (n._names = i.fromArray(e._names.toArray(), !0));
  var s = (n._sources = i.fromArray(e._sources.toArray(), !0));
  n.sourceRoot = e._sourceRoot;
  n.sourcesContent = e._generateSourcesContent(
    n._sources.toArray(),
    n.sourceRoot
  );
  n.file = e._file;
  n._sourceMapURL = t;
  n._absoluteSources = n._sources.toArray().map(function (e) {
    return M_url_utils_maybe.computeSourceURL(n.sourceRoot, e, t);
  });
  for (
    c = e._mappings.toArray().slice(),
      d = n.__generatedMappings = [],
      p = n.__originalMappings = [],
      h = 0,
      f = c.length,
      undefined;
    h < f;
    h++
  ) {
    var c;
    var d;
    var p;
    var h;
    var f;
    var m = c[h];
    var g = new u();
    g.generatedLine = m.generatedLine;
    g.generatedColumn = m.generatedColumn;
    if (m.source) {
      g.source = s.indexOf(m.source);
      g.originalLine = m.originalLine;
      g.originalColumn = m.originalColumn;
      if (m.name) {
        g.name = o.indexOf(m.name);
      }
      p.push(g);
    }
    d.push(g);
  }
  a(n.__originalMappings, M_url_utils_maybe.compareByOriginalPositions);
  return n;
};
l.prototype._version = 3;
Object.defineProperty(l.prototype, "sources", {
  get: function () {
    return this._absoluteSources.slice();
  },
});
l.prototype._parseMappings = function (e, t) {
  for (
    d = 1,
      p = 0,
      h = 0,
      f = 0,
      m = 0,
      g = 0,
      _ = e.length,
      y = 0,
      v = {},
      b = {},
      w = [],
      x = [],
      undefined;
    y < _;

  ) {
    var n;
    var o;
    var i;
    var c;
    var l;
    var d;
    var p;
    var h;
    var f;
    var m;
    var g;
    var _;
    var y;
    var v;
    var b;
    var w;
    var x;
    if (";" === e.charAt(y)) {
      d++;
      y++;
      p = 0;
    } else if ("," === e.charAt(y)) y++;
    else {
      for (
        (n = new u()).generatedLine = d, c = y;
        c < _ && !this._charIsMappingSeparator(e, c);
        c++
      );
      if ((i = v[(o = e.slice(y, c))])) y += o.length;
      else {
        for (i = []; y < c; ) {
          M_vlq_maybe.decode(e, y, b);
          l = b.value;
          y = b.rest;
          i.push(l);
        }
        if (2 === i.length)
          throw new Error("Found a source, but no line and column");
        if (3 === i.length)
          throw new Error("Found a source and line, but no column");
        v[o] = i;
      }
      n.generatedColumn = p + i[0];
      p = n.generatedColumn;
      if (i.length > 1) {
        n.source = m + i[1];
        m += i[1];
        n.originalLine = h + i[2];
        h = n.originalLine;
        n.originalLine += 1;
        n.originalColumn = f + i[3];
        f = n.originalColumn;
        if (i.length > 4) {
          n.name = g + i[4];
          g += i[4];
        }
      }
      x.push(n);
      if ("number" == typeof n.originalLine) {
        w.push(n);
      }
    }
  }
  a(x, M_url_utils_maybe.compareByGeneratedPositionsDeflated);
  this.__generatedMappings = x;
  a(w, M_url_utils_maybe.compareByOriginalPositions);
  this.__originalMappings = w;
};
l.prototype._findMapping = function (e, t, n, r, i, s) {
  if (e[n] <= 0)
    throw new TypeError("Line must be greater than or equal to 1, got " + e[n]);
  if (e[r] < 0)
    throw new TypeError(
      "Column must be greater than or equal to 0, got " + e[r]
    );
  return M_search_utils_maybe.search(e, t, i, s);
};
l.prototype.computeColumnSpans = function () {
  for (var e = 0; e < this._generatedMappings.length; ++e) {
    var t = this._generatedMappings[e];
    if (e + 1 < this._generatedMappings.length) {
      var n = this._generatedMappings[e + 1];
      if (t.generatedLine === n.generatedLine) {
        t.lastGeneratedColumn = n.generatedColumn - 1;
        continue;
      }
    }
    t.lastGeneratedColumn = 1 / 0;
  }
};
l.prototype.originalPositionFor = function (e) {
  var t = {
    generatedLine: M_url_utils_maybe.getArg(e, "line"),
    generatedColumn: M_url_utils_maybe.getArg(e, "column"),
  };
  var n = this._findMapping(
    t,
    this._generatedMappings,
    "generatedLine",
    "generatedColumn",
    M_url_utils_maybe.compareByGeneratedPositionsDeflated,
    M_url_utils_maybe.getArg(e, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
  );
  if (n >= 0) {
    var o = this._generatedMappings[n];
    if (o.generatedLine === t.generatedLine) {
      var i = M_url_utils_maybe.getArg(o, "source", null);
      if (null !== i) {
        i = this._sources.at(i);
        i = M_url_utils_maybe.computeSourceURL(
          this.sourceRoot,
          i,
          this._sourceMapURL
        );
      }
      var s = M_url_utils_maybe.getArg(o, "name", null);
      if (null !== s) {
        s = this._names.at(s);
      }
      return {
        source: i,
        line: M_url_utils_maybe.getArg(o, "originalLine", null),
        column: M_url_utils_maybe.getArg(o, "originalColumn", null),
        name: s,
      };
    }
  }
  return {
    source: null,
    line: null,
    column: null,
    name: null,
  };
};
l.prototype.hasContentsOfAllSources = function () {
  return (
    !!this.sourcesContent &&
    this.sourcesContent.length >= this._sources.size() &&
    !this.sourcesContent.some(function (e) {
      return null == e;
    })
  );
};
l.prototype.sourceContentFor = function (e, t) {
  if (!this.sourcesContent) return null;
  var n = this._findSourceIndex(e);
  if (n >= 0) return this.sourcesContent[n];
  var o;
  var i = e;
  if (null != this.sourceRoot) {
    i = M_url_utils_maybe.relative(this.sourceRoot, i);
  }
  if (
    null != this.sourceRoot &&
    (o = M_url_utils_maybe.urlParse(this.sourceRoot))
  ) {
    var s = i.replace(/^file:\/\//, "");
    if ("file" == o.scheme && this._sources.has(s))
      return this.sourcesContent[this._sources.indexOf(s)];
    if ((!o.path || "/" == o.path) && this._sources.has("/" + i))
      return this.sourcesContent[this._sources.indexOf("/" + i)];
  }
  if (t) return null;
  throw new Error('"' + i + '" is not in the SourceMap.');
};
l.prototype.generatedPositionFor = function (e) {
  var t = M_url_utils_maybe.getArg(e, "source");
  if ((t = this._findSourceIndex(t)) < 0)
    return {
      line: null,
      column: null,
      lastColumn: null,
    };
  var n = {
    source: t,
    originalLine: M_url_utils_maybe.getArg(e, "line"),
    originalColumn: M_url_utils_maybe.getArg(e, "column"),
  };
  var o = this._findMapping(
    n,
    this._originalMappings,
    "originalLine",
    "originalColumn",
    M_url_utils_maybe.compareByOriginalPositions,
    M_url_utils_maybe.getArg(e, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
  );
  if (o >= 0) {
    var i = this._originalMappings[o];
    if (i.source === n.source)
      return {
        line: M_url_utils_maybe.getArg(i, "generatedLine", null),
        column: M_url_utils_maybe.getArg(i, "generatedColumn", null),
        lastColumn: M_url_utils_maybe.getArg(i, "lastGeneratedColumn", null),
      };
  }
  return {
    line: null,
    column: null,
    lastColumn: null,
  };
};
d.prototype = Object.create(SourceMapConsumer.prototype);
d.prototype.constructor = SourceMapConsumer;
d.prototype._version = 3;
Object.defineProperty(d.prototype, "sources", {
  get: function () {
    for (e = [], t = 0, undefined; t < this._sections.length; t++) {
      var e;
      var t;
      for (var n = 0; n < this._sections[t].consumer.sources.length; n++)
        e.push(this._sections[t].consumer.sources[n]);
    }
    return e;
  },
});
d.prototype.originalPositionFor = function (e) {
  var t = {
    generatedLine: M_url_utils_maybe.getArg(e, "line"),
    generatedColumn: M_url_utils_maybe.getArg(e, "column"),
  };
  var n = M_search_utils_maybe.search(t, this._sections, function (e, t) {
    return (
      e.generatedLine - t.generatedOffset.generatedLine ||
      e.generatedColumn - t.generatedOffset.generatedColumn
    );
  });
  var i = this._sections[n];
  return i
    ? i.consumer.originalPositionFor({
        line: t.generatedLine - (i.generatedOffset.generatedLine - 1),
        column:
          t.generatedColumn -
          (i.generatedOffset.generatedLine === t.generatedLine
            ? i.generatedOffset.generatedColumn - 1
            : 0),
        bias: e.bias,
      })
    : {
        source: null,
        line: null,
        column: null,
        name: null,
      };
};
d.prototype.hasContentsOfAllSources = function () {
  return this._sections.every(function (e) {
    return e.consumer.hasContentsOfAllSources();
  });
};
d.prototype.sourceContentFor = function (e, t) {
  for (var n = 0; n < this._sections.length; n++) {
    var r = this._sections[n].consumer.sourceContentFor(e, !0);
    if (r) return r;
  }
  if (t) return null;
  throw new Error('"' + e + '" is not in the SourceMap.');
};
d.prototype.generatedPositionFor = function (e) {
  for (var t = 0; t < this._sections.length; t++) {
    var n = this._sections[t];
    if (
      -1 !== n.consumer._findSourceIndex(M_url_utils_maybe.getArg(e, "source"))
    ) {
      var o = n.consumer.generatedPositionFor(e);
      if (o)
        return {
          line: o.line + (n.generatedOffset.generatedLine - 1),
          column:
            o.column +
            (n.generatedOffset.generatedLine === o.line
              ? n.generatedOffset.generatedColumn - 1
              : 0),
        };
    }
  }
  return {
    line: null,
    column: null,
  };
};
d.prototype._parseMappings = function (e, t) {
  this.__generatedMappings = [];
  this.__originalMappings = [];
  for (var n = 0; n < this._sections.length; n++)
    for (
      o = this._sections[n],
        i = o.consumer._generatedMappings,
        s = 0,
        undefined;
      s < i.length;
      s++
    ) {
      var o;
      var i;
      var s;
      var c = i[s];
      var l = o.consumer._sources.at(c.source);
      l = M_url_utils_maybe.computeSourceURL(
        o.consumer.sourceRoot,
        l,
        this._sourceMapURL
      );
      this._sources.add(l);
      l = this._sources.indexOf(l);
      var u = null;
      if (c.name) {
        u = o.consumer._names.at(c.name);
        this._names.add(u);
        u = this._names.indexOf(u);
      }
      var d = {
        source: l,
        generatedLine: c.generatedLine + (o.generatedOffset.generatedLine - 1),
        generatedColumn:
          c.generatedColumn +
          (o.generatedOffset.generatedLine === c.generatedLine
            ? o.generatedOffset.generatedColumn - 1
            : 0),
        originalLine: c.originalLine,
        originalColumn: c.originalColumn,
        name: u,
      };
      this.__generatedMappings.push(d);
      if ("number" == typeof d.originalLine) {
        this.__originalMappings.push(d);
      }
    }
  a(
    this.__generatedMappings,
    M_url_utils_maybe.compareByGeneratedPositionsDeflated
  );
  a(this.__originalMappings, M_url_utils_maybe.compareByOriginalPositions);
};
