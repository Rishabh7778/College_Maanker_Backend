import Consult from "../models/consultModel.js";

export const bookConsult = async(req, res) =>{
    try {
        const {name, email, mobile, message} = req.body;
        const consultData = new Consult({
            name, email, mobile, message
        })

        const response = await consultData.save();        
        console.log(response);
        res.status(200).json({success: true, message:"Consult Book Successfully"});
    } catch (error) {
        
    }
}