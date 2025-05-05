import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    name: {
        type: String,
        require:true,
    },
    email: {
        type: String,
        require:true,
    },
    phoneNo: {
        type: String,
        require:true,
    },
    whatsappNo: {
        type: String,
        require:true,
    },
    packageType: {
        type: String,
    },
    cloudinaryUrl: {
        type: String,
    },
    razorPaymentId: {
        type:String
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }   
});

const PaymentForm = mongoose.model('PaymentForm', formSchema);
export default PaymentForm;