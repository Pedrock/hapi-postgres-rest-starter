'use strict';
// Based on crumb: https://github.com/hapijs/crumb

// Load modules
const Boom = require('boom');
const Hoek = require('hoek');
const Joi = require('joi');

// Declare internals
const internals = {};

internals.schema = Joi.object().keys({
    key: Joi.string().optional(),
    skip: Joi.func().optional()
});

internals.defaults = {
    key: 'crumb',
    skip: false                    // Set to a function which returns true when to skip crumb generation and validation
};

exports.register = function (server, options, next) {

    const validateOptions = internals.schema.validate(options);
    if (validateOptions.error) {
        return next(validateOptions.error);
    }

    const settings = Hoek.applyToDefaults(internals.defaults, options);

    const routeDefaults = {
        key: settings.key,
        source: 'payload'
    };

    server.state(settings.key, settings.cookieOptions);

    server.ext('onPostAuth', (request, reply) => {

        // If skip function enabled. Call it and if returns true, do not attempt to do anything with crumb.
        if (settings.skip && settings.skip(request, reply)) {
            return reply.continue();
        }

        // Validate incoming crumb
        if (typeof request.route.settings.plugins._crumb === 'undefined') {
            if (request.route.settings.plugins.crumb || !request.route.settings.plugins.hasOwnProperty('crumb')) {
                request.route.settings.plugins._crumb = Hoek.applyToDefaults(routeDefaults, request.route.settings.plugins.crumb || {});
            } else {
                request.route.settings.plugins._crumb = false;
            }
        }

        if (request.method !== 'post' && request.method !== 'put' && request.method !== 'patch' && request.method !== 'delete' ||
            !request.route.settings.plugins._crumb) {

            return reply.continue();
        }

        const header = request.headers['x-csrf-token'];

        if (!header) {
            return reply(Boom.forbidden());
        }

        if (header !== request.state.jwtid) {
            return reply(Boom.forbidden());
        }

        return reply.continue();
    });

    return next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
