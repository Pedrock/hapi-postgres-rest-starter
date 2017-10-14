'use strict';

import * as Joi from 'joi';

exports.register = {
    payload: {
        username: Joi.string().required(),
        password: Joi.string().required()
    }
};

exports.login = {
    payload: {
        username: Joi.string().required(),
        password: Joi.string().required()
    }
};
