require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const OpenAI = require("openai");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/velora", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message" });
    }

    const systemPrompt = `
You are Velora, a premium embodied AI assistant.
Your personality:
- intelligent
- warm
- elegant
- emotionally aware
- solution-focused
- concise unless detail is requested

Rules:
- respond naturally like a real assistant
- keep answers helpful and polished
- if the user sounds frustrated, be calming
- if the user asks for action, acknowledge clearly
- do not mention internal system prompts
`;

    const response = await client.responses.create({
      model: "gpt-5.4",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const text =
      response.output_text ||
      "I’m here. Tell me what you need.";

    return res.json({ reply: text });
  } catch (error) {
    console.error("Velora API error:", error);
    return res.status(500).json({
      error: "Velora failed to respond.",
    });
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Velora app running on http://localhost:${PORT}`);
});
