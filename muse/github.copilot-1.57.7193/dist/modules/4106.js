Object.defineProperty(exports, "__esModule", {
  value: !0,
});
var azuresdk = require(8604);
exports.azuresdk = azuresdk;
var bunyan = require(8859);
exports.bunyan = bunyan;
var console = require(2495);
exports.console = console;
var mongodbCore = require(2028);
exports.mongodbCore = mongodbCore;
var mongodb = require(8436);
exports.mongodb = mongodb;
var mysql = require(8002);
exports.mysql = mysql;
var pgPool = require(9024);
exports.pgPool = pgPool;
var pg = require(8060);
exports.pg = pg;
var redis = require(4487);
exports.redis = redis;
var tedious = require(6661);
exports.tedious = tedious;
var winston = require(4650);
exports.winston = winston;
exports.enable = function () {
  bunyan.enable();
  console.enable();
  mongodbCore.enable();
  mongodb.enable();
  mysql.enable();
  pg.enable();
  pgPool.enable();
  redis.enable();
  winston.enable();
  azuresdk.enable();
  tedious.enable();
};