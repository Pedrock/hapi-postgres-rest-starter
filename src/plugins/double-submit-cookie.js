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
    key: 'dsc',
    skip: false // Set to a function which returns true when to skip dsc generation and validation
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

        // If skip function enabled. Call it and if returns true, do not attempt to do anything with dsc.
        if (settings.skip && settings.skip(request, reply)) {
            return reply.continue();
        }

        // Validate incoming dsc
        if (typeof request.route.settings.plugins._dsc === 'undefined') {
            if (request.route.settings.plugins.dsc || !request.route.settings.plugins.hasOwnProperty('dsc')) {
                request.route.settings.plugins._dsc = Hoek.applyToDefaults(routeDefaults, request.route.settings.plugins.dsc || {});
            } else {
                request.route.settings.plugins._dsc = false;
            }
        }

        if (request.method !== 'post' && request.method !== 'put' && request.method !== 'patch' && request.method !== 'delete' ||
            !request.route.settings.plugins._dsc) {

            return reply.continue();
        }

        if (request.headers.authorization !== undefined) {
            return reply.continue(); // Don't check for double submit cookies when the authorization header is present
        }

        const header = request.headers['x-csrf-token'];

        if (!header) {
            return reply(Boom.forbidden('No X-CSRF Token Header'));
        }

        if (header !== request.state.jwtid) {
            return reply(Boom.forbidden('X-CSRF Header value does not match jwtid cookie'));
        }

        return reply.continue();
    });

    return next();
};

exports.register.attributes = {
    'name': 'hapi-double-submit-cookie',
    'version': '1.0.0'
};
