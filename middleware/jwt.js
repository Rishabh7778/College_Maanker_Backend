import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const jwtAuthMiddleware = (req, res, next) => {

    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token not found" })
    }

    //Extract the jwt token from the request headers
    const token = authorization.split(" ")[1];
    if (!token) return res.status(401).json({ error: 'Token not found' })

    try {
        // verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

        req.user = decoded
        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({ error: "Invalid Token" })
    }
}

// Generate a token

export const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: "1h"});
}


export const verify = async (req, res)=> {
    try {
        const user = await User.findById(req.user.id)
        return res.status(200).json({success: true, user});
    } catch (error) {
        return res.status(500).json({success: false, error: error.message});
    }
}

// generate a refresh token 
export const refreshTokenHandler = (req, res)=> {

    //Get refreshToken from cookies
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
        return res.status(401).json({error: "Refresh token is not provided"});
    }

    jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET || "default_Refresh_TOken",
        (err, userData) => {
            if(err){
                return res.status(403).json({error: "Invalid refresh token"});
            }
        //Generate a new access token using the data from refresh token

        const newAccessToken = generateToken({
            id: userData.id,
            email: userData.email,
        });

        //send new access token
        res.json({success:true, accessToken: newAccessToken});        
        }
    );
};