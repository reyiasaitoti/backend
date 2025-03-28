const pool = require("./db");

const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log("✅ Users table created successfully");
  } catch (err) {
    console.error("❌ Error creating users table:", err);
  } finally {
    pool.end(); // Close DB connection
  }
};

createUsersTable();
