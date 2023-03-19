import mongoose from "mongoose";

const cultSchema = new mongoose.Schema({
    name: { type: String, required: true },
    numberOfPeopleJoined: { type: Number, default: 0 },
    description: { type: String },
    image: { type: String },
    likes: { type: Number, default: 0 },
},
    {
        timestamps: true,
    })

const Cult = mongoose.model("cult", cultSchema);

export default Cult;