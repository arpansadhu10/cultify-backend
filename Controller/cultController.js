import Cult from "../model/cultModel.js";
import APIError from "../utils/APIError.js";

export const createCult = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const doesAlreadyExists = await Cult.findOne({ name: name });
        if (doesAlreadyExists) {
            throw new APIError("cult Already exists", 409);
        }

        const cult = await Cult.create({
            name: name,
            description: description,
            image: req.body.image,
        })
        res.status(200).json({ data: cult, message: "cult created successfully" });
    } catch (err) {
        next(err);
    }
}

