var mysql = require("../sql/mysql");
var config = require("../config");

mysql.init(config.mysqlConfig);

mysql.test();