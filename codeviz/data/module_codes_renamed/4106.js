Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_azure_core_tracing_NOTSURE = require("azure-core-tracing");
exports.azuresdk = M_azure_core_tracing_NOTSURE;
var M_bunyan_monkey_patch_NOTSURE = require("bunyan-monkey-patch");
exports.bunyan = M_bunyan_monkey_patch_NOTSURE;
var M_console_hook_NOTSURE = require("console-hook");
exports.console = M_console_hook_NOTSURE;
var M_mongo_core_monkey_patch_NOTSURE = require("mongo-core-monkey-patch");
exports.mongodbCore = M_mongo_core_monkey_patch_NOTSURE;
var M_mongodb_apm_NOTSURE = require("mongodb-apm");
exports.mongodb = M_mongodb_apm_NOTSURE;
var M_mysql_trace_patch_NOTSURE = require("mysql-trace-patch");
exports.mysql = M_mysql_trace_patch_NOTSURE;
var M_postgres_pool_monkey_patch_NOTSURE = require("postgres-pool-monkey-patch");
exports.pgPool = M_postgres_pool_monkey_patch_NOTSURE;
var M_postgres_diagnostics_NOTSURE = require("postgres-diagnostics");
exports.pg = M_postgres_diagnostics_NOTSURE;
var M_redis_monkey_patch_NOTSURE = require("redis-monkey-patch");
exports.redis = M_redis_monkey_patch_NOTSURE;
var M_tedious_opentelemetry_NOTSURE = require("tedious-opentelemetry");
exports.tedious = M_tedious_opentelemetry_NOTSURE;
var M_winston_patcher_NOTSURE = require("winston-patcher");
exports.winston = M_winston_patcher_NOTSURE;
exports.enable = function () {
  M_bunyan_monkey_patch_NOTSURE.enable();
  M_console_hook_NOTSURE.enable();
  M_mongo_core_monkey_patch_NOTSURE.enable();
  M_mongodb_apm_NOTSURE.enable();
  M_mysql_trace_patch_NOTSURE.enable();
  M_postgres_diagnostics_NOTSURE.enable();
  M_postgres_pool_monkey_patch_NOTSURE.enable();
  M_redis_monkey_patch_NOTSURE.enable();
  M_winston_patcher_NOTSURE.enable();
  M_azure_core_tracing_NOTSURE.enable();
  M_tedious_opentelemetry_NOTSURE.enable();
};
