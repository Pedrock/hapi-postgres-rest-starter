'use strict';

require('dotenv-safe').load({ allowEmptyValues: true });

const isTsNode = require.main.filename.endsWith('.ts') || require.main.filename.includes('lab\\bin\\lab');
const path = isTsNode ? 'src' : 'dist';

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
        `${path}/server/entities/**/*.{ts,js}`
    ],
    migrations: [
        `${path}/server/migrations/**/*.{ts,js}`
    ],
    subscribers: [
        `${path}/server/subscribers/**/*.{ts,js}`
    ],
    cli: {
        entitiesDir: 'src/server/entities',
        migrationsDir: 'src/server/migrations',
        subscribersDir: 'src/server/subscribers'
    }
};
