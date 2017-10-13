/* eslint-disable quotes */
'use strict';

module.exports = class initial1507858985114 {

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_username_idx" ON "user"(LOWER("username"))`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX user_username_idx`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
};
