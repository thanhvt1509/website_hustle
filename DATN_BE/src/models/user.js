import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String },
    phone: { type: String },
    fullname: { type: String },
    shipping_address: {
      city: String,
      district: String,
      ward: String,
    },
    addresses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address' 
    }],
    password: { type: String, required: true },
    birthday: String,
    last_login: Date,
    height: Number,
    weight: Number,
    discount_code_birthday: String,
    gender: String,
    role: {
      type: String,
      default: "user",
    },
    voucherwallet: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Voucher",
      },
    ],
    isActive: {
      type: Boolean,
      required: true,
      default: false
    },
    forgotPasswordToken: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.path("email").validate(function (value) {
  return value || this.phone;
}, "Phải có ít nhất một trong email hoặc phone");

userSchema.path("phone").validate(function (value) {
  return value || this.email;
}, "Phải có ít nhất một trong email hoặc phone");

export default mongoose.model("User", userSchema);
