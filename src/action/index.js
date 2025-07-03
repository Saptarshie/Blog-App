'use server'

import { isValidWalletAddress } from "@/utils/functions/isValidWallet";
import { redirect } from "next/navigation";
import {connectToDB} from "@/database";
import {User} from "@/models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const Joi = require('joi');
// Define validation schema
const SignUpSchema = Joi.object({
  username: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});
export async function SignUpAction(data){
    console.log(data);
    try {
        const { error } = SignUpSchema.validate(data);
        if(error){
            return {
                success: false,
                status: 400,
                message: error.details[0].message,
            };
        };
        const db = await connectToDB();
        const userExists = await User.findOne({ $or: [{ username: data?.username }, { email: data?.email }] });
        if (userExists) {
            return {
                success: false,
                status: 400,
                message: "User already exists",
            };
        }
        console.log(data);
        const {password} = data;
        const user = await User.create({
            username: data.username,
            email: data.email,
            password: bcrypt.hashSync(data.password, 10),
            walletAddress: "",
            subscriberCount: -1,
            subscription: [],
            blogs: [],
        });
        return {
            success: true,
            status: 200,
            message: "User created successfully",
            user: JSON.parse(JSON.stringify(user)),}
    } catch (error) {
        console.log(error);
        return {
            success: false,
            status: 500,
            message: error.message,
        };
    }
}
export async function SignInAction(data){
    console.log(data);
    try {
        const db = await connectToDB();
        const user = await User.findOne({ $or: [{ username: data?.userid }, { email: data?.userid }] });
        if (!user) {
            return {
                success: false,
                status: 400,
                message: "User not found",
            };
        }
        const isPasswordValid = bcrypt.compareSync(data.password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                status: 400,
                message: "Invalid password",
            };
        }
        const jwt_secret = process.env.JWT_SECRET||"secret";
        const token = jwt.sign({ id: user._id, username: user.username, email: user.email}, jwt_secret, { expiresIn: "1d" });
        cookies().set("token", token);
        return {
            success: true,
            status: 200,
            message: "User logged in successfully",
            user: JSON.parse(JSON.stringify(user)),
        };}
        catch (error) {
        console.log(error);
            return {
                success: false,
                status: 500,
                message: error.message,
            };
        }
    }
        
export async function SignOutAction(){
    try {
        cookies().set("token", "", { maxAge: 0 });
        return {
            success: true,
            status: 200,
            message: "User logged out successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            status: 500,
            message: error.message,
        };
    }
}

export async function fetchUserAction(){
    try{
        const db = await connectToDB();
        const token = await cookies().get("token")?.value;
        if (!token) {
            return {
                success: false,
                status: 401,
                message: "User not authenticated",
            };
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET||"secret");
        // console.log(decoded);
        const user = await User.findById(decoded.id);
        if (!user) {
            return {
                success: false,
                status: 400,
                message: "User not found",
            }
        }
        return {
            success: true,
            status: 200,
            message: "User fetched successfully",
            user: JSON.parse(JSON.stringify(user)),
        }
    }catch(error){
        console.log(error);
        return {
            success: false,
            status: 500,
            message: error.message,
        }
    }
}

export async function RegisterCreatorAction(data){
    console.log("data is : ",data);
    if(!isValidWalletAddress(data)){
        return {
            success: false,
            status: 400,
            message: "Invalid wallet address",
        }
    }
    try{
        const db = await connectToDB();
        const token = await cookies().get("token")?.value;
        if (!token) {
            return {
                success: false,
                status: 401,
                message: "User not authenticated",
            };
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET||"secret");
        // console.log(decoded);
        // Declare user before using it
        var user = await User.findById(decoded.id);
        if (!user) {
            return {
                success: false,
                status: 404,
                message: "User not found",
            }
        }
        user = await User.findByIdAndUpdate(decoded.id,{$set:{subscriberCount: Math.max(0,user.subscriberCount),walletAddress: data}},{new: true});
        if (!user) {
            return {
                success: false,
                status: 400,
                message: "User not found",
            }
        }
        return {
            success: true,
            status: 200,
            message: "User fetched successfully",
            user: JSON.parse(JSON.stringify(user)),
        }
    }catch(error){
        console.log(error);
        return {
            success: false,
            status: 500,
            message: error.message,
        }
    }
}