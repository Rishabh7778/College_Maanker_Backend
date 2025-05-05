import multer from "multer";
const storage = multer.memoryStorage();

const upload = multer(
    {
        storage,
        limits: {
            fileSize: 1024 * 1024 * 500 // 500MB 
        }
    });


export default upload;