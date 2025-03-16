const AssemblyAI = require("assemblyai").AssemblyAI;
const fs = require("fs");


const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY, // Ensure API key is stored securely
});

const transcribeAudio = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("Audio file not found");
    }

    const params = {
      audio: filePath, // Use local file path
      speaker_labels: true,
    };

    const transcript = await client.transcripts.transcribe(params);

    if (transcript.status === "error") {
      console.error(`❌ Transcription failed: ${transcript.error}`);
      return null;
    }

    console.log("✅ Transcription completed:", transcript.text);
    transcript.utterances?.forEach((utterance) =>
      console.log(`🎙️ Speaker ${utterance.speaker}: ${utterance.text}`)
    );

    return transcript.text;
  } catch (error) {
    console.error("🚨 Error during transcription:", error.message);
    return null;
  }
};

module.exports = transcribeAudio;
