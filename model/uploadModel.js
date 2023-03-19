import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
    id: { type: String },
    secure_url: { type: String },
},
    {
        timestamps: true,
    })

const Upload = mongoose.model("upload", uploadSchema);

export default Upload;