const express = require("express");
const multer = require("multer");
const transcribeAudio = require("../services/transcriptionService");


const router = express.Router();
const upload = multer({ dest: "src/uploads/" });

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const audioFilePath = req.file.path;
    const result = await transcribeAudio(audioFilePath);

    if (!result) {
      return res.status(500).json({ message: "Transcription failed" });
    }

    res.json({
      message: "File uploaded and processed successfully",
      transcript: result.transcript,
      summary: result.summary,
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing file", error: error.message });
  }
});

export default router;
