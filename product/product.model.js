import mongoose from "mongoose";

// set rule
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 55,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Customer",
  },
});

// create table
export const Product = mongoose.model("Product", productSchema);
