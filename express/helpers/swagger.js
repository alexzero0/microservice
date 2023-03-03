const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// swagger documentation, move it outside the main file later
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        explorer: true,
        defaultModelsExpandDepth: 1,
        defaultModelчExpandDepth: 1,
        info: {
            title: process.env.npm_package_name,
            version: process.env.npm_package_version,
        },
    },
    apis: ['./controllers/**/*.js', './docs/*.yaml'], // files containing annotations
};
module.exports = (app) => app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));
