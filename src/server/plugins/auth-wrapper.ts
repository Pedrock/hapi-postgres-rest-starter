'use strict';

import * as Blacklist from 'express-jwt-blacklist';

export const register = function register(server, options, next) {
    Blacklist.configure({
        tokenId: 'jti',
        store: {
            type: 'redis',
            client: server.app.redis
        }
    });

    server.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET,
        validateFunc: (decoded, request, callback) =>
            Blacklist.isRevoked(null, decoded, (error, revoked) => {
                callback(error, !revoked);
            }),
        verifyOptions: { algorithms: ['HS256'] }
    });

    next();
};

(<any>register).attributes = {
    name: 'auth-wrapper',
    version: '1.0.0'
};
