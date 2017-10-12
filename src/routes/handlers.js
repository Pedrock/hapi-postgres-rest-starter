'use strict';

const JWT = require('jsonwebtoken');
const Cryptiles = require('cryptiles');
const Blacklist = require('express-jwt-blacklist');

exports.login = function (request, reply) {
    const obj = { id: 123, name: 'Charlie' };
    const jwtid = Cryptiles.randomString(64);
    const token = JWT.sign(obj, process.env.JWT_SECRET, { jwtid });

    return reply(token)
        .state('token', token, { path: '/' })
        .state('jwtid', jwtid, { path: '/', isHttpOnly: false });
};

exports.logout = function (request, reply) {
    console.log(request.auth.credentials);
    Blacklist.revoke(request.auth.credentials);
    return reply();
};
