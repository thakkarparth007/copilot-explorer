Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var M_azure_core_tracing_maybe = require("azure-core-tracing");
exports.azuresdk = M_azure_core_tracing_maybe;
var M_bunyan_monkey_patch_maybe = require("bunyan-monkey-patch");
exports.bunyan = M_bunyan_monkey_patch_maybe;
var M_console_hook_maybe = require("console-hook");
exports.console = M_console_hook_maybe;
var M_mongo_core_monkey_patch_maybe = require("mongo-core-monkey-patch");
exports.mongodbCore = M_mongo_core_monkey_patch_maybe;
var M_mongodb_apm_maybe = require("mongodb-apm");
exports.mongodb = M_mongodb_apm_maybe;
var M_mysql_trace_patch_maybe = require("mysql-trace-patch");
exports.mysql = M_mysql_trace_patch_maybe;
var M_postgres_pool_monkey_patch_maybe = require("postgres-pool-monkey-patch");
exports.pgPool = M_postgres_pool_monkey_patch_maybe;
var M_postgres_diagnostics_maybe = require("postgres-diagnostics");
exports.pg = M_postgres_diagnostics_maybe;
var M_redis_monkey_patch_maybe = require("redis-monkey-patch");
exports.redis = M_redis_monkey_patch_maybe;
var M_tedious_opentelemetry_maybe = require("tedious-opentelemetry");
exports.tedious = M_tedious_opentelemetry_maybe;
var M_winston_patcher_maybe = require("winston-patcher");
exports.winston = M_winston_patcher_maybe;
exports.enable = function () {
  M_bunyan_monkey_patch_maybe.enable();
  M_console_hook_maybe.enable();
  M_mongo_core_monkey_patch_maybe.enable();
  M_mongodb_apm_maybe.enable();
  M_mysql_trace_patch_maybe.enable();
  M_postgres_diagnostics_maybe.enable();
  M_postgres_pool_monkey_patch_maybe.enable();
  M_redis_monkey_patch_maybe.enable();
  M_winston_patcher_maybe.enable();
  M_azure_core_tracing_maybe.enable();
  M_tedious_opentelemetry_maybe.enable();
};
