import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema({
    size: {
        type: String,
        require: true
    }
},
    {
        timestamps: true,
        versionKey: false,
    });

export default mongoose.model('Size', sizeSchema);