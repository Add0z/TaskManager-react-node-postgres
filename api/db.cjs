// import postgres from 'postgres';
//
// export const db = postgres.createConnection({
//     host: "localhost",
//     port: "root ",
//     database: "User",
//     username: "postgres",
//     password: "password",
// })

const { Pool } = require('pg');

const pool = new Pool({
    host: "localhost",
    port: "5432",
    database: "TaskManager",
    user: "postgres",
    password: "211191",
});

module.exports = { pool};