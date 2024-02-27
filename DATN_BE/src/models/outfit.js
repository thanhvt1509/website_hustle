import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const outfitSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        sku: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        image: {
            type: Object,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        items: [{ type: mongoose.Types.ObjectId, ref: "ProductDetail" }],
        hide: {
            type: Boolean,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false }
);
outfitSchema.plugin(mongoosePaginate);

export default mongoose.model("Outfit", outfitSchema);