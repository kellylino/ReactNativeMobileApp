//import { tokenExtractor } from "./middlewares/middleware";
const config = require('./config/config');
const express = require('express');
const cors = require('cors');
const app = express()
const userRouter = require('./routes/userRoutes');
const eventRouter = require('./routes/eventRoutes');
const habitRouter = require('./routes/habitRoutes');
const uploadRouter = require('./routes/upload');
const mongoose = require('mongoose');
mongoose.connect(config.MONGO_URI);

app.use(cors());
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));

// console.log("tokenExtractor:", tokenExtractor); // Add this line
// console.log("Type of tokenExtractor:", typeof tokenExtractor); // Add this line

// app.use(tokenExtractor);
app.use('/api/user', userRouter);
app.use('/api/event', eventRouter);
app.use('/api/habit', habitRouter);
app.use('/api/upload', uploadRouter);


module.exports = app