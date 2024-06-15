import { Schema } from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  detailDescription: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  inventory: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  keywords: {
    type: [String],
    required: true,
  },
});

export { productSchema };
