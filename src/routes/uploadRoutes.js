const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const transcribeAudio = require("../services/transcriptionService");

const router = express.Router();
router.use(cors());

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: "src/uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(process.cwd(), "src/uploads", req.file.filename);
    console.log("📂 File saved at:", filePath);

    // Step 1: Transcribe the audio
    const transcription = await transcribeAudio(filePath);
    if (!transcription) {
      return res.status(500).json({ error: "Transcription failed" });
    }


    // Send both transcription
    res.json({
      message: "Transcription successful",
      transcription,
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
