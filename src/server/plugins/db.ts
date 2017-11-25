'use strict';

import * as Typeorm from 'typeorm';

export const register = function register(server, options, next) {
    Typeorm.createConnection().then(() => {
        console.log('Connected to database successfully');
        server.decorate('request', 'getManager', Typeorm.getManager);
        next();
    }).catch((error) => process.nextTick(() => {
        throw error;
    }));
};

(<any>register).attributes = {
    name: 'db-wrapper',
    version: '1.0.0'
};
