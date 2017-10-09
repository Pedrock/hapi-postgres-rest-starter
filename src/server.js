'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const Crumb = require('crumb');
const Blipp = require('blipp');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.register([
    Inert,
    Vision,
    HapiSwagger,
    {
        register: Crumb,
        options: { restful: true }
    },
    {
        register: Blipp,
        options: { showAuth: true }
    }
], (err) => {
    if (err) {
        throw err;
    }
    server.start( (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Server running at:', server.info.uri);
        }
    });
});

// Add the route
server.route([{
    method: 'GET',
    path: '/hello',
    config: {
        tags: ['api'],
        validate: {
            query: {
                id : Joi.number()
                    .required()
                    .description('the id for the todo item')
            }
        },
        handler: function (request, reply) {
            return reply('hello world');
        }
    }
}, {
    method: 'POST',
    path: '/hello',
    config: {
        tags: ['api'],
        validate: {
            payload: {
                id : Joi.number()
                    .required()
                    .description('the id for the todo item')
            }
        },
        handler: function (request, reply) {
            return reply('hello world post');
        }
    }
}, {
    method: 'GET',
    path: '/csrf',
    config: {
        tags: ['api'],
        handler: function (request, reply) {
            return reply({ crumb: server.plugins.crumb.generate(request, reply) });
        }
    }
}]);
