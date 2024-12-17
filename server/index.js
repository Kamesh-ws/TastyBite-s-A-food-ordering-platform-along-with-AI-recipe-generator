import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());

const port = process.env.PORT;

//import routes
import userRoutes from "./routes/userRoute.js";
import restaurantRoutes from "./routes/restaurantRoute.js";
import aiRoutes from './routes/recipeRoute.js';
import orderRoutes from './routes/orderRoute.js';

//Middleware

// Allow requests from your frontend (http://localhost:3000)
// app.use(cors({
//     origin: 'http://localhost:3000', // Change this to your frontend URL
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Define allowed methods
//     credentials: true // If you're using cookies or credentials, enable this
//   }));

// Alternatively, allow requests from all origins (not recommended for production)
app.use(cors());

//Using routes
app.use("/api/", userRoutes);
app.use("/api/", restaurantRoutes);
app.use('/api/', aiRoutes);
app.use('/api/', orderRoutes);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    connectDB();
});