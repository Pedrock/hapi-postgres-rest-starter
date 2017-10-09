'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.register([
    Inert,
    Vision,
    HapiSwagger
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
server.route({
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
});
