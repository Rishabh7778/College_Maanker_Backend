import express from 'express';
import { editBlog, getBlog, uploadBlog } from '../controller/blogController.js';
import upload from '../middleware/upload.js'
const router = express.Router();

router.post('/upload', upload.single('video'), uploadBlog);
router.get('/blogs', getBlog);
router.put('/edit', editBlog);

export default router;