// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String },
        password: { type: String, required: true },
        isSuperAdmin: { type: Boolean, required: true }
    },
    {
        timestamps: true,
    }
);
const Admin = mongoose.model("admin", AdminSchema);

export default Admin;
// module.exports = {matchPassword}
