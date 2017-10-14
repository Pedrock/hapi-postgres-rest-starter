'use strict';

require('dotenv-safe').load({ allowEmptyValues: true });

module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    migrationsRun: true,
    entities: [
        'src/entities/**/*.ts'
    ],
    migrations: [
        'src/migrations/**/*.ts'
    ],
    subscribers: [
        'src/subscribers/**/*.ts'
    ],
    cli: {
        entitiesDir: 'src/entities',
        migrationsDir: 'src/migrations',
        subscribersDir: 'src/subscribers'
    }
};
