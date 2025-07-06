import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai'; // <-- updated import

// Load environment variables from .env file
// This allows us to use the OPENAI_API_KEY defined in the .env file
dotenv.config();

// Initialize OpenAI API with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create an Express application
// and set up middleware for CORS and JSON parsing
const app = express();
app.use(cors());
app.use(express.json());

// Define a GET route for the root path
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Codex!',
  })
});

// Define a POST route for handling chat requests
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0
    });

    res.status(200).send({
      bot: response.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({error});
  }
});

// Start the server on port 5000
// This is the port where the server will listen for incoming requests
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));