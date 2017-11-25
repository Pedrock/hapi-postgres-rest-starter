'use strict';
require('dotenv-safe').load({ allowEmptyValues: true });
const { exec } = require('child_process');

const run = function (command, callback) {
    const stream = exec(command, {}, () => {
        if (callback) {
            callback();
        }
    });
    stream.stdout.pipe(process.stdout);
    stream.stderr.pipe(process.stderr);
};

run('docker network prune -f', () => {
    run(`docker-compose run -d -p ${process.env.DB_PORT || 5432}:5432 postgres`);
    run(`docker-compose run -d -p ${process.env.REDIS_PORT || 6379}:6379 redis`);
});
