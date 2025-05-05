import Blog from '../models/blogModel.js';
import cloudinary from '../config/cloudinary.js';

export const uploadBlog = async (req, res) => {
  const { name, date, title, category } = req.body;

  try {
    let uploadedVideo = null;

    if (req.file) {
      // 1) Validate it’s a video
      if (!req.file.mimetype.startsWith('video/')) {
        return res.status(400).json({
          success: false,
          message: 'Only video files are allowed'
        });
      }

      // 2) Upload **unsigned** via your preset
      uploadedVideo = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.unsigned_upload_stream(
          'blog_video_preset',        
          { resource_type: 'video' }, 
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
    }

    // 3) Save to Mongo
    const blog = new Blog({
      name,
      date,
      title,
      category,
      videoPath: uploadedVideo?.secure_url || null
    });
    const saved = await blog.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully uploaded (unsigned)',
      data: saved
    });

  } catch (err) {
    console.error('Upload failed:', err);
    return res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: err.message
    });
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

