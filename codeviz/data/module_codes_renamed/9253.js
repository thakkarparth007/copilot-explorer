var M_app_id_lookup_NOTSURE = require("app-id-lookup"),
  M_telemetry_config_parser_NOTSURE = require("telemetry-config-parser"),
  M_quickpulse_constants_NOTSURE = require("quickpulse-constants"),
  s = require("url"),
  a = (function () {
    function e(t) {
      var n = this;
      this.endpointBase =
        M_quickpulse_constants_NOTSURE.DEFAULT_BREEZE_ENDPOINT;
      var r = process.env[e.ENV_connectionString],
        a = M_telemetry_config_parser_NOTSURE.parse(t),
        c = M_telemetry_config_parser_NOTSURE.parse(r),
        l = !a.instrumentationkey && Object.keys(a).length > 0 ? null : t;
      this.instrumentationKey =
        a.instrumentationkey ||
        l ||
        c.instrumentationkey ||
        e._getInstrumentationKey();
      this.endpointUrl =
        (a.ingestionendpoint || c.ingestionendpoint || this.endpointBase) +
        "/v2/track";
      this.maxBatchSize = 250;
      this.maxBatchIntervalMs = 15e3;
      this.disableAppInsights = !1;
      this.samplingPercentage = 100;
      this.correlationIdRetryIntervalMs = 3e4;
      this.correlationHeaderExcludedDomains = [
        "*.core.windows.net",
        "*.core.chinacloudapi.cn",
        "*.core.cloudapi.de",
        "*.core.usgovcloudapi.net",
        "*.core.microsoft.scloud",
        "*.core.eaglex.ic.gov",
      ];
      this.setCorrelationId = function (e) {
        return (n.correlationId = e);
      };
      this.proxyHttpUrl = process.env[e.ENV_http_proxy] || undefined;
      this.proxyHttpsUrl = process.env[e.ENV_https_proxy] || undefined;
      this.httpAgent = undefined;
      this.httpsAgent = undefined;
      this.profileQueryEndpoint =
        a.ingestionendpoint ||
        c.ingestionendpoint ||
        process.env[e.ENV_profileQueryEndpoint] ||
        this.endpointBase;
      this._quickPulseHost =
        a.liveendpoint ||
        c.liveendpoint ||
        process.env[e.ENV_quickPulseHost] ||
        M_quickpulse_constants_NOTSURE.DEFAULT_LIVEMETRICS_HOST;
      if (this._quickPulseHost.match(/^https?:\/\//)) {
        this._quickPulseHost = s.parse(this._quickPulseHost).host;
      }
    }
    Object.defineProperty(e.prototype, "profileQueryEndpoint", {
      get: function () {
        return this._profileQueryEndpoint;
      },
      set: function (e) {
        M_app_id_lookup_NOTSURE.cancelCorrelationIdQuery(
          this,
          this.setCorrelationId
        );
        this._profileQueryEndpoint = e;
        this.correlationId = M_app_id_lookup_NOTSURE.correlationIdPrefix;
        M_app_id_lookup_NOTSURE.queryCorrelationId(this, this.setCorrelationId);
      },
      enumerable: !0,
      configurable: !0,
    });
    Object.defineProperty(e.prototype, "quickPulseHost", {
      get: function () {
        return this._quickPulseHost;
      },
      set: function (e) {
        this._quickPulseHost = e;
      },
      enumerable: !0,
      configurable: !0,
    });
    e._getInstrumentationKey = function () {
      var t =
        process.env[e.ENV_iKey] ||
        process.env[e.ENV_azurePrefix + e.ENV_iKey] ||
        process.env[e.legacy_ENV_iKey] ||
        process.env[e.ENV_azurePrefix + e.legacy_ENV_iKey];
      if (!t || "" == t)
        throw new Error(
          "Instrumentation key not found, pass the key in the config to this method or set the key in the environment variable APPINSIGHTS_INSTRUMENTATIONKEY before starting the server"
        );
      return t;
    };
    e.ENV_azurePrefix = "APPSETTING_";
    e.ENV_iKey = "APPINSIGHTS_INSTRUMENTATIONKEY";
    e.legacy_ENV_iKey = "APPINSIGHTS_INSTRUMENTATION_KEY";
    e.ENV_profileQueryEndpoint = "APPINSIGHTS_PROFILE_QUERY_ENDPOINT";
    e.ENV_quickPulseHost = "APPINSIGHTS_QUICKPULSE_HOST";
    e.ENV_connectionString = "APPLICATIONINSIGHTS_CONNECTION_STRING";
    e.ENV_nativeMetricsDisablers =
      "APPLICATION_INSIGHTS_DISABLE_EXTENDED_METRIC";
    e.ENV_nativeMetricsDisableAll =
      "APPLICATION_INSIGHTS_DISABLE_ALL_EXTENDED_METRICS";
    e.ENV_http_proxy = "http_proxy";
    e.ENV_https_proxy = "https_proxy";
    return e;
  })();
module.exports = a;
