'use strict';

require('dotenv-safe').load();

const Redis = require('redis');
const Blacklist = require('express-jwt-blacklist');
const Glue = require('glue');

// redis
const client = Redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
if (process.env.NODE_ENV === 'production') {
    client.auth(process.env.SESSION_PASSWORD, (error) => {
        if (error) {
            throw error;
        }
    });
}
client.on('error', (err) => {
    console.log('Error ' + err);
});

Blacklist.configure({
    tokenId: 'jti',
    store: {
        type: 'redis',
        client
    }
});


const manifest = {
    connections: [
        {
            host: 'localhost',
            port: 8000,
            labels: ['api']
        }
    ],
    registrations: [
        { plugin: 'inert' },
        { plugin: 'vision' },
        { plugin: 'hapi-swagger' },
        { plugin: 'hapi-auth-jwt2' },
        /*{
            plugin: {
                register: 'crumb',
                options: { restful: true }
            }
        },*/
        {
            plugin: {
                register: 'blipp',
                options: { showAuth: true }
            }
        },
        {
            plugin: './plugins/double-submit-cookie'
        },
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

    server.state('session');

    server.auth.strategy('jwt', 'jwt',
        { key: process.env.JWT_SECRET,
            validateFunc: (decoded, request, callback) =>
                Blacklist.isRevoked(null, decoded, (error, revoked) => {
                    callback(error, !revoked);
                }),
            verifyOptions: { algorithms: ['HS256'] }
        });

    server.route(require('./routes'));

    server.start( (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Server running at:', server.info.uri);
        }
    });
});
