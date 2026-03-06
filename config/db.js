const { Pool } = require("pg");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})
pool.connect()
    .then(client => {
        console.log("PostgreSQL Connected Successfully!");
        client.release();
    })
    .catch(err => {
        console.error("Database connection error:", err);
    });

module.exports = pool;