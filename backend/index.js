const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/class', require('./routes/class'));
app.use('/assignment', require('./routes/assignment'));
app.use('/announcement', require('./routes/announcement'));
app.use('/subject', require('./routes/subject'));
app.use('/study', require('./routes/study'));
app.use('/analytics', require('./routes/analytics'));
app.use('/flashcards', require('./routes/flashcard'));
app.use('/api/ai', require('./routes/ai'));
app.use('/progress', require('./routes/progress'));
app.use('/chat', require('./routes/chat'));
app.use('/departments', require('./routes/department'));
app.use('/api/admin', require('./routes/adminRoutes'));


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error'
    });
});

// Default Route
app.get('/', (req, res) => {
    res.send('Smart Study Tracker API is running...');
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
