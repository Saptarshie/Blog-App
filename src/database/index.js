import mongoose from "mongoose";

export const connectToDB = async () => {
    const url = process.env.MONGODB_URL||"mongodb+srv://jenshie2004:1T0GHwzTEjGNLjvw@cluster0.kgyfkai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    try{
        await mongoose.connect(url);
        console.log("Connected to the database");
    }catch(err){
        console.log(err);  
    }
}