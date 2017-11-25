'use strict';

require('dotenv-safe').load({ allowEmptyValues: true });

import "reflect-metadata";
import * as Glue from 'glue';

const manifest = {
    connections: [
        {
            host: '0.0.0.0',
            port: 8000,
            labels: ['api']
        }
    ],
    registrations: [
        { plugin: 'hapi-auth-jwt2' },
        { plugin: './server/plugins/auth-wrapper' },
        { plugin: './server/plugins/db' },
        { plugin: './server/plugins/redis' },
        { plugin: 'inert' },
        { plugin: 'vision' },
        { plugin: {
            register: 'hapi-swagger',
            options: {
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
        { plugin: './server/plugins/double-submit-cookie' },
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
                register: './server/routes/routes',
                routes: { prefix: '/api' }
            }
        }
    ]
};

const options = {
    relativeTo: __dirname
};

const startServer = (callback?) => {
    Glue.compose(manifest, options, (err, server) => {
        if (err) {
            throw err;
        }

        server.state('token', { isSecure: process.env.NODE_ENV === 'production' });
        server.state('jwtid', { isSecure: process.env.NODE_ENV === 'production' });

        if (callback) {
            callback(server);
        } else {
            server.start((err) => {
                if (err) {
                    throw err;
                }
                console.log('Server running at:', server.info.uri);
            });
        }
    });
};

if (!module.parent) {
    startServer();
} else {
    module.exports = () => new Promise(startServer);
}
