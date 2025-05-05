import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10
        });

        console.log('Database is connected')
    } catch (error) {
        console.log('Database connection Error: ', error)
    }
}

export default connectDB;