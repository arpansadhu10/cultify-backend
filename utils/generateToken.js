import Jwt from "jsonwebtoken";
const generateToken = (id, type) => {
    return Jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default generateToken;