import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.API_KEY
});

app.use(express.static('public'));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": userMessage }],
    });

    const gptResponse = chatCompletion.choices[0].message.content;
    res.json({ reply: gptResponse });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing your message');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});