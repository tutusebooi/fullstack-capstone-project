require('dotenv').config();
const express = require('express');
const natural = require('natural');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.post('/sentiment', async (req, res) => {
    const { sentence } = req.body;
    if (!sentence) {
        return res.status(400).json({ error: 'No sentence provided' });
    }
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");
    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));
        let sentiment = "neutral";
        if (analysisResult < 0) sentiment = "negative";
        else if (analysisResult > 0) sentiment = "positive";
        res.status(200).json({ sentimentScore: analysisResult, sentiment });
    } catch (error) {
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));