const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

app.post("/generate", upload.single("image"), async (req, res) => {
  try {
    const prompt = "Basic test prompt: convert image into improved artistic style";

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      image: req.file.buffer.toString("base64")
    });

    const output = response.data[0].url;

    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

app.listen(4000, () => console.log("Backend running on 4000"));
