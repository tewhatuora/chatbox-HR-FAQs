// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AzureOpenAI } from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  
});

const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: deployment,
      messages,
    });

    res.json({ content: completion.choices[0].message.content });
  } catch (err) {
    console.error('Error from Azure OpenAI:', err);
    res.status(500).json({ error: 'OpenAI API call failed.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
