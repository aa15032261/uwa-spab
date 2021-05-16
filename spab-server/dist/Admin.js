"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// import config file
require("./Config");
const pg_1 = require("pg");
const prompts = require("prompts");
const LoginController_1 = require("./LoginController");
const crypto = require("crypto");
const otplib_1 = require("otplib");
main();
/**
 * spab-server admin menu entry point
 *
 * The admin menu provides the following functionalities:
 *
 * 3871: Rebuild database
 * 1: List users
 * 2: Create a new user
 * 3: Remove a user
 * 4: List clients
 * 5: Create a new client
 * 6: Remove a client
 * 7: Remove client's logs
 */
function main() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const pool = new pg_1.Pool({
                host: DB_HOST,
                port: DB_PORT,
                database: DB_NAME,
                user: DB_USER,
                password: DB_PASSWORD,
            });
            console.log('Available options:');
            console.log('3871: Rebuild database');
            console.log('1: List users');
            console.log('2: Create a new user');
            console.log('3: Remove a user');
            console.log('4: List clients');
            console.log('5: Create a new client');
            console.log('6: Remove a client');
            console.log(`7: Remove client's logs`);
            console.log('');
            let option = yield prompts({
                type: 'number',
                name: 'value',
                message: 'Option:',
                validate: (value) => {
                    return value >= 1 && value <= 7 || value === 3871;
                }
            });
            if (option.value === 3871) {
                yield rebuildDbStructure(pool);
                console.log('Successful');
            }
            else if (option.value === 1) {
                let users = (yield pool.query(`SELECT * FROM users`)).rows;
                for (let user of users) {
                    let lastLogin = parseInt(user.lastLogin);
                    if (!lastLogin) {
                        lastLogin = 0;
                    }
                    console.log({
                        _id: user._id,
                        email: user.email,
                        lastLogin: new Date(lastLogin),
                        isBanned: user.failedAttempt > 5
                    });
                }
            }
            else if (option.value === 2) {
                let questions = [
                    {
                        type: 'text',
                        name: 'email',
                        message: 'Email: '
                    },
                    {
                        type: 'text',
                        name: 'pass',
                        message: 'Password: '
                    }
                ];
                let option = yield prompts(questions);
                let loginController = new LoginController_1.LoginController();
                yield pool.query(`INSERT INTO users ("email", "pass", "lastLogin", "lastModified", "failedAttempt") VALUES ($1, $2, 0, 0, 0)`, [option.email, loginController.genScryptedPass(option.pass)]);
                console.log('Successful');
            }
            else if (option.value === 3) {
                let questions = [
                    {
                        type: 'text',
                        name: 'email',
                        message: 'Email: '
                    }
                ];
                let option = yield prompts(questions);
                yield pool.query(`DELETE FROM users WHERE "email"=$1`, [option.email]);
                console.log('Successful');
            }
            else if (option.value === 4) {
                let clients = (yield pool.query(`SELECT * FROM clients`)).rows;
                for (let client of clients) {
                    console.log({
                        _id: client._id,
                        name: client.name,
                        token: client.token,
                        twoFactor: client.twoFactor
                    });
                }
            }
            else if (option.value === 5) {
                let questions = [
                    {
                        type: 'text',
                        name: 'name',
                        message: 'Name: '
                    }
                ];
                let option = yield prompts(questions);
                yield pool.query(`INSERT INTO clients ("name", "token", "twoFactor") VALUES ($1, $2, $3)`, [option.name, crypto.randomBytes(32).toString('hex'), {
                        type: "totp",
                        secret: otplib_1.authenticator.generateSecret()
                    }]);
                console.log('Successful');
            }
            else if (option.value === 6) {
                let questions = [
                    {
                        type: 'text',
                        name: '_id',
                        message: '_id: '
                    }
                ];
                let option = yield prompts(questions);
                yield pool.query(`DELETE FROM clients WHERE "_id"=$1`, [option._id]);
                console.log('Successful');
            }
            else if (option.value === 7) {
                let questions = [
                    {
                        type: 'text',
                        name: '_id',
                        message: '_id: '
                    }
                ];
                let option = yield prompts(questions);
                yield pool.query(`DELETE FROM logs WHERE "clientId"=$1`, [option._id]);
                console.log('Successful');
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
function rebuildDbStructure(pool) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield pool.query(`DROP TABLE IF EXISTS logs;`);
        yield pool.query(`DROP TABLE IF EXISTS sessions;`);
        yield pool.query(`DROP TABLE IF EXISTS users;`);
        yield pool.query(`DROP TABLE IF EXISTS clients;`);
        yield pool.query(`CREATE OR REPLACE FUNCTION generate_uid(size INT) RETURNS TEXT AS $$
        DECLARE
          characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          l INT := length(characters);
          i INT := 0;
          output TEXT := '';
        BEGIN
          WHILE i < size LOOP
            output := output || substr(characters, round(random() * l)::integer + 1, 1);
            i := i + 1;
          END LOOP;
          RETURN output;
        END;
        $$ LANGUAGE plpgsql;`);
        yield pool.query(`CREATE TABLE IF NOT EXISTS sessions (
            "_id" text PRIMARY KEY,
            "name" text NOT NULL,
            "expireAt" bigint NOT NULL,
            "info" bytea NOT NULL,
            "data" bytea NOT NULL
        )`);
        yield pool.query(`CREATE TABLE IF NOT EXISTS users (
            "_id" text PRIMARY KEY DEFAULT generate_uid(24),
            "email" text UNIQUE NOT NULL,
            "pass" text NOT NULL,
            "lastLogin" bigint NOT NULL,
            "lastModified" bigint NOT NULL,
            "failedAttempt" integer NOT NULL
        );`);
        yield pool.query(`CREATE TABLE IF NOT EXISTS clients (
            "_id" text PRIMARY KEY DEFAULT generate_uid(24),
            "name" text NOT NULL,
            "token" text UNIQUE NOT NULL,
            "twoFactor" json NOT NULL
        );`);
        yield pool.query(`CREATE TABLE IF NOT EXISTS logs (
            "_id" text PRIMARY KEY DEFAULT generate_uid(24),
            "clientId" text NOT NULL,
            "timestamp" bigint NOT NULL,
            "logId" bigint,
            "type" text NOT NULL,
            "typeId" text NOT NULL,
            "data" bytea NOT NULL,
            FOREIGN KEY ("clientId") REFERENCES clients("_id") ON DELETE CASCADE
        );`);
    });
}
