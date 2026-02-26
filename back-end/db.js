require("dotenv").config();
const pgPromise = require("pg-promise");

const pgp = pgPromise();

const cn = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "berkeley_student_system",
};

const db = pgp(cn);

// Test connection on startup
db.connect()
  .then((obj) => {
    console.log("Database connection successful");
    obj.done();
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });

module.exports = db;
