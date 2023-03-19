import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'post', required: true }
},
    {
        timestamps: true,
    })

const Like = mongoose.model("like", likeSchema);

export default Like;