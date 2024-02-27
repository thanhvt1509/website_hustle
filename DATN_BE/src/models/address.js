import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Types.ObjectId, ref: "User" },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    myProvince: { type: String, required: true },
    myDistrict: { type: String, required: true },
    myWard: { type: String, required: true },
    address: { type: String, required: true },
    isDefault: { type: Boolean, required: true, default: false },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Address", addressSchema);
