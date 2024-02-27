import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        productDetailId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductDetail",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        totalMoney: {
            type: Number,
            required: true,
            min: 0,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false }
);
cartSchema.plugin(mongoosePaginate);

export default mongoose.model("Cart", cartSchema);
