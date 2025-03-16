const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Protected route (requires authentication)
router.get("/protected-route", authMiddleware, (req, res) => {
    res.json({ message: `Welcome, user ${req.user.id}!` });
});

module.exports = router;
