import { v2 as cloudinary } from 'cloudinary'
import Upload from '../model/uploadModel.js';
import getDataUri from '../utils/dataUri.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const uploadFile = async (req, res, next) => {
    if (req.file) {
        const file = req.file;
        const fileUri = getDataUri(file);
        // console.log(fileUri);
        try {
            const result = await cloudinary.uploader.upload(fileUri.content);
            console.log(result);
            const uploader = await Upload.create({
                id: result.public_id,
                secure_url: result.secure_url
            })
            req.cloudinary = result;
            return res.status(200).json({ message: uploader });
            // next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to upload file to Cloudinary' });
        }
    } else {
        res.status(400).json({ message: 'No file found in request' });
    }
}