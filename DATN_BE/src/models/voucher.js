import mongoose from "mongoose";

const validVoucherTypes = ["percent", "value", "Type3"]; // Thay thế bằng các loại Voucher cụ thể

const voucherSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: validVoucherTypes,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
    },
    discount: {
        type: Number,
        required: true
    },
    used: {
        type: Number,
    },
    minOrderValue: {
        type: Number,
        default: 0,
    },
    maxOrderValue: {
        type: Number,
        default: 0,
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTo: {
        type: Date,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
        versionKey: false
    });

export default mongoose.model('Voucher', voucherSchema);