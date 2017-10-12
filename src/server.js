'use strict';

require('dotenv-safe').load({ allowEmptyValues: true });

const Redis = require('redis');
const Glue = require('glue');

const redis = Redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
redis.on('error', (err) => {
    console.log('Error ' + err);
});

const manifest = {
    server: {
        app: {
            redis,
            db: require('./db/db')
        }
    },
    connections: [
        {
            host: '0.0.0.0',
            port: 8000,
            labels: ['api']
        }
    ],
    registrations: [
        { plugin: 'hapi-auth-jwt2' },
        { plugin: './plugins/auth-wrapper' },
        { plugin: 'inert' },
        { plugin: 'vision' },
        { plugin: {
            register: 'hapi-swagger',
            options: {
                auth: false,
                securityDefinitions: {
                    jwt: {
                        type: 'apiKey',
                        name: 'Authorization',
                        in: 'header'
                    }
                }
            }
        } },

        {
            plugin: {
                register: 'blipp',
                options: { showAuth: true }
            }
        },
        { plugin: './plugins/double-submit-cookie' },
        {
            plugin: {
                register: 'good',
                options: {
                    reporters: {
                        console: [{
                            module: 'good-squeeze',
                            name: 'Squeeze',
                            args: [{
                                response: '*',
                                log: '*',
                                error: '*'
                            }]
                        }, {
                            module: 'good-console'
                        }, 'stdout']
                    }
                }
            }
        },
        {
            plugin: {
                register: './routes/routes',
                routes: { prefix: '/api' }
            }
        }
    ]
};

const options = {
    relativeTo: __dirname
};

Glue.compose(manifest, options, (err, server) => {
    if (err) {
        throw err;
    }

    server.state('token', { isSecure: process.env.NODE_ENV === 'production' });
    server.state('jwtid', { isSecure: process.env.NODE_ENV === 'production' });

    server.start( (err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});
