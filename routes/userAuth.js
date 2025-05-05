import express from 'express';
import {signup, login} from '../controller/userController.js'
import { jwtAuthMiddleware, refreshTokenHandler, verify } from '../middleware/jwt.js';
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", jwtAuthMiddleware, verify);
router.post("/refresh", refreshTokenHandler);

export default router;