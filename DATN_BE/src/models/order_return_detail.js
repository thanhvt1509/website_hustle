import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const orderReturnDetailSchema = new mongoose.Schema(
    {
        orderReturnId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderReturn",
            required: true,
        },
        productDetailId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductDetail",
            required: true,
        },
        costPrice: {
            type: Number,
            min: 0,
        },
        orderDetailId: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            min: 0,
            required: true
        },
        quantity: {
            type: Number,
            min: 0,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        // totalMoney: {
        //     type: Number,
        //     required: true
        // },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false }
);
orderReturnDetailSchema.plugin(mongoosePaginate);

export default mongoose.model("OrderReturnDetail", orderReturnDetailSchema);
