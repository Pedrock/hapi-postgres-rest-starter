'use strict';

const Joi = require('joi');

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
