import cloudinary from "../config/cloudinary.js";
import Razorpay from "razorpay";
import PaymentForm from "../models/paymentFormModel.js";


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const submitForm = async (req, res) => {
    try {
        const { name, email, phoneNo, whatsappNo, packageType } = req.body;

        // upload file in cloudinary

        let uploadedFile = null;
        if (req.file) {
            const buffer = req.file.buffer;
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "auto" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                stream.end(buffer);
            });
            uploadedFile = result;
        }
        // set amount package

        const prices = {
            starter: 999,
            silver: 4999,
            gold: 9999,
        };

        const amount = prices[packageType];
        if (!amount) {
            return res.status(400).json({ success: false, messgae: "Invalid package type" });
        }

        // PAyment

        const paymentOrder = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        });

        const newPaymentForm = new PaymentForm({
            name,
            email,
            phoneNo,
            whatsappNo,
            packageType,
            cloudinaryUrl: uploadedFile?.secure_url || null,
            razorPaymentId: paymentOrder.id,
        })

        await newPaymentForm.save(); // save in mongo database

        return res.status(200).json({
            success: true,
            order: paymentOrder,
            message: "Form submitted successfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}


export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const crypto = await import("crypto");
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Payment verification failed" });
        }

        // update DB

        const form = await PaymentForm.findOneAndUpdate(
            { razorPaymentId: razorpay_order_id },
            {
                isPaid: true,
                razorPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                updatedAt: Date.now(),
            },
            { new: true }
        );
        if (!form) {
            return res.status(404).json({ success: false, message: "Form data not found" });
        }


        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: form,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Payment Server Error" });
    }
}

