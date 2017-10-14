import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1508018603261 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, PRIMARY KEY("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_username_idx" ON "user"(LOWER("username"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX user_username_idx`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
