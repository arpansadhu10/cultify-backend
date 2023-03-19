// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const bcrypt = require("bcryptjs");
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String },
        password: { type: String, required: true },
        pic: { type: String },
        otpToken: { type: String },
        emailVerificationHash: { type: String },
        isVerified: { type: Boolean, default: false, required: true },//this field is only to check if either otp or email is verified
        notVerifiedReason: { type: String, enum: ['EMAIL', 'OTP', 'BANNED'] },
        signInMethod: { type: String, enum: ['EMAIL', 'OTP', 'BOTH GIVEN'], required: true },
        contactNumber: {
            countryCode: { type: String },
            number: { type: String, length: 10 }
        },
        dateOfBirth: { type: Date }, //yyyy-mm-dd,
        joinedCults: [{ type: mongoose.Schema.Types.ObjectId, ref: "cult" }]
    },
    {
        timestamps: true,
    }
);
userSchema.methods.matchPassword = async function (enterdPassword) {
    return await bcrypt.compare(enterdPassword, this.password);
};


// userSchema.pre("save", async function (next) {
//     if (!this.isModified) {
//         next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });
// userSchema.pre("find", async function () {
//   // const user = this.toObject();
//   // delete user.password;
//   // delete user.otpToken;
//   // delete user.emailVerificationHash;
//   // return user;
//   this.select('-password -otpToken -emailVerificationHash')

// });

userSchema.method('toJSON', function toJSON() {
    const user = this.toObject();
    delete user.password;
    delete user.otpToken;
    delete user.emailVerificationHash;
    return user;
});
const User = mongoose.model("User", userSchema);

export default User;
// module.exports = {matchPassword}
