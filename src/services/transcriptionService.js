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
      speaker_labels: true, // Enable speaker identification
      summarization: true, // Enable summarization
      summary_model: "informative",  // ✅ Add this
      summary_type: "paragraph", // Options: "bullets", "gist", "headline", "paragraph"
    };

    // Step 1: Start Transcription
    const transcript = await client.transcripts.transcribe(params);

    if (transcript.status === "error") {
      console.error(`❌ Transcription failed: ${transcript.error}`);
      return null;
    }

    console.log("✅ Transcription completed:", transcript.text);
    transcript.utterances?.forEach((utterance) =>
      console.log(`🎙️ Speaker ${utterance.speaker}: ${utterance.text}`)
    );

    // Step 2: Fetch Transcript Status Until Completed
    let finalTranscript = await client.transcripts.get(transcript.id);
    while (finalTranscript.status !== "completed") {
      console.log("⏳ Processing transcription...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5s
      finalTranscript = await client.transcripts.get(transcript.id);
    }

    console.log("✅ Transcription & Summarization Done!");

    return {
      text: finalTranscript.text,
      summary: finalTranscript.summary, // Retrieve AI-generated summary
    };
  } catch (error) {
    console.error("🚨 Error during transcription:", error.message);
    return null;
  }
};

module.exports = transcribeAudio;
