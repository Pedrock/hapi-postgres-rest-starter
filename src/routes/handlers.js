'use strict';

const JWT = require('jsonwebtoken');
const Cryptiles = require('cryptiles');
const Blacklist = require('express-jwt-blacklist');
const Bcrypt = require('bcrypt');
const Boom = require('boom');

const login = function (user, reply) {
    const obj = { id: user.id, username: user.username };
    const jwtid = Cryptiles.randomString(64);
    const token = JWT.sign(obj, process.env.JWT_SECRET, { jwtid });
    return reply(token)
        .state('token', token, { path: '/' })
        .state('jwtid', jwtid, { path: '/', isHttpOnly: false });
};

exports.register = async function (request, reply) {
    const userRepository = request.getManager().getRepository('User');
    userRepository.save({
        username: request.payload.username,
        password: await Bcrypt.hash(request.payload.password, 10)
    }).then((user) => {
        login(user, reply);
    }).catch((error) => {
        if (error.constraint === 'user_username_idx') {
            reply(Boom.conflict('Username already in use'));
        } else {
            reply(error);
        }
    });
};

exports.login = function (request, reply) {
    const userRepository = request.getManager().getRepository('User');
    userRepository.findOne({ username: request.payload.username })
        .then(async (user) => {
            if (!user) {
                throw Boom.forbidden('Invalid username/password');
            }
            const success = await Bcrypt.compare(request.payload.password, user.password);
            if (!success) {
                throw Boom.forbidden('Invalid username/password');
            }
            login(user, reply);
        })
        .catch(reply);
};

exports.logout = function (request, reply) {
    console.log(request.auth.credentials);
    Blacklist.revoke(request.auth.credentials);
    return reply();
};
