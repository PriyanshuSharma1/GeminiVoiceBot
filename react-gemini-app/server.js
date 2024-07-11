const PORT = 8000;
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post("/gemini", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: req.body.history,
    });
    console.log(req.body.message);

    const msg = req.body.message;
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = await response.text();
    console.log(text);

    // Send the response back to the client
    res.json({ message: text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
