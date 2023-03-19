import mongoose from "mongoose";

const cultSchema = new mongoose.Schema({
    name: { type: String, required: true },
    numberOfPeopleJoined: { type: Number },
    description: { type: String },
    image: { type: String },
    likes: { type: Number },
})

const Cult = mongoose.model("cult", cultSchema);

export default Cult;