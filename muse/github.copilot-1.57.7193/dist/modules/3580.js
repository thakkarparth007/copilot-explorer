var n, r, o;
Object.defineProperty(exports, "__esModule", {
  value: !0
});
exports.DEFAULT_BREEZE_ENDPOINT = "https://dc.services.visualstudio.com";
exports.DEFAULT_LIVEMETRICS_ENDPOINT = "https://rt.services.visualstudio.com";
exports.DEFAULT_LIVEMETRICS_HOST = "rt.services.visualstudio.com";
(function (e) {
  e.COMMITTED_BYTES = "\\Memory\\Committed Bytes";
  e.PROCESSOR_TIME = "\\Processor(_Total)\\% Processor Time";
  e.REQUEST_RATE = "\\ApplicationInsights\\Requests/Sec";
  e.REQUEST_FAILURE_RATE = "\\ApplicationInsights\\Requests Failed/Sec";
  e.REQUEST_DURATION = "\\ApplicationInsights\\Request Duration";
  e.DEPENDENCY_RATE = "\\ApplicationInsights\\Dependency Calls/Sec";
  e.DEPENDENCY_FAILURE_RATE = "\\ApplicationInsights\\Dependency Calls Failed/Sec";
  e.DEPENDENCY_DURATION = "\\ApplicationInsights\\Dependency Call Duration";
  e.EXCEPTION_RATE = "\\ApplicationInsights\\Exceptions/Sec";
})(n = exports.QuickPulseCounter || (exports.QuickPulseCounter = {}));
(function (e) {
  e.PRIVATE_BYTES = "\\Process(??APP_WIN32_PROC??)\\Private Bytes";
  e.AVAILABLE_BYTES = "\\Memory\\Available Bytes";
  e.PROCESSOR_TIME = "\\Processor(_Total)\\% Processor Time";
  e.PROCESS_TIME = "\\Process(??APP_WIN32_PROC??)\\% Processor Time";
  e.REQUEST_RATE = "\\ASP.NET Applications(??APP_W3SVC_PROC??)\\Requests/Sec";
  e.REQUEST_DURATION = "\\ASP.NET Applications(??APP_W3SVC_PROC??)\\Request Execution Time";
})(r = exports.PerformanceCounter || (exports.PerformanceCounter = {}));
exports.PerformanceToQuickPulseCounter = ((o = {})[r.PROCESSOR_TIME] = n.PROCESSOR_TIME, o[r.REQUEST_RATE] = n.REQUEST_RATE, o[r.REQUEST_DURATION] = n.REQUEST_DURATION, o[n.COMMITTED_BYTES] = n.COMMITTED_BYTES, o[n.REQUEST_FAILURE_RATE] = n.REQUEST_FAILURE_RATE, o[n.DEPENDENCY_RATE] = n.DEPENDENCY_RATE, o[n.DEPENDENCY_FAILURE_RATE] = n.DEPENDENCY_FAILURE_RATE, o[n.DEPENDENCY_DURATION] = n.DEPENDENCY_DURATION, o[n.EXCEPTION_RATE] = n.EXCEPTION_RATE, o);
exports.QuickPulseDocumentType = {
  Event: "Event",
  Exception: "Exception",
  Trace: "Trace",
  Metric: "Metric",
  Request: "Request",
  Dependency: "RemoteDependency",
  Availability: "Availability"
};
exports.QuickPulseType = {
  Event: "EventTelemetryDocument",
  Exception: "ExceptionTelemetryDocument",
  Trace: "TraceTelemetryDocument",
  Metric: "MetricTelemetryDocument",
  Request: "RequestTelemetryDocument",
  Dependency: "DependencyTelemetryDocument",
  Availability: "AvailabilityTelemetryDocument"
};
exports.TelemetryTypeStringToQuickPulseType = {
  EventData: exports.QuickPulseType.Event,
  ExceptionData: exports.QuickPulseType.Exception,
  MessageData: exports.QuickPulseType.Trace,
  MetricData: exports.QuickPulseType.Metric,
  RequestData: exports.QuickPulseType.Request,
  RemoteDependencyData: exports.QuickPulseType.Dependency,
  AvailabilityData: exports.QuickPulseType.Availability
};
exports.TelemetryTypeStringToQuickPulseDocumentType = {
  EventData: exports.QuickPulseDocumentType.Event,
  ExceptionData: exports.QuickPulseDocumentType.Exception,
  MessageData: exports.QuickPulseDocumentType.Trace,
  MetricData: exports.QuickPulseDocumentType.Metric,
  RequestData: exports.QuickPulseDocumentType.Request,
  RemoteDependencyData: exports.QuickPulseDocumentType.Dependency,
  AvailabilityData: exports.QuickPulseDocumentType.Availability
};