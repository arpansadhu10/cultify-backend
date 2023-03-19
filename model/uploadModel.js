import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
    id: { type: String },
    secure_url: { type: String },
})

const Upload = mongoose.model("upload", uploadSchema);

export default Upload;