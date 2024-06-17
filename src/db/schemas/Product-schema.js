import { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      required: false,
      min: [0, '0보다 작은 값은 설정이 불가합니다.'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, '0보다 작은 값은 설정이 불가합니다.'],
    },
  },
  {
    collection: 'products',
    timestamps: true,
  },
);

export { ProductSchema };
