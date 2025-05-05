import express from 'express';
import { bookConsult } from '../controller/consultController.js';
const router = express.Router();

router.post('/bookConsult', bookConsult);

export default router;