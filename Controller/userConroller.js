import User from "../model/userModel.js";
import Cult from "../model/cultModel.js";
import APIError from "../utils/APIError.js";
import EmailService from "../utils/emailService.js";
import generateToken from "../utils/generateToken.js";
import { comparePasswordHash, generateEmailVerificationToken, generateEmailVerifyUrl, generateOTP, generatePasswordHash } from "../utils/helpers.js";


export const signup = async (req, res, next) => {
    try {
        /* A function that creates a new user in the database. */
        const { name, email, password, pic, contactNumber } = req.body;
        if (!name || !password) {
            // res.status(400);
            throw new APIError("Please enter all fields", 401);
        }
        if (!email && !(contactNumber)) {
            throw new APIError("Please enter all fields", 401);
        }


        let userExistsViaEmail = []
        if (email !== undefined) {
            console.log(email, "EMAIL");
            userExistsViaEmail = await User.aggregate([
                {
                    '$match': {
                        'email': email
                    }
                }
            ]);

        }
        let userExistsViaContactNumber = [];
        if (contactNumber !== undefined) {
            if (contactNumber.number !== undefined) {
                userExistsViaContactNumber = await User.aggregate([
                    {
                        '$match': {
                            '$and': [
                                {
                                    'contactNumber.number': String(contactNumber.number)
                                }, {
                                    'contactNumber.countryCode': String(contactNumber.countryCode)
                                }
                            ]
                        }
                    }
                ]);
            }
        }

        console.log(userExistsViaEmail, userExistsViaContactNumber);

        if (userExistsViaEmail.length > 0 || userExistsViaContactNumber.length > 0) {
            // res.status(400);
            throw new APIError("User already exists", 400);
        }
        let joinedCults = req.body.joinedCults;
        if (!req.body.joinedCults) {
            throw new APIError("Please select at least 2 cults", 400)

        }
        if (joinedCults.length < 2) {
            throw new APIError("Please select at least 2 cults", 400)
        }
        const mySet = new Set(joinedCults);
        joinedCults = [...mySet]
        const emailHash = generateEmailVerificationToken();
        const emailHashEncrypted = await generatePasswordHash(String(emailHash));
        const OTP = generateOTP();
        const otpHash = await generatePasswordHash(String(OTP))
        console.log(OTP, emailHash);
        let user;
        const encryptedPassword = await generatePasswordHash(String(password));
        const url = generateEmailVerifyUrl(emailHash, email);
        await EmailService.sendMail({
            from: `Cultify <${String(process.env.AWS_SES_EMAIL)}>`,
            to: email,
            text: 'Email Verification',
            subject: 'Cultify | Email Verification',
            html: `<div>
                <p>Hi ${name}.</p>
                <p>This Email contains your link to verify email id</p>
                <p>Please click here</p>
                <a>${url}</a>
              </div>`,
        });
        if (email && !contactNumber) {
            user = await User.create({
                signInMethod: 'EMAIL',
                name,
                email,
                password: encryptedPassword,
                pic: pic,
                joinedCults: joinedCults,
                emailVerificationHash: emailHashEncrypted
            });
            //TODO:SEND MAIL



        } else if (contactNumber && !email) {
            user = await User.create({
                signInMethod: 'OTP',
                name,
                contactNumber,
                password: encryptedPassword,
                pic: pic,
                joinedCults: joinedCults,
                otpToken: otpHash
            });
        } else {
            //Todo:handle case
            user = await User.create({
                signInMethod: 'BOTH GIVEN',
                name,
                email,
                contactNumber,
                password: encryptedPassword,
                pic: pic,
                joinedCults: joinedCults,
                emailVerificationHash: emailHash,
                otpToken: otpHash
            });
        }
        //incrementing cult join count


        const incrementCults = joinedCults.map(async (index) => {
            const cult = await Cult.findById(index);
            if (cult) {
                if (cult.numberOfPeopleJoined === undefined) {
                    cult.numberOfPeopleJoined = 1;
                    cult.save();
                } else {
                    cult.numberOfPeopleJoined = cult.numberOfPeopleJoined + 1;
                    cult.save();
                }
                ;
            }
        });

        await Promise.all(incrementCults);


        console.log(user);
        if (user) {
            res.status(201).json({
                user
            });
        } else {
            // res.status(400);
            throw new Error("Failed to create new user", 400);
        }
    } catch (err) {
        next(err);
    }

};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new APIError("Enter all the fields", 401);
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new APIError("User not found", 404);
        }
        console.log(user);
        console.log(await comparePasswordHash(password, user.password));
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
        if (user && (await user.matchPassword(password))) {
            res.status(201).json({
                user,
                token: generateToken(user._id, 'student'),
            });
        } else {
            // res.status(400);
            throw new APIError("Failed to login user", 400);
        }
    } catch (err) {
        next(err);
    }
};

// POST api/user/verify-email
export const verifyEmail = async (req, res, next) => {
    try {
        const { email, hash } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new APIError("User not found", 404);
        }
        if (user.emailVerificationHash === undefined) {
            throw new APIError("Invalid Request", 404);

        }
        // console.log(await comparePasswordHash(user.emailVerificationHash, String(hash)));
        console.log(user);
        if (await comparePasswordHash(String(hash), String(user.emailVerificationHash))) {
            console.log("here");
            user.emailVerificationHash = undefined;
            user.otpToken = undefined;
            user.isVerified = true;
            await user.save();

            res.status(201).json({
                user,
                token: generateToken(user._id, 'student'),
            });
        } else {
            throw new APIError("Invalid Request", 404);

        }
    } catch (err) {
        console.log(err);
        next(err)
    }
}