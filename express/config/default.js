require('dotenv').config({ path: process.env.DOTENV || '.env' });

module.exports = {
    app: {
        port: process.env.EXPRESS_PORT || 3000,
        passwordPattern: /[\w\d]{5,}/,
        namePattern: /^([\w]{3,})+\s+([\w\s]{3,})+$/i,
    },
    database: {
        databaseURI: process.env.EXPRESS_DATABASE_URL,
        dialect: 'postgresql',
        logging: false,
        dialectOptions: {
            // ssl: {
            //   require: true,
            //   rejectUnauthorized: false,
            // },
        },
    },
};
