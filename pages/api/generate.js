import formidable from "formidable";
import fs from "fs";
import { OpenAI } from "openai";
import prompts from "../../../prompts";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "form error" });

      const filePath = files.image.filepath;
      const fileData = fs.readFileSync(filePath, { encoding: "base64" });

      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompts.testPrompt,
        image: fileData,
      });

      const url = response.data[0].url;

      return res.status(200).json({ url });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI generation failed" });
  }
}
