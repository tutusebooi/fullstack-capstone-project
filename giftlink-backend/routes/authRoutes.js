const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const existing = await collection.findOne({ email: req.body.email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const result = await collection.insertOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });
        const authtoken = jwt.sign(
            { id: result.insertedId },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );
        res.status(201).json({ authtoken, firstName: req.body.firstName });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("users");
        // findOne to locate the current user in the database
        const user = await collection.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const authtoken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1h' }
        );
        res.json({ authtoken, firstName: user.firstName });
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;