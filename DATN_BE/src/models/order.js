import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      myProvince: { type: String, required: true },
      myDistrict: { type: String, required: true },
      myWard: { type: String, required: true },
      detailAddress: { type: String, required: true }
    },
    paymentStatus: {
      type: Number,
      default: 0
    },
    voucher_code: {
      type: String,
    },
    note: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
    },
    paymentStatus: {
      type: Number,
    },
    pay_method: {
      type: String,
      // required: true,
    },
    orderDetails: [{ type: mongoose.Types.ObjectId, ref: "OrderDetail" }],
    orderReturn: { type: mongoose.Types.ObjectId, ref: "OrderReturn" },
    totalMoney: {
      type: Number,
      required: true,
      min: 0,
    },
    voucherDiscounted: {
      type: Number,
      default: 0
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    employeeId: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true, versionKey: false }
);
orderSchema.plugin(mongoosePaginate);

export default mongoose.model("Order", orderSchema);
