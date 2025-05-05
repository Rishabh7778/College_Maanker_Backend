import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path'
import { fileURLToPath } from 'url';
import connectDB from './database/db.js';
import authRouter from './routes/userAuth.js';
import consultRoute from './routes/consultRoute.js'
import blogRoute from './routes/blogRoute.js'
import paymentRoute from './routes/paymentRoute.js'

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
  

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/auth', authRouter);
app.use('/api/consult', consultRoute);
app.use('/api/blog', blogRoute);
app.use('/api/payment', paymentRoute);

connectDB();

app.listen(process.env.PORT, ()=>{
    console.log(`Server is listening ${process.env.PORT}`);
})