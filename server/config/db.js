const mongoose = require('mongoose');

const connectDB = async () => {
    if (process.env.MOCK_DATABASE === 'true') {
        console.log('--- MOCK DATABASE MODE ACTIVE ---');
        console.log('The server is running with in-memory data for demonstration.');
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error.message.includes('ECONNREFUSED')) {
            console.error('CRITICAL: MongoDB connection refused. Please ensure MongoDB is running locally on port 27017, or check your MONGO_URI in .env.');
        } else {
            console.error(`Error: ${error.message}`);
        }
        process.exit(1);
    }
};

module.exports = connectDB;
