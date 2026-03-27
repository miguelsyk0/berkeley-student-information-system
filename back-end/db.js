require("dotenv").config();
const pgPromise = require("pg-promise");

const pgp = pgPromise();

const cn = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "berkeley_student_system",
  ssl: process.env.DB_HOST !== "localhost" ? { rejectUnauthorized: false } : false,
};

console.log(`Connecting to database at ${cn.host}:${cn.port} as ${cn.user}...`);
const db = pgp(cn);

module.exports = db;
