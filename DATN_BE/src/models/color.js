import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
    color: {
        type: String,
        require: true
    },
    color_code: {
        type: String,
        require: true
    }
},
    {
        timestamps: true,
        versionKey: false,
    });

export default mongoose.model('Color', colorSchema);