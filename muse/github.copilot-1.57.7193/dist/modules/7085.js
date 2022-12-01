var r = require(4433).h,
  o = require(2728),
  i = /(\r?\n)/,
  s = "$$$isSourceNode$$$";
function a(e, t, n, r, o) {
  this.children = [];
  this.sourceContents = {};
  this.line = null == e ? null : e;
  this.column = null == t ? null : t;
  this.source = null == n ? null : n;
  this.name = null == o ? null : o;
  this[s] = !0;
  if (null != r) {
    this.add(r);
  }
}
a.fromStringWithSourceMap = function (e, t, n) {
  var r = new a(),
    s = e.split(i),
    c = 0,
    l = function () {
      return e() + (e() || "");
      function e() {
        return c < s.length ? s[c++] : undefined;
      }
    },
    u = 1,
    d = 0,
    p = null;
  t.eachMapping(function (e) {
    if (null !== p) {
      if (!(u < e.generatedLine)) {
        var t = (n = s[c] || "").substr(0, e.generatedColumn - d);
        s[c] = n.substr(e.generatedColumn - d);
        d = e.generatedColumn;
        h(p, t);
        return void (p = e);
      }
      h(p, l());
      u++;
      d = 0;
    }
    for (; u < e.generatedLine; ) {
      r.add(l());
      u++;
    }
    if (d < e.generatedColumn) {
      var n = s[c] || "";
      r.add(n.substr(0, e.generatedColumn));
      s[c] = n.substr(e.generatedColumn);
      d = e.generatedColumn;
    }
    p = e;
  }, this);
  if (c < s.length) {
    if (p) {
      h(p, l());
    }
    r.add(s.splice(c).join(""));
  }
  t.sources.forEach(function (e) {
    var i = t.sourceContentFor(e);
    if (null != i) {
      if (null != n) {
        e = o.join(n, e);
      }
      r.setSourceContent(e, i);
    }
  });
  return r;
  function h(e, t) {
    if (null === e || undefined === e.source) r.add(t);
    else {
      var i = n ? o.join(n, e.source) : e.source;
      r.add(new a(e.originalLine, e.originalColumn, i, t, e.name));
    }
  }
};
a.prototype.add = function (e) {
  if (Array.isArray(e))
    e.forEach(function (e) {
      this.add(e);
    }, this);
  else {
    if (!e[s] && "string" != typeof e)
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " +
          e
      );
    if (e) {
      this.children.push(e);
    }
  }
  return this;
};
a.prototype.prepend = function (e) {
  if (Array.isArray(e))
    for (var t = e.length - 1; t >= 0; t--) this.prepend(e[t]);
  else {
    if (!e[s] && "string" != typeof e)
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " +
          e
      );
    this.children.unshift(e);
  }
  return this;
};
a.prototype.walk = function (e) {
  for (var t, n = 0, r = this.children.length; n < r; n++)
    if ((t = this.children[n])[s]) {
      t.walk(e);
    } else {
      if ("" !== t) {
        e(t, {
          source: this.source,
          line: this.line,
          column: this.column,
          name: this.name,
        });
      }
    }
};
a.prototype.join = function (e) {
  var t,
    n,
    r = this.children.length;
  if (r > 0) {
    for (t = [], n = 0; n < r - 1; n++) {
      t.push(this.children[n]);
      t.push(e);
    }
    t.push(this.children[n]);
    this.children = t;
  }
  return this;
};
a.prototype.replaceRight = function (e, t) {
  var n = this.children[this.children.length - 1];
  if (n[s]) {
    n.replaceRight(e, t);
  } else {
    if ("string" == typeof n) {
      this.children[this.children.length - 1] = n.replace(e, t);
    } else {
      this.children.push("".replace(e, t));
    }
  }
  return this;
};
a.prototype.setSourceContent = function (e, t) {
  this.sourceContents[o.toSetString(e)] = t;
};
a.prototype.walkSourceContents = function (e) {
  for (var t = 0, n = this.children.length; t < n; t++)
    if (this.children[t][s]) {
      this.children[t].walkSourceContents(e);
    }
  var r = Object.keys(this.sourceContents);
  for (t = 0, n = r.length; t < n; t++)
    e(o.fromSetString(r[t]), this.sourceContents[r[t]]);
};
a.prototype.toString = function () {
  var e = "";
  this.walk(function (t) {
    e += t;
  });
  return e;
};
a.prototype.toStringWithSourceMap = function (e) {
  var t = {
      code: "",
      line: 1,
      column: 0,
    },
    n = new r(e),
    o = !1,
    i = null,
    s = null,
    a = null,
    c = null;
  this.walk(function (e, r) {
    t.code += e;
    if (null !== r.source && null !== r.line && null !== r.column) {
      if (i === r.source && s === r.line && a === r.column && c === r.name) {
        n.addMapping({
          source: r.source,
          original: {
            line: r.line,
            column: r.column,
          },
          generated: {
            line: t.line,
            column: t.column,
          },
          name: r.name,
        });
      }
      i = r.source;
      s = r.line;
      a = r.column;
      c = r.name;
      o = !0;
    } else {
      if (o) {
        n.addMapping({
          generated: {
            line: t.line,
            column: t.column,
          },
        });
        i = null;
        o = !1;
      }
    }
    for (var l = 0, u = e.length; l < u; l++)
      if (10 === e.charCodeAt(l)) {
        t.line++;
        t.column = 0;
        if (l + 1 === u) {
          i = null;
          o = !1;
        } else {
          if (o) {
            n.addMapping({
              source: r.source,
              original: {
                line: r.line,
                column: r.column,
              },
              generated: {
                line: t.line,
                column: t.column,
              },
              name: r.name,
            });
          }
        }
      } else {
        t.column++;
      }
  });
  this.walkSourceContents(function (e, t) {
    n.setSourceContent(e, t);
  });
  return {
    code: t.code,
    map: n,
  };
};