require("dotenv").config();
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const uploadRoutes = require("./routes/uploadRoutes");


const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware: Enable JSON parsing
app.use(express.json());

// Enable CORS for frontend
app.use(cors({ 
    origin: "*", // Allow all origins (change to frontend URL later)
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
    // origin: "http://localhost:5173",
    // methods: "GET,POST",
    // allowedHeaders: "Content-Type"   
 })); 


app.use("/api", protectedRoutes);
app.use("/api", uploadRoutes);




app.use("/api/auth", authRoutes);

// Sample route
app.get("/", (req, res) => {
    res.send("Audio Summarization Backend is Running!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

