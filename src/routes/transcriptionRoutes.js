const express = require("express");
const multer = require("multer");
const path = require("path");
const transcribeAudio = require("../services/transcriptionService");

const router = express.Router();

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
      return res.status(400).json({ message: "No file uploaded" });
    }

    const audioFilePath = path.join(process.cwd(), "src/uploads", req.file.filename);
    console.log("📂 File saved at:", audioFilePath);

    // Transcribe the audio file
    const result = await transcribeAudio(audioFilePath);

    if (!result || !result.transcript) {
      return res.status(500).json({ message: "Transcription failed" });
    }

    res.json({
      message: "File uploaded and processed successfully",
      transcript: result.transcript,
      summary: result.summary || "No summary available",
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ message: "Error processing file", error: error.message });
  }
});

module.exports = router;
