import mongoose from "mongoose";

const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URL)
    .then((con) => console.log(`MongoDB is  connected successfully`))
    .catch((err) => console.error(err))
}

export default connectDB;

// module.exports=connectDB;