/* eslint-disable @typescript-eslint/no-require-imports */
// Conecta sequelize a la base de datos para ejecutar los comandos de sequelize cli y poder hacer migraciones
require('ts-node/register'); // Debe dejarse asi porque da error si se convierte en modulo ES

const { config } = require('./env.ts');

module.exports = {
    username: config.db.user,
    password: config.db.password,
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
};