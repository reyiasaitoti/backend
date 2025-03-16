const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use Render's DATABASE_URL
  ssl: {
    rejectUnauthorized: false, // Required for Render-hosted PostgreSQL
  },
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;
