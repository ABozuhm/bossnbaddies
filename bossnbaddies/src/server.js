require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

// Serve your "Boss n Baddies" Front-end
app.use(express.static(path.join(__dirname, '../public')));

// 1. Redirect Logic (Revenue Engine)
const redirects = {
    'sephora': 'https://www.sephora.com', // Replace with your affiliate link
    'temu': 'https://www.temu.com'      // Replace with your affiliate link
};

app.get('/go/:id', (req, res) => {
    const target = redirects[req.params.id];
    if (target) return res.redirect(target);
    res.status(404).send('Link not found');
});

// 2. Gemini AI Avatar Logic
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/avatar/chat', async (req, res) => {
    try {
        const { userInput } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent(`You are Velora, the AI for Boss n Baddies. Be helpful and stylish. Answer this: ${userInput}`);
        const response = await result.response;
        
        res.json({ response: response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "I'm recalibrating. Try again soon!" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`\n🚀 BossNBaddies Engine Live!`);
    console.log(`📍 Port: ${PORT}`);
});
