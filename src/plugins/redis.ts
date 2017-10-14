'use strict';

import * as Redis from 'redis';

export const register = function register(server, options, next) {
    const redis = Redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
    redis.on('error', (err) => {
        console.log('Redis Error: ' + err);
    });

    server.decorate('request', 'redis', redis);

    next();
};

(<any>register).attributes = {
    name: 'redis-wrapper',
    version: '1.0.0'
};
