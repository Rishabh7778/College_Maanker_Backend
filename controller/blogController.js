import Blog from '../models/blogModel.js';
import fs from 'fs';

export const uploadBlog = async (req, res) => {
    const { name, date, title, category } = req.body;

    try {
        const blogData = new Blog({
            name,
            date,
            title,
            category,
            videoPath: req.file.path,
        });

        const response = await blogData.save();
        console.log(response);
        res.status(200).json({ success: true, message: "successfully uploaded", response });
    } catch (error) {
        res.status(500).json({ success: false, message: "upload failed", error: error.message });
    }
};

export const getBlog = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: "failed to fetch videos", error: error.message });
    }
}

export const editBlog = async (req, res) => {
    const { id } = req.params;
    const { name, date, title, category } = req.body;

    const updateData = {
        name, title, date, category,
    };

    if (req.file) {
        updateData.videoPath = req.file.path;
    }

    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        if (!updateBlog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        return res.status(200).json({ success: true, message: "Blog updated Succesfully", updateBlog });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to update blog", error: error.message });
    }
}

export const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ success: false, message: "blog not found" })
        }

        //Delete blog video

        const videoPath = blog.videoPath;
        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath); // delete the video file
        }

        const response = await Blog.findByIdAndDelete(id);
        console.log(response);

        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

