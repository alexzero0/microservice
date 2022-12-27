const config = require('config').database;
module.exports = {
    url: config.databaseURI,
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
        // ssl: {
        //     require: true,
        //     rejectUnauthorized: false,
        // },
    },
}