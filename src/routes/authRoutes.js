const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db"); // Import database connection

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into database
    const result = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email;`,
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
  } catch (error) {
    console.error("Database Error:", error);
    if (error.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
