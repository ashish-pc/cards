import mongoose from "mongoose";

export const mongoConnect = async () => {
    try {
        return await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_URI}`);
    } catch (err) {
        console.log(`Mongo is not connected: ${err}`);
        process.exit(1);
    }
};