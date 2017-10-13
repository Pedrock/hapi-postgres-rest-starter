'use strict';

const Redis = require('redis');

const register = function register(server, options, next) {
    const redis = Redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
    redis.on('error', (err) => {
        console.log('Redis Error: ' + err);
    });

    server.decorate('request', 'redis', redis);

    next();
};

register.attributes = {
    name: 'redis-wrapper',
    version: '1.0.0'
};

module.exports = { register };
