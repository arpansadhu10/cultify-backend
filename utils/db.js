import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;
export const connectDB = () => mongoose.connect(MONGO_URL).then(() => {

    console.log("DB Connected Successfully");

}
).catch((err) => {
    console.log("DB connection Failure");
    console.log(err.message);
    process.exit(1);
})