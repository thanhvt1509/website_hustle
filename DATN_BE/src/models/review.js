import mongoose from "mongoose";

const combinedSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String
    },
    size: {
      type: String
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [
      {
        type: Object,
        required: true,
      },
    ],
    reply:
    {
      nameUser: {
        type: String,
        default: "Admin",
      },
      comment: {
        type: String,
      },
      userId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
      },
      createdAt: {
        type: Date,
      },
      updatedAt: {
        type: Date,
      },
    }
    ,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Review", combinedSchema);