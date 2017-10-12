'use strict';

const Joi = require('joi');
const JWT = require('jsonwebtoken');
const Crypto = require('crypto');
const Blacklist = require('express-jwt-blacklist');

module.exports = [{
    method: 'GET',
    path: '/hello',
    config: {
        tags: ['api'],
        auth: 'jwt',
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
    path: '/login',
    config: {
        tags: ['api'],
        plugins: {
            crumb: false
        },
        handler: function (request, reply) {
            console.log(request.response);
            const obj = { id: 123, name: 'Charlie' };
            const jwtid = Crypto.randomBytes(64).toString('base64');
            const token = JWT.sign(obj, process.env.JWT_SECRET, { jwtid });

            return reply()
                .state('token', token, { path: '/' })
                .state('jwtid', jwtid, { path: '/', isHttpOnly: false });
        }
    }
}, {
    method: 'POST',
    path: '/logout',
    config: {
        tags: ['api'],
        auth: 'jwt',
        handler: function (request, reply) {
            console.log(request.auth.credentials);
            Blacklist.revoke(request.auth.credentials);
            return reply('bye');
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
            return reply({ crumb: this.plugins.crumb.generate(request, reply) });
        }
    }
}];
