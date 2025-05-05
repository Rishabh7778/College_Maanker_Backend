import mongoose from  'mongoose';

const consultSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    phoneNo:{
        type: String,
        required: true,
    },
    message:{
        type: String,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
    
})

const Consult = mongoose.model("Consult", consultSchema);
export default Consult;