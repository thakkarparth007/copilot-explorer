var M_fs = require("fs");
var M_os = require("os");
var M_path = require("path");
var M_zlib = require("zlib");
var M_child_process = require("child_process");
var M_logging_maybe = require("logging");
var M_request_tracker_maybe = require("request-tracker");
var M_http_util_maybe = require("http-util");
var d = (function () {
  function e(t, n, o) {
    this._config = t;
    this._onSuccess = n;
    this._onError = o;
    this._enableDiskRetryMode = !1;
    this._resendInterval = e.WAIT_BETWEEN_RESEND;
    this._maxBytesOnDisk = e.MAX_BYTES_ON_DISK;
    this._numConsecutiveFailures = 0;
    if (!e.OS_PROVIDES_FILE_PROTECTION)
      if (e.USE_ICACLS) {
        try {
          e.OS_PROVIDES_FILE_PROTECTION = M_fs.existsSync(e.ICACLS_PATH);
        } catch (e) {}
        e.OS_PROVIDES_FILE_PROTECTION ||
          M_logging_maybe.warn(
            e.TAG,
            "Could not find ICACLS in expected location! This is necessary to use disk retry mode on Windows."
          );
      } else e.OS_PROVIDES_FILE_PROTECTION = !0;
  }
  e.prototype.setDiskRetryMode = function (t, n, r) {
    this._enableDiskRetryMode = e.OS_PROVIDES_FILE_PROTECTION && t;
    if ("number" == typeof n && n >= 0) {
      this._resendInterval = Math.floor(n);
    }
    if ("number" == typeof r && r >= 0) {
      this._maxBytesOnDisk = Math.floor(r);
    }
    if (t && !e.OS_PROVIDES_FILE_PROTECTION) {
      this._enableDiskRetryMode = !1;
      M_logging_maybe.warn(
        e.TAG,
        "Ignoring request to enable disk retry mode. Sufficient file protection capabilities were not detected."
      );
    }
  };
  e.prototype.send = function (t, n) {
    var r = this;
    var o = this._config.endpointUrl;
    var i = {
      method: "POST",
      withCredentials: !1,
      headers: {
        "Content-Type": "application/x-json-stream",
      },
    };
    M_zlib.gzip(t, function (s, a) {
      var d = a;
      if (s) {
        M_logging_maybe.warn(s);
        d = t;
        i.headers["Content-Length"] = t.length.toString();
      } else {
        i.headers["Content-Encoding"] = "gzip";
        i.headers["Content-Length"] = a.length;
      }
      M_logging_maybe.info(e.TAG, i);
      i[M_request_tracker_maybe.disableCollectionRequestOption] = !0;
      var p = M_http_util_maybe.makeRequest(r._config, o, i, function (o) {
        o.setEncoding("utf-8");
        var i = "";
        o.on("data", function (e) {
          i += e;
        });
        o.on("end", function () {
          r._numConsecutiveFailures = 0;
          M_logging_maybe.info(e.TAG, i);
          if ("function" == typeof r._onSuccess) {
            r._onSuccess(i);
          }
          if ("function" == typeof n) {
            n(i);
          }
          if (r._enableDiskRetryMode) {
            if (200 === o.statusCode) {
              setTimeout(function () {
                return r._sendFirstFileOnDisk();
              }, r._resendInterval).unref();
            } else {
              if (
                408 !== o.statusCode &&
                429 !== o.statusCode &&
                439 !== o.statusCode &&
                500 !== o.statusCode &&
                503 !== o.statusCode
              ) {
                r._storeToDisk(t);
              }
            }
          }
        });
      });
      p.on("error", function (o) {
        r._numConsecutiveFailures++;
        if (
          !r._enableDiskRetryMode ||
          (r._numConsecutiveFailures > 0 &&
            r._numConsecutiveFailures % e.MAX_CONNECTION_FAILURES_BEFORE_WARN ==
              0)
        ) {
          var i =
            "Ingestion endpoint could not be reached. This batch of telemetry items has been lost. Use Disk Retry Caching to enable resending of failed telemetry. Error:";
          r._enableDiskRetryMode &&
            (i =
              "Ingestion endpoint could not be reached " +
              r._numConsecutiveFailures +
              " consecutive times. There may be resulting telemetry loss. Most recent error:"),
            M_logging_maybe.warn(e.TAG, i, o);
        } else (i = "Transient failure to reach ingestion endpoint. This batch of telemetry items will be retried. Error:"), M_logging_maybe.info(e.TAG, i, o);
        r._onErrorHelper(o);
        if ("function" == typeof n) {
          var s = "error sending telemetry";
          o && "function" == typeof o.toString && (s = o.toString()), n(s);
        }
        if (r._enableDiskRetryMode) {
          r._storeToDisk(t);
        }
      });
      p.write(d);
      p.end();
    });
  };
  e.prototype.saveOnCrash = function (e) {
    if (this._enableDiskRetryMode) {
      this._storeToDiskSync(e);
    }
  };
  e.prototype._runICACLS = function (t, n) {
    var r = M_child_process.spawn(e.ICACLS_PATH, t, {
      windowsHide: !0,
    });
    r.on("error", function (e) {
      return n(e);
    });
    r.on("close", function (e, t) {
      return n(
        0 === e
          ? null
          : new Error(
              "Setting ACL restrictions did not succeed (ICACLS returned code " +
                e +
                ")"
            )
      );
    });
  };
  e.prototype._runICACLSSync = function (t) {
    if (!M_child_process.spawnSync)
      throw new Error(
        "Could not synchronously call ICACLS under current version of Node.js"
      );
    var n = M_child_process.spawnSync(e.ICACLS_PATH, t, {
      windowsHide: !0,
    });
    if (n.error) throw n.error;
    if (0 !== n.status)
      throw new Error(
        "Setting ACL restrictions did not succeed (ICACLS returned code " +
          n.status +
          ")"
      );
  };
  e.prototype._getACLIdentity = function (t) {
    if (e.ACL_IDENTITY) return t(null, e.ACL_IDENTITY);
    var n = M_child_process.spawn(
      e.POWERSHELL_PATH,
      [
        "-Command",
        "[System.Security.Principal.WindowsIdentity]::GetCurrent().Name",
      ],
      {
        windowsHide: !0,
        stdio: ["ignore", "pipe", "pipe"],
      }
    );
    var r = "";
    n.stdout.on("data", function (e) {
      return (r += e);
    });
    n.on("error", function (e) {
      return t(e, null);
    });
    n.on("close", function (n, o) {
      e.ACL_IDENTITY = r && r.trim();
      return t(
        0 === n
          ? null
          : new Error(
              "Getting ACL identity did not succeed (PS returned code " +
                n +
                ")"
            ),
        e.ACL_IDENTITY
      );
    });
  };
  e.prototype._getACLIdentitySync = function () {
    if (e.ACL_IDENTITY) return e.ACL_IDENTITY;
    if (M_child_process.spawnSync) {
      var t = M_child_process.spawnSync(
        e.POWERSHELL_PATH,
        [
          "-Command",
          "[System.Security.Principal.WindowsIdentity]::GetCurrent().Name",
        ],
        {
          windowsHide: !0,
          stdio: ["ignore", "pipe", "pipe"],
        }
      );
      if (t.error) throw t.error;
      if (0 !== t.status)
        throw new Error(
          "Getting ACL identity did not succeed (PS returned code " +
            t.status +
            ")"
        );
      e.ACL_IDENTITY = t.stdout && t.stdout.toString().trim();
      return e.ACL_IDENTITY;
    }
    throw new Error(
      "Could not synchronously get ACL identity under current version of Node.js"
    );
  };
  e.prototype._getACLArguments = function (e, t) {
    return [
      e,
      "/grant",
      "*S-1-5-32-544:(OI)(CI)F",
      "/grant",
      t + ":(OI)(CI)F",
      "/inheritance:r",
    ];
  };
  e.prototype._applyACLRules = function (t, n) {
    var r = this;
    return e.USE_ICACLS
      ? undefined !== e.ACLED_DIRECTORIES[t]
        ? n(
            e.ACLED_DIRECTORIES[t]
              ? null
              : new Error(
                  "Setting ACL restrictions did not succeed (cached result)"
                )
          )
        : ((e.ACLED_DIRECTORIES[t] = !1),
          void this._getACLIdentity(function (o, i) {
            if (o) {
              e.ACLED_DIRECTORIES[t] = !1;
              return n(o);
            }
            r._runICACLS(r._getACLArguments(t, i), function (r) {
              e.ACLED_DIRECTORIES[t] = !r;
              return n(r);
            });
          }))
      : n(null);
  };
  e.prototype._applyACLRulesSync = function (t) {
    if (e.USE_ICACLS) {
      if (undefined === e.ACLED_DIRECTORIES[t]) {
        this._runICACLSSync(
          this._getACLArguments(t, this._getACLIdentitySync())
        );
        return void (e.ACLED_DIRECTORIES[t] = !0);
      }
      if (!e.ACLED_DIRECTORIES[t])
        throw new Error(
          "Setting ACL restrictions did not succeed (cached result)"
        );
    }
  };
  e.prototype._confirmDirExists = function (e, t) {
    var n = this;
    M_fs.lstat(e, function (o, i) {
      if (o && "ENOENT" === o.code) {
        M_fs.mkdir(e, function (r) {
          if (r && "EEXIST" !== r.code) {
            t(r);
          } else {
            n._applyACLRules(e, t);
          }
        });
      } else {
        if (!o && i.isDirectory()) {
          n._applyACLRules(e, t);
        } else {
          t(o || new Error("Path existed but was not a directory"));
        }
      }
    });
  };
  e.prototype._getShallowDirectorySize = function (e, t) {
    M_fs.readdir(e, function (n, o) {
      if (n) return t(n, -1);
      var s = null;
      var a = 0;
      var c = 0;
      if (0 !== o.length)
        for (var l = 0; l < o.length; l++)
          M_fs.stat(M_path.join(e, o[l]), function (e, n) {
            c++;
            if (e) {
              s = e;
            } else {
              if (n.isFile()) {
                a += n.size;
              }
            }
            if (c === o.length) {
              t(s, s ? -1 : a);
            }
          });
      else t(null, 0);
    });
  };
  e.prototype._getShallowDirectorySizeSync = function (e) {
    for (t = M_fs.readdirSync(e), n = 0, o = 0, undefined; o < t.length; o++) {
      var t;
      var n;
      var o;
      n += M_fs.statSync(M_path.join(e, t[o])).size;
    }
    return n;
  };
  e.prototype._storeToDisk = function (t) {
    var n = this;
    var s = M_path.join(
      M_os.tmpdir(),
      e.TEMPDIR_PREFIX + this._config.instrumentationKey
    );
    M_logging_maybe.info(
      e.TAG,
      "Checking existance of data storage directory: " + s
    );
    this._confirmDirExists(s, function (o) {
      if (o) {
        M_logging_maybe.warn(
          e.TAG,
          "Error while checking/creating directory: " + (o && o.message)
        );
        return void n._onErrorHelper(o);
      }
      n._getShallowDirectorySize(s, function (o, a) {
        if (o || a < 0) {
          M_logging_maybe.warn(
            e.TAG,
            "Error while checking directory size: " + (o && o.message)
          );
          return void n._onErrorHelper(o);
        }
        if (a > n._maxBytesOnDisk)
          M_logging_maybe.warn(
            e.TAG,
            "Not saving data due to max size limit being met. Directory size in bytes is: " +
              a
          );
        else {
          var l = new Date().getTime() + ".ai.json";
          var u = M_path.join(s, l);
          M_logging_maybe.info(e.TAG, "saving data to disk at: " + u);
          M_fs.writeFile(
            u,
            t,
            {
              mode: 384,
            },
            function (e) {
              return n._onErrorHelper(e);
            }
          );
        }
      });
    });
  };
  e.prototype._storeToDiskSync = function (t) {
    var n = M_path.join(
      M_os.tmpdir(),
      e.TEMPDIR_PREFIX + this._config.instrumentationKey
    );
    try {
      M_logging_maybe.info(
        e.TAG,
        "Checking existance of data storage directory: " + n
      );
      if (M_fs.existsSync(n)) {
        M_fs.mkdirSync(n);
      }
      this._applyACLRulesSync(n);
      var s = this._getShallowDirectorySizeSync(n);
      if (s > this._maxBytesOnDisk)
        return void M_logging_maybe.info(
          e.TAG,
          "Not saving data due to max size limit being met. Directory size in bytes is: " +
            s
        );
      var a = new Date().getTime() + ".ai.json";
      var l = M_path.join(n, a);
      M_logging_maybe.info(e.TAG, "saving data before crash to disk at: " + l);
      M_fs.writeFileSync(l, t, {
        mode: 384,
      });
    } catch (t) {
      M_logging_maybe.warn(
        e.TAG,
        "Error while saving data to disk: " + (t && t.message)
      );
      this._onErrorHelper(t);
    }
  };
  e.prototype._sendFirstFileOnDisk = function () {
    var t = this;
    var n = M_path.join(
      M_os.tmpdir(),
      e.TEMPDIR_PREFIX + this._config.instrumentationKey
    );
    M_fs.exists(n, function (e) {
      if (e) {
        M_fs.readdir(n, function (e, o) {
          if (e) t._onErrorHelper(e);
          else if (
            (o = o.filter(function (e) {
              return M_path.basename(e).indexOf(".ai.json") > -1;
            })).length > 0
          ) {
            var s = o[0];
            var a = M_path.join(n, s);
            M_fs.readFile(a, function (e, n) {
              if (e) {
                t._onErrorHelper(e);
              } else {
                M_fs.unlink(a, function (e) {
                  if (e) {
                    t._onErrorHelper(e);
                  } else {
                    t.send(n);
                  }
                });
              }
            });
          }
        });
      }
    });
  };
  e.prototype._onErrorHelper = function (e) {
    if ("function" == typeof this._onError) {
      this._onError(e);
    }
  };
  e.TAG = "Sender";
  e.ICACLS_PATH = process.env.systemdrive + "/windows/system32/icacls.exe";
  e.POWERSHELL_PATH =
    process.env.systemdrive +
    "/windows/system32/windowspowershell/v1.0/powershell.exe";
  e.ACLED_DIRECTORIES = {};
  e.ACL_IDENTITY = null;
  e.WAIT_BETWEEN_RESEND = 6e4;
  e.MAX_BYTES_ON_DISK = 5e7;
  e.MAX_CONNECTION_FAILURES_BEFORE_WARN = 5;
  e.TEMPDIR_PREFIX = "appInsights-node";
  e.OS_PROVIDES_FILE_PROTECTION = !1;
  e.USE_ICACLS = "Windows_NT" === M_os.type();
  return e;
})();
module.exports = d;
