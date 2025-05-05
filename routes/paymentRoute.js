import express from 'express';
import upload from '../middleware/multer.js';
import { submitForm, verifyPayment } from '../controller/paymentController.js'

const router = express.Router();

router.post('/paymentForm', upload.single("file"), submitForm);
router.post('/verifyPayment', verifyPayment)

export default router;
