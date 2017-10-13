'use strict';

const Glob = require('glob');

require('dotenv-safe').load({ allowEmptyValues: true });

module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    migrationsRun: true,
    entitySchemas: [
        ...Glob.sync('./src/entities/**/*.js').map(require)
    ],
    migrations: [
        './src/migrations/**/*.js'
    ],
    subscribers: [
        'src/subscriber/**/*.js'
    ]
};
