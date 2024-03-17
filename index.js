import express from 'express'
import dotenv from 'dotenv'
import connectDB from './database.js'
import { router } from './route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app=express()
app.use(cookieParser())

app.use(express.json());
dotenv.config({path:'./.env'})

const corsOptions = {
    origin: 'https://blog-inky-nine.vercel.app',
    // origin: ['https://blog-inky-nine.vercel.app', 'http://localhost:5173'],
    credentials: true, 

};
app.use(cors(corsOptions));
const port=process.env.PORT||4000;

app.listen(port,()=>{
    console.log(`app is running currently on ${port}`)
})
app.use('/user/api',router)

connectDB()