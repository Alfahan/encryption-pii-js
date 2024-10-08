const mongoose = require('mongoose');
const dotenv = require('dotenv');

const dt_conf = async () => {
    dotenv.config();
    try {
        const dbHost = process.env.DB_AUTH_HOST || 'localhost';
        const dbPort = process.env.DB_AUTH_PORT || '27017'; // Default port for MongoDB
        const dbUsername = process.env.DB_AUTH_USERNAME || '';
        const dbPassword = process.env.DB_AUTH_PASSWORD || '';
        const dbName = process.env.DB_AUTH_DATABASE || 'mydatabase';

        // Build MongoDB URI
        const uri = dbUsername
            ? `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`
            : `mongodb://${dbHost}:${dbPort}/${dbName}`;

        // Connect to MongoDB using Mongoose
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected successfully');
        return mongoose.connection;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

module.exports = {
    dt_conf,
};
