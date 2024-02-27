import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  images: {
    type: Object,
    required: true,
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  }],

},
  {
    timestamps: true,
    versionKey: false,
  });
categorySchema.plugin(mongoosePaginate);

export default mongoose.model('Category', categorySchema);