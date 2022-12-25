const config = require('config');
const app = require('./app');

app.listen(config.app.port, () => {
    console.log(`${new Date()}: API started on port: ${config.app.port}`);
});

module.exports = app;