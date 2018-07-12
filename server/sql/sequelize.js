const Sequelize = require("sequelize");
const sequelize = new Sequelize("mysql", "root", "", {
    host: "localhost",
    dialect: "mysql",
    operatorsAliases: false,
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate().then(() => {
    console.log("Connection has been done!");
}).catch(err => {
    console.log("error!");
});