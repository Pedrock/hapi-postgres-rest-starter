'use strict';

const Objection = require('objection');
const Model = Objection.Model;
const Knex = require('knex');

// Initialize knex connection.
const knex = Knex(require('../../knexfile'));

// Give the connection to objection.
Model.knex(knex);

knex.raw('SELECT 1')
    .then(() => console.log('Connected to database successfully'))
    .catch((error) => process.nextTick(() => {
        throw error;
    }));
