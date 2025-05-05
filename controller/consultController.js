import Consult from "../models/consultModel.js";
import User from "../models/userModel.js"

export const bookConsult = async(req, res) =>{
    try {
        const {name, email, phoneNo, message} = req.body;
        const verifyEmail = await User.findOne({email});
        if(!verifyEmail){
            return res.status(404).json({success: false, message:"Email id not found"})
        }
        const consultData = new Consult({
            name, email, phoneNo, message
        })

        const response = await consultData.save();        
        console.log(response);
        res.status(200).json({success: true, message:"Consult Book Successfully"});
    } catch (error) {
        
    }
}