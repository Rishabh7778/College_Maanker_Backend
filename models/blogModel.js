import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    name: String,
    title: String,
    date: String,
    category: String,
    videoPath: String,
    createAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;