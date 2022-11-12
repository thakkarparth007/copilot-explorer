var r = require(2728),
  o = require(9216),
  i = require(8213).I,
  s = require(6400),
  a = require(2826).U;
function c(e, t) {
  var n = e;
  "string" == typeof e && (n = r.parseSourceMapInput(e));
  return null != n.sections ? new d(n, t) : new l(n, t);
}
function l(e, t) {
  var n = e;
  "string" == typeof e && (n = r.parseSourceMapInput(e));
  var o = r.getArg(n, "version"),
    s = r.getArg(n, "sources"),
    a = r.getArg(n, "names", []),
    c = r.getArg(n, "sourceRoot", null),
    l = r.getArg(n, "sourcesContent", null),
    u = r.getArg(n, "mappings"),
    d = r.getArg(n, "file", null);
  if (o != this._version) throw new Error("Unsupported version: " + o);
  c && (c = r.normalize(c));
  s = s.map(String).map(r.normalize).map(function (e) {
    return c && r.isAbsolute(c) && r.isAbsolute(e) ? r.relative(c, e) : e;
  });
  this._names = i.fromArray(a.map(String), !0);
  this._sources = i.fromArray(s, !0);
  this._absoluteSources = this._sources.toArray().map(function (e) {
    return r.computeSourceURL(c, e, t);
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
  "string" == typeof e && (n = r.parseSourceMapInput(e));
  var o = r.getArg(n, "version"),
    s = r.getArg(n, "sections");
  if (o != this._version) throw new Error("Unsupported version: " + o);
  this._sources = new i();
  this._names = new i();
  var a = {
    line: -1,
    column: 0
  };
  this._sections = s.map(function (e) {
    if (e.url) throw new Error("Support for url field in sections not implemented.");
    var n = r.getArg(e, "offset"),
      o = r.getArg(n, "line"),
      i = r.getArg(n, "column");
    if (o < a.line || o === a.line && i < a.column) throw new Error("Section offsets must be ordered and non-overlapping.");
    a = n;
    return {
      generatedOffset: {
        generatedLine: o + 1,
        generatedColumn: i + 1
      },
      consumer: new c(r.getArg(e, "map"), t)
    };
  });
}
c.fromSourceMap = function (e, t) {
  return l.fromSourceMap(e, t);
};
c.prototype._version = 3;
c.prototype.__generatedMappings = null;
Object.defineProperty(c.prototype, "_generatedMappings", {
  configurable: !0,
  enumerable: !0,
  get: function () {
    this.__generatedMappings || this._parseMappings(this._mappings, this.sourceRoot);
    return this.__generatedMappings;
  }
});
c.prototype.__originalMappings = null;
Object.defineProperty(c.prototype, "_originalMappings", {
  configurable: !0,
  enumerable: !0,
  get: function () {
    this.__originalMappings || this._parseMappings(this._mappings, this.sourceRoot);
    return this.__originalMappings;
  }
});
c.prototype._charIsMappingSeparator = function (e, t) {
  var n = e.charAt(t);
  return ";" === n || "," === n;
};
c.prototype._parseMappings = function (e, t) {
  throw new Error("Subclasses must implement _parseMappings");
};
c.GENERATED_ORDER = 1;
c.ORIGINAL_ORDER = 2;
c.GREATEST_LOWER_BOUND = 1;
c.LEAST_UPPER_BOUND = 2;
c.prototype.eachMapping = function (e, t, n) {
  var o,
    i = t || null;
  switch (n || c.GENERATED_ORDER) {
    case c.GENERATED_ORDER:
      o = this._generatedMappings;
      break;
    case c.ORIGINAL_ORDER:
      o = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
  }
  var s = this.sourceRoot;
  o.map(function (e) {
    var t = null === e.source ? null : this._sources.at(e.source);
    return {
      source: t = r.computeSourceURL(s, t, this._sourceMapURL),
      generatedLine: e.generatedLine,
      generatedColumn: e.generatedColumn,
      originalLine: e.originalLine,
      originalColumn: e.originalColumn,
      name: null === e.name ? null : this._names.at(e.name)
    };
  }, this).forEach(e, i);
};
c.prototype.allGeneratedPositionsFor = function (e) {
  var t = r.getArg(e, "line"),
    n = {
      source: r.getArg(e, "source"),
      originalLine: t,
      originalColumn: r.getArg(e, "column", 0)
    };
  n.source = this._findSourceIndex(n.source);
  if (n.source < 0) return [];
  var i = [],
    s = this._findMapping(n, this._originalMappings, "originalLine", "originalColumn", r.compareByOriginalPositions, o.LEAST_UPPER_BOUND);
  if (s >= 0) {
    var a = this._originalMappings[s];
    if (undefined === e.column) for (var c = a.originalLine; a && a.originalLine === c;) {
      i.push({
        line: r.getArg(a, "generatedLine", null),
        column: r.getArg(a, "generatedColumn", null),
        lastColumn: r.getArg(a, "lastGeneratedColumn", null)
      });
      a = this._originalMappings[++s];
    } else for (var l = a.originalColumn; a && a.originalLine === t && a.originalColumn == l;) {
      i.push({
        line: r.getArg(a, "generatedLine", null),
        column: r.getArg(a, "generatedColumn", null),
        lastColumn: r.getArg(a, "lastGeneratedColumn", null)
      });
      a = this._originalMappings[++s];
    }
  }
  return i;
};
exports.SourceMapConsumer = c;
l.prototype = Object.create(c.prototype);
l.prototype.consumer = c;
l.prototype._findSourceIndex = function (e) {
  var t,
    n = e;
  null != this.sourceRoot && (n = r.relative(this.sourceRoot, n));
  if (this._sources.has(n)) return this._sources.indexOf(n);
  for (t = 0; t < this._absoluteSources.length; ++t) if (this._absoluteSources[t] == e) return t;
  return -1;
};
l.fromSourceMap = function (e, t) {
  var n = Object.create(l.prototype),
    o = n._names = i.fromArray(e._names.toArray(), !0),
    s = n._sources = i.fromArray(e._sources.toArray(), !0);
  n.sourceRoot = e._sourceRoot;
  n.sourcesContent = e._generateSourcesContent(n._sources.toArray(), n.sourceRoot);
  n.file = e._file;
  n._sourceMapURL = t;
  n._absoluteSources = n._sources.toArray().map(function (e) {
    return r.computeSourceURL(n.sourceRoot, e, t);
  });
  for (var c = e._mappings.toArray().slice(), d = n.__generatedMappings = [], p = n.__originalMappings = [], h = 0, f = c.length; h < f; h++) {
    var m = c[h],
      g = new u();
    g.generatedLine = m.generatedLine;
    g.generatedColumn = m.generatedColumn;
    m.source && (g.source = s.indexOf(m.source), g.originalLine = m.originalLine, g.originalColumn = m.originalColumn, m.name && (g.name = o.indexOf(m.name)), p.push(g));
    d.push(g);
  }
  a(n.__originalMappings, r.compareByOriginalPositions);
  return n;
};
l.prototype._version = 3;
Object.defineProperty(l.prototype, "sources", {
  get: function () {
    return this._absoluteSources.slice();
  }
});
l.prototype._parseMappings = function (e, t) {
  for (var n, o, i, c, l, d = 1, p = 0, h = 0, f = 0, m = 0, g = 0, _ = e.length, y = 0, v = {}, b = {}, w = [], x = []; y < _;) if (";" === e.charAt(y)) {
    d++;
    y++;
    p = 0;
  } else if ("," === e.charAt(y)) y++;else {
    for ((n = new u()).generatedLine = d, c = y; c < _ && !this._charIsMappingSeparator(e, c); c++);
    if (i = v[o = e.slice(y, c)]) y += o.length;else {
      for (i = []; y < c;) {
        s.decode(e, y, b);
        l = b.value;
        y = b.rest;
        i.push(l);
      }
      if (2 === i.length) throw new Error("Found a source, but no line and column");
      if (3 === i.length) throw new Error("Found a source and line, but no column");
      v[o] = i;
    }
    n.generatedColumn = p + i[0];
    p = n.generatedColumn;
    i.length > 1 && (n.source = m + i[1], m += i[1], n.originalLine = h + i[2], h = n.originalLine, n.originalLine += 1, n.originalColumn = f + i[3], f = n.originalColumn, i.length > 4 && (n.name = g + i[4], g += i[4]));
    x.push(n);
    "number" == typeof n.originalLine && w.push(n);
  }
  a(x, r.compareByGeneratedPositionsDeflated);
  this.__generatedMappings = x;
  a(w, r.compareByOriginalPositions);
  this.__originalMappings = w;
};
l.prototype._findMapping = function (e, t, n, r, i, s) {
  if (e[n] <= 0) throw new TypeError("Line must be greater than or equal to 1, got " + e[n]);
  if (e[r] < 0) throw new TypeError("Column must be greater than or equal to 0, got " + e[r]);
  return o.search(e, t, i, s);
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
      generatedLine: r.getArg(e, "line"),
      generatedColumn: r.getArg(e, "column")
    },
    n = this._findMapping(t, this._generatedMappings, "generatedLine", "generatedColumn", r.compareByGeneratedPositionsDeflated, r.getArg(e, "bias", c.GREATEST_LOWER_BOUND));
  if (n >= 0) {
    var o = this._generatedMappings[n];
    if (o.generatedLine === t.generatedLine) {
      var i = r.getArg(o, "source", null);
      null !== i && (i = this._sources.at(i), i = r.computeSourceURL(this.sourceRoot, i, this._sourceMapURL));
      var s = r.getArg(o, "name", null);
      null !== s && (s = this._names.at(s));
      return {
        source: i,
        line: r.getArg(o, "originalLine", null),
        column: r.getArg(o, "originalColumn", null),
        name: s
      };
    }
  }
  return {
    source: null,
    line: null,
    column: null,
    name: null
  };
};
l.prototype.hasContentsOfAllSources = function () {
  return !!this.sourcesContent && this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function (e) {
    return null == e;
  });
};
l.prototype.sourceContentFor = function (e, t) {
  if (!this.sourcesContent) return null;
  var n = this._findSourceIndex(e);
  if (n >= 0) return this.sourcesContent[n];
  var o,
    i = e;
  null != this.sourceRoot && (i = r.relative(this.sourceRoot, i));
  if (null != this.sourceRoot && (o = r.urlParse(this.sourceRoot))) {
    var s = i.replace(/^file:\/\//, "");
    if ("file" == o.scheme && this._sources.has(s)) return this.sourcesContent[this._sources.indexOf(s)];
    if ((!o.path || "/" == o.path) && this._sources.has("/" + i)) return this.sourcesContent[this._sources.indexOf("/" + i)];
  }
  if (t) return null;
  throw new Error('"' + i + '" is not in the SourceMap.');
};
l.prototype.generatedPositionFor = function (e) {
  var t = r.getArg(e, "source");
  if ((t = this._findSourceIndex(t)) < 0) return {
    line: null,
    column: null,
    lastColumn: null
  };
  var n = {
      source: t,
      originalLine: r.getArg(e, "line"),
      originalColumn: r.getArg(e, "column")
    },
    o = this._findMapping(n, this._originalMappings, "originalLine", "originalColumn", r.compareByOriginalPositions, r.getArg(e, "bias", c.GREATEST_LOWER_BOUND));
  if (o >= 0) {
    var i = this._originalMappings[o];
    if (i.source === n.source) return {
      line: r.getArg(i, "generatedLine", null),
      column: r.getArg(i, "generatedColumn", null),
      lastColumn: r.getArg(i, "lastGeneratedColumn", null)
    };
  }
  return {
    line: null,
    column: null,
    lastColumn: null
  };
};
d.prototype = Object.create(c.prototype);
d.prototype.constructor = c;
d.prototype._version = 3;
Object.defineProperty(d.prototype, "sources", {
  get: function () {
    for (var e = [], t = 0; t < this._sections.length; t++) for (var n = 0; n < this._sections[t].consumer.sources.length; n++) e.push(this._sections[t].consumer.sources[n]);
    return e;
  }
});
d.prototype.originalPositionFor = function (e) {
  var t = {
      generatedLine: r.getArg(e, "line"),
      generatedColumn: r.getArg(e, "column")
    },
    n = o.search(t, this._sections, function (e, t) {
      return e.generatedLine - t.generatedOffset.generatedLine || e.generatedColumn - t.generatedOffset.generatedColumn;
    }),
    i = this._sections[n];
  return i ? i.consumer.originalPositionFor({
    line: t.generatedLine - (i.generatedOffset.generatedLine - 1),
    column: t.generatedColumn - (i.generatedOffset.generatedLine === t.generatedLine ? i.generatedOffset.generatedColumn - 1 : 0),
    bias: e.bias
  }) : {
    source: null,
    line: null,
    column: null,
    name: null
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
    if (-1 !== n.consumer._findSourceIndex(r.getArg(e, "source"))) {
      var o = n.consumer.generatedPositionFor(e);
      if (o) return {
        line: o.line + (n.generatedOffset.generatedLine - 1),
        column: o.column + (n.generatedOffset.generatedLine === o.line ? n.generatedOffset.generatedColumn - 1 : 0)
      };
    }
  }
  return {
    line: null,
    column: null
  };
};
d.prototype._parseMappings = function (e, t) {
  this.__generatedMappings = [];
  this.__originalMappings = [];
  for (var n = 0; n < this._sections.length; n++) for (var o = this._sections[n], i = o.consumer._generatedMappings, s = 0; s < i.length; s++) {
    var c = i[s],
      l = o.consumer._sources.at(c.source);
    l = r.computeSourceURL(o.consumer.sourceRoot, l, this._sourceMapURL);
    this._sources.add(l);
    l = this._sources.indexOf(l);
    var u = null;
    c.name && (u = o.consumer._names.at(c.name), this._names.add(u), u = this._names.indexOf(u));
    var d = {
      source: l,
      generatedLine: c.generatedLine + (o.generatedOffset.generatedLine - 1),
      generatedColumn: c.generatedColumn + (o.generatedOffset.generatedLine === c.generatedLine ? o.generatedOffset.generatedColumn - 1 : 0),
      originalLine: c.originalLine,
      originalColumn: c.originalColumn,
      name: u
    };
    this.__generatedMappings.push(d);
    "number" == typeof d.originalLine && this.__originalMappings.push(d);
  }
  a(this.__generatedMappings, r.compareByGeneratedPositionsDeflated);
  a(this.__originalMappings, r.compareByOriginalPositions);
};