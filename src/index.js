require("dotenv").config();
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const uploadRoutes = require("./routes/uploadRoutes");


const express = require("express");
const cors = require("cors");

const app = express();

app.use("/api", protectedRoutes);
app.use("/api", uploadRoutes);



// Enable CORS for frontend
app.use(cors({ 
    origin: "*", // Allow all origins (change to frontend URL later)
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
    // origin: "http://localhost:5173",
    // methods: "GET,POST",
    // allowedHeaders: "Content-Type"   
 })); 
// ✅ Middleware: Enable JSON parsing
app.use(express.json());

app.use("/api/auth", authRoutes);

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Sample route
app.get("/", (req, res) => {
    res.send("Audio Summarization Backend is Running!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

