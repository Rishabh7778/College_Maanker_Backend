import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { generateToken } from '../middleware/jwt.js'

export const signup = async(req, res) => {
    try {
        const {email, password} = req.body;

        // Check the user already exist or not 
        const checkUser = await User.findOne({email});
        if(checkUser){
            return res.status(400).json({message: "Email is already exist", status: false});
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create a new user document

        const newUser = new User({
            email,
            password: hashedPassword
        });

        // save the user data in database

        const response = await newUser.save();

        // check the usedata saved or not in console
        console.log('Data is saved: ', response);

        // Generate the token
        const paylaod = {
            id: response.id,
            email: response.email
        };

        const token = generateToken(paylaod);
        console.log("Token generated: ", token);

        res.status(200).json({ response: response, token: token });

    } catch (error) {
        console.error("Error during register", error);
        res.status(200).json({ error: "Internal Server Error" });
    }
}

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        
        // check the user is valid or not
        const validUser = await User.findOne({email});
        if(!validUser){
            return res.status(404).json({success: false, error: "User not found, Please try again!"});
        }

        // verify the password
        const passMatch = await bcrypt.compare(password, validUser.password);
        if(!passMatch){
            return res.status(404).json({success: false, error: "Password doesn't match, Please try again!"});
        }

        const payload = {
            id: validUser._id,
            email: validUser.email
        };

        const accesstoken = generateToken(payload);

        // generate refresh token        
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_SECRET || "default_refresh_secret",
            {expiresIn: "7d"}
        );

        // token sets in cookies
        res.cookie("accessToken", accesstoken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
        });

        res.status(200).json({success: true, message: "Logged in successfully"});       

    } catch (error) {
        res.status(500).json({error: "Internal server error", message: error.message});
    }
};