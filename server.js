import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './config/dbConnect.js';

dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// PORT from .env
const PORT = process.env.PORT || 5000;

import test from './routes/test_route.js'
import userRoutes from './routes/userRoutes.js';

app.use('/api/users', userRoutes);
app.use('/api/test', test);

// Start server only after DB connects
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB...');
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});