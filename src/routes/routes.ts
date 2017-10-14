'use strict';

const Handlers = require('./handlers');
const Schema = require('./schema');

module.exports = {
    register: function (server, options, next) {
        server.route([
            {
                method: 'POST',
                path: '/register',
                config: {
                    tags: ['api'],
                    plugins: { dsc: false }, // Disable double submit cookies for this route
                    handler: Handlers.register,
                    validate: Schema.register
                }
            },
            {
                method: 'POST',
                path: '/login',
                config: {
                    tags: ['api'],
                    plugins: { dsc: false }, // Disable double submit cookies for this route
                    handler: Handlers.login,
                    validate: Schema.login
                }
            },
            {
                method: 'POST',
                path: '/logout',
                config: {
                    tags: ['api'],
                    auth: 'jwt',
                    handler: Handlers.logout
                }
            }
        ]);
        next();
    }
};

module.exports.register.attributes = {
    name: 'routes',
    version: '1.0.0'
};
