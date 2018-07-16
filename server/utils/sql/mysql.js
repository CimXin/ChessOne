const mysql = require("mysql2");
var pool = null;

function query(sql, next) {
    pool.getConnection((err, conn) => {
        if (err) {
            next(err, null, null);
        } else {
            conn.query(sql, (err, results, fields) => {
                next(err, results, fields);
            });
        }
        pool.releaseConnection(conn);
    });
}

exports.init = (config) => {
    pool = mysql.createPool({
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log("初始化数据库");
}

exports.test = () => {
    var sql = "select * from rooms";
    query(sql, (err, results, fields) => {
        console.log(results);
    });
}