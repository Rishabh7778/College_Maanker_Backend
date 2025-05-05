import express from 'express';
import { editBlog, getBlog, uploadBlog } from '../controller/blogController.js';
import upload from '../middleware/multer.js'
const router = express.Router();

router.post('/uploadBlog', upload.single('video'), uploadBlog);
router.get('/blogs', getBlog);
router.put('/edit', editBlog);

export default router;