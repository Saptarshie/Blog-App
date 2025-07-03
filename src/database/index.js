import mongoose from "mongoose";

export const connectToDB = async () => {
    const url = process.env.MONGODB_URL;
    try{
        await mongoose.connect(url);
        console.log("Connected to the database");
    }catch(err){
        console.log(err);  
    }
}