

import User from '../model/userModel.js';
import Jwt from 'jsonwebtoken';
import APIError from '../utils/APIError.js';

export const auth = async (req, res, next) => {

    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            try {
                token = req.headers.authorization.split(" ")[1];
                const decoded = Jwt
                    .verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id).select("-password");
                if (user.isVerified === false) {

                    if (user.notVerifiedReason === "EMAIL") {
                        throw new APIError("Please Verify Your Email", 401);
                    }
                    if (user.notVerifiedReason === "OTP") {
                        throw new APIError("Please Verify Your Phone Number", 401)
                    }
                    if (user.notVerifiedReason === "BANNED") {
                        throw new APIError("User banned from platform. Please contact administrator", 401);
                    }
                    else {
                        throw new APIError("Please Verify Email", 401);
                    }
                }

                req.user = user
                next();
            } catch (error) {
                res.status(401);
                throw new Error("Not authorized, token mismatch");
            }
        } else {
            res.status(401);
            throw new Error("Token not found");
        }
    } catch (error) {
        next(error);
    }
};

export const checkAdmin = async (req, res, next) => {

    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            try {
                token = req.headers.authorization.split(" ")[1];
                const decoded = Jwt
                    .verify(token, process.env.JWT_SECRET);
                const user = await Admin.findById(decoded?.id);
                if (user.isSuperAdmin === true) {
                    req.user = user
                    next();
                }
                throw new APIError("Not authorized, token mismatch", 404);

            } catch (error) {
                res.status(401);
                throw new Error("Not authorized, token mismatch");
            }
        } else {
            res.status(401);
            throw new Error("Token not found");
        }
    } catch (error) {
        next(error);
    }
};

// export default protect;
