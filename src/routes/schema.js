'use strict';

const Joi = require('joi');

exports.login = {
    payload: {
        username: Joi.string().required(),
        password: Joi.string().required()
    }
};
