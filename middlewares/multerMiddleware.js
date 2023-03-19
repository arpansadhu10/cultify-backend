/* eslint-disable import/prefer-default-export */
import Multer from 'multer';
import APIError from '../utils/APIError.js';

export const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // no larger than 10mb.
    },
    fileFilter: (req, file, cb) => {
        if (file) {
            cb(null, true);
        } else {
            cb(new APIError(`No File Found`, 400));
        }
    },
});

export const uploads = multer;
