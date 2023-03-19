import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    description: { type: String },
    image: { type: String },
    likes: { type: Number, default: 0 },
    cult: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'cult' },
    numberOfComments: { type: Number, default: 0 }
},
    {
        timestamps: true,
    })

const Post = mongoose.model("post", postSchema);

export default Post;