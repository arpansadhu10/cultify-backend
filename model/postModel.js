import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    name: { type: String, required: true },
    numberOfPeopleJoined: { type: Number },
    description: { type: String },
    image: { type: String },
    likes: { type: Number },
    cult: { type: mongoose.Schema.Types.ObjectId, ref: 'cult' }
})

const Cult = mongoose.model("cult", postSchema);

export default Cult;