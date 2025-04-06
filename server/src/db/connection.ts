import mongoose from "mongoose";
import { config } from "dotenv";
config();

const MONGO_URI = process.env.MONGO_URI!;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

// Add connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

export async function connectDB() {
    try {
        // Add connection options
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            family: 4 // Use IPv4, skip trying IPv6
        });
        
        console.log("Mongoose connection state:", mongoose.connection.readyState);
    }
    catch (error) {
        console.error("Mongoose connection failed:", error);
        // Exit process with failure code
        process.exit(1);
    }
}