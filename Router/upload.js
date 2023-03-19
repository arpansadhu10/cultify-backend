import { Router } from "express";
import multer from "multer";
import { auth } from "../middlewares/authMiddleware.js";
import { v2 as cloudinary } from 'cloudinary'
import { uploads } from "../middlewares/multerMiddleware.js";
import { uploadFile } from "../controller/uploadController.js";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }).single('file');

const UploadRouter = Router();

UploadRouter.post('/', uploads.single('file'), uploadFile);
export default UploadRouter;